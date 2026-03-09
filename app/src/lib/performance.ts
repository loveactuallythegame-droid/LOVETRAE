"""
 * Performance Utilities
 * React.memo optimization, lazy loading helpers, and profiling
 */

import React, { useEffect, useRef, useCallback } from 'react';

// =============================================================================
// React.memo with Custom Comparison
// =============================================================================

/**
 * Creates a memoized component with deep comparison for specific props
 * Useful for game components that receive complex state objects
 */
export function memoWithDeepCompare<P extends object>(
  Component: React.ComponentType<P>,
  deepCompareProps: (keyof P)[] = []
): React.MemoExoticComponent<React.ComponentType<P>> {
  return React.memo(Component, (prevProps, nextProps) => {
    // Shallow compare all props first
    const allKeys = Object.keys(prevProps) as (keyof P)[];
    
    for (const key of allKeys) {
      if (deepCompareProps.includes(key)) {
        // Deep compare for specified props
        if (JSON.stringify(prevProps[key]) !== JSON.stringify(nextProps[key])) {
          return false;
        }
      } else {
        // Shallow compare for others
        if (prevProps[key] !== nextProps[key]) {
          return false;
        }
      }
    }
    
    return true;
  });
}

/**
 * Creates a memoized component that only re-renders when specific props change
 */
export function memoWithPropCheck<P extends object>(
  Component: React.ComponentType<P>,
  shouldUpdate: (prevProps: P, nextProps: P) => boolean
): React.MemoExoticComponent<React.ComponentType<P>> {
  return React.memo(Component, (prevProps, nextProps) => !shouldUpdate(prevProps, nextProps));
}

// =============================================================================
// Lazy Loading with Preload
// =============================================================================

interface LazyComponentWithPreload<T extends React.ComponentType<any>> {
  Component: React.LazyExoticComponent<T>;
  preload: () => Promise<void>;
}

/**
 * Creates a lazy-loaded component with preload capability
 * Usage: const { Component, preload } = lazyWithPreload(() => import('./HeavyComponent'))
 */
export function lazyWithPreload<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>
): LazyComponentWithPreload<T> {
  let Component: React.LazyExoticComponent<T> | null = null;
  let preloadPromise: Promise<void> | null = null;

  const preload = async (): Promise<void> => {
    if (!preloadPromise) {
      preloadPromise = factory().then(() => undefined);
    }
    return preloadPromise;
  };

  const LazyComponent = React.lazy(factory);

  return {
    Component: LazyComponent,
    preload,
  };
}

// =============================================================================
// Intersection Observer for Lazy Loading
// =============================================================================

interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

/**
 * Hook to observe when an element enters the viewport
 * Useful for lazy loading game screens or heavy components
 */
export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
): [React.RefObject<any>, boolean] {
  const { threshold = 0, rootMargin = '0px', triggerOnce = true } = options;
  const ref = useRef<HTMLElement>(null);
  const [isIntersecting, setIsIntersecting] = React.useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsIntersecting(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce]);

  return [ref, isIntersecting];
}

// =============================================================================
// Performance Profiling
// =============================================================================

/**
 * Hook to measure component render time
 */
export function useRenderPerf(componentName: string, enabled: boolean = __DEV__): void {
  const renderCount = useRef(0);
  const startTime = useRef<number>(0);

  useEffect(() => {
    if (!enabled) return;

    renderCount.current += 1;
    const endTime = performance.now();
    const duration = endTime - startTime.current;

    if (renderCount.current > 1) {
      console.log(`[Perf] ${componentName} re-render #${renderCount.current}: ${duration.toFixed(2)}ms`);
    }

    return () => {
      startTime.current = performance.now();
    };
  });

  if (enabled && renderCount.current === 0) {
    startTime.current = performance.now();
    console.log(`[Perf] ${componentName} initial render`);
  }
}

/**
 * Debounce function for performance-intensive operations
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

/**
 * Throttle function for scroll/resize handlers
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

// =============================================================================
// Image Preloading
// =============================================================================

/**
 * Preload an image and return a promise
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Preload multiple images
 */
export async function preloadImages(srcs: string[]): Promise<void> {
  await Promise.all(srcs.map(preloadImage));
}

// =============================================================================
// Memory Management
// =============================================================================

/**
 * Hook to cleanup on unmount
 */
export function useCleanup(cleanup: () => void): void {
  useEffect(() => {
    return cleanup;
  }, []);
}

/**
 * Hook to limit re-renders by batching state updates
 */
export function useBatchedState<T>(
  initialState: T
): [T, (updates: Partial<T>) => void] {
  const [state, setState] = React.useState<T>(initialState);
  const pendingUpdates = useRef<Partial<T>>({});
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const batchUpdate = useCallback((updates: Partial<T>) => {
    pendingUpdates.current = { ...pendingUpdates.current, ...updates };

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setState(prev => ({ ...prev, ...pendingUpdates.current }));
      pendingUpdates.current = {};
    }, 0);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [state, batchUpdate];
}
