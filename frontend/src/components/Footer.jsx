import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer glass fade-in">
      <div className="footer-content">
        <span>© {new Date().getFullYear()} DSA Simulator. All rights reserved.</span>
        <span>
          Made with <span style={{color: '#ff6b6b'}}>❤</span> for learning and practice.
        </span>
        <a
          href="https://github.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
}

export default Footer;