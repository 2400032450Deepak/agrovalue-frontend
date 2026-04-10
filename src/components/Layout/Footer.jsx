import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{
      background: '#0f172a',
      color: '#94a3b8',
      marginTop: '3rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '3rem 2rem 1rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2rem'
      }}>
        {/* About Section */}
        <div>
          <h4 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.1rem' }}>
            AgroValue Connect
          </h4>
          <p style={{ lineHeight: '1.6', fontSize: '0.9rem' }}>
            Empowering farmers and connecting them with global buyers since 2024.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.1rem' }}>
            Quick Links
          </h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}>
              <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Home</Link>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <Link to="/products" style={{ color: '#94a3b8', textDecoration: 'none' }}>Products</Link>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <Link to="/about" style={{ color: '#94a3b8', textDecoration: 'none' }}>About Us</Link>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <Link to="/contact" style={{ color: '#94a3b8', textDecoration: 'none' }}>Contact</Link>
            </li>
          </ul>
        </div>

        {/* For Farmers */}
        <div>
          <h4 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.1rem' }}>
            For Farmers
          </h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}>
              <Link to="/register" style={{ color: '#94a3b8', textDecoration: 'none' }}>Start Selling</Link>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <Link to="/farmer-guide" style={{ color: '#94a3b8', textDecoration: 'none' }}>Seller Guide</Link>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <Link to="/pricing" style={{ color: '#94a3b8', textDecoration: 'none' }}>Pricing</Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.1rem' }}>
            Contact Us
          </h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}>📞 +91 1234567890</li>
            <li style={{ marginBottom: '0.5rem' }}>✉️ support@agrovalue.com</li>
            <li style={{ marginBottom: '0.5rem' }}>📍 India</li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div style={{
        textAlign: 'center',
        padding: '1.5rem',
        borderTop: '1px solid #334155',
        fontSize: '0.8rem'
      }}>
        <p>&copy; 2024 AgroValue Connect. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;