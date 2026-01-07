import React, { Suspense } from 'react';
import { View, ActivityIndicator, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SOSButton from '../../components/sos/SOSButton';
import PreviewOverlay from '../../components/preview/PreviewOverlay';
import { MarcieOverlay } from '../../components/ai-host';
import FeedbackFab from '../../components/feedback/FeedbackFab';
import { navigationRef, navigate, getCurrentState } from '../../lib/navigation';
import { useAppStore } from '../../state/store';
import ErrorBoundary from '../../components/ErrorBoundary';
import Provider from '../../state/Provider';

const SplashScreenLazy = React.lazy(() => import('./SplashScreen'));
const OriginStoryScreenLazy = React.lazy(() => import('./OriginStoryScreen'));
const CoupleCodeScreenLazy = React.lazy(() => import('./CoupleCodeScreen'));
const PartnerEntryScreenLazy = React.lazy(() => import('./PartnerEntryScreen'));
const LegalDisclaimerScreenLazy = React.lazy(() => import('./LegalDisclaimerScreen'));
const SignInScreenLazy = React.lazy(() => import('./SignInScreen'));
const PasswordResetScreenLazy = React.lazy(() => import('./PasswordResetScreen'));
const BoothsScreenLazy = React.lazy(() => import('../sos/BoothsScreen'));
const CoolDownRoomLazy = React.lazy(() => import('../sos/CoolDownRoom'));
const VerdictScreenLazy = React.lazy(() => import('../sos/VerdictScreen'));
const DashboardHomeLazy = React.lazy(() => import('../dashboard/DashboardHome'));
const PartnerTranslatorLazy = React.lazy(() => import('../dashboard/PartnerTranslator'));
const ProfileScreenLazy = React.lazy(() => import('../dashboard/ProfileScreen'));
const PartnerDashboardLazy = React.lazy(() => import('../dashboard/PartnerDashboard'));
const SettingsScreenLazy = React.lazy(() => import('../dashboard/SettingsScreen'));
const SupportScreenLazy = React.lazy(() => import('../support/SupportScreen'));
const GameLibraryScreenLazy = React.lazy(() => import('../games/GameLibraryScreen'));
const ChallengeScreenLazy = React.lazy(() => import('../games/ChallengeScreen'));
const ResultsRoastLazy = React.lazy(() => import('../games/ResultsRoastScreen'));
const TruthOrTrustLazy = React.lazy(() => import('../games/TruthOrTrust'));
const ApologyAuctionLazy = React.lazy(() => import('../games/ApologyAuction'));
const GratitudeCloudLazy = React.lazy(() => import('../games/GratitudeCloud'));
const EyeContactChallengeLazy = React.lazy(() => import('../games/EyeContactChallenge'));
const MemoryLaneMapLazy = React.lazy(() => import('../games/MemoryLaneMap'));
const SlapOfTruthLazy = React.lazy(() => import('../games/SlapOfTruth'));
const DefensivenessDetoxLazy = React.lazy(() => import('../games/DefensivenessDetox'));
const WhosRightLazy = React.lazy(() => import('../games/WhosRight'));
const StressTestLazy = React.lazy(() => import('../games/StressTest'));
const RoleSwapRoastLazy = React.lazy(() => import('../games/RoleSwapRoast'));
const WindowsAndWallsLazy = React.lazy(() => import('../games/WindowsAndWalls'));
const TriggerTriageLazy = React.lazy(() => import('../games/TriggerTriage'));
const TrustBankLazy = React.lazy(() => import('../games/TrustBank'));
const TheIcebergLazy = React.lazy(() => import('../games/TheIceberg'));
const SecrecyAuditLazy = React.lazy(() => import('../games/SecrecyAudit'));


type RootStackParamList = {
  Splash: undefined;
  OriginStory: undefined;
  CoupleCode: undefined;
  PartnerEntry: undefined;
  LegalDisclaimer: undefined;
  AuthSignIn: undefined;
  AuthReset: undefined;
  SOSBooths: undefined;
  SOSCoolDown: { fightId: string };
  SOSVerdict: { fightId: string; timeout?: boolean };
  Dashboard: undefined;
  PartnerTranslator: undefined;
  Profile: undefined;
  PartnerDashboard: undefined;
  Settings: undefined;
  Support: undefined;
  GameLibrary: undefined;
  ChallengeScreen: { title: string; duration?: number; type?: string };
  ResultsRoast: { result: any; verdict?: any };
  PlayTruthOrTrust: { gameId: string };
  PlayApologyAuction: { gameId: string };
  PlayGratitudeCloud: { gameId: string };
  PlayEyeContactChallenge: { gameId: string };
  PlayMemoryLaneMap: { gameId: string };
  PlaySlapOfTruth: { gameId: string };
  PlayDefensivenessDetox: { gameId: string };
  PlayWhosRight: { gameId: string };
  PlayStressTest: { gameId: string };
  PlayRoleSwapRoast: { gameId: string };
  PlayWindowsAndWalls: { gameId: string };
  PlayTriggerTriage: { gameId: string };
  PlayTrustBank: { gameId: string };
  PlayTheIceberg: { gameId: string };
  PlaySecrecyAudit: { gameId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function Loader() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator />
    </View>
  );
}

const linking = {
  prefixes: [Linking.createURL('/')],
  config: {
    screens: {
      ChallengeScreen: 'challenge/:title',
      PartnerTranslator: 'translator',
    }
  }
};

export default function OnboardingNavigator() {
  return (
    <ErrorBoundary>
      <Provider>
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }} initialRouteName="Splash">
            <Stack.Screen name="Splash" component={Splash} />
            <Stack.Screen name="OriginStory" component={Origin} options={{ animation: 'slide_from_bottom' }} />
            <Stack.Screen name="CoupleCode" component={CoupleCode} options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="PartnerEntry" component={PartnerEntry} options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="LegalDisclaimer" component={LegalDisclaimer} />
            <Stack.Screen name="AuthSignIn" component={AuthSignIn} />
            <Stack.Screen name="AuthReset" component={AuthReset} />
            <Stack.Screen name="SOSBooths" component={Booths} options={{ animation: 'none' }} />
            <Stack.Screen name="SOSCoolDown" component={CoolDown} options={{ animation: 'none' }} />
            <Stack.Screen name="SOSVerdict" component={Verdict} options={{ animation: 'fade' }} />
            <Stack.Screen name="Dashboard" component={Dashboard} />
            <Stack.Screen name="PartnerTranslator" component={PartnerTranslator} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="PartnerDashboard" component={PartnerDashboard} />
          <Stack.Screen name="Settings" component={Settings} />
          <Stack.Screen name="Support" component={Support} />
            <Stack.Screen name="GameLibrary" component={GameLibrary} />
            <Stack.Screen name="ChallengeScreen" component={ChallengeScreen} />
            <Stack.Screen name="ResultsRoast" component={ResultsRoast} />
            <Stack.Screen name="PlayTruthOrTrust" component={TruthOrTrustScreen} />
            <Stack.Screen name="PlayApologyAuction" component={ApologyAuctionScreen} />
            <Stack.Screen name="PlayGratitudeCloud" component={GratitudeCloudScreen} />
            <Stack.Screen name="PlayEyeContactChallenge" component={EyeContactChallengeScreen} />
            <Stack.Screen name="PlayMemoryLaneMap" component={MemoryLaneMapScreen} />
            <Stack.Screen name="PlaySlapOfTruth" component={SlapOfTruthScreen} />
            <Stack.Screen name="PlayDefensivenessDetox" component={DefensivenessDetoxScreen} />
            <Stack.Screen name="PlayWhosRight" component={WhosRightScreen} />
            <Stack.Screen name="PlayStressTest" component={StressTestScreen} />
            <Stack.Screen name="PlayRoleSwapRoast" component={RoleSwapRoastScreen} />
          <Stack.Screen name="PlayWindowsAndWalls" component={WindowsAndWallsScreen} />
          <Stack.Screen name="PlayTriggerTriage" component={TriggerTriageScreen} />
          <Stack.Screen name="PlayTrustBank" component={TrustBankScreen} />
          <Stack.Screen name="PlayTheIceberg" component={TheIcebergScreen} />
          <Stack.Screen name="PlaySecrecyAudit" component={SecrecyAuditScreen} />
          </Stack.Navigator>
          <SOSButton onPress={() => navigate('SOSBooths')} />
          <FeedbackFab />
          <PreviewOverlay />
          {Platform.OS !== 'web' && <MarcieOverlay visible={true} />}
        </NavigationContainer>
      </Provider>
    </ErrorBoundary>
  );
}

