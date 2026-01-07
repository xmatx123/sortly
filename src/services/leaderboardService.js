import { db } from '../firebase';
import { collection, query, where, orderBy, limit, getDocs, addDoc, serverTimestamp, doc, setDoc, getDoc } from 'firebase/firestore';

const ID_COUNTER_DOC = 'leaderboard_counters'; // Document to store simple incrementing IDs if needed, or just use Firestore IDs
const LEADERBOARD_COLLECTION = 'leaderboards';

export const leaderboardService = {
  // Submit a score to the global leaderboard
  async submitScore(playerName, score, category, gameHistoryId, userId = null) {
    if (!category || typeof category !== 'string') {
      console.error("Invalid category provided to submitScore:", category);
      return null;
    }

    // We can store one document per entry.
    // To keep it clean, we might want to store it in a sub-collection per category, or a root collection with fields.
    // Let's use a root collection 'leaderboard_entries' for simplicity and query/index it.

    // Actually, to make "Global Leaderboard" efficient, we often just query 'gameHistory' if it has player names.
    // But 'gameHistory' is huge. A dedicated 'leaderboard' collection is better.
    // We will save every high score submission here.

    try {
      const entryData = {
        playerName,
        score,
        category,
        gameHistoryId,
        userId, // Optional: link to auth user if signed in
        timestamp: serverTimestamp()
      };

      // If we want to only keep ONE score per user per category (Max Score), we'd need to check first.
      // For now, let's just append like the local one did, but let's be smart.
      // Simple "High Score" tables usually take all entries.

      const docRef = await addDoc(collection(db, LEADERBOARD_COLLECTION), entryData);
      console.log("Global leaderboard score submitted:", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Error submitting global score:", error);
      return null;
    }
  },

  // Get top scores for a category
  async getTopScores(category, limitCount = 100) {
    if (!category) return [];

    try {
      const q = query(
        collection(db, LEADERBOARD_COLLECTION),
        where('category', '==', category),
        orderBy('score', 'desc'),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error fetching global leaderboard:", error);
      // If index is missing, this will fail. We should catch it.
      return [];
    }
  }
};