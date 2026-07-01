import { useEffect, useState } from 'react';

const caseTypes = ['Small claims', 'Simplified civil complaint', 'Family law / divorce', 'Post-divorce modification', 'Criminal case', 'Other'];

const serviceCards = [
  {
    title: 'Court forms — simplified',
    description: 'Blank MS Word-style forms for your specific case type, plus links to official Colorado self-help forms when the court provides them.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 24, height: 24 }}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    title: 'Statutes & case law',
    description: 'Relevant Colorado statutes, case law, and civil procedure references are bundled in plain language using resources such as LexisNexis.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 24, height: 24 }}>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  {
    title: 'Step-by-step filing guide',
    description: 'A clear path from intake to filing with deadlines, process service guidance under CRCP 4, and practical prep tips for hearings.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 24, height: 24 }}>
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
  {
    title: 'Limited representation tips',
    description: 'Learn how to use limited representation under CRCP 11(b) so a lawyer can help without taking over your case.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 24, height: 24 }}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    title: 'Know your rights',
    description: 'Learn how Colorado judges approach pro se representation, including CRS 13-5.7-101 and Rule 2.6, to strengthen your filing strategy.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 24, height: 24 }}>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
  {
    title: 'Personal intake review',
    description: 'Submit your facts and receive a customized filing package for your situation, including guidance for divorce, separation agreements, and post-divorce issues.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 24, height: 24 }}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
];

const steps = [
  { number: '1', title: 'Share your details', description: 'Tell us about your situation in less than five minutes so we can understand the right filing path.' },
  { number: '2', title: 'Receive your package', description: 'Get tailored forms, statutes, and instructions prepared for your specific Colorado case type.' },
  { number: '3', title: 'File with confidence', description: 'Move forward with a clear plan, knowing your filing package aligns with the latest court rules.' },
];

const results = [
  {
    title: 'Settlement negotiation support',
    description: 'Negotiated a meaningful settlement through a formal complaint process without paying a full attorney retainer.',
  },
  {
    title: 'Family filing readiness',
    description: 'Prepared a separation agreement and filing package that helped a family resolve matters quickly and efficiently.',
  },
  {
    title: 'Civil case strategy',
    description: 'Supported a self-represented litigant with clear filing guidance and targeted legal authority for a civil dispute.',
  },
  {
    title: 'Cost reduction',
    description: 'Helped clients save thousands by using strategic filing support instead of expensive full representation.',
  },
];

const testimonials = [
  {
    name: 'Melissa R.',
    title: 'Civil case client',
    quote: 'The process felt organized and manageable. I finally had a clear filing plan and the confidence to move forward.',
  },
  {
    name: 'Daniel T.',
    title: 'Family law client',
    quote: 'The intake was straightforward, and the packet I received was exactly what I needed to prepare my case.',
  },
];

const pricingHighlights = [
  'Simplified court forms for your case type',
  'Relevant Colorado statutes and case law included',
  'Step-by-step filing instructions',
  'Process serving guidance (CRCP 4)',
  'Limited representation strategy (CRCP 11b)',
];

const whyChooseUs = [
  {
    title: 'Customized to your facts',
    description: 'Every intake is reviewed with your case details in mind, so the forms and guidance are not generic.',
  },
  {
    title: 'Clear legal direction',
    description: 'We simplify process rules, deadlines, and filing requirements so you know exactly what to do next.',
  },
  {
    title: 'Built for self-representation',
    description: 'Our process is designed to help you feel prepared, organized, and supported while representing yourself.',
  },
];

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    caseType: '',
    county: '',
    summary: '',
  });
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    const hash = window.location.hash || '';
    const queryString = hash.includes('?') ? hash.split('?')[1] : '';
    const params = new URLSearchParams(queryString);

    if (params.get('payment') === 'success') {
      setStatus({ type: 'success', message: 'Payment completed. We will contact you shortly.' });
    }
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: 'info', message: 'Submitting your intake...' });

    try {
      const response = await fetch('/api/submit-intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (!response.ok) {
        setStatus({ type: 'error', message: result.message || 'Please complete the required fields.' });
        return;
      }

      setStatus({ type: 'success', message: 'Your intake was submitted successfully.' });
      setFormData({ name: '', email: '', phone: '', caseType: '', county: '', summary: '' });
    } catch {
      setStatus({ type: 'error', message: 'Something went wrong. Please try again.' });
    }
  };

  const handlePayNow = async () => {
    if (!formData.email) {
      setStatus({ type: 'error', message: 'Please enter your email before paying.' });
      return;
    }

    setStatus({ type: 'info', message: 'Redirecting to secure checkout...' });

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          caseType: formData.caseType,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.ok) {
        setStatus({ type: 'error', message: result.message || 'Payment setup failed.' });
        return;
      }

      window.location.href = result.url;
    } catch {
      setStatus({ type: 'error', message: 'Unable to start payment. Please try again.' });
    }
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'DM Sans, sans-serif', color: '#2D2D2D' }}>
      <nav style={{ background: 'linear-gradient(180deg, #1f3557 0%, #1B2A4A 100%)', padding: '18px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '22px', color: '#fff', letterSpacing: '0.2px' }}>
          Colorado <span style={{ color: '#C9A84C' }}>Legal</span> Service
        </div>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <a href="#services" style={{ color: 'rgba(255,255,255,0.72)', fontSize: '14px' }}>Services</a>
          <a href="#why-us" style={{ color: 'rgba(255,255,255,0.72)', fontSize: '14px' }}>Why us</a>
          <a href="#how-it-works" style={{ color: 'rgba(255,255,255,0.72)', fontSize: '14px' }}>How it works</a>
          <a href="#pricing" style={{ color: 'rgba(255,255,255,0.72)', fontSize: '14px' }}>Pricing</a>
          <a href="#intake" style={{ background: '#C9A84C', color: '#1B2A4A', padding: '10px 18px', borderRadius: '10px', fontWeight: 700, fontSize: '14px' }}>Get started</a>
        </div>
      </nav>

      <section style={{ background: 'linear-gradient(180deg, rgba(17,29,51,0.72), rgba(17,29,51,0.54)), url("/photos/Screenshot 2025-10-09 214519.png") center/cover no-repeat', padding: '92px 5% 110px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at top center, rgba(201,168,76,0.16), transparent 28%), radial-gradient(circle at bottom right, rgba(255,255,255,0.08), transparent 20%)' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '760px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(201,168,76,0.14)', padding: '8px 16px', borderRadius: '999px', color: '#F4D27A', border: '1px solid rgba(201,168,76,0.35)', marginBottom: '24px', boxShadow: '0 0 0 1px rgba(255,255,255,0.02) inset' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14 }}>
              <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Colorado Courts — Pro Se Filing Guidance
          </div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(40px, 5vw, 58px)', color: '#fff', margin: '0 auto 20px', lineHeight: 1.12, textShadow: '0 4px 30px rgba(17,29,51,0.35)' }}>
            Save thousands on legal fees — <span style={{ color: '#F4D27A' }}>file your own case</span> in Colorado
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.76)', maxWidth: '600px', margin: '0 auto 36px', fontSize: '17px', lineHeight: 1.75 }}>
            Get exact court forms, statutes, and step-by-step guidance tailored to your filing — with a $100 flat fee and no confusing retainer model.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <a href="#intake" style={{ background: '#C9A84C', color: '#1B2A4A', padding: '15px 30px', borderRadius: '12px', fontWeight: 700, boxShadow: '0 10px 28px rgba(201,168,76,0.28)', textDecoration: 'none' }}>Get started — $100 flat fee</a>
            <a href="#services" style={{ border: '1px solid rgba(255,255,255,0.2)', padding: '15px 30px', borderRadius: '12px', color: '#fff', background: 'rgba(255,255,255,0.04)', textDecoration: 'none' }}>See services</a>
          </div>
        </div>
      </section>

      <section style={{ padding: '0 5%', marginTop: '-36px', position: 'relative', zIndex: 2 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '14px' }}>
          {[
            '4+ settlements won',
            'Fast turnaround',
            'Ready-to-file forms',
            'Colorado courts only',
          ].map((item, index) => (
            <div key={item} style={{ background: '#fff', border: '1px solid #edf2f7', borderRadius: '16px', padding: '16px 16px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 8px 30px rgba(17, 29, 51, 0.05)' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1B2A4A' }}>
                {index === 0 ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 18, height: 18 }}><path d="M5 3l14 9-14 9V3z" /></svg> : null}
                {index === 1 ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 18, height: 18 }}><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg> : null}
                {index === 2 ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 18, height: 18 }}><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" /></svg> : null}
                {index === 3 ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 18, height: 18 }}><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /></svg> : null}
              </div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="services" style={{ padding: '86px 5%' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '42px' }}>
            <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '1.5px', color: '#C9A84C', textTransform: 'uppercase' }}>Services</p>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(30px, 4vw, 42px)', color: '#1B2A4A', marginTop: '10px' }}>A smoother path to filing your case</h2>
            <p style={{ maxWidth: '640px', fontSize: '16px', color: '#6B7280', lineHeight: 1.75, marginTop: '14px' }}>
              Every service is designed to reduce confusion, minimize wasted time, and help you file with more confidence.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            {serviceCards.map((card) => (
              <div key={card.title} style={{ background: '#fff', border: '1px solid #edf2f7', borderRadius: '18px', padding: '28px 24px', boxShadow: '0 4px 20px rgba(27, 42, 74, 0.04)', transition: 'transform 0.2s, box-shadow 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(27, 42, 74, 0.08)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(27, 42, 74, 0.04)'; }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, #f8f3e4, #f1e5c2)', color: '#1B2A4A', marginBottom: '18px' }}>
                  {card.icon}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1B2A4A', marginBottom: '10px' }}>{card.title}</h3>
                <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: 1.7 }}>{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="why-us" style={{ padding: '0 5% 76px' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '1.5px', color: '#C9A84C', textTransform: 'uppercase' }}>Why us</p>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 4vw, 38px)', color: '#1B2A4A', marginTop: '10px' }}>Why clients choose our process</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
            {whyChooseUs.map((item) => (
              <div key={item.title} style={{ background: '#fff', border: '1px solid #edf2f7', borderRadius: '18px', padding: '26px 22px', boxShadow: '0 8px 28px rgba(27, 42, 74, 0.05)' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, #f8f3e4, #f1e5c2)', color: '#1B2A4A', marginBottom: '14px' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 20, height: 20 }}>
                    <path d="M12 2l2.5 5.5L20 10l-4 4 1 6-5-2.5L7 20l1-6-4-4 5.5-2.5L12 2z" />
                  </svg>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1B2A4A', marginBottom: '10px' }}>{item.title}</h3>
                <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: 1.7 }}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="case-types" style={{ padding: '0 5% 72px' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '1.5px', color: '#C9A84C', textTransform: 'uppercase' }}>Case types</p>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 4vw, 38px)', color: '#1B2A4A', marginTop: '10px' }}>Coverage aligned with Colorado court needs</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
            {[
              { title: 'Small claims', description: 'Up to $7,500 with a strong complaint and evidence package.' },
              { title: 'Simplified civil', description: 'District court complaints under simplified civil procedure up to $100,000.' },
              { title: 'Family law', description: 'Divorce, parenting time, child support, and separation agreement support.' },
              { title: 'Criminal matters', description: 'Basic case prep guidance, arraignment questions, and filing awareness.' },
            ].map((item) => (
              <div key={item.title} style={{ background: '#fff', border: '1px solid #edf2f7', borderRadius: '18px', padding: '24px', boxShadow: '0 6px 24px rgba(27,42,74,0.05)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1B2A4A', marginBottom: '8px' }}>{item.title}</h3>
                <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: 1.7 }}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" style={{ padding: '0 5% 72px', background: 'linear-gradient(180deg, #f8fafc 0%, #f3f6fb 100%)' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto', background: '#fff', borderRadius: '30px', border: '1px solid #edf2f7', padding: '52px 42px', boxShadow: '0 10px 40px rgba(27,42,74,0.05)' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '1.5px', color: '#C9A84C', textTransform: 'uppercase' }}>How it works</p>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 4vw, 38px)', color: '#1B2A4A', marginTop: '10px' }}>Three simple steps to move forward</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
            {steps.map((step) => (
              <div key={step.number} style={{ background: '#f8fafc', border: '1px solid #edf2f7', borderRadius: '18px', padding: '26px 22px', textAlign: 'center' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#1B2A4A', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, marginBottom: '18px' }}>{step.number}</div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1B2A4A', marginBottom: '10px' }}>{step.title}</h3>
                <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: 1.7 }}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '0 5% 76px' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '32px' }}>
            <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '1.5px', color: '#C9A84C', textTransform: 'uppercase' }}>Results</p>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(30px, 4vw, 40px)', color: '#1B2A4A', marginTop: '10px' }}>Real outcomes, not generic advice</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            {results.map((result) => (
              <div key={result.title} style={{ background: 'linear-gradient(180deg, #1B2A4A 0%, #22375a 100%)', color: '#fff', borderRadius: '18px', padding: '24px', boxShadow: '0 8px 24px rgba(27,42,74,0.15)' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(201,168,76,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2" style={{ width: 18, height: 18 }}>
                    <path d="M12 2l2.5 5.5L20 10l-4 4 1 6-5-2.5L7 20l1-6-4-4 5.5-2.5L12 2z" />
                  </svg>
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '10px' }}>{result.title}</h3>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.72)', lineHeight: 1.65 }}>{result.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '0 5% 76px' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto', background: '#fff', border: '1px solid #edf2f7', borderRadius: '28px', padding: '42px', boxShadow: '0 10px 35px rgba(27,42,74,0.06)' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '1.5px', color: '#C9A84C', textTransform: 'uppercase' }}>Testimonials</p>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 4vw, 38px)', color: '#1B2A4A' }}>Clients appreciate the clarity</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} style={{ background: '#f8fafc', border: '1px solid #edf2f7', borderRadius: '20px', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #1B2A4A, #34507d)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{testimonial.name.split(' ')[0][0]}</div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#1B2A4A' }}>{testimonial.name}</div>
                    <div style={{ fontSize: '12px', color: '#6B7280' }}>{testimonial.title}</div>
                  </div>
                </div>
                <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: 1.7 }}>&ldquo;{testimonial.quote}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" style={{ padding: '0 5% 84px' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto', background: 'linear-gradient(135deg, #1B2A4A 0%, #22375a 70%, #2d4266 100%)', borderRadius: '30px', padding: '54px 42px', boxShadow: '0 10px 50px rgba(27,42,74,0.18)' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '1.5px', color: '#C9A84C', textTransform: 'uppercase' }}>Pricing</p>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(30px, 4vw, 40px)', color: '#fff', marginTop: '10px' }}>Simple, transparent pricing</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '40px', alignItems: 'center' }}>
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '32px', textAlign: 'center' }}>
              <div style={{ fontSize: '56px', fontWeight: 700, color: '#C9A84C', fontFamily: 'Playfair Display, serif', marginBottom: '8px' }}>$100</div>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.48)', marginBottom: '24px' }}>One-time flat fee · no hidden costs</div>
              <button type="button" onClick={handlePayNow} style={{ background: '#C9A84C', color: '#1B2A4A', padding: '14px 22px', borderRadius: '12px', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
                Pay $100 securely
              </button>
            </div>
            <div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {pricingHighlights.map((item) => (
                  <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'rgba(255,255,255,0.82)', fontSize: '15px', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(201,168,76,0.12)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#C9A84C', flexShrink: 0 }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: 14, height: 14 }}><polyline points="20 6 9 17 4 12" /></svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="intake" style={{ padding: '0 5% 88px' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '24px', padding: '36px', boxShadow: '0 10px 35px rgba(27,42,74,0.08)' }}>
          <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '1.4px', color: '#C9A84C', textTransform: 'uppercase', marginBottom: '8px' }}>Intake form</p>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '36px', color: '#1B2A4A', marginBottom: '8px' }}>Tell us about your case</h2>
          <p style={{ color: '#6B7280', marginBottom: '30px' }}>Share a few details and we’ll prepare a custom filing package to move your case forward.</p>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label htmlFor="name" style={{ fontSize: '14px', fontWeight: 600, color: '#243659' }}>Full name</label>
                <input id="name" name="name" value={formData.name} onChange={handleChange} required style={{ padding: '14px', border: '1px solid #d1d5db', borderRadius: '12px', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label htmlFor="email" style={{ fontSize: '14px', fontWeight: 600, color: '#243659' }}>Email address</label>
                <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required style={{ padding: '14px', border: '1px solid #d1d5db', borderRadius: '12px', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label htmlFor="phone" style={{ fontSize: '14px', fontWeight: 600, color: '#243659' }}>Phone number</label>
                <input id="phone" name="phone" value={formData.phone} onChange={handleChange} required style={{ padding: '14px', border: '1px solid #d1d5db', borderRadius: '12px', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label htmlFor="caseType" style={{ fontSize: '14px', fontWeight: 600, color: '#243659' }}>Case type</label>
                <select id="caseType" name="caseType" value={formData.caseType} onChange={handleChange} required style={{ padding: '14px', border: '1px solid #d1d5db', borderRadius: '12px', outline: 'none' }}>
                  <option value="">Select a case type</option>
                  {caseTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
              <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label htmlFor="county" style={{ fontSize: '14px', fontWeight: 600, color: '#243659' }}>County or court location</label>
                <input id="county" name="county" value={formData.county} onChange={handleChange} style={{ padding: '14px', border: '1px solid #d1d5db', borderRadius: '12px', outline: 'none' }} />
              </div>
              <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label htmlFor="summary" style={{ fontSize: '14px', fontWeight: 600, color: '#243659' }}>Tell us what happened</label>
                <textarea id="summary" name="summary" value={formData.summary} onChange={handleChange} required rows="6" style={{ padding: '14px', border: '1px solid #d1d5db', borderRadius: '12px', minHeight: '140px', outline: 'none' }} />
              </div>
            </div>
            <div style={{ marginTop: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
              <button type="submit" style={{ background: '#C9A84C', color: '#1B2A4A', padding: '14px 28px', borderRadius: '12px', border: 'none', fontWeight: 700, cursor: 'pointer' }}>Submit intake</button>
            </div>
            {status.message && (
              <div style={{ marginTop: '14px', padding: '14px 16px', borderRadius: '12px', background: status.type === 'error' ? '#fef2f2' : status.type === 'success' ? '#ecfdf3' : '#f8fafc', color: status.type === 'error' ? '#b91c1c' : status.type === 'success' ? '#047857' : '#243659' }}>
                {status.message}
              </div>
            )}
          </form>
        </div>
      </section>

      <section style={{ padding: '0 5% 88px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '36px', color: '#1B2A4A', marginBottom: '12px' }}>Ready to take control of your case?</h2>
          <p style={{ color: '#6B7280', marginBottom: '24px' }}>Join others who have saved time and money by filing with a clear plan.</p>
          <a href="#intake" style={{ display: 'inline-block', background: '#1B2A4A', color: '#fff', padding: '14px 28px', borderRadius: '12px', fontWeight: 700 }}>Get started for $100 →</a>
        </div>
      </section>

      <footer style={{ background: '#111d33', padding: '24px 5%', textAlign: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.32)', fontSize: '12px' }}>© 2026 Colorado Legal Service · Colorado courts only · No information on this site constitutes legal advice or guarantees any outcome.</p>
      </footer>
    </div>
  );
}

export default App;
