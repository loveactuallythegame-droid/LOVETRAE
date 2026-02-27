/**
 * API Functions for Love Actually - The Game
 * 
 * This module exports all API functions organized by domain:
 * - userApi: User management
 * - coupleApi: Couple linking and management
 * - gamesApi: Game sessions and categories
 * - sosApi: SOS fight resolution
 * - marcieApi: Dr. Marcie AI chat
 */

import { get, post, put, del, ApiError } from './httpClient';

// ============================================================================
// Type Definitions (matching admin/src/models.ts and backend/server.py)
// ============================================================================

export interface User {
  id: string;
  email: string;
  display_name: string;
  partner_id: string | null;
  couple_code: string | null;
  couple_id?: string | null;
  sarcasm_level: number;
  trust_level: number;
  vulnerability_level: number;
  points: number;
  plan: string;
  created_at: string;
}

export interface Couple {
  id: string;
  user1_id: string;
  user2_id: string;
  partners?: [string, string];
  created_at: string;
  trust_meter: number;
  vulnerability_meter: number;
  romance_meter: number;
  connection_meter: number;
  total_points: number;
  streak_days: number;
  linking_code?: string;
}

export interface CouplePresence {
  couple_id: string;
  user1_online: boolean;
  user2_online: boolean;
  total_connections: number;
}

export interface GameCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  games: string[];
}

export interface GameSession {
  id: string;
  user_id: string;
  game_id: string;
  category_id: string;
  started_at: string;
  completed: boolean;
  completed_at?: string;
  score: number;
  responses: any[];
}

export interface SOSSession {
  id: string;
  initiator_id: string;
  couple_id: string;
  status: 'waiting_for_partner' | 'one_submitted' | 'analyzing' | 'completed';
  started_at: string;
  submissions: Record<string, SOSBoothSubmission>;
  verdict?: string;
}

export interface SOSBoothSubmission {
  i_feel: string;
  when_partner: string;
  because_i_tell_myself: string;
  what_i_need: string;
  submitted_at?: string;
}

export interface MarcieResponse {
  response: string;
  animation: string;
  sarcasm_level: number;
}

export interface HealthCheck {
  status: string;
  app: string;
  version: string;
  timestamp: string;
}

// ============================================================================
// User API
// ============================================================================

export const userApi = {
  /**
   * Create a new user in the backend after Firebase Auth signup
   * 
   * @param data - User data (email and display_name)
   * @param token - Firebase Auth ID token
   * @returns Created user object
   * 
   * @example
   * const user = await userApi.create(
   *   { email: 'test@example.com', display_name: 'Test User' },
   *   await firebaseUser.getIdToken()
   * );
   */
  create: async (
    data: { email: string; display_name: string },
    token: string
  ): Promise<User> => {
    return post<User>('users', data, { token });
  },

  /**
   * Get user by ID
   * 
   * @param userId - User's unique ID
   * @param token - Firebase Auth ID token
   * @returns User object
   * 
   * @example
   * const user = await userApi.get('user-123', token);
   */
  get: async (userId: string, token: string): Promise<User> => {
    return get<User>(`users/${userId}`, { token });
  },

  /**
   * Update user's sarcasm level (1-4)
   * 
   * @param userId - User's unique ID
   * @param level - Sarcasm level (1-4)
   * @param token - Firebase Auth ID token
   * @returns Success response with new level
   * 
   * @example
   * const result = await userApi.updateSarcasm('user-123', 3, token);
   * // { success: true, sarcasm_level: 3, name: 'Radical Truth Wizard' }
   */
  updateSarcasm: async (
    userId: string,
    level: number,
    token: string
  ): Promise<{ success: boolean; sarcasm_level: number; name: string }> => {
    return put<{ success: boolean; sarcasm_level: number; name: string }>(
      `users/${userId}/sarcasm`,
      { level },
      { token }
    );
  },
};

// ============================================================================
// Couple API
// ============================================================================