function Splash({ navigation }: any) {
  return (
    <Suspense fallback={<Loader />}>
      <SplashScreenLazy onStart={() => navigation.replace('OriginStory')} onLogin={() => navigation.navigate('AuthSignIn')} />
    </Suspense>
  );
}

function Origin({ navigation }: any) {
  return (
    <Suspense fallback={<Loader />}>
      <OriginStoryScreenLazy onComplete={() => navigation.replace('CoupleCode')} />
    </Suspense>
  );
}

function CoupleCode({ navigation }: any) {
  return (
    <Suspense fallback={<Loader />}>
      <CoupleCodeScreenLazy onNext={() => navigation.replace('PartnerEntry')} />
    </Suspense>
  );
}

function AuthSignIn({ navigation }: any) {
  return (
    <Suspense fallback={<Loader />}>
      <SignInScreenLazy onAuthenticated={() => navigation.replace('LegalDisclaimer')} onForgot={() => navigation.navigate('AuthReset')} />
    </Suspense>
  );
}

function AuthReset({ navigation }: any) {
  return (
    <Suspense fallback={<Loader />}>
      <PasswordResetScreenLazy onSent={() => navigation.goBack()} />
    </Suspense>
  );
}

function PartnerEntry({ navigation }: any) {
  return (
    <Suspense fallback={<Loader />}>
      <PartnerEntryScreenLazy onLinked={() => navigation.replace('LegalDisclaimer')} />
    </Suspense>
  );
}
function LegalDisclaimer({ navigation }: any) {
  return (
    <Suspense fallback={<Loader />}>
      <LegalDisclaimerScreenLazy onContinue={() => navigation.replace('Dashboard')} />
    </Suspense>
  );
}

