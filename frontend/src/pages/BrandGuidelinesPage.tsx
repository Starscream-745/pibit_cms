import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import '../styles/BrandGuidelinesPage.css';

const sections = [
  { id: 'hero', label: 'Intro' },
  { id: 'colors', label: 'Colors' },
  { id: 'typography', label: 'Typography' },
  { id: 'logo', label: 'Logo' },
  { id: 'spacing', label: 'Layout' },
  { id: 'voice', label: 'Voice' },
  { id: 'download', label: 'Assets' }
];

const SectionHeader: React.FC<{ title: string; subtitle?: string; dark?: boolean }> = ({ title, subtitle, dark }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    className="section-header"
  >
    <h2 style={{ color: dark ? 'white' : '#0a0a0a' }}>{title}</h2>
    {subtitle && <p className="section-description">{subtitle}</p>}
  </motion.div>
);

const Section: React.FC<{
  id: string;
  className?: string;
  onInView: (id: string) => void;
  children: React.ReactNode;
}> = ({ id, className, onInView, children }) => {
  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  useEffect(() => {
    if (inView) onInView(id);
  }, [inView, id, onInView]);

  return (
    <section id={id} ref={ref} className={`guideline-section ${className || ''}`}>
      {children}
    </section>
  );
};

const BrandGuidelinesPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="brand-guidelines-container">
      <Link to="/" className="back-to-dashboard">
        <span>←</span> Back to Dashboard
      </Link>

      <motion.div className="scroll-progress" style={{ scaleX }} />

      <nav className="side-nav">
        {sections.map((section) => (
          <motion.div
            key={section.id}
            className={`nav-dot ${activeSection === section.id ? 'active' : ''}`}
            onClick={() => scrollTo(section.id)}
            whileHover={{ scale: 1.5 }}
            title={section.label}
          />
        ))}
      </nav>

      <Section id="hero" onInView={setActiveSection}>
        <div className="halo-bg" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="hero-title">
            <img src="/logo.png" alt="PIBIT.AI" style={{ height: '80px', width: 'auto', verticalAlign: 'middle' }} />
          </h1>
          <p className="hero-subtitle">Visual Identity Standards 2026</p>
          <motion.div
            className="scroll-indicator"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            ↓ Scroll to Explore
          </motion.div>
        </motion.div>
      </Section>

      <Section id="colors" className="section-light" onInView={setActiveSection}>
        <div className="guidelines-content">
          <SectionHeader
            title="Core Palette"
            subtitle="Our colors reflect innovation, trust, and technology."
          />
          <div className="color-grid">
            {[
              { name: 'Tech Blue', hex: '#0684F0', desc: 'Primary brand color' },
              { name: 'Celestial', hex: '#29A0F3', desc: 'Accents & Highlights' },
              { name: 'Jet Black', hex: '#383838', desc: 'Primary Typography' },
              { name: 'Cloud White', hex: '#FFFFFF', desc: 'Canvas & Negative Space' }
            ].map((color, i) => (
              <motion.div
                key={color.hex}
                className="color-card"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
              >
                <div className="color-swatch" style={{ background: color.hex, border: i === 3 ? '1px solid #eee' : 'none' }} />
                <div className="color-info">
                  <h3>{color.name}</h3>
                  <p className="color-hex">{color.hex}</p>
                  <p className="color-usage">{color.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      <Section id="typography" onInView={setActiveSection}>
        <div className="halo-bg" style={{ left: '-10%', top: '20%' }} />
        <div className="guidelines-content">
          <SectionHeader title="Typography" subtitle="Modernity through geometric precision." dark />
          <div className="typography-display">
            <motion.div
              className="typography-card premium-hover-card"
              initial="initial"
              whileHover="hover"
            >
              <motion.div
                className="font-camouflage-title"
                variants={{
                  initial: { opacity: 0.15, scale: 1, y: 0 },
                  hover: { opacity: 0, scale: 1.1, y: -20 }
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <div>SPACE</div>
                <div style={{ marginTop: '-2rem' }}>GROTESK</div>
              </motion.div>

              <motion.div
                className="card-details-overlay"
                variants={{
                  initial: { opacity: 0, y: 30 },
                  hover: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.4 }}
              >
                <h3 className="font-title-small">Space Grotesk</h3>
                <p className="font-subtitle">Headings, titles, navigation</p>
                <div className="font-weights-list">
                  <div className="weight-pill">Regular (400)</div>
                  <div className="weight-pill">Medium (500)</div>
                  <div className="weight-pill">Semi-Bold (600)</div>
                  <div className="weight-pill">Bold (700)</div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              className="typography-card premium-hover-card"
              initial="initial"
              whileHover="hover"
            >
              <motion.div
                className="font-camouflage-title"
                variants={{
                  initial: { opacity: 0.15, scale: 1, y: 0 },
                  hover: { opacity: 0, scale: 1.1, y: -20 }
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                INTER
              </motion.div>

              <motion.div
                className="card-details-overlay"
                variants={{
                  initial: { opacity: 0, y: 30 },
                  hover: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.4 }}
              >
                <h3 className="font-title-small">Inter</h3>
                <p className="font-subtitle">Body text, descriptions, UI elements</p>
                <div className="font-weights-list">
                  <div className="weight-pill">Regular (400)</div>
                  <div className="weight-pill">Medium (500)</div>
                  <div className="weight-pill">Semi-Bold (600)</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </Section>

      <Section id="logo" className="section-light" onInView={setActiveSection}>
        <div className="guidelines-content">
          <SectionHeader title="Logo Integrity" subtitle="Maintaining visual consistency." />
          <div className="logo-rules">
            <motion.div
              className="rule-card do"
              whileHover={{ scale: 1.02 }}
            >
              <div className="rule-icon">✓</div>
              <h3>Do</h3>
              <ul>
                <li>Maintain clear space</li>
                <li>Use brand colors</li>
                <li>Keep proportions</li>
              </ul>
            </motion.div>
            <motion.div
              className="rule-card dont"
              whileHover={{ scale: 1.02 }}
            >
              <div className="rule-icon">✗</div>
              <h3>Don't</h3>
              <ul>
                <li>Stretch or distort</li>
                <li>Add drop shadows</li>
                <li>Modify geometry</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </Section>

      <Section id="spacing" onInView={setActiveSection}>
        <div className="halo-bg" style={{ right: '-10%', bottom: '10%' }} />
        <div className="guidelines-content">
          <SectionHeader title="Grid System" subtitle="The 8px foundation of our interface." dark />
          <div className="spacing-info">
            {['8px Base', '24px Gutter', '1400px Max'].map((item, i) => (
              <motion.div
                key={item}
                className="spacing-item"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <h3>{item.split(' ')[1]}</h3>
                <p>{item.split(' ')[0]}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      <Section id="voice" className="section-light" onInView={setActiveSection}>
        <div className="guidelines-content">
          <SectionHeader title="Brand Voice" subtitle="How we communicate our vision." />
          <div className="voice-grid">
            {['Innovative', 'Trustworthy', 'Accessible', 'Precise'].map((voice, i) => (
              <motion.div
                key={voice}
                className="voice-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <h3>{voice}</h3>
                <p>Establishing our position as a leader in AI asset management.</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      <Section id="download" onInView={setActiveSection}>
        <div className="guidelines-content">
          <SectionHeader title="Ready to Build?" subtitle="Access the official PIBIT.AI asset library." dark />
          <div className="premium-cta-group">
            <Link to="/iconography" className="btn-premium btn-premium-primary">
              View Iconography
            </Link>
            <Link to="/images" className="btn-premium btn-premium-secondary">
              Explore Image Gallery
            </Link>
          </div>
        </div>
        <footer className="premium-footer">
          <p>© 2026 PIBIT.AI - All rights reserved</p>
        </footer>
      </Section>
    </div>
  );
};

export default BrandGuidelinesPage;
