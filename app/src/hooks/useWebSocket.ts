/**
 * useWebSocket Hook
 * 
 * Manages WebSocket connection for real-time couple synchronization.
 * Handles connection lifecycle, reconnection, and message broadcasting.
 * 
 * Usage:
 * const { 
 *   isConnected, 
 *   partnerOnline, 
 *   sendMessage, 
 *   lastMessage,
 *   connectionState 
 * } = useWebSocket(coupleId);
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { ENV } from '../lib/env';

// WebSocket connection states
export type ConnectionState = 'connecting' | 'connected' | 'disconnected' | 'reconnecting' | 'error';

interface WebSocketMessage {
  type: string;
  [key: string]: any;
}

interface UseWebSocketReturn {
  /** Whether the WebSocket is connected */
  isConnected: boolean;
  /** Whether partner is online */
  partnerOnline: boolean;
  /** Current connection state */
  connectionState: ConnectionState;
  /** Send a message to partner */
  sendMessage: (message: WebSocketMessage) => boolean;
  /** Last received message */
  lastMessage: WebSocketMessage | null;
  /** Manually reconnect */
  reconnect: () => void;
  /** Connection error if any */
  error: Error | null;
}

// Configuration
const WS_URL = ENV.WS_URL || 'ws://localhost:8001';
const RECONNECT_INTERVAL = 3000; // 3 seconds
const MAX_RECONNECT_ATTEMPTS = 5;
const HEARTBEAT_INTERVAL = 30000; // 30 seconds

export function useWebSocket(coupleId: string | null | undefined): UseWebSocketReturn {
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
  const [partnerOnline, setPartnerOnline] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [error, setError] = useState<Error | null>(null);
  
  const ws = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const reconnectTimer = useRef<NodeJS.Timeout | null>(null);
  const heartbeatTimer = useRef<NodeJS.Timeout | null>(null);
  const isMounted = useRef(true);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (reconnectTimer.current) {
      clearTimeout(reconnectTimer.current);
      reconnectTimer.current = null;
    }
    if (heartbeatTimer.current) {
      clearInterval(heartbeatTimer.current);
      heartbeatTimer.current = null;
    }
    if (ws.current) {
      // Remove listeners to prevent callbacks after cleanup
      ws.current.onopen = null;
      ws.current.onclose = null;
      ws.current.onerror = null;
      ws.current.onmessage = null;
      
      if (ws.current.readyState === WebSocket.OPEN || ws.current.readyState === WebSocket.CONNECTING) {
        ws.current.close();
      }
      ws.current = null;
    }
  }, []);

  // Connect to WebSocket
  const connect = useCallback(() => {
    if (!coupleId || !isMounted.current) return;
    
    // Don't connect if already connected
    if (ws.current?.readyState === WebSocket.OPEN) return;
    
    cleanup();
    
    setConnectionState('connecting');
    setError(null);
    
    try {
      const wsUrl = `${WS_URL}/ws/${coupleId}`;
      console.log(`[useWebSocket] Connecting to ${wsUrl}`);
      
      ws.current = new WebSocket(wsUrl);
      
      ws.current.onopen = () => {
        if (!isMounted.current) return;
        
        console.log('[useWebSocket] Connected');
        setConnectionState('connected');
        reconnectAttempts.current = 0;
        
        // Send initial presence message
        ws.current?.send(JSON.stringify({
          type: 'presence',
          status: 'online',
          timestamp: new Date().toISOString()
        }));
        
        // Start heartbeat
        heartbeatTimer.current = setInterval(() => {
          if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({
              type: 'heartbeat',
              timestamp: new Date().toISOString()
            }));
          }
        }, HEARTBEAT_INTERVAL);
      };
      
      ws.current.onclose = (event) => {
        if (!isMounted.current) return;
        
        console.log(`[useWebSocket] Disconnected: ${event.code} ${event.reason}`);
        setConnectionState('disconnected');
        setPartnerOnline(false);
        
        // Attempt reconnection if not closed cleanly and within retry limit
        if (!event.wasClean && reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
          setConnectionState('reconnecting');
          reconnectAttempts.current += 1;
          
          console.log(`[useWebSocket] Reconnecting in ${RECONNECT_INTERVAL}ms (attempt ${reconnectAttempts.current})`);
          
          reconnectTimer.current = setTimeout(() => {
            if (isMounted.current) {
              connect();
            }
          }, RECONNECT_INTERVAL);
        } else if (reconnectAttempts.current >= MAX_RECONNECT_ATTEMPTS) {
          setError(new Error('Max reconnection attempts reached'));
          setConnectionState('error');
        }
      };
      
      ws.current.onerror = (error) => {
        if (!isMounted.current) return;
        
        console.error('[useWebSocket] Error:', error);
        setError(new Error('WebSocket connection error'));
        setConnectionState('error');
      };
      
      ws.current.onmessage = (event) => {
        if (!isMounted.current) return;
        
        try {
          const message = JSON.parse(event.data);
          console.log('[useWebSocket] Received:', message.type);
          
          setLastMessage(message);
          
          // Handle specific message types
          switch (message.type) {
            case 'partner_connected':
              setPartnerOnline(true);
              break;
            case 'partner_disconnected':
              setPartnerOnline(false);
              break;
            case 'presence':
              if (message.status === 'online') {
                setPartnerOnline(true);
              }
              break;
            case 'game_progress':
              // Game-specific progress updates
              break;
            case 'heartbeat':
              // Heartbeat acknowledgment
              break;
            default:
              // Custom message types handled by components
              break;
          }
        } catch (err) {
          console.error('[useWebSocket] Failed to parse message:', err);
        }
      };
    } catch (err) {
      if (!isMounted.current) return;
      
      console.error('[useWebSocket] Failed to connect:', err);
      setError(err instanceof Error ? err : new Error('Failed to connect'));
      setConnectionState('error');
    }
  }, [coupleId, cleanup]);

  // Send message function
  const sendMessage = useCallback((message: WebSocketMessage): boolean => {
    if (ws.current?.readyState !== WebSocket.OPEN) {
      console.warn('[useWebSocket] Cannot send message: not connected');
      return false;
    }
    
    try {
      ws.current.send(JSON.stringify({
        ...message,
        timestamp: new Date().toISOString()
      }));
      return true;
    } catch (err) {
      console.error('[useWebSocket] Failed to send message:', err);
      return false;
    }
  }, []);

  // Manual reconnect
  const reconnect = useCallback(() => {
    reconnectAttempts.current = 0;
    connect();
  }, [connect]);

  // Connect on mount and when coupleId changes
  useEffect(() => {
    isMounted.current = true;
    
    if (coupleId) {
      connect();
    }
    
    return () => {
      isMounted.current = false;
      cleanup();
    };
  }, [coupleId, connect, cleanup]);

  return {
    isConnected: connectionState === 'connected',
    partnerOnline,
    connectionState,
    sendMessage,
    lastMessage,
    reconnect,
    error
  };
}

export default useWebSocket;
