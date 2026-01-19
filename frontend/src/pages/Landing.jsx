import React from "react";
import { Link } from "react-router-dom";

export default function Landing() {
    return (
        <div className="landing-container">
            <header className="landing-header">
                <Link to="/" className="logo">EquityPlatform</Link>
                <div className="nav-links">
                    <Link to="/login" className="btn btn-secondary btn-sm">Sign In</Link>
                    <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
                </div>
            </header>

            <section className="hero-section">
                <div className="hero-content">
                    <h1>The Future of <br /> <span className="text-gradient">Startup Investing</span></h1>
                    <p>
                        Connect with high-growth startups, fund disruptive innovation, and
                        secure your equity on our institutional-grade platform.
                    </p>
                    <div className="hero-actions">
                        <Link to="/register" className="btn btn-large btn-primary">Start Investing</Link>
                        <Link to="/login" className="btn btn-large btn-secondary">Raise Capital</Link>
                    </div>
                </div>
            </section>

            <section className="container">
                <div className="features-section">
                    <div className="glass-card feature-card">
                        <div className="feature-icon">🚀</div>
                        <h3>For Startups</h3>
                        <p>Showcase your innovation to a global network of accredited investors. Protect your IP and manage funding rounds with precision.</p>
                    </div>
                    <div className="glass-card feature-card">
                        <div className="feature-icon">💎</div>
                        <h3>For Investors</h3>
                        <p>Discover vetted, high-growth investment opportunities. Access institutional-grade data and manage your portfolio in one secure workspace.</p>
                    </div>
                    <div className="glass-card feature-card">
                        <div className="feature-icon">🛡️</div>
                        <h3>Security First</h3>
                        <p>Built with trust at the core. Rigorous KYC verification, encrypted document vault, and admin-verified transaction flows.</p>
                    </div>
                </div>
            </section>

            <footer className="container">
                <hr />
                <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                    &copy; {new Date().getFullYear()} EquityPlatform. All Rights Reserved.
                </div>
            </footer>
        </div>
    );
}


