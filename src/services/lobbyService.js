import { realtimeDb } from '../firebase';
import { ref, set, update, remove, get, onValue, off } from 'firebase/database';

const LOBBIES_PATH = 'lobbies';

class LobbyService {
  constructor() {
    this.lobbiesRef = ref(realtimeDb, LOBBIES_PATH);
  }

  // Create a new lobby
  async createLobby(lobbyId, player, gameMode = 'cooperation') {
    const lobbyRef = ref(realtimeDb, `${LOBBIES_PATH}/${lobbyId}`);
    await set(lobbyRef, {
      players: [player],
      status: 'waiting',
      gameMode: gameMode,
      createdAt: Date.now(),
      lastUpdated: Date.now()
    });
    return lobbyId;
  }

  // Join an existing lobby
  async joinLobby(lobbyId, player) {
    const lobbyRef = ref(realtimeDb, `${LOBBIES_PATH}/${lobbyId}`);
    const snapshot = await get(lobbyRef);
    const lobbyData = snapshot.val();
    
    if (lobbyData) {
      const currentPlayers = lobbyData.players || [];
      if (currentPlayers.some(p => p.id === player.id)) {
        console.warn(`Player ${player.id} already in lobby ${lobbyId}.`);
        return;
      }
      await update(lobbyRef, {
        players: [...currentPlayers, player],
        lastUpdated: Date.now()
      });
    } else {
      throw new Error('Lobby not found');
    }
  }

  // Leave a lobby
  async leaveLobby(lobbyId, playerId) {
    const lobbyRef = ref(realtimeDb, `${LOBBIES_PATH}/${lobbyId}`);
    const snapshot = await get(lobbyRef);
    const lobbyData = snapshot.val();
    
    if (lobbyData) {
      const currentPlayers = lobbyData.players || [];
      const updatedPlayers = currentPlayers.filter(p => p.id !== playerId);
      
      if (updatedPlayers.length === 0) {
        console.log(`Last player left lobby ${lobbyId}. Deleting lobby.`);
        await remove(lobbyRef);
      } else {
        let updates = {
            players: updatedPlayers,
            lastUpdated: Date.now()
        };
        
        await update(lobbyRef, updates);
      }
    } else {
      console.warn(`Attempted to leave non-existent or already deleted lobby: ${lobbyId}`);
    }
  }

  // Subscribe to lobby changes
  subscribeToLobby(lobbyId, callback) {
    const lobbyRef = ref(realtimeDb, `${LOBBIES_PATH}/${lobbyId}`);
    const listener = onValue(lobbyRef, (snapshot) => {
      const data = snapshot.val();
      callback(data);
    }, (error) => {
        console.error(`Error subscribing to lobby ${lobbyId}:`, error);
        callback(null);
    });

    return () => off(lobbyRef, 'value', listener);
  }

  // Start the game
  async startGame(lobbyId) {
    const lobbyRef = ref(realtimeDb, `${LOBBIES_PATH}/${lobbyId}`);
    await update(lobbyRef, {
      status: 'playing',
      startedAt: Date.now(),
      lastUpdated: Date.now()
    });
  }

  // End the game
  async endGame(lobbyId, result = {}) {
    const lobbyRef = ref(realtimeDb, `${LOBBIES_PATH}/${lobbyId}`);
    await update(lobbyRef, {
      status: 'completed',
      result: result,
      endedAt: Date.now(),
      lastUpdated: Date.now()
    });
  }

  // Clean up lobby
  async cleanupLobby(lobbyId) {
    console.log(`Cleaning up lobby: ${lobbyId}`);
    const lobbyRef = ref(realtimeDb, `${LOBBIES_PATH}/${lobbyId}`);
    await remove(lobbyRef);
  }
}

export const lobbyService = new LobbyService(); 