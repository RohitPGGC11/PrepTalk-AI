import React from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { userContext } from "../../contexts/userContext";
import Navbar from "../../components/Navbar/Navbar";

/* ── data ── */
const domains = [
  { icon: "⚛️", label: "Frontend Development" },
  { icon: "⚙️", label: "Backend Development" },
  { icon: "🧮", label: "Data Structures & Algorithms" },
  { icon: "🏗️", label: "System Design" },
  { icon: "🗄️", label: "Database & SQL" },
  { icon: "🤝", label: "HR & Behavioral" },
];

const features = [
  { icon: "🤖", title: "AI Interviewer",        desc: "Dynamic, context-aware questions that adapt to your responses in real-time." },
  { icon: "🎙️", title: "Voice & Text Mode",     desc: "Practice with speech recognition or typed answers — your choice." },
  { icon: "📊", title: "Performance Analytics",  desc: "Deep-dive scores, keyword heatmaps, and trend tracking across sessions." },
  { icon: "💡", title: "Smart Feedback",         desc: "Clarity, confidence, and technical accuracy scored after every answer." },
];

const steps = [
  { num: "01", label: "Choose Domain", desc: "Pick your domain and set the difficulty from beginner to senior." },
  { num: "02", label: "AI Generates",  desc: "The interviewer builds a structured, realistic question set for you." },
  { num: "03", label: "You Respond",   desc: "Answer via voice or text, just like a real technical interview." },
  { num: "04", label: "Get Report",    desc: "Receive detailed feedback, scores, and a personalised roadmap." },
];

const testimonials = [
  { text: "PrepTALK AI helped me crack my frontend interview. The AI feedback was incredibly accurate and actionable.", author: "Rohan M.",  role: "SDE-2 at a top startup" },
  { text: "The resume analyzer improved my ATS score by 30 points in one pass. I started getting callbacks immediately.", author: "Priya S.", role: "Backend Developer" },
  { text: "Best interview prep platform I've used. The adaptive questions felt exactly like a real FAANG screen.", author: "Arjun K.",  role: "Final Year, IIT-D" },
];

const stats = [
  ["10K+", "Interviews Taken"],
  ["95%",  "User Satisfaction"],
  ["6",    "Domains Covered"],
  ["4.9★", "Average Rating"],
];

 const interviewFeatures = [
  "Interview Question Practice",
  "AI Feedback on Answers",
  "Confidence & Communication Analysis",
  "Role-Specific Interview Questions",
  "Performance Score & Improvement Tips",
];

