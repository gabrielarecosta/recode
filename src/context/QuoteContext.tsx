'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface QuoteState {
  projectType: string;
  customDesign: boolean;
  selectedModules: string[];
  urgency: string;
  currency: 'ARS' | 'USD';
}

interface QuoteContextProps {
  quote: QuoteState;
  setProjectType: (type: string) => void;
  setCustomDesign: (val: boolean) => void;
  setSelectedModules: (modules: string[]) => void;
  toggleModule: (modKey: string) => void;
  setUrgency: (urgency: string) => void;
  setCurrency: (currency: 'ARS' | 'USD') => void;
  clearQuote: () => void;
}

const LOCAL_STORAGE_KEY = 'recode_quote_selection';

const defaultState: QuoteState = {
  projectType: 'institucional',
  customDesign: true,
  selectedModules: [],
  urgency: 'urgencia_media',
  currency: 'ARS'
};

const QuoteContext = createContext<QuoteContextProps | undefined>(undefined);

export function QuoteProvider({ children }: { children: React.ReactNode }) {
  const [quote, setQuote] = useState<QuoteState>(defaultState);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        try {
          setQuote(JSON.parse(stored));
        } catch (e) {
          console.error('Error parsing stored quote state', e);
        }
      }
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(quote));
    }
  }, [quote, isLoaded]);

  const setProjectType = (projectType: string) => {
    setQuote(prev => ({ ...prev, projectType }));
  };

  const setCustomDesign = (customDesign: boolean) => {
    setQuote(prev => ({ ...prev, customDesign }));
  };

  const setSelectedModules = (selectedModules: string[]) => {
    setQuote(prev => ({ ...prev, selectedModules }));
  };

  const toggleModule = (modKey: string) => {
    setQuote(prev => {
      const exists = prev.selectedModules.includes(modKey);
      const newModules = exists
        ? prev.selectedModules.filter(m => m !== modKey)
        : [...prev.selectedModules, modKey];
      return { ...prev, selectedModules: newModules };
    });
  };

  const setUrgency = (urgency: string) => {
    setQuote(prev => ({ ...prev, urgency }));
  };

  const setCurrency = (currency: 'ARS' | 'USD') => {
    setQuote(prev => ({ ...prev, currency }));
  };

  const clearQuote = () => {
    setQuote(defaultState);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  };

  return (
    <QuoteContext.Provider
      value={{
        quote,
        setProjectType,
        setCustomDesign,
        setSelectedModules,
        toggleModule,
        setUrgency,
        setCurrency,
        clearQuote
      }}
    >
      {children}
    </QuoteContext.Provider>
  );
}

export function useQuote() {
  const context = useContext(QuoteContext);
  if (!context) {
    throw new Error('useQuote must be used within a QuoteProvider');
  }
  return context;
}
