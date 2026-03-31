import { useState, useEffect, useRef } from "react";
import "./App.css";

function useCountUp(target, duration, active) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let frame = 0;
    const total = Math.round(duration / 16);
    const id = setInterval(() => {
      frame++;
      setValue(frame >= total ? target : Math.floor((frame / total) * target));
      if (frame >= total) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [active, target, duration]);
  return value;
}

const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="check-icon">
    <path d="M2 6.5l3 3 6-6" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function App() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatStep, setChatStep] = useState(0);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);

  const msgCount = useCountUp(247, 1200, statsVisible);
  const convCount = useCountUp(38, 1000, statsVisible);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => setChatStep(1), 800);
    const t2 = setTimeout(() => setChatStep(2), 2000);
    const t3 = setTimeout(() => setChatStep(3), 3300);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setStatsVisible(true); obs.disconnect(); } },
      { threshold: 0.4 }
    );
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll(".fade-up");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div>
      {/* NAV */}
      <nav className={navScrolled ? "scrolled" : ""}>
        <a href="/" className="nav-logo">
          <span>Askra</span>
          <span className="nav-badge">BETA</span>
        </a>
        <div className={`nav-links${menuOpen ? " open" : ""}`}>
          <a href="#how-it-works" onClick={() => setMenuOpen(false)}>How it works</a>
          <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
          <a href="#pricing" onClick={() => setMenuOpen(false)}>Pricing</a>
        </div>
        <div className="nav-cta">
          <a href="https://app.askra.app/login" className="btn btn-ghost">Sign In</a>
          <a href="https://app.askra.app/register?plan=free" className="btn btn-primary">Get Started Free</a>
          <button
            className={`hamburger${menuOpen ? " active" : ""}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* HERO */}
      <div className="hero">
        <div className="hero-grid" />
        <div className="hero-badge hero-a1">✦ AI-powered customer support for small businesses</div>
        <h1 className="hero-a2">Your business,<br /><span>answered instantly</span></h1>
        <p className="hero-a3">Askra gives your website an AI-powered customer service focused chatbot that learns and uses any information you provide. Upload your documents, customize your bot, and go live in minutes.</p>
        <div className="hero-cta hero-a4">
          <a href="https://app.askra.app/register?plan=free" className="btn btn-primary">Start for free</a>
          <a href="#how-it-works" className="btn btn-ghost">See how it works</a>
        </div>

        <div className="hero-preview hero-a5">
          <div className="preview-bar">
            <div className="preview-dot" style={{ background: "#ff5f57" }} />
            <div className="preview-dot" style={{ background: "#febc2e" }} />
            <div className="preview-dot" style={{ background: "#28c840" }} />
            <div className="preview-url">app.askra.app/dashboard</div>
          </div>
          <div className="preview-content">
            <div className="preview-sidebar">
              <div className="preview-nav-item active">Overview</div>
              <div className="preview-nav-item">Bot Settings</div>
              <div className="preview-nav-item">Conversations</div>
              <div className="preview-nav-item">Knowledge Base</div>
            </div>
            <div className="preview-main">
              <div className="preview-stat-row" ref={statsRef}>
                <div className="preview-stat">
                  <div className="preview-stat-label">TOTAL MESSAGES</div>
                  <div className="preview-stat-value">{msgCount}</div>
                </div>
                <div className="preview-stat">
                  <div className="preview-stat-label">CONVERSATIONS</div>
                  <div className="preview-stat-value">{convCount}</div>
                </div>
                <div className="preview-stat">
                  <div className="preview-stat-label">STATUS</div>
                  <div className="preview-stat-value" style={{ fontSize: 13, marginTop: 4 }}>
                    <span style={{ background: "#0f2e1f", color: "#4ade80", border: "1px solid #14532d44", padding: "2px 8px", borderRadius: 4, fontSize: 11 }}>Active</span>
                  </div>
                </div>
              </div>
              <div className="preview-card">
                <div className="preview-card-title">Recent conversation</div>
                <div className={`preview-msg bot chat-msg${chatStep >= 1 ? " show" : ""}`}>Hi! How can I help you today?</div>
                <div className={`preview-msg user chat-msg${chatStep >= 2 ? " show" : ""}`}>What are your business hours?</div>
                <div className={`preview-msg bot chat-msg${chatStep >= 3 ? " show" : ""}`}>We're open Monday through Friday, 9am to 6pm EST.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section id="how-it-works">
        <div className="section-label fade-up">How it works</div>
        <div className="section-title fade-up delay-1">Up and running<br />in three steps</div>
        <div className="section-subtitle fade-up delay-2">No developers needed. No complicated setup. Just a smart chatbot on your website in minutes.</div>

        <div className="steps">
          <div className="step fade-up delay-1">
            <div className="step-number">01</div>
            <h3>Create your account</h3>
            <p>Sign up and customize your bot's name, colors, and personality to match your brand.</p>
          </div>
          <div className="step fade-up delay-2">
            <div className="step-number">02</div>
            <h3>Upload your knowledge</h3>
            <p>Upload PDFs of manuals, FAQs, or any type of text information. Askra learns everything about your business instantly.</p>
          </div>
          <div className="step fade-up delay-3">
            <div className="step-number">03</div>
            <h3>Embed on your site</h3>
            <p>Copy a few small lines of code and paste it into your website. Your bot goes live immediately.</p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ background: "#0f0f17", maxWidth: "100%", padding: "100px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="section-label fade-up">Features</div>
          <div className="section-title fade-up delay-1">Everything your business needs</div>
          <div className="section-subtitle fade-up delay-2">Built for small businesses who want enterprise-level customer support without the enterprise price tag.</div>

          <div className="features">
            <div className="feature fade-up delay-1">
              <div className="feature-icon">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#a78bfa" strokeWidth="1.5">
                  <path d="M9 1l2 6h6l-5 3.5 2 6L9 13l-5 3.5 2-6L1 7h6z"/>
                </svg>
              </div>
              <h3>AI Knowledge Base</h3>
              <p>Upload any PDF and your bot instantly knows the content. Product manuals, FAQs, service guides — all searchable.</p>
            </div>
            <div className="feature fade-up delay-2">
              <div className="feature-icon">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#a78bfa" strokeWidth="1.5">
                  <rect x="1" y="1" width="16" height="16" rx="3"/>
                  <path d="M5 9h8M5 6h8M5 12h5"/>
                </svg>
              </div>
              <h3>Full Customization</h3>
              <p>Match your brand exactly. Custom colors, bot name, logo, and opening message — all configurable from your dashboard.</p>
            </div>
            <div className="feature fade-up delay-3">
              <div className="feature-icon">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#a78bfa" strokeWidth="1.5">
                  <path d="M1 9a8 8 0 1016 0A8 8 0 001 9z"/>
                  <path d="M9 5v4l3 3"/>
                </svg>
              </div>
              <h3>24/7 Availability</h3>
              <p>Your bot answers customer questions around the clock. No sick days, no off hours, no missed opportunities.</p>
            </div>
            <div className="feature fade-up delay-1">
              <div className="feature-icon">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#a78bfa" strokeWidth="1.5">
                  <path d="M2 2h14v10H2zM6 16h6M9 12v4"/>
                </svg>
              </div>
              <h3>Conversation History</h3>
              <p>See every conversation your bot has had. Understand what your customers are asking and improve over time.</p>
            </div>
            <div className="feature fade-up delay-2">
              <div className="feature-icon">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#a78bfa" strokeWidth="1.5">
                  <path d="M9 1l2 4 5 .5-3.5 3.5 1 5L9 12l-4.5 2 1-5L2 5.5 7 5z"/>
                </svg>
              </div>
              <h3>Easy Embed</h3>
              <p>A few small lines of code. Paste it anywhere — Squarespace, WordPress, Shopify, or custom sites. Works everywhere.</p>
            </div>
            <div className="feature fade-up delay-3">
              <div className="feature-icon">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#a78bfa" strokeWidth="1.5">
                  <rect x="1" y="5" width="16" height="10" rx="2"/>
                  <path d="M5 5V3a4 4 0 018 0v2"/>
                </svg>
              </div>
              <h3>Secure by Default</h3>
              <p>JWT authentication, encrypted data, rate limiting, and input sanitization. Enterprise security at every plan.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing">
        <div className="section-label fade-up">Pricing</div>
        <div className="section-title fade-up delay-1">Simple, transparent pricing</div>
        <div className="section-subtitle fade-up delay-2">Start free and scale as you grow. No hidden fees, no surprises.</div>

        <div className="pricing-grid">
          <div className="pricing-card fade-up delay-1">
            <div className="pricing-plan">Free</div>
            <div className="pricing-price">$0<span>/mo</span></div>
            <div className="pricing-desc">Perfect for trying Askra out</div>
            <ul className="pricing-features">
              <li><CheckIcon />100 messages per month</li>
              <li><CheckIcon />1 PDF upload</li>
              <li><CheckIcon />Basic customization</li>
            </ul>
            <a href="https://app.askra.app/register?plan=free" className="btn btn-ghost">Get started free</a>
          </div>

          <div className="pricing-card featured fade-up delay-2">
            <div className="featured-badge">Most popular</div>
            <div className="pricing-plan">Starter</div>
            <div className="pricing-price">$29<span>/mo</span></div>
            <div className="pricing-desc">For small businesses ready to grow</div>
            <ul className="pricing-features">
              <li><CheckIcon />5,000 messages per month</li>
              <li><CheckIcon />10 PDF uploads</li>
              <li><CheckIcon />Full brand customization</li>
              <li><CheckIcon />Conversation history</li>
            </ul>
            <a href="https://app.askra.app/register?plan=starter" className="btn btn-primary">Get started</a>
          </div>

          <div className="pricing-card fade-up delay-3">
            <div className="pricing-plan">Pro</div>
            <div className="pricing-price">$79<span>/mo</span></div>
            <div className="pricing-desc">For businesses that need more</div>
            <ul className="pricing-features">
              <li><CheckIcon />50,000 messages per month</li>
              <li><CheckIcon />75 PDF uploads</li>
              <li><CheckIcon />Full brand customization</li>
              <li><CheckIcon />Conversation history</li>
              <li><CheckIcon />Priority support</li>
              <li><CheckIcon />Early access to new features</li>
            </ul>
            <a href="https://app.askra.app/register?plan=pro" className="btn btn-ghost">Get started</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-logo">
          <span>Askra</span>
          <span className="nav-badge">BETA</span>
        </div>
        <div className="footer-links">
          <a href="https://mail.google.com/mail/?view=cm&to=jacksonjallen26@gmail.com" target="_blank" rel="noreferrer">Contact</a>
          <a href="https://app.askra.app/privacy" target="_blank" rel="noreferrer">Privacy Policy</a>
          <a href="https://app.askra.app/terms" target="_blank" rel="noreferrer">Terms of Service</a>
        </div>
        <div className="footer-copy">© 2026 Askra. All rights reserved.</div>
      </footer>
    </div>
  );
}

export default App;
