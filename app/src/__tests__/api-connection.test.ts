/**
 * API Connection Test Suite
 * 
 * Tests the connection between frontend and backend server
 * Verifies all API endpoints are working correctly
 */

import { httpClient, ApiError, handleApiError, withRetry } from '../lib/httpClient';
import api from '../lib/api';
import { auth } from '../lib/firebaseClient';

// Mock Firebase auth
jest.mock('../lib/firebaseClient', () => ({
  auth: {
    currentUser: {
      getIdToken: jest.fn().mockResolvedValue('test-token')
    }
  }
}));

// Mock fetch for HTTP requests
global.fetch = jest.fn();

describe('API Connection Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('HTTP Client', () => {
    test('should make successful GET request', async () => {
      const mockResponse = { success: true, data: { test: 'data' } };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => mockResponse
      });

      const result = await httpClient.get('/test');
      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/test'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test-token'
          })
        })
      );
    });

    test('should handle authentication errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ error: 'Unauthorized' })
      });

      await expect(httpClient.get('/test')).rejects.toThrow(ApiError);
    });

    test('should handle network errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new TypeError('Network error'));

      await expect(httpClient.get('/test')).rejects.toThrow(ApiError);
    });

    test('should retry failed requests', async () => {
      const mockResponse = { success: true };
      
      // First call fails, second succeeds
      (global.fetch as jest.Mock)
        .mockRejectedValueOnce(new TypeError('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: async () => mockResponse
        });

      const result = await withRetry(() => httpClient.get('/test'));
      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('Health Check API', () => {
    test('should check backend health', async () => {
      const mockHealth = { status: 'healthy', app: 'Love Actually - The Game' };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => mockHealth
      });

      const result = await api.healthApi.check();
      expect(result).toEqual(mockHealth);
    });
  });

  describe('User API', () => {
    test('should create user', async () => {
      const userData = { email: 'test@example.com', display_name: 'Test User' };
      const mockResponse = { id: '123', ...userData };
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => mockResponse
      });

      const result = await api.userApi.create(userData);
      expect(result).toEqual(mockResponse);
    });

    test('should get user by ID', async () => {
      const userId = '123';
      const mockUser = { id: userId, email: 'test@example.com', display_name: 'Test User' };
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => mockUser
      });

      const result = await api.userApi.get(userId);
      expect(result).toEqual(mockUser);
    });

    test('should update sarcasm level', async () => {
      const userId = '123';
      const level = 2;
      const mockResponse = { success: true, sarcasm_level: level };
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => mockResponse
      });

      const result = await api.userApi.updateSarcasm(userId, level);
      expect(result).toEqual(mockResponse);
    });

    test('should validate sarcasm level', async () => {
      const userId = '123';
      const invalidLevel = 5;
      
      await expect(api.userApi.updateSarcasm(userId, invalidLevel))
        .rejects.toThrow('Sarcasm level must be 1-4');
    });
  });

  describe('Games API', () => {
    test('should get game categories', async () => {
      const mockCategories = {
        categories: [
          { id: 'emotional-connection', name: 'Emotional Connection' },
          { id: 'conflict-resolution', name: 'Conflict Resolution' }
        ]
      };
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => mockCategories
      });

      const result = await api.gamesApi.getCategories();
      expect(result).toEqual(mockCategories);
    });

    test('should create game session', async () => {
      const sessionData = {
        user_id: '123',
        game_id: 'truth-or-trust',
        category_id: 'emotional-connection'
      };
      const mockResponse = { id: 'session-123', ...sessionData };
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => mockResponse
      });

      const result = await api.gamesApi.createSession(
        sessionData.user_id,
        sessionData.game_id,
        sessionData.category_id
      );
      expect(result).toEqual(mockResponse);
    });

    test('should update game session', async () => {
      const sessionId = 'session-123';
      const updateData = { score: 100, completed: true };
      const mockResponse = { id: sessionId, ...updateData };
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => mockResponse
      });

      const result = await api.gamesApi.updateSession(
        sessionId,
        updateData.score,
        updateData.completed
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('SOS API', () => {
    test('should create SOS session', async () => {
      const sosData = {
        initiator_id: 'user-123',
        couple_id: 'couple-456'
      };
      const mockResponse = { id: 'sos-789', ...sosData };
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => mockResponse
      });

      const result = await api.sosApi.createSession(
        sosData.initiator_id,
        sosData.couple_id
      );
      expect(result).toEqual(mockResponse);
    });

    test('should submit SOS booth', async () => {
      const sessionId = 'sos-789';
      const userId = 'user-123';
      const responses = {
        i_feel: 'frustrated',
        when_partner: 'doesn\'t listen',
        because_i_tell_myself: 'I\'m not important',
        what_i_need: 'to feel heard'
      };
      const mockResponse = { success: true };
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => mockResponse
      });

      const result = await api.sosApi.submitBooth(sessionId, userId, responses);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Dr. Marcie AI API', () => {
    test('should chat with Dr. Marcie', async () => {
      const chatData = {
        user_id: 'user-123',
        context: 'relationship advice',
        message: 'How do I improve communication?',
        sarcasm_level: 2
      };
      const mockResponse = {
        response: 'Sweetheart, communication isn\'t mind-reading. Use words, not vibes.',
        animation: 'marcie-idle',
        sarcasm_level: 2
      };
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => mockResponse
      });

      const result = await api.marcieApi.chat(
        chatData.user_id,
        chatData.context,
        chatData.message,
        chatData.sarcasm_level
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Error Handling', () => {
    test('should handle API errors gracefully', () => {
      const apiError = new ApiError(404, 'User not found');
      const userMessage = handleApiError(apiError);
      expect(userMessage).toBe('The requested resource was not found.');
    });

    test('should handle network errors', () => {
      const networkError = new TypeError('Failed to fetch');
      const userMessage = handleApiError(networkError);
      expect(userMessage).toBe('Network error. Please check your internet connection.');
    });

    test('should identify network errors', () => {
      const networkError = new TypeError('Failed to fetch');
      expect(isNetworkError(networkError)).toBe(true);
      
      const serverError = new ApiError(500, 'Server error');
      expect(isNetworkError(serverError)).toBe(true);
      
      const clientError = new ApiError(400, 'Bad request');
      expect(isNetworkError(clientError)).toBe(false);
    });
  });

  describe('WebSocket API', () => {
    test('should create WebSocket connection', () => {
      const mockWebSocket = {
        send: jest.fn(),
        close: jest.fn(),
        onopen: null,
        onmessage: null,
        onclose: null,
        onerror: null,
        readyState: WebSocket.OPEN
      };

      (global as any).WebSocket = jest.fn(() => mockWebSocket);

      const onMessage = jest.fn();
      const onConnect = jest.fn();
      const onDisconnect = jest.fn();

      const ws = api.websocketApi.connect('couple-123', onMessage, onConnect, onDisconnect);

      expect(global.WebSocket).toHaveBeenCalledWith(expect.stringContaining('/ws/couple-123'));
      
      // Simulate connection
      mockWebSocket.onopen?.(new Event('open'));
      expect(onConnect).toHaveBeenCalled();
      
      // Simulate message
      mockWebSocket.onmessage?.({ data: JSON.stringify({ type: 'test' }) } as MessageEvent);
      expect(onMessage).toHaveBeenCalledWith({ type: 'test' });
      
      // Test sending message
      ws.send({ test: 'data' });
      expect(mockWebSocket.send).toHaveBeenCalledWith(JSON.stringify({ test: 'data' }));
      
      // Test closing connection
      ws.close();
      expect(mockWebSocket.close).toHaveBeenCalled();
    });
  });
});

