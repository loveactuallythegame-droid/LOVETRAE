/**
 * HTTP Client for LoveTrae Backend API
 * 
 * This client handles all communication with the backend server
 * and provides proper error handling and authentication.
 */

import { auth } from './firebaseClient';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001/api';

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  status: number;
  message: string;
  details?: any;
}

// Custom error class for API errors
export class ApiError extends Error {
  status: number;
  details?: any;

  constructor(status: number, message: string, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

// Get authentication token
const getAuthToken = async (): Promise<string | null> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return null;
    }
    return await user.getIdToken();
  } catch (error) {
    console.error('Failed to get auth token:', error);
    return null;
  }
};

// Handle API response
const handleResponse = async (response: Response): Promise<any> => {
  const contentType = response.headers.get('content-type');
  
  if (contentType && contentType.includes('application/json')) {
    const data = await response.json();
    
    if (!response.ok) {
      throw new ApiError(
        response.status,
        data.error || data.message || `HTTP ${response.status}`,
        data.details
      );
    }
    
    return data;
  } else {
    const text = await response.text();
    
    if (!response.ok) {
      throw new ApiError(
        response.status,
        text || `HTTP ${response.status}`,
        null
      );
    }
    
    return text;
  }
};

// HTTP Client implementation
export const httpClient = {
  /**
   * GET request
   */
  get: async <T = any>(endpoint: string, requireAuth: boolean = true): Promise<T> => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (requireAuth) {
      const token = await getAuthToken();
      if (!token) {
        throw new ApiError(401, 'Authentication required');
      }
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers,
      });

      return await handleResponse(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Network error occurred');
    }
  },

  /**
   * POST request
   */
  post: async <T = any>(endpoint: string, data?: any, requireAuth: boolean = true): Promise<T> => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (requireAuth) {
      const token = await getAuthToken();
      if (!token) {
        throw new ApiError(401, 'Authentication required');
      }
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: data ? JSON.stringify(data) : undefined,
      });

      return await handleResponse(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Network error occurred');
    }
  },

  /**
   * PUT request
   */
  put: async <T = any>(endpoint: string, data?: any, requireAuth: boolean = true): Promise<T> => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (requireAuth) {
      const token = await getAuthToken();
      if (!token) {
        throw new ApiError(401, 'Authentication required');
      }
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers,
        body: data ? JSON.stringify(data) : undefined,
      });

      return await handleResponse(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Network error occurred');
    }
  },

  /**
   * DELETE request
   */
  delete: async <T = any>(endpoint: string, requireAuth: boolean = true): Promise<T> => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (requireAuth) {
      const token = await getAuthToken();
      if (!token) {
        throw new ApiError(401, 'Authentication required');
      }
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers,
      });

      return await handleResponse(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Network error occurred');
    }
  },

  /**
   * Upload file (multipart/form-data)
   */
  upload: async <T = any>(endpoint: string, formData: FormData, requireAuth: boolean = true): Promise<T> => {
    const headers: HeadersInit = {};

    if (requireAuth) {
      const token = await getAuthToken();
      if (!token) {
        throw new ApiError(401, 'Authentication required');
      }
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: formData,
      });

      return await handleResponse(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Network error occurred');
    }
  },
};

// Utility functions
export const handleApiError = (error: any): string => {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 400:
        return 'Bad request. Please check your input.';
      case 401:
        return 'Authentication required. Please log in again.';
      case 403:
        return 'You don\'t have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 409:
        return 'This action conflicts with existing data.';
      case 422:
        return 'Validation error. Please check your input.';
      case 429:
        return 'Too many requests. Please try again later.';
      case 500:
        return 'Server error. Please try again later.';
      case 502:
      case 503:
      case 504:
        return 'Service unavailable. Please try again later.';
      default:
        return error.message || 'An unexpected error occurred.';
    }
  }
  
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return 'Network error. Please check your internet connection.';
  }
  
  return 'An unexpected error occurred. Please try again.';
};

export const isNetworkError = (error: any): boolean => {
  return error instanceof TypeError || 
         (error instanceof ApiError && error.status >= 500) ||
         (error instanceof ApiError && error.status === 0);
};

export const shouldRetryRequest = (error: any): boolean => {
  return isNetworkError(error) || 
         (error instanceof ApiError && error.status === 429);
};

// Retry logic for failed requests
export const withRetry = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (!shouldRetryRequest(error) || attempt === maxRetries - 1) {
        throw error;
      }
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt)));
    }
  }
  
  throw lastError;
};

export default httpClient;