function Booths(props: any) {
  return (
    <Suspense fallback={<Loader />}>
      <BoothsScreenLazy {...props} />
    </Suspense>
  );
}

function CoolDown(props: any) {
  return (
    <Suspense fallback={<Loader />}>
      <CoolDownRoomLazy {...props} />
    </Suspense>
  );
}

function Verdict(props: any) {
  return (
    <Suspense fallback={<Loader />}>
      <VerdictScreenLazy {...props} />
    </Suspense>
  );
}

function Dashboard(props: any) {
  return (
    <Suspense fallback={<Loader />}>
      <DashboardHomeLazy {...props} />
    </Suspense>
  );
}

function PartnerTranslator(props: any) {
  return (
    <Suspense fallback={<Loader />}>
      <PartnerTranslatorLazy {...props} />
    </Suspense>
  );
}

function Profile(props: any) {
  return (
    <Suspense fallback={<Loader />}>
      <ProfileScreenLazy {...props} />
    </Suspense>
  );
}

function PartnerDashboard(props: any) {
  return (
    <Suspense fallback={<Loader />}>
      <PartnerDashboardLazy {...props} />
    </Suspense>
  );
}

function Settings(props: any) {
  return (
    <Suspense fallback={<Loader />}>
      <SettingsScreenLazy {...props} />
    </Suspense>
  );
}

function Support(props: any) {
  return (
    <Suspense fallback={<Loader />}>
      <SupportScreenLazy {...props} />
    </Suspense>
  );
}

function GameLibrary(props: any) {
  return (
    <Suspense fallback={<Loader />}>
      <GameLibraryScreenLazy {...props} />
    </Suspense>
  );
}

function ChallengeScreen(props: any) {
  return (
    <Suspense fallback={<Loader />}>
      <ChallengeScreenLazy {...props} />
    </Suspense>
  );
}

function ResultsRoast(props: any) {
  return (
    <Suspense fallback={<Loader />}>
      <ResultsRoastLazy {...props} />
    </Suspense>
  );
}

function WindowsAndWallsScreen(props: any) {
  return (
    <Suspense fallback={<Loader />}>
      <WindowsAndWallsLazy {...props} />
    </Suspense>
  );
}

function TriggerTriageScreen(props: any) {
  return (
    <Suspense fallback={<Loader />}>
      <TriggerTriageLazy {...props} />
    </Suspense>
  );
}

function TrustBankScreen(props: any) {
  return (
    <Suspense fallback={<Loader />}>
      <TrustBankLazy {...props} />
    </Suspense>
  );
}

function TheIcebergScreen(props: any) {
  return (
    <Suspense fallback={<Loader />}>
      <TheIcebergLazy {...props} />
    </Suspense>
  );
}

function SecrecyAuditScreen(props: any) {
  return (
    <Suspense fallback={<Loader />}>
      <SecrecyAuditLazy {...props} />
    </Suspense>
  );
}

function TruthOrTrustScreen(props: any) {
  return (
    <Suspense fallback={<Loader />}>
      <TruthOrTrustLazy {...props} />
    </Suspense>
  );
}

function ApologyAuctionScreen(props: any) {
  return (
    <Suspense fallback={<Loader />}>
      <ApologyAuctionLazy {...props} />
    </Suspense>
  );
}

function GratitudeCloudScreen(props: any) {
  return (
    <Suspense fallback={<Loader />}>
      <GratitudeCloudLazy {...props} />
    </Suspense>
  );
}

function EyeContactChallengeScreen(props: any) {
  return (
    <Suspense fallback={<Loader />}>
      <EyeContactChallengeLazy {...props} />
    </Suspense>
  );
}

function MemoryLaneMapScreen(props: any) {
  return (
    <Suspense fallback={<Loader />}>
      <MemoryLaneMapLazy {...props} />
    </Suspense>
  );
}

function SlapOfTruthScreen(props: any) {
  return (
    <Suspense fallback={<Loader />}>
      <SlapOfTruthLazy {...props} />
    </Suspense>
  );
}

function DefensivenessDetoxScreen(props: any) {
  return (
    <Suspense fallback={<Loader />}>
      <DefensivenessDetoxLazy {...props} />
    </Suspense>
  );
}

function WhosRightScreen(props: any) {
  return (
    <Suspense fallback={<Loader />}>
      <WhosRightLazy {...props} />
    </Suspense>
  );
}

function StressTestScreen(props: any) {
  return (
    <Suspense fallback={<Loader />}>
      <StressTestLazy {...props} />
    </Suspense>
  );
}

function RoleSwapRoastScreen(props: any) {
  return (
    <Suspense fallback={<Loader />}>
      <RoleSwapRoastLazy {...props} />
    </Suspense>
  );
}
