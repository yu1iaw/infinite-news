import { ResetFiltersContextProvider } from '@/contexts/reset-filters-provider';
import { manageStorage } from '@/lib/utils';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as Crypto from 'expo-crypto';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { MenuProvider } from 'react-native-popup-menu';
import 'react-native-reanimated';

const client = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      gcTime: 12 * 60 * 60 * 1000,
    }
  }
});

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';



export default function RootLayout() {

  useEffect(() => {
    (async () => {
      if (!(await manageStorage.get('userUUID'))) {
        await manageStorage.set('userUUID', Crypto.randomUUID());
      }
    })()
  }, [])

  return (
    <QueryClientProvider client={client}>
      <MenuProvider>
        <ResetFiltersContextProvider>
          <RootLayoutNav />
        </ResetFiltersContextProvider>
      </MenuProvider>
    </QueryClientProvider>
  )
}

function RootLayoutNav() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="news" options={{ headerShown: false }} />
    </Stack>
  );
}
