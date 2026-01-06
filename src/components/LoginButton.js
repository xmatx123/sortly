import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { userProfileService } from '../services/userProfileService';
import { avatarService } from '../services/avatarService';
import './LoginButton.css';

export default function LoginButton() {
  const { currentUser, login, signup, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserProfile = async () => {
      if (currentUser) {
        try {
          const profile = await userProfileService.getUserProfile(currentUser.uid);
          setUserProfile(profile);
        } catch (error) {
          console.error('Error loading user profile:', error);
        }
      }
    };
    loadUserProfile();
  }, [currentUser]);

  async function handleLogin(e) {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      setShowLoginForm(false);
      navigate('/profile');
    } catch (error) {
      setError('Failed to log in: ' + error.message);
    }
    setLoading(false);
  }

  async function handleSignup(e) {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await signup(email, password);
      setShowLoginForm(false);
      navigate('/profile');
    } catch (error) {
      setError('Failed to create an account: ' + error.message);
    }
    setLoading(false);
  }

  async function handleLogout() {
    try {
      setError('');
      setLoading(true);
      await logout();
      navigate('/');
    } catch (error) {
      setError('Failed to log out: ' + error.message);
    }
    setLoading(false);
  }

  if (currentUser) {
    return (
      <div className="login-button">
        <div className="user-profile-button" onClick={() => navigate('/profile')}>
          <img 
            src={userProfile?.avatarUrl || avatarService.getAvatarOptions()[0].url} 
            alt="Profile" 
            className="header-avatar"
          />
          <span className="user-name">{userProfile?.nickname || currentUser.email}</span>
        </div>
        <button onClick={handleLogout} disabled={loading} className="logout-button">
          Log Out
        </button>
      </div>
    );
  }

  return (
    <div className="login-button">
      {!showLoginForm ? (
        <button onClick={() => setShowLoginForm(true)}>
          Login / Sign Up
        </button>
      ) : (
        <div className="login-form">
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
          <div className="login-buttons">
            <button onClick={handleLogin} disabled={loading}>
              Login
            </button>
            <button onClick={handleSignup} disabled={loading}>
              Sign Up
            </button>
            <button onClick={() => setShowLoginForm(false)}>
              Cancel
            </button>
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      )}
    </div>
  );
} 