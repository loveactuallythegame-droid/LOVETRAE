import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import { initAppAssets, preloadAssets } from './src/lib/asset-loader';
import { INTRO_VIDEO, CRITICAL_LOGOS, LAZY_LOGOS, CRITICAL_AVATAR_FRAMES, LAZY_AVATAR_FRAMES, FONT_SOURCES } from './src/constants/assetManifest';
import OnboardingNavigator from './src/screens/auth/OnboardingNavigator';
import * as Sentry from '@sentry/react-native';
import FeedbackFab from './src/components/feedback/FeedbackFab';
import { useAppStore } from './src/state/store';

import { ENV } from './src/lib/env';

export default function App() {
  const isBeta = useAppStore((s) => s.isBeta);

  useEffect(() => {
    // 1. Load Critical Assets & Hide Splash
    initAppAssets({
      video: INTRO_VIDEO,
      logos: CRITICAL_LOGOS,
      avatars: CRITICAL_AVATAR_FRAMES,
      fonts: FONT_SOURCES,
    }).then(() => {
      // 2. Lazy Load the Rest
      setTimeout(() => {
        preloadAssets({
          logos: LAZY_LOGOS,
          avatars: LAZY_AVATAR_FRAMES,
        });
      }, 200);
    });

    const dsn = ENV.SENTRY_DSN;
    if (dsn) {
      Sentry.init({ dsn, tracesSampleRate: 0.3 });
    }
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="light" />
      <OnboardingNavigator />
      {isBeta && <FeedbackFab />}
    </View>
  );
}
