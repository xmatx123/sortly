import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { userProfileService } from '../services/userProfileService';
import { achievementsService } from '../services/achievementsService';
import { avatarService } from '../services/avatarService';
import { gameHistoryService } from '../services/gameHistoryService';
import ProfileHeader from '../components/profile/ProfileHeader';
import AchievementsSection from '../components/profile/AchievementsSection';
import GameHistory from '../components/profile/GameHistory';
import './ProfilePage.css';

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [achievements, setAchievements] = useState(null);
  const [gameHistory, setGameHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [formData, setFormData] = useState({
    nickname: '',
    country: '',
    avatarUrl: ''
  });

  const avatarOptions = avatarService.getAvatarOptions();
  const achievementDefinitions = achievementsService.getAchievementDefinitions();
  const userId = currentUser?.uid;

  const loadProfile = useCallback(async () => {
    if (!userId) return;
    
    try {
      const [userProfile, userAchievements, userGameHistory] = await Promise.all([
        userProfileService.getUserProfile(userId),
        achievementsService.getUserAchievements(userId),
        gameHistoryService.getAllTopGames(userId)
      ]);

      if (userProfile) {
        setProfile(userProfile);
        setFormData({
          nickname: userProfile.nickname || '',
          country: userProfile.country || '',
          avatarUrl: userProfile.avatarUrl || avatarOptions[0].url
        });
      }

      setAchievements(userAchievements);
      setGameHistory(userGameHistory);
    } catch (error) {
      setError('Failed to load profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [userId, avatarOptions]);

  useEffect(() => {
    if (currentUser) {
      loadProfile();
    }
  }, [currentUser, loadProfile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarSelect = (avatarUrl) => {
    setFormData(prev => ({ ...prev, avatarUrl }));
    setShowAvatarSelector(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await userProfileService.updateUserProfile(currentUser.uid, formData);
      setProfile(prev => ({ ...prev, ...formData }));
      setEditing(false);
    } catch (error) {
      setError('Failed to update profile: ' + error.message);
    }
  };

  if (!currentUser) {
    navigate('/');
    return null;
  }

  if (loading) {
    return <div className="profile-page">Loading...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-content">
        <ProfileHeader
          profile={profile}
          currentUser={currentUser}
          editing={editing}
          formData={formData}
          avatarOptions={avatarOptions}
          showAvatarSelector={showAvatarSelector}
          onEdit={() => setEditing(true)}
          onAvatarSelect={handleAvatarSelect}
          onAvatarSelectorToggle={() => setShowAvatarSelector(!showAvatarSelector)}
          onSubmit={handleSubmit}
          onChange={handleInputChange}
          onCancel={() => setEditing(false)}
        />

        {error && <div className="error-message">{error}</div>}

        <AchievementsSection
          achievementDefinitions={achievementDefinitions}
          achievements={achievements}
        />

        <GameHistory gameHistory={gameHistory} />
      </div>
    </div>
  );
};

export default ProfilePage; 