export const coupleApi = {
  /**
   * Link a user with their partner using a couple code
   * 
   * @param userId - Current user's ID
   * @param partnerCode - Partner's couple code
   * @param token - Firebase Auth ID token
   * @returns Success response with couple ID and partner info
   * 
   * @example
   * const result = await coupleApi.link('user-123', 'ABC12345', token);
   * // { success: true, couple_id: 'couple-456', partner: { id: '...', display_name: '...' } }
   */
  link: async (
    userId: string,
    partnerCode: string,
    token: string
  ): Promise<{
    success: boolean;
    couple_id: string;
    partner: { id: string; display_name: string };
  }> => {
    return post<{
      success: boolean;
      couple_id: string;
      partner: { id: string; display_name: string };
    }>('couples/link', { user_id: userId, partner_code: partnerCode }, { token });
  },

  /**
   * Get couple data by ID
   * 
   * @param coupleId - Couple's unique ID
   * @param token - Firebase Auth ID token
   * @returns Couple object
   * 
   * @example
   * const couple = await coupleApi.get('couple-456', token);
   */
  get: async (coupleId: string, token: string): Promise<Couple> => {
    return get<Couple>(`couples/${coupleId}`, { token });
  },

  /**
   * Get couple presence (online status)
   * 
   * @param coupleId - Couple's unique ID
   * @param token - Firebase Auth ID token
   * @returns Presence status for both partners
   * 
   * @example
   * const presence = await coupleApi.getPresence('couple-456', token);
   * // { couple_id: '...', user1_online: true, user2_online: false, total_connections: 1 }
   */
  getPresence: async (coupleId: string, token: string): Promise<CouplePresence> => {
    return get<CouplePresence>(`couples/${coupleId}/presence`, { token });
  },
};

// ============================================================================
// Games API
// ============================================================================

export const gamesApi = {
  /**
   * Get all game categories
   * 
   * No authentication required - public endpoint
   * 
   * @returns List of game categories
   * 
   * @example
   * const { categories } = await gamesApi.getCategories();
   */
  getCategories: async (): Promise<{ categories: GameCategory[] }> => {
    return get<{ categories: GameCategory[] }>('games/categories');
  },

  /**
   * Get a specific category with its games
   * 
   * @param categoryId - Category ID (e.g., 'emotional-connection', 'love-arcade')
   * @returns Category object with games list
   * 
   * @example
   * const category = await gamesApi.getCategory('love-arcade');
   */
  getCategory: async (categoryId: string): Promise<GameCategory> => {
    return get<GameCategory>(`games/categories/${categoryId}`);
  },

  /**
   * Create a new game session
   * 
   * @param userId - Current user's ID
   * @param gameId - Game identifier (e.g., 'truth-teller-tower')
   * @param categoryId - Category ID
   * @param token - Firebase Auth ID token
   * @returns Created game session
   * 
   * @example
   * const session = await gamesApi.createSession(
   *   'user-123',
   *   'truth-teller-tower',
   *   'love-arcade',
   *   token
   * );
   */
  createSession: async (
    userId: string,
    gameId: string,
    categoryId: string,
    token: string
  ): Promise<GameSession> => {
    return post<GameSession>(
      'games/sessions',
      { user_id: userId, game_id: gameId, category_id: categoryId },
      { token }
    );
  },

  /**
   * Update a game session (score, completion status, responses)
   * 
   * @param sessionId - Game session ID
   * @param data - Update data (score, completed, responses)
   * @param token - Firebase Auth ID token
   * @returns Updated game session
   * 
   * @example
   * const updated = await gamesApi.updateSession(
   *   'session-789',
   *   { score: 85, completed: true, responses: [...] },
   *   token
   * );
   */
  updateSession: async (
    sessionId: string,
    data: {
      score?: number;
      completed?: boolean;
      responses?: any[];
    },
    token: string
  ): Promise<GameSession> => {
    return put<GameSession>(`games/sessions/${sessionId}`, data, { token });
  },

  /**
   * Get Love Arcade games with detailed configurations
   * 
   * No authentication required - public endpoint
   * 
   * @returns List of Love Arcade games
   * 
   * @example
   * const { games } = await gamesApi.getLoveArcadeGames();
   */
  getLoveArcadeGames: async (): Promise<{
    games: Array<{
      id: string;
      name: string;
      phase: string;
      format: string;
      description: string;
      max_score: number;
      [key: string]: any;
    }>;
  }> => {
    return get('love-arcade/games');
  },
};

