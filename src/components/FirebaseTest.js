import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { leaderboardService } from '../services/leaderboardService';

export function FirebaseTest() {
  const { currentUser, login, signup, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [testScore, setTestScore] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await signup(email, password);
    } catch (error) {
      setError('Failed to create an account: ' + error.message);
    }
    setLoading(false);
  }

  async function handleLogin(e) {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
    } catch (error) {
      setError('Failed to log in: ' + error.message);
    }
    setLoading(false);
  }

  async function handleLogout() {
    try {
      setError('');
      setLoading(true);
      await logout();
    } catch (error) {
      setError('Failed to log out: ' + error.message);
    }
    setLoading(false);
  }

  async function addTestScore() {
    if (!currentUser) return;
    try {
      await leaderboardService.addScore(
        currentUser.uid,
        currentUser.email,
        100,
        'test'
      );
      setTestScore('Score added successfully!');
    } catch (error) {
      setTestScore('Failed to add score: ' + error.message);
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Firebase Test</h2>
      
      {currentUser ? (
        <div>
          <p>Logged in as: {currentUser.email}</p>
          <button onClick={handleLogout} disabled={loading}>
            Log Out
          </button>
          <button onClick={addTestScore} style={{ marginLeft: '10px' }}>
            Add Test Score
          </button>
          {testScore && <p>{testScore}</p>}
        </div>
      ) : (
        <div>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <button type="submit" disabled={loading}>
              Sign Up
            </button>
          </form>
          <form onSubmit={handleLogin} style={{ marginTop: '10px' }}>
            <button type="submit" disabled={loading}>
              Log In
            </button>
          </form>
        </div>
      )}
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
} 