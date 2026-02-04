import { Platform, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Mobile-first responsive design
const guidelineBaseWidth = 375; // iPhone 12 width
const guidelineBaseHeight = 812; // iPhone 12 height

const scale = (size: number) => (width / guidelineBaseWidth) * size;
const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

// Color palette based on the design requirements
export const COLORS = {
  // Primary gradient colors
  primaryGradientStart: '#db147c',  // Pink
  primaryGradientEnd: '#f05d68',    // Orange-red
  
  // Profile/avatar ring gradient
  profileRingStart: '#fcc738',      // Yellow
  profileRingMid: '#ea031f',        // Red
  profileRingEnd: '#c60ab3',        // Purple
  
  // Inner circle/line gradient
  innerLineStart: '#ef1b6e',        // Pink
  innerLineMid1: '#c41e77',         // Purple-pink
  innerLineMid2: '#a22ac4',         // Purple
  innerLineEnd: '#9056ef',          // Blue-purple
  
  // Accent colors
  accentPink: '#FC0C84',
  accentOrange: '#ff7600',
  accentYellow: '#ffef1f',
  accentTeal: '#37cf97',
  accentViolet: '#b37dec',
  accentRose: '#e16ba9',
  
  // UI colors
  background: '#0f0a0c',
  surface: '#1a0a1f',
  darkSurface: '#1a0a1f',
  card: 'rgba(26, 10, 31, 0.8)',
  textPrimary: '#ffffff',
  textSecondary: 'rgba(255, 255, 255, 0.6)',
  textHint: 'rgba(255, 255, 255, 0.4)',
  border: 'rgba(255, 255, 255, 0.1)',
  focusOutline: '#fc0c84',
  
  // Status colors
  success: '#33DEA5',
  warning: '#E11637',
  error: '#E11637',
  info: '#22d3ee',
  
  // Game category colors
  emotionalConnection: '#FA1F63',
  conflictResolution: '#33DEA5',
  creativeChaos: '#E4E831',
  romanceHub: '#BE1980',
  healingHospital: '#5C1459',
  gameShow: '#22d3ee',
  loveArcade: '#FF6B6B',
};

// Typography scaled for mobile
export const TYPOGRAPHY = {
  header: {
    fontSize: moderateScale(24),
    lineHeight: moderateScale(28),
    fontWeight: 'bold' as const,
  },
  title: {
    fontSize: moderateScale(20),
    lineHeight: moderateScale(24),
    fontWeight: '600' as const,
  },
  body: {
    fontSize: moderateScale(16),
    lineHeight: moderateScale(22),
    fontWeight: 'normal' as const,
  },
  caption: {
    fontSize: moderateScale(14),
    lineHeight: moderateScale(18),
    fontWeight: 'normal' as const,
  },
  small: {
    fontSize: moderateScale(12),
    lineHeight: moderateScale(16),
    fontWeight: 'normal' as const,
  },
  keyword: {
    fontSize: moderateScale(10),
    lineHeight: moderateScale(12),
    fontWeight: 'bold' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
  },
  sass: {
    fontSize: moderateScale(18),
    lineHeight: moderateScale(24),
    fontWeight: '500' as const,
    fontStyle: 'italic' as const,
  },
};

// Spacing system scaled for mobile
export const SPACING = {
  xs: scale(4),
  sm: scale(8),
  md: scale(12),
  lg: scale(16),
  xl: scale(24),
  xxl: scale(32),
};

// Component sizes optimized for mobile
export const SIZES = {
  buttonHeight: moderateScale(50),
  buttonBorderRadius: moderateScale(12),
  inputHeight: moderateScale(56),
  borderRadius: moderateScale(8),
  cardPadding: moderateScale(16),
  iconSize: moderateScale(24),
  avatarSize: moderateScale(64),
  largeAvatarSize: moderateScale(120),
};

// Shadow styles optimized for mobile
export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: Platform.OS === 'android' ? 2 : 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: Platform.OS === 'android' ? 4 : 2,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: Platform.OS === 'android' ? 8 : 4,
    },
    shadowOpacity: 0.45,
    shadowRadius: 12.84,
    elevation: 16,
  },
};

// Responsive helpers
export const RESPONSIVE = {
  isSmallDevice: width < 375,
  isLargeDevice: width > 414,
  screenWidth: width,
  screenHeight: height,
  scale,
  verticalScale,
  moderateScale,
};

// Safe area offsets for mobile
export const SAFE_AREA = {
  top: Platform.OS === 'ios' ? 44 : 24,
  bottom: Platform.OS === 'ios' ? 34 : 16,
  left: 0,
  right: 0,
};

// Animation presets for mobile
export const ANIMATIONS = {
  fast: 200,
  normal: 300,
  slow: 500,
  spring: {
    tension: 120,
    friction: 8,
  },
};

export default {
  COLORS,
  TYPOGRAPHY,
  SPACING,
  SIZES,
  SHADOWS,
  RESPONSIVE,
  SAFE_AREA,
  ANIMATIONS,
};