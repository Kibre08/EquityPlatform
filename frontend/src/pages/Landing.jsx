import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Landing() {
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();

    // useEffect(() => {
    //     if (user) {
    //         navigate(`/${user.role}-dashboard`);
    //     }
    // }, [user, navigate]);

    return (
        <div className="landing-container">
            <header className="landing-header">
                <div className="logo">startup investment and IP platform</div>
                <nav>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <Link to="/login" className="btn btn-outline" style={{ border: 'none', color: '#fff' }}>Login</Link>
                        <Link to="/register" className="btn btn-primary">Get Started</Link>
                    </div>
                </nav>
            </header>

            <section className="hero-section">
                <div className="hero-content">
                    <h1>The Future of <br /> Startup Investing</h1>
                    <p>Connect with innovative startups, fund groundbreaking ideas, and secure your equity with our transparent, blockchain-ready platform.</p>
                    <div className="hero-actions">
                        <Link to="/register" className="btn btn-large btn-primary">Start Investing</Link>
                        <Link to="/login" className="btn btn-large btn-secondary">Raise Capital</Link>
                    </div>
                </div>
            </section>

            <section className="features-section">
                <div className="feature-card">
                    <h3>🚀 For Startups</h3>
                    <p>Showcase your innovation to a global network of investors. Protect your IP and manage funding rounds effortlessly.</p>
                </div>
                <div className="feature-card">
                    <h3>💎 For Investors</h3>
                    <p>Discover vetted high-growth startups. View pitch decks, verify IP, and manage your portfolio in one secure dashboard.</p>
                </div>
                <div className="feature-card">
                    <h3>🛡️ Secure & Transparent</h3>
                    <p>Built with trust in mind. Rigorous KYC verification, secure document handling, and admin-verified transactions.</p>
                </div>
            </section>

            <footer className="landing-footer">
                <p>&copy; {new Date().getFullYear()} EquityPlatform. Empowering Innovation.</p>
            </footer>
        </div>
    );
}
