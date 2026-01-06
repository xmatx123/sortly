import React from 'react';
import PropTypes from 'prop-types';
import './AvatarSelector.css';

const AvatarSelector = ({ avatarOptions, selectedAvatar, onSelect, onClose }) => (
  <div className="avatar-selector">
    <div className="avatar-grid">
      {avatarOptions.map(avatar => (
        <div 
          key={avatar.id} 
          className={`avatar-option ${selectedAvatar === avatar.url ? 'selected' : ''}`}
          onClick={() => onSelect(avatar.url)}
        >
          <img src={avatar.url} alt={avatar.name} />
          <span>{avatar.name}</span>
        </div>
      ))}
    </div>
  </div>
);

AvatarSelector.propTypes = {
  avatarOptions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  })).isRequired,
  selectedAvatar: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default AvatarSelector; 