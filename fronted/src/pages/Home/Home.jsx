import React from "react";
import "./Home.css";

const Home = () => {
  return (
    <div className="home">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">
          <span className="logo-highlight">PrepTALK</span> AI
        </div>

        <ul className="nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#domains">Domains</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#resume">Resume</a></li>
        </ul>

        <button className="nav-btn">Get Started</button>
      </nav>


      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-content">
          <h1>
            Master Technical Interviews with AI
          </h1>
          <p>
            Prep smarter with AI-powered mock interviews across Frontend,
            Backend, Data Structures, System Design, and more.
          </p>
          <div className="hero-buttons">
            <button className="primary-btn">Start Interview</button>
            <button className="secondary-btn">Analyze Resume</button>
          </div>
        </div>
      </section>


      {/* ABOUT */}
      <section id="about" className="section">
        <h2>About PrepTALK AI</h2>
        <p>
          PrepTALK AI is an intelligent interview preparation platform designed
          to simulate real-world technical interviews. It evaluates your answers,
          tracks performance, and provides AI-driven feedback to help you improve faster.
        </p>
      </section>


      {/* DOMAINS */}
      <section id="domains" className="section light-bg">
        <h2>Interview Domains</h2>

        <div className="grid">
          <div className="card">Frontend Development</div>
          <div className="card">Backend Development</div>
          <div className="card">Data Structures & Algorithms</div>
          <div className="card">System Design</div>
          <div className="card">Database & SQL</div>
          <div className="card">HR & Behavioral</div>
        </div>
      </section>


      {/* FEATURES */}
      <section id="features" className="section">
        <h2>Platform Features</h2>

        <div className="grid">
          <div className="feature-card">
            <h3>AI Interviewer</h3>
            <p>Dynamic AI-generated questions with realistic interview flow.</p>
          </div>

          <div className="feature-card">
            <h3>Voice & Text Mode</h3>
            <p>Practice using speech recognition or text-based responses.</p>
          </div>

          <div className="feature-card">
            <h3>Performance Analytics</h3>
            <p>Track scores, keyword coverage, and improvement areas.</p>
          </div>

          <div className="feature-card">
            <h3>Smart Feedback</h3>
            <p>Get clarity, confidence, and technical accuracy insights.</p>
          </div>
        </div>
      </section>


      {/* RESUME */}
      <section id="resume" className="section light-bg">
        <h2>Resume Builder & Analyzer</h2>
        <p>
          Build professional resumes with guided templates and analyze your resume
          using AI to improve keywords, structure, and ATS compatibility.
        </p>

        <div className="hero-buttons">
          <button className="primary-btn">Create Resume</button>
          <button className="secondary-btn">Analyze Resume</button>
        </div>
      </section>

      {/* WHY CHOOSE US */}
<section className="section">
  <h2>Why Choose PrepTALK AI?</h2>

  <div className="grid">
    <div className="info-card">
      <h3>Real Interview Simulation</h3>
      <p>
        Experience company-level interview patterns powered by AI logic
        and structured evaluation.
      </p>
    </div>

    <div className="info-card">
      <h3>Domain-Specific Preparation</h3>
      <p>
        Prepare separately for Frontend, Backend, DSA, System Design,
        and core CS subjects.
      </p>
    </div>

    <div className="info-card">
      <h3>Instant Performance Report</h3>
      <p>
        Get structured performance analytics including strengths,
        weaknesses, and improvement roadmap.
      </p>
    </div>
  </div>
</section>
{/* INTERVIEW PROCESS */}
<section className="section light-bg">
  <h2>Our Interview Process</h2>

  <div className="grid">
    <div className="process-card">
      <h3>Step 1</h3>
      <p>Select your domain and difficulty level.</p>
    </div>

    <div className="process-card">
      <h3>Step 2</h3>
      <p>AI generates structured interview questions dynamically.</p>
    </div>

    <div className="process-card">
      <h3>Step 3</h3>
      <p>Respond via voice or text mode.</p>
    </div>

    <div className="process-card">
      <h3>Step 4</h3>
      <p>Receive intelligent feedback and performance score.</p>
    </div>
  </div>
</section>
{/* PRICING SECTION */}
<section className="section">
  <h2>Simple Pricing</h2>

  <div className="grid">
    <div className="pricing-card">
      <h3>Free Plan</h3>
      <p>Basic AI Interviews</p>
      <p>Limited Resume Analysis</p>
      <h4>₹0 / Month</h4>
    </div>

    <div className="pricing-card featured">
      <h3>Pro Plan</h3>
      <p>Unlimited AI Interviews</p>
      <p>Advanced Resume Analysis</p>
      <p>Detailed Performance Reports</p>
      <h4>₹499 / Month</h4>
    </div>

    <div className="pricing-card">
      <h3>Enterprise</h3>
      <p>Team Dashboard</p>
      <p>Advanced Analytics</p>
      <p>Custom Interview Sets</p>
      <h4>Contact Us</h4>
    </div>
  </div>
</section>
{/* TESTIMONIALS */}
<section className="section light-bg">
  <h2>What Users Say</h2>

  <div className="grid">
    <div className="testimonial-card">
      <p>
        "PrepTALK AI helped me crack my frontend interview.
        The AI feedback was incredibly accurate."
      </p>
      <h4>- Software Engineer</h4>
    </div>

    <div className="testimonial-card">
      <p>
        "The resume analyzer improved my ATS score significantly.
        Highly recommended!"
      </p>
      <h4>- Backend Developer</h4>
    </div>

    <div className="testimonial-card">
      <p>
        "Best AI-based interview preparation platform I’ve used."
      </p>
      <h4>- Final Year Student</h4>
    </div>
  </div>
</section>

      {/* CTA */}
      <section className="cta">
        <h2>Ready to Ace Your Next Interview?</h2>
        <button className="primary-btn">Get Started Now</button>
      </section>


      {/* FOOTER */}
      <footer className="footer">
        © 2026 PrepTALK AI. All rights reserved.
      </footer>

    </div>
  );
};

export default Home;