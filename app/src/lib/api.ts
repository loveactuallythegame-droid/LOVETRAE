/**
 * LoveTrae API Client
 * 
 * This module provides a unified interface for all backend API calls.
 * It connects to the FastAPI backend server instead of using Firebase directly.
 */

import { httpClient, ApiError, handleApiError, withRetry } from './httpClient';
import { auth } from './firebaseClient';

// User API
export const userApi = {
  create: async (data: { email: string; display_name: string }) => {
    const token = await auth.currentUser?.getIdToken();
    if (!token) throw new Error('User not authenticated');
    
    return withRetry(() => httpClient.post('/users', data, token));
  },
  
  get: async (userId: string) => {
    const token = await auth.currentUser?.getIdToken();
    if (!token) throw new Error('User not authenticated');
    
    return withRetry(() => httpClient.get(`/users/${userId}`, token));
  },
  
  updateSarcasm: async (userId: string, level: number) => {
    if (level < 1 || level > 4) {
      throw new Error('Sarcasm level must be 1-4');
    }
    
    const token = await auth.currentUser?.getIdToken();
    if (!token) throw new Error('User not authenticated');
    
    return withRetry(() => httpClient.put(`/users/${userId}/sarcasm`, { level }, token));
  },
};

// Couple Linking API
export const coupleApi = {
  link: async (userId: string, partnerCode: string) => {
    const token = await auth.currentUser?.getIdToken();
    if (!token) throw new Error('User not authenticated');
    
    return withRetry(() => httpClient.post('/couples/link', {
      user_id: userId,
      partner_code: partnerCode
    }, token));
  },
  
  get: async (coupleId: string) => {
    const token = await auth.currentUser?.getIdToken();
    if (!token) throw new Error('User not authenticated');
    
    return withRetry(() => httpClient.get(`/couples/${coupleId}`, token));
  },
  
  getPresence: async (coupleId: string) => {
    const token = await auth.currentUser?.getIdToken();
    if (!token) throw new Error('User not authenticated');
    
    return withRetry(() => httpClient.get(`/couples/${coupleId}/presence`, token));
  }
};

// Games API
export const gamesApi = {
  getCategories: async () => {
    // This endpoint doesn't require authentication
    return withRetry(() => httpClient.get('/games/categories', false));
  },
  
  getCategoryGames: async (categoryId: string) => {
    // This endpoint doesn't require authentication
    return withRetry(() => httpClient.get(`/games/categories/${categoryId}`, false));
  },
  
  createSession: async (userId: string, gameId: string, categoryId: string) => {
    const token = await auth.currentUser?.getIdToken();
    if (!token) throw new Error('User not authenticated');
    
    return withRetry(() => httpClient.post('/games/sessions', {
      user_id: userId,
      game_id: gameId,
      category_id: categoryId
    }, token));
  },
  
  updateSession: async (sessionId: string, score?: number, completed?: boolean, responses?: any[]) => {
    const token = await auth.currentUser?.getIdToken();
    if (!token) throw new Error('User not authenticated');
    
    const updateData: any = {};
    if (score !== undefined) updateData.score = score;
    if (completed !== undefined) updateData.completed = completed;
    if (responses !== undefined) updateData.responses = responses;
    
    return withRetry(() => httpClient.put(`/games/sessions/${sessionId}`, updateData, token));
  },
  
  getLoveArcadeGames: async () => {
    // This endpoint doesn't require authentication
    return withRetry(() => httpClient.get('/love-arcade/games', false));
  }
};

// SOS Fight Solver API
export const sosApi = {
  createSession: async (initiatorId: string, coupleId: string) => {
    const token = await auth.currentUser?.getIdToken();
    if (!token) throw new Error('User not authenticated');
    
    return withRetry(() => httpClient.post('/sos/sessions', {
      initiator_id: initiatorId,
      couple_id: coupleId
    }, token));
  },
  
  submitBooth: async (sessionId: string, userId: string, responses: {
    i_feel: string;
    when_partner: string;
    because_i_tell_myself: string;
    what_i_need: string;
  }) => {
    const token = await auth.currentUser?.getIdToken();
    if (!token) throw new Error('User not authenticated');
    
    return withRetry(() => httpClient.post(`/sos/sessions/${sessionId}/submit`, {
      session_id: sessionId,
      user_id: userId,
      i_feel: responses.i_feel,
      when_partner: responses.when_partner,
      because_i_tell_myself: responses.because_i_tell_myself,
      what_i_need: responses.what_i_need
    }, token));
  },
  
  getSession: async (sessionId: string) => {
    const token = await auth.currentUser?.getIdToken();
    if (!token) throw new Error('User not authenticated');
    
    return withRetry(() => httpClient.get(`/sos/sessions/${sessionId}`, token));
  }
};

