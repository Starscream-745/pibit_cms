import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import '../styles/ContactPage.css';

// ─── EmailJS Config ────────────────────────────────────────────────────────────
// 1. Sign up free at https://emailjs.com
// 2. Add Gmail service → copy Service ID below
// 3. Create email template → copy Template ID below
// 4. Go to Account → copy Public Key below
const EMAILJS_SERVICE_ID  = 'service_d4q346k';
const EMAILJS_TEMPLATE_ID = 'template_o7d7zfl';
const EMAILJS_PUBLIC_KEY  = 'fnu-D3cstGn_DBUWf';
// ──────────────────────────────────────────────────────────────────────────────

const MAX_MESSAGES = 3;
const COOLDOWN_SECONDS = 30;
const STORAGE_KEY = 'pibit_contact_count';
const COOLDOWN_KEY = 'pibit_contact_cooldown';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', company: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0); // seconds remaining
  const [msgCount, setMsgCount] = useState<number>(() =>
    parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10)
  );

  // Cooldown countdown
  React.useEffect(() => {
    const stored = parseInt(localStorage.getItem(COOLDOWN_KEY) || '0', 10);
    const remaining = Math.max(0, Math.ceil((stored - Date.now()) / 1000));
    if (remaining > 0) setCooldown(remaining);
  }, []);

  React.useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown(prev => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Guard: limit reached
    if (msgCount >= MAX_MESSAGES) return;
    // Guard: cooldown active
    if (cooldown > 0) return;

    setSending(true);
    setError('');

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name:  formData.name,
          from_email: formData.email,
          company:    formData.company,
          message:    formData.message,
          to_email:   'kushargatyagi31@gmail.com',
        },
        EMAILJS_PUBLIC_KEY
      );

      // Update count & cooldown in localStorage
      const newCount = msgCount + 1;
      localStorage.setItem(STORAGE_KEY, String(newCount));
      localStorage.setItem(COOLDOWN_KEY, String(Date.now() + COOLDOWN_SECONDS * 1000));
      setMsgCount(newCount);
      setCooldown(COOLDOWN_SECONDS);
      setSubmitted(true);

    } catch (err: any) {
      console.error('EmailJS error:', err);
      setError('Something went wrong. Please try emailing us directly at kushargatyagi31@gmail.com');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="contact-page">

      {/* Hero */}
      <div className="contact-hero">
        <div className="contact-hero-badge">Get In Touch</div>
        <h1>Let's build something <span className="contact-gradient-text">great together</span></h1>
        <p className="contact-hero-sub">
          Whether you're exploring PIBIT.AI for your brand, need a demo, or have a technical question — we're here.
        </p>
      </div>

      {/* Cards row */}
      <div className="contact-channels">

        {/* WhatsApp */}
        <a
          href="https://wa.me/917310892568"
          target="_blank"
          rel="noopener noreferrer"
          className="contact-channel-card channel-whatsapp"
        >
          <div className="channel-icon">
            <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </div>
          <div className="channel-info">
            <h3>Chat on WhatsApp</h3>
            <p>Quick questions? Message us directly. We respond fast.</p>
          </div>
          <div className="channel-arrow">→</div>
        </a>

        {/* Book a Call */}
        <div className="contact-channel-card channel-call channel-disabled">
          <div className="channel-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <div className="channel-info">
            <h3>Book a Demo Call <span className="coming-soon-badge">Coming Soon</span></h3>
            <p>Schedule a 15-min intro with our sales team. See PIBIT.AI live.</p>
          </div>
        </div>

        {/* Email */}
        <a
          href="mailto:kushargatyagi31@gmail.com"
          className="contact-channel-card channel-email"
        >
          <div className="channel-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>
          <div className="channel-info">
            <h3>Send an Email</h3>
            <p>For detailed inquiries, proposals, or partnerships.</p>
          </div>
          <div className="channel-arrow">→</div>
        </a>

      </div>

      {/* Divider */}
      <div className="contact-divider">
        <span>or send us a message directly</span>
      </div>

      {/* Form */}
      <div className="contact-form-wrapper">
        {submitted ? (
          <div className="contact-success">
            <div className="success-icon">✓</div>
            <h3>Message sent!</h3>
            <p>We'll get back to you within 24 hours.</p>
            {msgCount < MAX_MESSAGES ? (
              cooldown > 0 ? (
                <p className="cooldown-note">You can send another message in <strong>{cooldown}s</strong></p>
              ) : (
                <button className="btn-reset" onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', company: '', message: '' }); }}>
                  Send another message ({MAX_MESSAGES - msgCount} left)
                </button>
              )
            ) : (
              <p className="cooldown-note">You've reached the message limit of {MAX_MESSAGES}. Please email us directly.</p>
            )}
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Your Name *</label>
                <input
                  id="name" name="name" type="text"
                  placeholder="John Smith"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  id="email" name="email" type="email"
                  placeholder="john@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="company">Company / Organisation</label>
              <input
                id="company" name="company" type="text"
                placeholder="Your company name"
                value={formData.company}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Your Message *</label>
              <textarea
                id="message" name="message"
                placeholder="Tell us about your project, question, or how we can help..."
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>
            {error && (
              <p className="contact-error">{error}</p>
            )}
            {msgCount >= MAX_MESSAGES ? (
              <p className="contact-error">You've reached the maximum of {MAX_MESSAGES} messages. Please email us at <a href="mailto:kushargatyagi31@gmail.com">kushargatyagi31@gmail.com</a></p>
            ) : (
              <button
                type="submit"
                className="contact-submit-btn"
                disabled={sending || cooldown > 0}
              >
                {sending
                  ? 'Sending...'
                  : cooldown > 0
                  ? `Please wait ${cooldown}s`
                  : `Send Message → (${MAX_MESSAGES - msgCount} left)`
                }
              </button>
            )}
          </form>
        )}
      </div>

    </div>
  );
};

export default ContactPage;
