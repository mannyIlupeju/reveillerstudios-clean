'use client'

import { ReactNode } from 'react';

import { LoadingProvider } from '../../Context/context/LoadingContext';
import { CanvasProvider } from '../../Context/context/CanvasContext';
import { GlobalProvider } from '../../Context/GlobalContext';
import { Provider } from 'react-redux';
import { store } from '../../../store/store';
import { CurrencyProvider } from '../../Context/context/CurrencyContext';
import { FoldersProvider } from '../../Context/context/FoldersContext';

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <CurrencyProvider>
        <FoldersProvider>
          <GlobalProvider>
            <LoadingProvider>
              <CanvasProvider>
                {children}
              </CanvasProvider>
            </LoadingProvider>
          </GlobalProvider>
        </FoldersProvider>
      </CurrencyProvider>
    </Provider>
  );
}