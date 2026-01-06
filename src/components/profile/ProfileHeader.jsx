import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AvatarSelector from './AvatarSelector';
import './ProfileHeader.css';

const ProfileHeader = ({ 
  profile, 
  currentUser, 
  avatarOptions,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    nickname: profile?.nickname || '',
    country: profile?.country || '',
    avatarUrl: profile?.avatarUrl || avatarOptions[0].url
  });
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setIsEditing(true);
  };

  const handleAvatarSelect = (avatarUrl) => {
    setFormData(prev => ({
      ...prev,
      avatarUrl
    }));
    setShowAvatarSelector(false);
    setIsEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  return (
    <div className="profile-header">
      <div className="avatar-container">
        <img 
          src={formData.avatarUrl} 
          alt="Profile" 
          className="profile-avatar"
          onClick={() => setShowAvatarSelector(true)}
        />
        {showAvatarSelector && (
          <AvatarSelector
            avatarOptions={avatarOptions}
            selectedAvatar={formData.avatarUrl}
            onSelect={handleAvatarSelect}
            onClose={() => setShowAvatarSelector(false)}
          />
        )}
      </div>
      <div className="profile-info">
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <input
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              placeholder="Set your nickname"
              className="inline-input"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Set your country"
              className="inline-input"
            />
          </div>
          <div className="email-display">{currentUser.email}</div>
          {isEditing && (
            <button type="submit" className="save-button">
              Save Changes
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

ProfileHeader.propTypes = {
  profile: PropTypes.shape({
    nickname: PropTypes.string,
    country: PropTypes.string,
    avatarUrl: PropTypes.string
  }),
  currentUser: PropTypes.shape({
    email: PropTypes.string.isRequired
  }).isRequired,
  avatarOptions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  })).isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default ProfileHeader; 