// ============================================================================
// SOS API
// ============================================================================

export const sosApi = {
  /**
   * Create a new SOS fight resolution session
   * 
   * @param initiatorId - User initiating the SOS session
   * @param coupleId - Couple's ID
   * @param token - Firebase Auth ID token
   * @returns Created SOS session
   * 
   * @example
   * const session = await sosApi.createSession('user-123', 'couple-456', token);
   */
  createSession: async (
    initiatorId: string,
    coupleId: string,
    token: string
  ): Promise<SOSSession> => {
    return post<SOSSession>(
      'sos/sessions',
      { initiator_id: initiatorId, couple_id: coupleId },
      { token }
    );
  },

  /**
   * Submit a booth response in an SOS session
   * 
   * @param sessionId - SOS session ID
   * @param userId - Current user's ID
   * @param responses - Booth responses (I feel, when partner, etc.)
   * @param token - Firebase Auth ID token
   * @returns Updated SOS session
   * 
   * @example
   * const updated = await sosApi.submitBooth(
   *   'sos-789',
   *   'user-123',
   *   {
   *     i_feel: 'hurt',
   *     when_partner: 'ignores me',
   *     because_i_tell_myself: "they don't care",
   *     what_i_need: 'attention'
   *   },
   *   token
   * );
   */
  submitBooth: async (
    sessionId: string,
    userId: string,
    responses: SOSBoothSubmission,
    token: string
  ): Promise<SOSSession> => {
    return post<SOSSession>(
      `sos/sessions/${sessionId}/submit`,
      {
        session_id: sessionId,
        user_id: userId,
        i_feel: responses.i_feel,
        when_partner: responses.when_partner,
        because_i_tell_myself: responses.because_i_tell_myself,
        what_i_need: responses.what_i_need,
      },
      { token }
    );
  },

  /**
   * Get SOS session by ID
   * 
   * @param sessionId - SOS session ID
   * @param token - Firebase Auth ID token
   * @returns SOS session with submissions
   * 
   * @example
   * const session = await sosApi.getSession('sos-789', token);
   */
  getSession: async (sessionId: string, token: string): Promise<SOSSession> => {
    return get<SOSSession>(`sos/sessions/${sessionId}`, { token });
  },
};

// ============================================================================
// Dr. Marcie AI API
// ============================================================================

export const marcieApi = {
  /**
   * Chat with Dr. Marcie AI
   * 
   * @param userId - Current user's ID
   * @param context - Context for the conversation
   * @param message - User's message to Dr. Marcie
   * @param sarcasmLevel - Sarcasm level (1-4)
   * @param token - Firebase Auth ID token
   * @param gameContext - Optional game context for game-specific responses
   * @returns Dr. Marcie's response with animation
   * 
   * @example
   * const response = await marcieApi.chat(
   *   'user-123',
   *   'User is struggling with trust issues',
   *   'How do I rebuild trust?',
   *   3,
   *   token
   * );
   * // { response: "...", animation: "marcie-thinking", sarcasm_level: 3 }
   */
  chat: async (
    userId: string,
    context: string,
    message: string,
    sarcasmLevel: number,
    token: string,
    gameContext?: string
  ): Promise<MarcieResponse> => {
    return post<MarcieResponse>(
      'marcie/chat',
      {
        user_id: userId,
        context,
        message,
        sarcasm_level: sarcasmLevel,
        game_context: gameContext,
      },
      { token }
    );
  },
};

// ============================================================================
// Health Check
// ============================================================================

export const healthApi = {
  /**
   * Check backend API health
   * 
   * No authentication required
   * 
   * @returns Health check response
   * 
   * @example
   * const health = await healthApi.check();
   * // { status: 'healthy', app: 'Love Actually - The Game', version: '1.0.0', timestamp: '...' }
   */
  check: async (): Promise<HealthCheck> => {
    return get<HealthCheck>('health');
  },
};

// ============================================================================
// Export all APIs as default
// ============================================================================

export default {
  userApi,
  coupleApi,
  gamesApi,
  sosApi,
  marcieApi,
  healthApi,
  ApiError,
};
