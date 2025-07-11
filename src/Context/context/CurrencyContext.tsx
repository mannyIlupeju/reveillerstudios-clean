// CurrencyContext.tsx
'use client';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface Currency {
  code: 'USD' | 'CAD';
  symbol: '$' | 'CA$';
}

interface CurrencyContextType {
  currency: Currency;
  setCurrency: React.Dispatch<React.SetStateAction<Currency>>;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrency] = useState<Currency>({ code: 'USD', symbol: '$' });

  useEffect(() => {
    async function detect() {
      try {
        const res = await fetch('/api/detectCountry');
        const data = await res.json();
        if (data.country === 'CA') {
          setCurrency({ code: 'CAD', symbol: 'CA$' });
        } else {
          setCurrency({ code: 'USD', symbol: '$' });
        }
      } catch (_) {
        setCurrency({ code: 'USD', symbol: '$' });
      }
    }
    detect();
  }, []);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('useCurrency must be used within a CurrencyProvider');
  return context;
};
