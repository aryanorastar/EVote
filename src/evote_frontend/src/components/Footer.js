import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-logo">
            <h2>EVote <i className="fas fa-vote-yea"></i></h2>
            <p>Decentralized Governance</p>
          </div>
          <div className="footer-links">
            <div className="footer-section">
              <h3>Navigation</h3>
              <ul>
                <li><a href="/"><i className="fas fa-home mr-2"></i> Home</a></li>
                <li><a href="/proposals"><i className="fas fa-clipboard-list mr-2"></i> Proposals</a></li>
                <li><a href="/voting"><i className="fas fa-vote-yea mr-2"></i> Voting</a></li>
                <li><a href="/about"><i className="fas fa-info-circle mr-2"></i> About</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h3>Contact</h3>
              <p><i className="fas fa-envelope mr-2"></i> info@evote.example</p>
              <p><i className="fas fa-map-marker-alt mr-2"></i> 123 Blockchain St.</p>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} EVote. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