/* ══════════════════════════════════════
   COMPONENT
══════════════════════════════════════ */
const Home = () => {
  const navigate = useNavigate();
  const { Token } = useContext(userContext);
  return (
    <div className="home">

      {/*── NAvbar ── */}
      <Navbar/>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />

        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot" />
            AI-Powered Interview Prep
          </div>

          <h1>
            Master Technical<br />
            <span className="gradient-text">Interviews with AI</span>
          </h1>

          <p>
            Prep smarter with adaptive mock interviews across Frontend, Backend,
            DSA, System Design, and more — with real-time AI feedback.
          </p>

          <div className="hero-buttons">
            <button className="primary-btn" onClick={() => navigate("/domain")}>
              Start Interview →
            </button>
            <button className="secondary-btn" onClick={()=>{window.open("https://www.linkedin.com/in/rohitkumar731", "_blank")}}>Meet the Developer</button>
          </div>
        </div>

        {/* stats strip */}
        <div className="stats-strip">
          {stats.map(([num, label]) => (
            <div key={label} className="stat-item">
              <div className="stat-num">{num}</div>
              <div className="stat-label">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="section-light">
        <div className="section-inner">
          <span className="section-tag">About</span>
          <h2>Built for engineers who<br />take interviews seriously</h2>
          <p className="section-desc">
            PrepTALK AI is an intelligent interview preparation platform that simulates
            real-world technical interviews. It evaluates your answers, tracks performance
            over time, and delivers AI-driven feedback so you can improve faster than
            grinding LeetCode alone.
          </p>
        </div>
      </section>

      {/* ── DOMAINS ── */}
      <section id="domains" className="section">
        <span className="section-tag">Domains</span>
        <h2>Everything you need to prep</h2>
        <p className="section-desc">
          Six specialised tracks, each with adaptive question banks built by
          engineers who've been there.
        </p>
        <div className="domains-grid">
          {domains.map((d, i) => (
            <div key={i} className="domain-card">
              <span className="domain-icon">{d.icon}</span>
              {d.label}
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="section-light">
        <div className="section-inner">
          <span className="section-tag">Features</span>
          <h2>A platform that evolves<br />with you</h2>
          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RESUME ── */}
      <section id="resume" className="section">
        <div className="resume-layout">
          <div>
            <span className="section-tag">Upcoming</span>
            <h2>Your Will Be,<br />interview-ready</h2>
            <p className="section-desc">
              Build professional Carrier with guided AI  and run them through
              AI analysis for keyword optimisation, structure improvements, and response
              compatibility scoring.
            </p>
            <div className="hero-buttons">
              <button className="primary-btn">Start your journey</button>
              <button className="secondary-btn">Analyze YourSelf</button>
            </div>
          </div>

          <div className="resume-checklist">
            {interviewFeatures.map((item) => (
              <div key={item} className="resume-check-item">
                <span className="checkmark">✓</span> {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="section-light">
        <div className="section-inner">
          <span className="section-tag">How It Works</span>
          <h2>Four steps to interview confidence</h2>
          <div className="process-grid">
            {steps.map((s, i) => (
              <div key={i} className="process-card">
                <div className="process-num">{s.num}</div>
                <h3>{s.label}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="section">
        <span className="section-tag">Pricing</span>
        <h2>Simple, transparent pricing</h2>
        <p className="section-desc">No hidden fees. Upgrade or downgrade anytime.</p>

        <div className="pricing-grid">
          {/* Free */}
          <div className="pricing-card">
            <div className="plan-name">Free Plan</div>
            <div className="plan-price">₹0</div>
            <div className="plan-per">forever</div>
            {["5 AI interviews / month", "Basic performance report", "1 resume analysis"].map(f => (
              <div key={f} className="plan-feature"><span className="checkmark">✓</span> {f}</div>
            ))}
            <button className="secondary-btn plan-btn">Get Started</button>
          </div>

          {/* Pro */}
          <div className="pricing-card featured">
            <div className="popular-badge">Most Popular</div>
            <div className="plan-name">Pro Plan</div>
            <div className="plan-price gradient">₹499</div>
            <div className="plan-per">per month</div>
            {["Unlimited AI interviews", "Detailed performance analytics", "Unlimited resume analysis", "Voice mode", "Priority support"].map(f => (
              <div key={f} className="plan-feature"><span className="checkmark">✓</span> {f}</div>
            ))}
            <button className="primary-btn plan-btn">Start Free Trial</button>
          </div>

          {/* Enterprise */}
          <div className="pricing-card">
            <div className="plan-name">Enterprise</div>
            <div className="plan-price">Custom</div>
            <div className="plan-per">contact for pricing</div>
            {["Team dashboard", "Advanced analytics", "Custom interview sets", "Dedicated support", "SSO & compliance"].map(f => (
              <div key={f} className="plan-feature"><span className="checkmark">✓</span> {f}</div>
            ))}
            <button className="secondary-btn plan-btn">Contact Sales</button>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section-light">
        <div className="section-inner">
          <span className="section-tag">Testimonials</span>
          <h2>Trusted by engineers<br />across India</h2>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card">
                <div className="stars">★★★★★</div>
                <p>"{t.text}"</p>
                <div className="testimonial-author">{t.author}</div>
                <div className="testimonial-role">{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta">
        <div className="cta-glow" />
        <h2>
          Ready to ace your<br />
          <span className="gradient-text">next interview?</span>
        </h2>
        <p>Join thousands of engineers already preparing smarter.</p>
        <div className="hero-buttons">
          <button
            className="primary-btn"
            onClick={() => navigate(Token ? "/domain" : "/login")}
          >
            Start for Free →
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-logo">
          <span className="logo-highlight">PrepTALK</span> AI
        </div>
        <div className="footer-copy">© 2026 PrepTALK AI. All rights reserved.</div>
        <div className="footer-links">
          <a href="https://www.linkedin.com/in/rohitkumar731">Privacy</a>
          <a href="https://www.linkedin.com/in/rohitkumar731">Terms</a>
          <a href="https://www.linkedin.com/in/rohitkumar731">Contact</a>
        </div>
      </footer>

    </div>
  );
};

export default Home;
