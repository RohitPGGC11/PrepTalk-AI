import React from "react";
import "./Home.css";


const Home = () => {
return (
<div className="home">
{/* Hero Section */}
<section className="hero">
<h1>Build Faster with React</h1>
<p>
A simple and clean React home page using separate CSS for styling.
</p>
<div className="hero-buttons">
<button className="btn primary">Get Started</button>
<button className="btn secondary">Learn More</button>
</div>
</section>


{/* Features Section */}
<section className="features">
<div className="feature-card">
<h3>Fast</h3>
<p>Reusable components help you develop faster.</p>
</div>
<div className="feature-card">
<h3>Secure</h3>
<p>Best practices for modern and secure apps.</p>
</div>
<div className="feature-card">
<h3>Scalable</h3>
<p>Easy to scale as your application grows.</p>
</div>
</section>


{/* CTA Section */}
<section className="cta">
<h2>Ready to start your project?</h2>
<button className="btn primary">Start Now</button>
</section>
</div>
);
};


export default Home;