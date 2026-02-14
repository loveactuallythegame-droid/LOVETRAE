/**
 * Asset management utility for Love Arcade app
 * Maps to public/appdocs folder structure as specified in Design Bible
 */

export const ASSETS = {
  // Dr. Marcie Animations (from public/animations/)
  animations: {
    idle: require('../../assets/animations/marcie-idle.webm'),
    correct: require('../../assets/animations/marcie-correct.webm'),
    detective: require('../../assets/animations/marcie-detective.webm'),
    healing: require('../../assets/animations/marcie-healing-intro.webm'),
    impatient: require('../../assets/animations/marcie-impatient.webm'),
    intro: require('../../assets/animations/marcie-intro.webm'),
    jeopardy: require('../../assets/animations/marcie-jeopardy.webm'),
    laugh: require('../../assets/animations/marcie-laugh.webm'),
    listening: require('../../assets/animations/marcie-listening.webm'),
    roast: require('../../assets/animations/marcie-roast-delivery.webm'),
    roastAlt: require('../../assets/animations/marcie-roast-delivery-alternative.webm'),
    shocked: require('../../assets/animations/marcie-shocked.webm'),
    shrug: require('../../assets/animations/marcie-shrug.webm'),
    sos: require('../../assets/animations/marcie-sos-intro.webm'),
    thinking: require('../../assets/animations/marcie-thinking.webm'),
    waiting: require('../../assets/animations/marcie-waiting.webm'),
    warning: require('../../assets/animations/marcie-warning.webm'),
    wrong: require('../../assets/animations/marcie-wrong.webm'),
  },

  // Dr. Marcie Images (from public/marcieimages/)
  marcieImages: {
    avatar1: require('../../assets/marcieimages/marcieimage1.png'),
    avatar2: require('../../assets/marcieimages/marcieimage2.png'),
    avatar3: require('../../assets/marcieimages/marcieimage3.png'),
    avatar4: require('../../assets/marcieimages/marcieimage4.png'),
    avatar5: require('../../assets/marcieimages/marcieimage5.png'),
    avatar10: require('../../assets/marcieimages/marcieimage10.png'),
    avatar11: require('../../assets/marcieimages/marcieimage11.png'),
    avatar12: require('../../assets/marcieimages/marcieimage12.png'),
    avatar13: require('../../assets/marcieimages/marcieimage13.png'),
    avatar14: require('../../assets/marcieimages/marcieimage14.png'),
    avatar15: require('../../assets/marcieimage15.png'),
    avatar16: require('../../assets/marcieimages/marcieimage16.png'),
    avatar17: require('../../assets/marcieimages/marcieimage17.png'),
    avatar18: require('../../assets/marcieimages/marcieimage18.png'),
    avatar19: require('../../assets/marcieimages/marcieimage19.png'),
    avatar20: require('../../assets/marcieimages/marcieimage20.png'),
    avatar21: require('../../assets/marcieimages/marcieimage21.png'),
    avatar22: require('../../assets/marcieimages/marcieimage22.png'),
    avatar23: require('../../assets/marcieimages/marcieimage23.png'),
    avatar24: require('../../assets/marcieimages/marcieimage24.png'),
    avatar25: require('../../assets/marcieimages/marcieimage25.png'),
    avatar26: require('../../assets/marcieimages/marcieimage26.png'),
    avatar27: require('../../assets/marcieimages/marcieimage27.png'),
    avatar28: require('../../assets/marcieimages/marcieimage28.png'),
    avatar29: require('../../assets/marcieimages/marcieimage29.png'),
    avatar30: require('../../assets/marcieimages/marcieimage30.png'),
    avatar31: require('../../assets/marcieimages/marcieimage31.png'),
    avatar32: require('../../assets/marcieimages/marcieimage32.png'),
    avatar33: require('../../assets/marcieimages/marcieimage33.png'),
    avatar34: require('../../assets/marcieimages/marcieimage34.png'),
    avatar35: require('../../assets/marcieimages/marcieimage35.png'),
    avatar36: require('../../assets/marcieimages/marcieimage36.png'),
    avatar37: require('../../assets/marcieimages/marcieimage37.png'),
    avatar38: require('../../assets/marcieimages/marcieimage38.png'),
    avatar39: require('../../assets/marcieimages/marcieimage39.png'),
    avatar40: require('../../assets/marcieimages/marcieimage40.png'),
    avatar41: require('../../assets/marcieimages/marcieimage41.png'),
    avatar42: require('../../assets/marcieimages/marcieimage42.png'),
    avatar43: require('../../assets/marcieimages/marcieimage43.png'),
    avatar44: require('../../assets/marcieimages/marcieimage44.png'),
    avatar45: require('../../assets/marcieimages/marcieimage45.png'),
    avatar46: require('../../assets/marcieimages/marcieimage46.png'),
    avatar47: require('../../assets/marcieimages/marcieimage47.png'),
    avatar48: require('../../assets/marcieimages/marcieimage48.png'),
    avatar49: require('../../assets/marcieimages/marcieimage49.png'),
    avatar50: require('../../assets/marcieimages/marcieimage50.png'),
  },

  // App Logos (from public/logo/)
  logos: {
    logo1: require('../../assets/logo/logo1.png'),
    logo2: require('../../assets/logo/logo2.png'),
    logo3: require('../../assets/logo/logo3.png'),
    logo4: require('../../assets/logo/logo4.png'),
    logo5: require('../../assets/logo/logo5.png'),
    logo7: require('../../assets/logo/logo7.png'),
    logo8: require('../../assets/logo/logo8.png'),
    logo9: require('../../assets/logo/logo9.png'),
    logo10: require('../../assets/logo/logo10.png'),
    logo11: require('../../assets/logo/logo11.png'),
    logo12: require('../../assets/logo/logo12.png'),
    logo13: require('../../assets/logo/logo13.png'),
    mainLogo: require('../../assets/logo/mainlogo.png'),
    mainLogoOne: require('../../assets/logo/mainlogoone.png'),
  },

  // Fonts (from public/fonts/)
  fonts: {
    barbie: require('../../assets/fonts/barbie.ttf'),
    cheese: require('../../assets/fonts/cheese.ttf'),
    cute: require('../../assets/fonts/cute.ttf'),
    holiday: require('../../assets/fonts/holiday.ttf'),
    nietha: require('../../assets/fonts/nietha.ttf'),
    pink: require('../../assets/fonts/pink.ttf'),
    smile: require('../../assets/fonts/smile.ttf'),
    sweet: require('../../assets/fonts/sweet.ttf'),
    wonderful: require('../../assets/fonts/wonderful.ttf'),
  },

  // Default avatar for games
  defaultAvatar: require('../../assets/marcieimages/marcieimage1.png'),
};