// Dr. Marcie AI API
export const marcieApi = {
  chat: async (userId: string, context: string, message: string, sarcasmLevel: number = 1, gameContext?: string) => {
    const token = await auth.currentUser?.getIdToken();
    if (!token) throw new Error('User not authenticated');
    
    const requestData: any = {
      user_id: userId,
      context,
      message,
      sarcasm_level: sarcasmLevel
    };
    
    if (gameContext) {
      requestData.game_context = gameContext;
    }
    
    return withRetry(() => httpClient.post('/marcie/chat', requestData, token));
  }
};

// Health Check API
export const healthApi = {
  check: async () => {
    // Health check doesn't require authentication
    return withRetry(() => httpClient.get('/health', false));
  }
};

// Leaderboard API
export const leaderboardApi = {
  getGlobal: async () => {
    const token = await auth.currentUser?.getIdToken();
    if (!token) throw new Error('User not authenticated');
    
    return withRetry(() => httpClient.get('/leaderboard/global', token));
  },
  
  getCouple: async (coupleId: string) => {
    const token = await auth.currentUser?.getIdToken();
    if (!token) throw new Error('User not authenticated');
    
    return withRetry(() => httpClient.get(`/leaderboard/couple/${coupleId}`, token));
  },
  
  getUser: async (userId: string) => {
    const token = await auth.currentUser?.getIdToken();
    if (!token) throw new Error('User not authenticated');
    
    return withRetry(() => httpClient.get(`/leaderboard/user/${userId}`, token));
  }
};

// Daily Quest API
export const dailyQuestApi = {
  getCurrent: async (userId: string) => {
    const token = await auth.currentUser?.getIdToken();
    if (!token) throw new Error('User not authenticated');
    
    return withRetry(() => httpClient.get(`/daily-quest/${userId}`, token));
  },
  
  complete: async (userId: string, questId: string) => {
    const token = await auth.currentUser?.getIdToken();
    if (!token) throw new Error('User not authenticated');
    
    return withRetry(() => httpClient.post(`/daily-quest/${userId}/complete`, {
      quest_id: questId
    }, token));
  }
};

// Achievement API
export const achievementApi = {
  getUserAchievements: async (userId: string) => {
    const token = await auth.currentUser?.getIdToken();
    if (!token) throw new Error('User not authenticated');
    
    return withRetry(() => httpClient.get(`/achievements/user/${userId}`, token));
  },
  
  unlock: async (userId: string, achievementId: string) => {
    const token = await auth.currentUser?.getIdToken();
    if (!token) throw new Error('User not authenticated');
    
    return withRetry(() => httpClient.post(`/achievements/unlock`, {
      user_id: userId,
      achievement_id: achievementId
    }, token));
  }
};

// WebSocket connection for real-time features
export const websocketApi = {
  connect: (coupleId: string, onMessage: (data: any) => void, onConnect: () => void, onDisconnect: () => void) => {
    const wsUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:8001';
    const ws = new WebSocket(`${wsUrl}/ws/${coupleId}`);
    
    ws.onopen = () => {
      console.log('WebSocket connected');
      onConnect();
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };
    
    ws.onclose = () => {
      console.log('WebSocket disconnected');
      onDisconnect();
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    return {
      send: (data: any) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(data));
        }
      },
      close: () => {
        ws.close();
      }
    };
  }
};

// Error handling utilities
export { ApiError, handleApiError, isNetworkError, shouldRetryRequest, withRetry };

// Default export
export default {
  userApi,
  coupleApi,
  gamesApi,
  sosApi,
  marcieApi,
  healthApi,
  leaderboardApi,
  dailyQuestApi,
  achievementApi,
  websocketApi
};