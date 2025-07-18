'use client'


import { ReactNode } from 'react';

import { LoadingProvider } from '../../Context/context/LoadingContext';
import { CanvasProvider } from '../../Context/context/CanvasContext';
import { GlobalProvider } from '../../Context/GlobalContext';
import {Provider} from 'react-redux'
import { store, persistor } from '../../../store/store';
import { PersistGate } from 'redux-persist/integration/react';
import { CurrencyProvider } from '../../Context/context/CurrencyContext';
import Image from 'next/image'





export default function AppProviders({ children }: { children: ReactNode }) {

  
  // You need to get loading from context or props. For demo, let's assume loading is false.
  const loading = false; // Replace with your actual loading state

  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <section className="flex justify-center mt-20 items-center">
            <Image
              src="/images/footerlogo.png"
              alt="Loading artwork of Reveillerstudios logo"
              width={800}
              height={800}
            />
          </section>
        }
        persistor={persistor}
      >
        <CurrencyProvider>
          <GlobalProvider>
            <LoadingProvider>
              <CanvasProvider> 
                    {children}
              </CanvasProvider>
            </LoadingProvider>
          </GlobalProvider>
        </CurrencyProvider>
      </PersistGate>
    </Provider>
  );
}