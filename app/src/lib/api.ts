// API client for Love Actually backend
// NOTE: Since we're moving to Firebase, we'll implement direct Firebase calls
// but keeping this API wrapper for backward compatibility

import { auth, db } from './firebaseClient';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';

// User API
export const userApi = {
  create: async (data: { email: string; display_name: string }) => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const profileRef = doc(db, 'profiles', user.uid);
    const profileData = {
      userId: user.uid,
      email: data.email,
      display_name: data.display_name,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
      partner_id: null,
      couple_code: user.uid.substring(0, 8).toUpperCase(), // temporary code
      sarcasm_level: 1,
      trust_level: 0.5,
      vulnerability_level: 0.5,
      points: 0,
      plan: "free"
    };
    
    await setDoc(profileRef, profileData);
    return profileData;
  },
  
  get: async (userId: string) => {
    const profileRef = doc(db, 'profiles', userId);
    const profileSnap = await getDoc(profileRef);
    
    if (!profileSnap.exists()) {
      throw new Error('User not found');
    }
    
    return { id: userId, ...profileSnap.data() };
  },
  
  updateSarcasm: async (userId: string, level: number) => {
    if (level < 1 || level > 4) {
      throw new Error('Sarcasm level must be 1-4');
    }
    
    const profileRef = doc(db, 'profiles', userId);
    await updateDoc(profileRef, { 
      sarcasm_level: level,
      updated_at: serverTimestamp()
    });
    
    return { success: true, sarcasm_level: level };
  },
};

// Couple Linking API
export const coupleApi = {
  link: async (userId: string, partnerCode: string) => {
    // Implementation moved to the component since it's Firebase-specific
    throw new Error('Use the component function instead');
  },
  
  get: async (coupleId: string) => {
    const coupleRef = doc(db, 'couples', coupleId);
    const coupleSnap = await getDoc(coupleRef);
    
    if (!coupleSnap.exists()) {
      throw new Error('Couple not found');
    }
    
    return { id: coupleId, ...coupleSnap.data() };
  },
};

// Games API
export const gamesApi = {
  getCategories: async () => {
    // Return the categories directly since they're defined in the app
    const categories = [
      {
        id: "emotional-connection",
        name: "Emotional Connection",
        description: "SEEN Method focused games",
        icon: "heart",
        color: "#FA1F63",
        games: ["truth-or-trust", "gratitude-cloud", "eye-contact-challenge", "memory-lane-map", "vibe-check"]
      },
      {
        id: "conflict-resolution",
        name: "Conflict Resolution",
        description: "Gottman-inspired games",
        icon: "shield",
        color: "#33DEA5",
        games: ["slap-of-truth", "apology-auction", "defensiveness-detox", "whos-right", "stress-test"]
      },
      {
        id: "creative-chaos",
        name: "Creative Chaos",
        description: "Playful, creative challenges",
        icon: "sparkles",
        color: "#E4E831",
        games: ["role-swap-roast", "draw-your-feelings", "gif-battle", "karaoke-confessional", "ransom-note"]
      },
      {
        id: "romance-hub",
        name: "Romance Hub",
        description: "Spicy & sweet connections",
        icon: "flame",
        color: "#BE1980",
        games: ["date-night-roulette", "bedroom-bingo", "six-second-kiss", "foreplay-slider", "touch-map"]
      },
      {
        id: "healing-hospital",
        name: "Healing Hospital",
        description: "Deep repair & recovery",
        icon: "medkit",
        color: "#5C1459",
        games: ["windows-and-walls", "trigger-triage", "trust-bank", "the-iceberg", "secrecy-audit"]
      },
      {
        id: "game-show",
        name: "Game Show",
        description: "Classic game show formats",
        icon: "trophy",
        color: "#22d3ee",
        games: ["couples-jeopardy", "relationship-millionaire", "family-feud-couples", "newlywed-sync", "wheel-of-intimacy"]
      },
      {
        id: "love-arcade",
        name: "The Love Arcade",
        description: "Championship matches of honesty, wit, and emotional parkour",
        icon: "game-controller",
        color: "#FF6B6B",
        games: ["truth-teller-tower", "echo-chamber-escape", "intimacy-feud", "relational-jeopardy", "family-forge", "harbor-storm"]
      }
    ];
    
    return { categories };
  },
  
  getCategory: async (categoryId: string) => {
    const categories = (await gamesApi.getCategories()).categories;
    const category = categories.find(cat => cat.id === categoryId);
    
    if (!category) {
      throw new Error('Category not found');
    }
    
    return category;
  },
  
  createSession: async (data: { user_id: string; game_id: string; category_id: string }) => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const sessionRef = doc(collection(db, 'game_sessions'));
    const sessionData = {
      id: sessionRef.id,
      userId: user.uid,
      game_id: data.game_id,
      category_id: data.category_id,
      started_at: serverTimestamp(),
      completed: false,
      score: 0,
      responses: [],
      created_at: serverTimestamp()
    };
    
    await setDoc(sessionRef, sessionData);
    return sessionData;
  },
  
  updateSession: async (sessionId: string, data: { score?: number; completed?: boolean; responses?: any[] }) => {
    const sessionRef = doc(db, 'game_sessions', sessionId);
    const updateData: any = { updated_at: serverTimestamp() };
    
    if (data.score !== undefined) updateData.score = data.score;
    if (data.completed !== undefined) updateData.completed = data.completed;
    if (data.responses !== undefined) updateData.responses = data.responses;
    
    await updateDoc(sessionRef, updateData);
    
    // If session is completed, update couple metrics
    if (data.completed) {
      // TODO: Update couple metrics based on game result
    }
    
    return { id: sessionId, ...data };
  },
};

