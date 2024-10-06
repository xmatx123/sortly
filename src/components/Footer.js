// src/components/Footer.js

import React from 'react';
import './Footer.css';
import logo from '../assets/logo.png'; // Reuse your logo

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <img src={logo} alt="Sortly Logo" className="footer-logo" />
        <p>&copy; {new Date().getFullYear()} Sortly. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