/**
 * Get appropriate Dr. Marcie animation based on game context
 */
export const getMarcieAnimation = (context: string) => {
  switch (context) {
    case 'idle':
      return ASSETS.animations.idle;
    case 'correct':
      return ASSETS.animations.correct;
    case 'detective':
      return ASSETS.animations.detective;
    case 'healing':
      return ASSETS.animations.healing;
    case 'impatient':
      return ASSETS.animations.impatient;
    case 'intro':
      return ASSETS.animations.intro;
    case 'jeopardy':
      return ASSETS.animations.jeopardy;
    case 'laugh':
      return ASSETS.animations.laugh;
    case 'listening':
      return ASSETS.animations.listening;
    case 'roast':
      return ASSETS.animations.roast;
    case 'shocked':
      return ASSETS.animations.shocked;
    case 'shrug':
      return ASSETS.animations.shrug;
    case 'sos':
      return ASSETS.animations.sos;
    case 'thinking':
      return ASSETS.animations.thinking;
    case 'waiting':
      return ASSETS.animations.waiting;
    case 'warning':
      return ASSETS.animations.warning;
    case 'wrong':
      return ASSETS.animations.wrong;
    default:
      return ASSETS.animations.idle;
  }
};

/**
 * Get appropriate Dr. Marcie image based on personality level
 */
export const getMarcieImage = (personalityLevel: number = 1) => {
  const imageMap = {
    1: ASSETS.marcieImages.avatar1, // Tutorial/Gentle
    2: ASSETS.marcieImages.avatar15, // Normal/Clinical
    3: ASSETS.marcieImages.avatar25, // Hard/Poetic
    4: ASSETS.marcieImages.avatar35, // Arcade/Dynamic
  };
  
  return imageMap[personalityLevel] || ASSETS.marcieImages.avatar1;
};

export default ASSETS;