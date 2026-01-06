import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  getDocs,
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

const LEADERBOARD_COLLECTION = 'scores';

export const leaderboardService = {
  // Add a new score
  async addScore(userId, username, score, gameMode) {
    try {
      const docRef = await addDoc(collection(db, LEADERBOARD_COLLECTION), {
        userId,
        username,
        score,
        gameMode,
        timestamp: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding score:', error);
      throw error;
    }
  },

  // Get global leaderboard
  async getGlobalLeaderboard(limit = 10) {
    try {
      const q = query(
        collection(db, LEADERBOARD_COLLECTION),
        orderBy('score', 'desc'),
        limit(limit)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      throw error;
    }
  },

  // Get user's best scores
  async getUserBestScores(userId, limit = 5) {
    try {
      const q = query(
        collection(db, LEADERBOARD_COLLECTION),
        where('userId', '==', userId),
        orderBy('score', 'desc'),
        limit(limit)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting user scores:', error);
      throw error;
    }
  }
}; 