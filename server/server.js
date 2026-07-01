require('dotenv').config();

const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const nodemailer = require('nodemailer');

const stripe = process.env.STRIPE_SECRET_KEY ? require('stripe')(process.env.STRIPE_SECRET_KEY) : null;

const app = express();
const port = process.env.PORT || 3001;
const submissionsPath = path.join(__dirname, 'submissions.json');

let transporter = null;
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

app.use(cors());

app.post('/api/stripe-webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    return res.status(503).json({ ok: false, message: 'Stripe webhooks are not configured.' });
  }

  const signature = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      await sendPaymentNotification(session);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

app.use(express.json());

function loadSubmissions() {
  if (!fs.existsSync(submissionsPath)) {
    return [];
  }

  try {
    return JSON.parse(fs.readFileSync(submissionsPath, 'utf8'));
  } catch {
    return [];
  }
}

function saveSubmission(payload) {
  const submissions = loadSubmissions();
  const entry = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    createdAt: new Date().toISOString(),
    ...payload,
  };

  submissions.push(entry);
  fs.writeFileSync(submissionsPath, JSON.stringify(submissions, null, 2));
  return entry;
}

async function sendPaymentNotification(session) {
  if (!transporter || !process.env.EMAIL_TO) {
    return;
  }

  const customerEmail = session.customer_details?.email || session.customer_email || 'Unknown email';
  const amount = (session.amount_total || 10000) / 100;
  const caseType = session.metadata?.caseType || 'General filing';
  const customerName = session.metadata?.name || 'Client';

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'no-reply@coloradolegalsvc.local',
      to: process.env.EMAIL_TO,
      subject: 'New payment received for Colorado Legal Service',
      html: `
        <h2>New payment received</h2>
        <p><strong>Client:</strong> ${customerName}</p>
        <p><strong>Email:</strong> ${customerEmail}</p>
        <p><strong>Case type:</strong> ${caseType}</p>
        <p><strong>Amount paid:</strong> $${amount.toFixed(2)}</p>
        <p><strong>Payment status:</strong> Completed</p>
      `,
    });
  } catch (error) {
    console.error('Failed to send payment email:', error);
  }
}

app.post('/api/create-checkout-session', async (req, res) => {
  if (!stripe) {
    return res.status(500).json({ ok: false, message: 'Stripe is not configured yet. Add STRIPE_SECRET_KEY to enable payments.' });
  }

  try {
    const { email, name, caseType } = req.body || {};
    const baseUrl = process.env.APP_BASE_URL || 'http://localhost:5173';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: email || undefined,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Colorado Legal Service Intake Package',
              description: 'One-time filing guidance package with forms and guidance',
            },
            unit_amount: 10000,
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/#intake?payment=success`,
      cancel_url: `${baseUrl}/#pricing`,
      metadata: {
        name: name || '',
        caseType: caseType || '',
      },
    });

    return res.status(200).json({ ok: true, url: session.url });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
});

app.post('/api/submit-intake', (req, res) => {
  const { name, email, phone, caseType, summary } = req.body;

  if (!name || !email || !phone || !caseType || !summary) {
    return res.status(400).json({ ok: false, message: 'Please complete all required fields.' });
  }

  const submission = saveSubmission(req.body);
  return res.status(200).json({ ok: true, message: 'Intake submitted successfully.', submission });
});

app.get('/api/submissions', (req, res) => {
  res.status(200).json(loadSubmissions());
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
