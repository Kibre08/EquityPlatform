// src/pages/IPAwareness.jsx
import React from "react";

export default function IPAwareness() {
  return (
    <div className="container">
      <h1>Intellectual Property (IP) — Quick Awareness</h1>

      <p>
        Intellectual Property (IP) means creations of the mind — inventions, literary and artistic works,
        designs, symbols, names and images used in commerce. Protecting IP helps innovators and creators
        get recognition and economic benefit from what they invent or create.
      </p>

      <h3>Types of IP</h3>

      <h4>Patents</h4>
      <p>Give inventors exclusive rights to use and commercialize a novel invention for a limited time (usually 20 years).</p>

      <h4>Trademarks</h4>
      <p>Protect brand identifiers — names, logos, slogans — that distinguish goods and services in the market.</p>

      <h4>Copyright</h4>
      <p>Protects original expressions like books, music, art, films, and software (the form of expression, not ideas).</p>

      <h4>Trade secrets</h4>
      <p>Company confidential business information (like formulas, processes, or practices) that derive economic value from secrecy.</p>

      <h4>Designs</h4>
      <p>Protect the visual design of objects (shapes, patterns, ornamentation).</p>

      <h3>Why it matters</h3>
      <p>IP protection encourages innovation, helps startups attract investment, and ensures fair competition.</p>

      <p style={{ marginTop: 12 }}>
        To learn more about legal registration in Ethiopia, visit the Ethiopian Intellectual Property Authority (EIPA):
      </p>

      <p>
        <a href="https://www.eipa.gov.et" target="_blank" rel="noreferrer">Ethiopian Intellectual Property Authority (EIPA)</a>
      </p>

      <p style={{ marginTop: 18, fontStyle: "italic" }}>
        Note: This page is a simple awareness summary. For legal advice or assistance in registering IP, contact a qualified IP attorney or the EIPA directly.
      </p>

      <div style={{ marginTop: 30, textAlign: "center" }}>
        <a href="/startup/ip" style={{ padding: "10px 20px", backgroundColor: "#28a745", color: "white", textDecoration: "none", borderRadius: 5, fontSize: 16 }}>
          I have reviewed the guidelines. Proceed to Upload IP
        </a>
      </div>
    </div>
  );
}
