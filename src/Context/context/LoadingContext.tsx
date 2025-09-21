'use client';

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react';

type LoadingContextValue = {
  loading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
};

const LoadingContext = createContext<LoadingContextValue | undefined>(undefined);

type LoadingProviderProps = { children: ReactNode };

export const LoadingProvider = ({ children }: LoadingProviderProps) => {
  // Start false so links aren’t disabled on first paint
  const [loading, setLoading] = useState(false);

  // Stable value; prevents unnecessary renders
  const value = useMemo<LoadingContextValue>(
    () => ({ loading, setIsLoading: setLoading }),
    [loading]
  );

  return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>;
};

export const useLoading = (): LoadingContextValue => {
  const ctx = useContext(LoadingContext);
  if (!ctx) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return ctx;
};