// Love Arcade API
export const loveArcadeApi = {
  getGames: async () => {
    // Return the arcade games directly since they're defined in the app
    const games = [
      {
        id: "truth-teller-tower",
        name: "Truth Teller Tower",
        phase: "Foundation (Phase 1)",
        format: "Who Wants to Be a Millionaire meets The Newlywed Game",
        description: "Scale the lie-avalanche. Five questions. Three lifelines. One shared brain.",
        max_score: 100,
        lifelines: ["50/50", "Double Confidence", "Trust Check"],
        scoring: {
          correct_answer: 10,
          predicted_partner: 5,
          double_truth: 20
        }
      },
      {
        id: "echo-chamber-escape",
        name: "Escape from the Echo Chamber",
        phase: "Deconstruction (Phase 2)",
        format: "Digital Escape Room",
        description: "Trapped in a hall of infinite mirrors. Break the loop together.",
        max_score: 100,
        time_limit_per_puzzle: 90,
        puzzles: 5
      },
      {
        id: "intimacy-feud",
        name: "The Intimacy Feud",
        phase: "Shared Reality (Phase 3)",
        format: "Family Feud style",
        description: "Survey says... be boring. Be authentic. Be real.",
        max_score: 250,
        scoring: {
          1st_place: 50,
          2nd_place: 30,
          3rd_place: 20,
          partner_match: 10,
          authenticity_streak: 15
        }
      },
      {
        id: "relational-jeopardy",
        name: "Relational Jeopardy!",
        phase: "The Future (Phase 4)",
        format: "Jeopardy style",
        description: "Categories designed by couples who rebuilt.",
        max_score: 2000,
        categories: ["Accountability Plans", "Redefinition", "Integration"],
        has_daily_double: true,
        has_final_jeopardy: true
      },
      {
        id: "family-forge",
        name: "Family Forge Edition",
        phase: "Special - Family Building",
        format: "Mixed game show formats",
        description: "For couples forging families after betrayal.",
        max_score: 1800,
        sub_games: ["Family Feud: Our New Reality", "The Newlywed Game: Heart-to-Heart", "Chopped: Family Kitchen", "The Amazing Race: Legacy Dash"]
      },
      {
        id: "harbor-storm",
        name: "Harbor & Storm Edition",
        phase: "Special - BPD/Emotional Regulation",
        format: "Cooperative challenges",
        description: "Build a better boat. Learn to sail as a crew.",
        max_score: 1900,
        sub_games: ["BPD Pattern Detective", "Validation Game Show", "Connection Constructor", "Harbor Master's Challenge"]
      }
    ];
    
    return { games };
  },
};

// SOS Fight Solver API
export const sosApi = {
  createSession: async (data: { initiator_id: string; couple_id: string }) => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const sessionRef = doc(collection(db, 'sos_sessions'));
    const sessionData = {
      id: sessionRef.id,
      initiator_id: user.uid,
      couple_id: data.couple_id,
      status: "waiting_for_partner",
      started_at: serverTimestamp(),
      submissions: {},
      verdict: null,
      created_at: serverTimestamp()
    };
    
    await setDoc(sessionRef, sessionData);
    return sessionData;
  },
  
  submit: async (sessionId: string, data: {
    user_id: string;
    i_feel: string;
    when_partner: string;
    because_i_tell_myself: string;
    what_i_need: string;
  }) => {
    const sessionRef = doc(db, 'sos_sessions', sessionId);
    const submissionData = {
      [`submissions.${data.user_id}`]: {
        i_feel: data.i_feel,
        when_partner: data.when_partner,
        because_i_tell_myself: data.because_i_tell_myself,
        what_i_need: data.what_i_need,
        submitted_at: serverTimestamp()
      }
    };
    
    await updateDoc(sessionRef, submissionData);
    
    // Check if both partners submitted
    const sessionSnap = await getDoc(sessionRef);
    const sessionData = sessionSnap.data();
    const submissionCount = Object.keys(sessionData?.submissions || {}).length;
    
    if (submissionCount >= 2) {
      await updateDoc(sessionRef, { status: "analyzing" });
      // In real app, trigger AI analysis here
    } else if (submissionCount === 1) {
      await updateDoc(sessionRef, { status: "one_submitted" });
    }
    
    return sessionSnap.data();
  },
  
  get: async (sessionId: string) => {
    const sessionRef = doc(db, 'sos_sessions', sessionId);
    const sessionSnap = await getDoc(sessionRef);
    
    if (!sessionSnap.exists()) {
      throw new Error('SOS Session not found');
    }
    
    return { id: sessionId, ...sessionSnap.data() };
  },
};

// Dr. Marcie AI API
export const marcieApi = {
  chat: async (data: {
    user_id: string;
    context: string;
    message: string;
    sarcasm_level?: number;
    game_context?: string;
  }) => {
    // For now, returning a mock response
    // In the full implementation, this would call an actual AI endpoint
    const responses = [
      "Sweetheart, if avoiding tough conversations were cardio, you'd be an Olympic athlete. Let's talk.",
      "That's not a red flag, darling—that's a red circus tent. With elephants.",
      "Communication isn't mind-reading. Use words, not vibes.",
      "Apologies without change are just performance art.",
      "You're not broken, but you are bleeding—and you keep trying to dance in the fire.",
      "Stop searching for closure in open wounds."
    ];
    
    return {
      response: responses[Math.floor(Math.random() * responses.length)],
      animation: "marcie-idle",
      sarcasm_level: data.sarcasm_level || 1
    };
  },
};

export default {
  user: userApi,
  couple: coupleApi,
  games: gamesApi,
  loveArcade: loveArcadeApi,
  sos: sosApi,
  marcie: marcieApi,
};