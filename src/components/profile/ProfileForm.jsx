import React from 'react';
import PropTypes from 'prop-types';
import './ProfileForm.css';

const ProfileForm = ({ formData, onSubmit, onChange, onCancel }) => (
  <form onSubmit={onSubmit} className="profile-form">
    <div className="form-group">
      <label>Nickname:</label>
      <input
        type="text"
        name="nickname"
        value={formData.nickname}
        onChange={onChange}
        required
      />
    </div>
    <div className="form-group">
      <label>Country:</label>
      <input
        type="text"
        name="country"
        value={formData.country}
        onChange={onChange}
        required
      />
    </div>
    <div className="form-actions">
      <button type="submit" className="save-button">Save Changes</button>
      <button type="button" onClick={onCancel} className="cancel-button">Cancel</button>
    </div>
  </form>
);

ProfileForm.propTypes = {
  formData: PropTypes.shape({
    nickname: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string.isRequired
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default ProfileForm; 