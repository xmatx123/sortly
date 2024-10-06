// src/components/Header.js

import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logo from '../assets/logo.png'; // Ensure you have a logo image in your assets folder

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <img src={logo} alt="Sortly Logo" className="logo-image" />
          <span className="site-name">Sortly - The Sorting Game</span>
        </Link>
        {/* Navigation Links */}
        <nav className="header-nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/game/population" className="nav-link">Population</Link>
          <Link to="/game/area" className="nav-link">Area</Link>
          {/* Add more links as needed */}
        </nav>
      </div>
    </header>
  );
}

export default Header;
