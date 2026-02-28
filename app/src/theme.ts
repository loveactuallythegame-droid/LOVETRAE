import { Platform, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Mobile-first responsive design
const guidelineBaseWidth = 375; // iPhone 12 width
const guidelineBaseHeight = 812; // iPhone 12 height

const scale = (size: number) => (width / guidelineBaseWidth) * size;
const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

// Cosmic Retro Arcade Color Palette
export const COLORS = {
  // Primary Button Gradient: #db147c → #f05d68 (Horizontal, 16px rounded)
  primaryGradientStart: '#DB147C',
  primaryGradientEnd: '#F05D68',
  
  // Avatar Outer Ring: #fcc738 → #ea031f → #c60ab3 (Circular, 60s rotation)
  avatarRingStart: '#FCC738',
  avatarRingMid: '#EA031F',
  avatarRingEnd: '#C60AB3',
  
  // Progress/XP Bars: #ef1b6e → #c41e77 → #a22ac4 → #9056ef
  progressGradientStart: '#EF1B6E',
  progressGradientMid1: '#C41E77',
  progressGradientMid2: '#A22AC4',
  progressGradientEnd: '#9056EF',
  
  // Arena Background: #1A0D2E to #3D1B5A (Vertical cosmic gradient)
  arenaBgStart: '#1A0D2E',
  arenaBgEnd: '#3D1B5A',
  
  // 10 Accent Colors (Emotional Vocabulary)
  vibrantPink: '#FC0C84',      // Love, intensity, emotional hits
  warmOrange: '#FF7600',       // Energy, excitement, playful alerts
  brightYellow: '#FFEF1F',     // Joy, achievement, victory moments
  mintGreen: '#37CF97',        // Growth, safety, healing, positivity
  softViolet: '#B37DEC',       // Connection depth, mystery, calm intimacy
  rosePink: '#E16BA9',         // Tenderness, romance, gentle moments
  blushPink: '#FF6B9D',        // Playfulness, lightheartedness, fun
  lavenderPurple: '#A16BF2',   // Reflection, depth, thoughtful moments
  aquaTeal: '#00D4AA',         // Clarity, insight, understanding
  peachOrange: '#FF9E3D',      // Warmth, comfort, nurturing
  
  // Background System (The Emotional Canvas)
  deepCosmicPurple: '#1A0B2E', // Primary background - emotional depth
  richPlum: '#2D1B45',         // Card backgrounds - focus areas
  midPurple: '#3D2A5C',        // Game backgrounds - playful energy
  nightSky: '#0F0A1F',         // Modal overlays - focus & intensity
  
  // UI Element Colors
  inputFieldBg: 'rgba(255, 255, 255, 0.05)',
  dividerLines: 'rgba(255, 255, 255, 0.08)',
  subtleBorders: 'rgba(255, 255, 255, 0.12)',
  focusRings: '#FC0C84',
  
  // Text Colors (The Emotional Voice)
  textPrimary: '#FFFFFF',                    // Primary text - clarity
  textSecondary: 'rgba(255, 255, 255, 0.7)', // Secondary text - guidance
  textHint: 'rgba(255, 255, 255, 0.4)',      // Hint text - subtlety
  textDisabled: 'rgba(255, 255, 255, 0.3)',  // Disabled text - restraint
  
  // Status Colors (Emotional Feedback)
  success: '#33DEA5',   // Growth, achievement, positive feedback
  warning: '#FFB800',   // Caution, attention, gentle alerts
  error: '#E11637',     // Urgency, mistakes, critical feedback
  info: '#22D3EE',      // Information, clarity, neutral feedback
  
  // Game Category Colors
  emotionalConnection: '#FA1F63',
  conflictResolution: '#33DEA5',
  creativeChaos: '#E4E831',
  romanceHub: '#BE1980',
  healingHospital: '#5C1459',
  gameShow: '#22D3EE',
  loveArcade: '#FF6B6B',
  
  // Cosmic Retro Arcade Specific
  neonGlow: 'rgba(219, 20, 124, 0.5)',
  cosmicGlow: 'rgba(252, 199, 56, 0.4)',
  retroShadow: 'rgba(240, 93, 104, 0.3)',
};

// Typography System (Inter Font Family)
export const TYPOGRAPHY = {
  // Font Families
  fontFamily: {
    black: 'Inter-Black',        // 900 weight for titles
    bold: 'Inter-Bold',          // 700 weight for emphasis
    semiBold: 'Inter-SemiBold',  // 600 weight for subtitles
    medium: 'Inter-Medium',      // 500 weight for buttons
    regular: 'Inter-Regular',    // 400 weight for body text
    light: 'Inter-Light',        // 300 weight for captions
  },
  
  // Font Sizes (Mobile-first responsive)
  fontSize: {
    // Display Sizes
    displayLarge: scale(32),     // 32px - Main titles
    displayMedium: scale(28),    // 28px - Section titles
    displaySmall: scale(24),     // 24px - Card titles
    
    // Header Sizes
    headerLarge: scale(20),      // 20px - Screen headers
    headerMedium: scale(18),     // 18px - Subheaders
    headerSmall: scale(16),      // 16px - Small headers
    
    // Body Sizes
    bodyLarge: scale(16),        // 16px - Primary body text
    bodyMedium: scale(14),       // 14px - Secondary body text
    bodySmall: scale(12),        // 12px - Caption text
    
    // Special Sizes
    button: scale(16),           // 16px - Button text
    input: scale(14),            // 14px - Input text
    label: scale(12),            // 12px - Label text
  },
  
  // Line Heights
  lineHeight: {
    tight: 1.2,      // For headers and display text
    normal: 1.4,     // For body text
    relaxed: 1.6,    // For long-form content
  },
  
  // Letter Spacing
  letterSpacing: {
    tight: -0.02,    // For display text
    normal: 0,       // For body text
    wide: 0.02,      // For captions and labels
  },
};

// Spacing System
export const SPACING = {
  // Base spacing unit (4px)
  unit: 4,
  
  // Micro spacing
  micro: 2,        // 2px
  tiny: 4,         // 4px
  small: 8,        // 8px
  medium: 12,      // 12px
  regular: 16,     // 16px
  large: 20,       // 20px
  xlarge: 24,      // 24px
  xxlarge: 32,     // 32px
  xxxlarge: 48,    // 48px
  
  // Component-specific spacing
  buttonPadding: 16,
  cardPadding: 20,
  screenPadding: 24,
  sectionPadding: 32,
  
  // Safe area spacing
  safeTop: 'env(safe-area-inset-top)',
  safeBottom: 'env(safe-area-inset-bottom)',
  safeLeft: 'env(safe-area-inset-left)',
  safeRight: 'env(safe-area-inset-right)',
};

// Border Radius System
export const BORDER_RADIUS = {
  // Button radius (16px for primary buttons)
  button: 16,
  card: 16,
  avatar: 9999, // Fully rounded
  
  // Standard radii
  small: 4,
  medium: 8,
  large: 12,
  xlarge: 20,
  round: 9999,
};

// Shadow System (Cosmic Glow Effects)
export const SHADOWS = {
  // Neon glow shadows
  neon: {
    shadowColor: COLORS.neonGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 8,
  },
  
  neonSoft: {
    shadowColor: COLORS.neonGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 6,
  },
  
  neonStrong: {
    shadowColor: COLORS.neonGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 30,
    elevation: 12,
  },
  
  // Cosmic glow effects
  cosmic: {
    shadowColor: COLORS.cosmicGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 10,
  },
  
  // Retro arcade shadows
  retro: {
    shadowColor: COLORS.retroShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  
  // Standard shadows
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

// Animation System
export const ANIMATIONS = {
  // Timing
  duration: {
    instant: 100,
    fast: 200,
    normal: 300,
    slow: 500,
    slower: 700,
  },
  
  // Easing curves
  easing: {
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    linear: 'linear',
  },
  
  // Preset animations
  fadeIn: {
    opacity: [0, 1],
    duration: 300,
    easing: 'ease-out',
  },
  
  slideUp: {
    transform: [{ translateY: 100 }, { translateY: 0 }],
    duration: 300,
    easing: 'ease-out',
  },
  
  scaleIn: {
    transform: [{ scale: 0.8 }, { scale: 1 }],
    duration: 200,
    easing: 'ease-out',
  },
  
  // Cosmic animations
  float: {
    transform: [{ translateY: 0 }, { translateY: -10 }, { translateY: 0 }],
    duration: 3000,
    easing: 'ease-in-out',
    iterations: -1, // Infinite
  },
  
  pulseNeon: {
    opacity: [0.6, 1, 0.6],
    duration: 2000,
    easing: 'ease-in-out',
    iterations: -1, // Infinite
  },
  
  liquidFill: {
    transform: [{ scaleY: 0 }, { scaleY: 0.5 }, { scaleY: 1 }],
    duration: 2000,
    easing: 'ease-in-out',
  },
};

// Component-specific styles
export const COMPONENTS = {
  // Primary Button Styles
  primaryButton: {
    backgroundColor: COLORS.primaryGradientStart,
    borderRadius: BORDER_RADIUS.button,
    paddingVertical: SPACING.regular,
    paddingHorizontal: SPACING.xlarge,
    shadowColor: COLORS.neonGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 8,
  },
  
  // Game Card Styles
  gameCard: {
    backgroundColor: 'rgba(45, 25, 80, 0.7)',
    borderRadius: BORDER_RADIUS.card,
    padding: SPACING.cardPadding,
    shadowColor: COLORS.cosmicGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 10,
  },
  
  // Global Header Styles
  globalHeader: {
    backgroundColor: 'rgba(26, 11, 46, 0.8)',
    backdropFilter: 'blur(16px)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(252, 199, 56, 0.2)',
  },
  
  // Marcie Host Styles
  marcieHost: {
    position: 'absolute',
    zIndex: 9999,
    shadowColor: COLORS.cosmicGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 30,
    elevation: 15,
  },
};

// Responsive breakpoints
export const BREAKPOINTS = {
  mobileSmall: 320,
  mobileMedium: 375,
  mobileLarge: 414,
  tablet: 768,
  desktop: 1024,
};

// Device-specific adjustments
export const DEVICE = {
  isSmallDevice: width < BREAKPOINTS.mobileMedium,
  isMediumDevice: width >= BREAKPOINTS.mobileMedium && width < BREAKPOINTS.mobileLarge,
  isLargeDevice: width >= BREAKPOINTS.mobileLarge,
  isTablet: width >= BREAKPOINTS.tablet,
  
  screenWidth: width,
  screenHeight: height,
  
  scale,
  verticalScale,
  moderateScale,
};

// Export the complete theme
export const THEME = {
  colors: COLORS,
  typography: TYPOGRAPHY,
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
  shadows: SHADOWS,
  animations: ANIMATIONS,
  components: COMPONENTS,
  breakpoints: BREAKPOINTS,
  device: DEVICE,
};

export default THEME;