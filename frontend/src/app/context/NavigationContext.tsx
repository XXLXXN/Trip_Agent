"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

type NavigationDirection = 'forward' | 'backward';

interface NavigationContextType {
  direction: NavigationDirection;
  push: (path: string, direction?: NavigationDirection) => void;
  back: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [direction, setDirection] = useState<NavigationDirection>('forward');
  const router = useRouter();

  const push = useCallback((path: string, dir: NavigationDirection = 'forward') => {
    setDirection(dir);
    router.push(path);
  }, [router]);

  const back = useCallback(() => {
    setDirection('backward');
    router.back();
  }, [router]);

  return (
    <NavigationContext.Provider value={{ direction, push, back }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
}

