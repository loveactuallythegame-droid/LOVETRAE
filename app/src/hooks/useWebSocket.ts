/**
 * useWebSocket Hook
 * 
 * Manages WebSocket connection to the backend for real-time couple synchronization.
 * Handles connection, reconnection, authentication, and message passing.
 * 
 * @example
 * const { isConnected, sendMessage, lastMessage, connect, disconnect } = useWebSocket(coupleId);
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { ENV } from '../lib/env';

interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp?: number;
  senderId?: string;
}

interface UseWebSocketReturn {
  /** Whether the WebSocket is currently connected */
  isConnected: boolean;
  /** Send a message to the partner through WebSocket */
  sendMessage: (message: Omit<WebSocketMessage, 'timestamp'>) => void;
  /** The last message received from the partner */
  lastMessage: WebSocketMessage | null;
  /** Connect to the WebSocket (usually called automatically) */
  connect: () => void;
  /** Disconnect from the WebSocket */
  disconnect: () => void;
  /** Current connection error, if any */
  error: Error | null;
  /** Number of reconnection attempts made */
  reconnectAttempts: number;
}

// Reconnection configuration
const RECONNECT_INTERVAL = 3000; // 3 seconds
const MAX_RECONNECT_ATTEMPTS = 5;
const CONNECTION_TIMEOUT = 10000; // 10 seconds

/**
 * Hook for managing WebSocket connection to backend
 * 
 * @param coupleId - The couple's unique ID for the room
 * @param token - Firebase Auth ID token for authentication
 * @returns WebSocket state and control functions
 */
export function useWebSocket(
  coupleId: string | null,
  token: string | null
): UseWebSocketReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const connectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isReconnecting = useRef(false);

  /**
   * Build WebSocket URL with authentication
   */
  const getWebSocketUrl = useCallback(() => {
    const baseUrl = ENV.WS_URL || 'ws://localhost:8001';
    // Remove 'http://' or 'https://' if present and replace with ws:// or wss://
    const wsBase = baseUrl.replace(/^https:/, 'wss:').replace(/^http:/, 'ws:');
    
    // WebSocket endpoint: /ws/{couple_id}
    // Token is passed as query parameter for initial auth
    const url = token 
      ? `${wsBase}/ws/${coupleId}?token=${encodeURIComponent(token)}`
      : `${wsBase}/ws/${coupleId}`;
    
    return url;
  }, [coupleId, token]);

  /**
   * Connect to WebSocket
   */
  const connect = useCallback(() => {
    // Don't connect if missing required params
    if (!coupleId || !token) {
      console.log('[WebSocket] Missing coupleId or token, skipping connection');
      return;
    }

    // Don't connect if already connected or reconnecting
    if (ws.current?.readyState === WebSocket.OPEN || isReconnecting.current) {
      console.log('[WebSocket] Already connected or reconnecting');
      return;
    }

    // Clean up any existing connection
    if (ws.current) {
      ws.current.close();
    }

    console.log(`[WebSocket] Connecting to room: ${coupleId}`);
    setError(null);

    try {
      const url = getWebSocketUrl();
      ws.current = new WebSocket(url);

      // Set connection timeout
      connectionTimeoutRef.current = setTimeout(() => {
        if (ws.current?.readyState !== WebSocket.OPEN) {
          console.error('[WebSocket] Connection timeout');
          ws.current?.close();
          setError(new Error('Connection timeout'));
        }
      }, CONNECTION_TIMEOUT);

      ws.current.onopen = () => {
        console.log('[WebSocket] Connected successfully');
        if (connectionTimeoutRef.current) {
          clearTimeout(connectionTimeoutRef.current);
        }
        setIsConnected(true);
        setError(null);
        setReconnectAttempts(0);
        isReconnecting.current = false;
      };

      ws.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          console.log('[WebSocket] Message received:', message);
          setLastMessage({
            ...message,
            timestamp: Date.now(),
          });
        } catch (err) {
          console.error('[WebSocket] Failed to parse message:', err);
        }
      };

      ws.current.onerror = (event) => {
        console.error('[WebSocket] Error:', event);
        setError(new Error('WebSocket error occurred'));
        setIsConnected(false);
      };

      ws.current.onclose = (event) => {
        console.log(`[WebSocket] Disconnected (code: ${event.code}, reason: ${event.reason})`);
        setIsConnected(false);

        // Attempt reconnection if not closed cleanly and we haven't exceeded max attempts
        if (!event.wasClean && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          isReconnecting.current = true;
          const nextAttempt = reconnectAttempts + 1;
          setReconnectAttempts(nextAttempt);
          
          console.log(`[WebSocket] Reconnecting in ${RECONNECT_INTERVAL}ms (attempt ${nextAttempt}/${MAX_RECONNECT_ATTEMPTS})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, RECONNECT_INTERVAL);
        } else if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
          console.error('[WebSocket] Max reconnection attempts reached');
          setError(new Error('Failed to reconnect after maximum attempts'));
        }
      };

    } catch (err) {
      console.error('[WebSocket] Failed to create connection:', err);
      setError(err instanceof Error ? err : new Error('Unknown connection error'));
    }
  }, [coupleId, token, getWebSocketUrl, reconnectAttempts]);

  /**
   * Disconnect from WebSocket
   */
  const disconnect = useCallback(() => {
    console.log('[WebSocket] Disconnecting...');
    
    // Clear any pending reconnection
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current);
      connectionTimeoutRef.current = null;
    }

    isReconnecting.current = false;
    setReconnectAttempts(0);

    // Close the connection
    if (ws.current) {
      ws.current.close(1000, 'User disconnected');
      ws.current = null;
    }

    setIsConnected(false);
  }, []);

  /**
   * Send a message through WebSocket
   */
  const sendMessage = useCallback((message: Omit<WebSocketMessage, 'timestamp'>) => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      console.error('[WebSocket] Cannot send message: not connected');
      return;
    }

    const fullMessage: WebSocketMessage = {
      ...message,
      timestamp: Date.now(),
    };

    try {
      ws.current.send(JSON.stringify(fullMessage));
      console.log('[WebSocket] Message sent:', fullMessage);
    } catch (err) {
      console.error('[WebSocket] Failed to send message:', err);
    }
  }, []);

  /**
   * Auto-connect when coupleId and token are available
   */
  useEffect(() => {
    if (coupleId && token) {
      connect();
    }

    // Cleanup on unmount or when dependencies change
    return () => {
      disconnect();
    };
  }, [coupleId, token, connect, disconnect]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
      }
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  return {
    isConnected,
    sendMessage,
    lastMessage,
    connect,
    disconnect,
    error,
    reconnectAttempts,
  };
}

export default useWebSocket;