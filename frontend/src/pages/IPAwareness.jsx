// src/pages/IPAwareness.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function IPAwareness() {
  return (
    <div className="container">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '3rem' }}>Intellectual Property <span className="text-gradient">Awareness Center</span></h1>

        <div className="glass-card" style={{ padding: '3rem', marginBottom: '2.5rem' }}>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '2rem', lineHeight: '1.8' }}>
            Intellectual Property (IP) refers to creations of the mind — inventions, literary and artistic works,
            designs, symbols, names and images used in commerce. Protecting IP helps innovators and creators
            get recognition and economic benefit from what they invent or create.
          </p>

          <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr', gap: '2rem' }}>
            <div className="glass" style={{ padding: '1.75rem', borderRadius: '1rem' }}>
              <h4 style={{ color: 'var(--primary)', marginBottom: '0.75rem', fontSize: '1.25rem' }}>Patents</h4>
              <p style={{ color: 'var(--text-secondary)' }}>Give inventors exclusive rights to use and commercialize a novel invention for a limited time (usually 20 years).</p>
            </div>

            <div className="glass" style={{ padding: '1.75rem', borderRadius: '1rem' }}>
              <h4 style={{ color: 'var(--primary)', marginBottom: '0.75rem', fontSize: '1.25rem' }}>Trademarks</h4>
              <p style={{ color: 'var(--text-secondary)' }}>Protect brand identifiers — names, logos, slogans — that distinguish goods and services in the market.</p>
            </div>

            <div className="glass" style={{ padding: '1.75rem', borderRadius: '1rem' }}>
              <h4 style={{ color: 'var(--primary)', marginBottom: '0.75rem', fontSize: '1.25rem' }}>Copyright</h4>
              <p style={{ color: 'var(--text-secondary)' }}>Protects original expressions like books, music, art, films, and software (the form of expression, not ideas).</p>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Official Resources</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            To learn more about professional legal registration in Ethiopia, visit the official EIPA portal.
          </p>

          <a href="https://www.eipa.gov.et" target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ marginBottom: '2.5rem' }}>
            🌐 Visit Ethiopian IP Authority (EIPA)
          </a>

          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '2rem' }}>
            <Link to="/startup/ip" className="btn btn-primary btn-large" style={{ width: '100%' }}>
              I understand the guidelines. Proceed to My IP
            </Link>
          </div>
        </div>

        <p style={{ marginTop: '2.5rem', textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.85rem' }}>
          Disclaimer: This page is a summary for awareness only. For official legal advice, please contact a qualified IP attorney.
        </p>
      </div>
    </div>
  );
}

