import { db } from '../firebase';
import { collection, query, where, orderBy, limit as firestoreLimit, getDocs, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';

const GAME_HISTORY_COLLECTION = 'gameHistory';
const CATEGORIES = ['population', 'area', 'gini'];

export const gameHistoryService = {
  async getTopGames(userId, category, mode = 'classic', limitCount = 5) {
    try {
      console.log(`Fetching top games for: userId=${userId}, category=${category}, mode=${mode}, limit=${limitCount}`);
      const gamesRef = collection(db, GAME_HISTORY_COLLECTION);
      const q = query(
        gamesRef,
        where('userId', '==', userId),
        where('category', '==', category),
        where('mode', '==', mode),
        orderBy('score', 'desc'),
        firestoreLimit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const games = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log("Fetched games:", games);
      return games;
    } catch (error) {
      console.error("Error fetching top games, attempting fallback:", error);
      // Fallback might be less efficient and might not work if index is required
      // Consider warning the user or simplifying the fallback
      try {
          const qFallback = query(
            collection(db, GAME_HISTORY_COLLECTION),
            where('userId', '==', userId),
            where('category', '==', category),
            where('mode', '==', mode)
          );
          const querySnapshotFallback = await getDocs(qFallback);
          const gamesFallback = querySnapshotFallback.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          // Sort in memory and limit
          const sortedGames = gamesFallback.sort((a, b) => b.score - a.score).slice(0, limitCount);
          console.log("Fetched games (fallback):", sortedGames);
          return sortedGames;
      } catch (fallbackError) {
          console.error("Fallback fetch also failed:", fallbackError);
          throw fallbackError; // Re-throw the error after logging
      }
    }
  },

  async getAllTopGames(userId) {
    try {
      const topGames = {};
      await Promise.all(
        CATEGORIES.map(async category => {
          topGames[category] = await this.getTopGames(userId, category);
        })
      );
      return topGames;
    } catch (error) {
      console.error('Error fetching all top games:', error);
      return {};
    }
  },

  async getGameDetails(gameId) {
    try {
        const docRef = doc(db, GAME_HISTORY_COLLECTION, gameId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("Fetched game details for ID:", gameId, docSnap.data());
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            console.log("No such game document!", gameId);
            return null; // Indicate game not found
        }
    } catch (error) {
        console.error("Error getting game details:", error);
        throw error;
    }
  },

  async saveGame(userId, category, mode, score, userAttemptList, correctlySortedList, incorrectCountry) {
    try {
      // Minimal payload for general game history (like user's attempt)
      const minimalUserAttempt = userAttemptList
        ? userAttemptList.map(({ id, name, flagUrl, ...rest }) => ({ // Include stat used for sorting
            id,
            name,
            flagUrl,
            value: rest[category] // Store the actual value used for sorting
          }))
        : null;

      // Specific data for classic mode review
       const minimalCorrectlySorted = mode === 'classic' && correctlySortedList
        ? correctlySortedList.map(({ id, name, flagUrl, ...rest }) => ({ // Include stat
            id,
            name,
            flagUrl,
            value: rest[category]
          }))
        : null;

       const minimalIncorrectCountry = mode === 'classic' && incorrectCountry
        ? { // Include stat
            id: incorrectCountry.id,
            name: incorrectCountry.name,
            flagUrl: incorrectCountry.flagUrl,
            value: incorrectCountry[category]
          }
        : null;

      const docData = {
        userId,
        category,
        mode, // Save the game mode ('classic', 'cooperation', etc.)
        score,
        userAttemptList: minimalUserAttempt, // List user provided (includes incorrect item)
        correctlySortedList: minimalCorrectlySorted, // List before the mistake (classic only)
        incorrectCountry: minimalIncorrectCountry, // The country placed incorrectly (classic only)
        timestamp: serverTimestamp()
      };

      // Remove null fields before saving to Firestore if desired
      Object.keys(docData).forEach(key => {
          if (docData[key] === null) {
              delete docData[key];
          }
      });

      const docRef = await addDoc(collection(db, GAME_HISTORY_COLLECTION), docData);
      console.log("Game history saved with ID:", docRef.id, "Data:", docData);
      return docRef.id;
    } catch (error) {
      console.error('Error saving game history:', error);
      throw error;
    }
  }
}; 