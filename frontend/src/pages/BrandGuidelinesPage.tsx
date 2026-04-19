import React from 'react';
import { Link } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import '../styles/BrandGuidelinesPage.css';

const BrandGuidelinesPage: React.FC = () => {
  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className="brand-guidelines-page">
      <Link to="/" className="floating-back-btn">
        <ArrowLeft size={20} />
        Back to Dashboard
      </Link>

      <section className="guidelines-hero">
        <motion.div 
          className="section-inner"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          variants={sectionVariants}
        >
          <h1>PIBIT.AI Brand Guidelines</h1>
          <p className="hero-subtitle">Our visual identity and brand standards</p>
        </motion.div>
      </section>

      <div className="guidelines-content">
        {/* Brand Colors */}
        <section className="guideline-section">
          <motion.div 
            className="section-inner"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={sectionVariants}
          >
            <h2>Brand Colors</h2>
            <p className="section-description">Our color palette reflects innovation, trust, and technology.</p>
            
            <div className="color-grid">
              <div className="color-card">
                <div className="color-swatch" style={{ background: '#0684F0' }}></div>
                <div className="color-info">
                  <h3>Tech Blue</h3>
                  <p className="color-hex">#0684F0</p>
                  <p className="color-usage">Primary brand color, CTAs, links</p>
                </div>
              </div>

              <div className="color-card">
                <div className="color-swatch" style={{ background: '#29A0F3' }}></div>
                <div className="color-info">
                  <h3>Celestial Blue</h3>
                  <p className="color-hex">#29A0F3</p>
                  <p className="color-usage">Accents, highlights, gradients</p>
                </div>
              </div>

              <div className="color-card">
                <div className="color-swatch" style={{ background: '#383838' }}></div>
                <div className="color-info">
                  <h3>Jet Black</h3>
                  <p className="color-hex">#383838</p>
                  <p className="color-usage">Primary text, headings</p>
                </div>
              </div>

              <div className="color-card">
                <div className="color-swatch" style={{ background: '#FFFFFF', border: '1px solid #e5e7eb' }}></div>
                <div className="color-info">
                  <h3>Cloud White</h3>
                  <p className="color-hex">#FFFFFF</p>
                  <p className="color-usage">Backgrounds, cards, contrast</p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Typography */}
        <section className="guideline-section">
          <motion.div 
            className="section-inner"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={sectionVariants}
          >
            <h2>Typography</h2>
            <p className="section-description">Our font choices convey modernity and professionalism.</p>
            
            <div className="typography-grid">
              <div className="typography-card">
                <h3 className="font-display" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Space Grotesk</h3>
                <p className="font-usage">Headings, titles, navigation</p>
                <div className="font-weights">
                  <span style={{ fontWeight: 400 }}>Regular (400)</span>
                  <span style={{ fontWeight: 500 }}>Medium (500)</span>
                  <span style={{ fontWeight: 600 }}>Semi-Bold (600)</span>
                  <span style={{ fontWeight: 700 }}>Bold (700)</span>
                </div>
              </div>

              <div className="typography-card">
                <h3 className="font-display" style={{ fontFamily: 'Inter, sans-serif' }}>Inter</h3>
                <p className="font-usage">Body text, descriptions, UI elements</p>
                <div className="font-weights">
                  <span style={{ fontWeight: 400 }}>Regular (400)</span>
                  <span style={{ fontWeight: 500 }}>Medium (500)</span>
                  <span style={{ fontWeight: 600 }}>Semi-Bold (600)</span>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Logo Usage */}
        <section className="guideline-section">
          <motion.div 
            className="section-inner"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={sectionVariants}
          >
            <h2>Logo Usage</h2>
            <p className="section-description">Guidelines for using the PIBIT.AI logo correctly.</p>
            
            <div className="logo-rules">
              <div className="rule-card do">
                <div className="rule-icon">✓</div>
                <h3>Do</h3>
                <ul>
                  <li>Use the logo on solid backgrounds</li>
                  <li>Maintain minimum clear space around logo</li>
                  <li>Use approved color variations only</li>
                  <li>Keep proportions intact when resizing</li>
                  <li>Use high-resolution versions for print</li>
                </ul>
              </div>

              <div className="rule-card dont">
                <div className="rule-icon">✗</div>
                <h3>Don't</h3>
                <ul>
                  <li>Stretch or distort the logo</li>
                  <li>Change logo colors</li>
                  <li>Add effects (shadows, gradients, etc.)</li>
                  <li>Place on busy backgrounds</li>
                  <li>Rotate or flip the logo</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Spacing & Layout */}
        <section className="guideline-section">
          <motion.div 
            className="section-inner"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={sectionVariants}
          >
            <h2>Spacing & Layout</h2>
            <p className="section-description">Consistent spacing creates visual harmony.</p>
            
            <div className="spacing-info">
              <div className="spacing-item">
                <h3>Base Unit</h3>
                <p>8px grid system</p>
              </div>
              <div className="spacing-item">
                <h3>Section Spacing</h3>
                <p>48px - 64px between sections</p>
              </div>
              <div className="spacing-item">
                <h3>Element Spacing</h3>
                <p>16px - 24px between elements</p>
              </div>
              <div className="spacing-item">
                <h3>Content Width</h3>
                <p>Max 1200px for readability</p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Voice & Tone */}
        <section className="guideline-section">
          <motion.div 
            className="section-inner"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={sectionVariants}
          >
            <h2>Voice & Tone</h2>
            <p className="section-description">How we communicate with our audience.</p>
            
            <div className="voice-grid">
              <div className="voice-card">
                <h3>Professional</h3>
                <p>We maintain expertise and credibility in AI technology</p>
              </div>
              <div className="voice-card">
                <h3>Innovative</h3>
                <p>We embrace cutting-edge solutions and forward thinking</p>
              </div>
              <div className="voice-card">
                <h3>Accessible</h3>
                <p>We make complex technology understandable for everyone</p>
              </div>
              <div className="voice-card">
                <h3>Trustworthy</h3>
                <p>We build confidence through transparency and reliability</p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Download Assets */}
        <section className="guideline-section download-section">
          <motion.div 
            className="section-inner"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={sectionVariants}
          >
            <h2>Download Brand Assets</h2>
            <p className="section-description">Get our official logos and brand materials.</p>
            
            <div className="download-cta">
              <Link to="/logos" className="btn btn-primary-large">
                <span className="btn-icon">📦</span>
                View All Logos
              </Link>
              <p className="download-note">All logos available in PNG format</p>
            </div>
          </motion.div>
        </section>
      </div>

      <section className="guidelines-footer">
        <motion.div 
          className="section-inner"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          variants={sectionVariants}
        >
          <p>For questions about brand usage, please contact the PIBIT.AI team.</p>
          <p className="footer-copyright">© 2026 PIBIT.AI - All rights reserved</p>
        </motion.div>
      </section>
    </div>
  );
};

export default BrandGuidelinesPage;
