// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer'; 
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import GameOverPage from './pages/GameOverPage';
import './App.css';

function App() {
  return (
    <Router>
      <Header />
      <div className="content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/game/:mode"
            element={<GamePage />}
          />
          <Route path="/gameover" element={<GameOverPage />} />
        </Routes>
      </div>
      <Footer /> 
    </Router>
  );
}

export default App;
