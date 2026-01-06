import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { avatarService } from './avatarService';

const USERS_COLLECTION = 'users';

export const userProfileService = {
  // Get user profile
  async getUserProfile(userId) {
    try {
      const userDoc = await getDoc(doc(db, USERS_COLLECTION, userId));
      if (userDoc.exists()) {
        return userDoc.data();
      }
      // If no profile exists, create a default one
      const defaultProfile = {
        nickname: '',
        country: '',
        avatarUrl: avatarService.getAvatarOptions()[0].url,
        createdAt: new Date()
      };
      await this.updateUserProfile(userId, defaultProfile);
      return defaultProfile;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  },

  // Create or update user profile
  async updateUserProfile(userId, profileData) {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);
      await setDoc(userRef, {
        ...profileData,
        updatedAt: new Date()
      }, { merge: true });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  // Update specific profile fields
  async updateProfileField(userId, field, value) {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);
      await updateDoc(userRef, {
        [field]: value,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating profile field:', error);
      throw error;
    }
  }
}; 