// Integration test for full API flow
describe('API Integration Flow', () => {
  test('should handle complete user flow', async () => {
    const userData = { email: 'integration@test.com', display_name: 'Integration Test' };
    const userId = 'integration-user-123';
    
    // Mock all API calls
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ id: userId, ...userData })
      }) // create user
      .mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ id: userId, ...userData })
      }) // get user
      .mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ categories: [] })
      }) // get categories
      .mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ id: 'session-123', user_id: userId })
      }); // create game session

    // Execute flow
    const createdUser = await api.userApi.create(userData);
    expect(createdUser.id).toBe(userId);

    const retrievedUser = await api.userApi.get(userId);
    expect(retrievedUser.email).toBe(userData.email);

    const categories = await api.gamesApi.getCategories();
    expect(categories).toBeDefined();

    const gameSession = await api.gamesApi.createSession(userId, 'test-game', 'test-category');
    expect(gameSession.user_id).toBe(userId);

    expect(global.fetch).toHaveBeenCalledTimes(4);
  });
});

// Performance test
describe('API Performance', () => {
  test('should handle concurrent requests', async () => {
    const mockResponse = { success: true };
    
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => mockResponse
    });

    const startTime = Date.now();
    
    // Make 10 concurrent requests
    const promises = Array.from({ length: 10 }, (_, i) => 
      api.healthApi.check()
    );
    
    const results = await Promise.all(promises);
    const endTime = Date.now();
    
    expect(results).toHaveLength(10);
    expect(results.every(r => r.success === true)).toBe(true);
    expect(endTime - startTime).toBeLessThan(5000); // Should complete within 5 seconds
  });
});

// Error recovery test
describe('Error Recovery', () => {
  test('should recover from temporary failures', async () => {
    const mockResponse = { success: true };
    
    // Simulate temporary failure then success
    (global.fetch as jest.Mock)
      .mockRejectedValueOnce(new TypeError('Network error'))
      .mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => mockResponse
      });

    const result = await withRetry(() => api.healthApi.check());
    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});