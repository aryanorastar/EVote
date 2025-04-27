import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-links">
          <div className="footer-link-wrapper">
            <div className="footer-link-items">
              <h2>About Us</h2>
              <a href="/about">How it works</a>
              <a href="/terms">Terms of Service</a>
            </div>
            <div className="footer-link-items">
              <h2>Contact Us</h2>
              <a href="/contact">Contact</a>
              <a href="/support">Support</a>
            </div>
          </div>
          <div className="footer-link-wrapper">
            <div className="footer-link-items">
              <h2>Social Media</h2>
              <a href="https://twitter.com">Twitter</a>
              <a href="https://github.com">GitHub</a>
            </div>
          </div>
        </div>
        <div className="social-media">
          <div className="social-media-wrap">
            <div className="footer-logo">
              <a href="/" className="social-logo">EVote <i className="fas fa-vote-yea"></i></a>
            </div>
            <p className="website-rights">EVote © {new Date().getFullYear()}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
