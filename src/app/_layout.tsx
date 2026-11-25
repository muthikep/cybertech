import '@/global.css';

import { ClerkProvider, useAuth } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, type ReactNode } from 'react';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { MissingEnvScreen } from '@/components/MissingEnvScreen';
import { getMissingEnvVars } from '@/lib/env';

SplashScreen.preventAutoHideAsync().catch(() => {});

function SplashGate({ children }: { children: ReactNode }) {
  const { isLoaded } = useAuth();

  useEffect(() => {
    if (isLoaded) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [isLoaded]);

  if (!isLoaded) {
    return null;
  }

  return <>{children}</>;
}

export default function RootLayout() {
  const missingEnvVars = getMissingEnvVars();

  useEffect(() => {
    if (missingEnvVars.length > 0) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [missingEnvVars.length]);

  if (missingEnvVars.length > 0) {
    return (
      <ErrorBoundary>
        <MissingEnvScreen missing={missingEnvVars} />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <ClerkProvider
        publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
        tokenCache={tokenCache}>
        <SplashGate>
          <Slot />
        </SplashGate>
      </ClerkProvider>
    </ErrorBoundary>
  );
}
