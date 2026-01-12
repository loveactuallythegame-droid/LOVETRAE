import { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { listGames, Game, supabase } from '../../lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import { speakMarcie } from '../../lib/voice-engine';
import { useAccess } from '../../lib/gating';
import { useAppStore } from '../../state/store';

type CategoryKey = 'emotional' | 'conflict' | 'creative' | 'romance';

const UPCOMING_GAMES: Game[] = [
  { id: 'upcoming-1', name: 'Quantum Flirting', category: 'romance', difficulty: 'Hard', xp: 500, description: 'Flirt across dimensions. (Coming Soon)', mechanics: '', marcieIntro: '' },
  { id: 'upcoming-2', name: 'Argue-Bot 3000', category: 'conflict', difficulty: 'Medium', xp: 300, description: 'Practice fighting with AI. (Coming Soon)', mechanics: '', marcieIntro: '' }
];

const MISSING_GAMES: Game[] = [
  { id: 'missing-1', name: 'Lie Detector: Lite', category: 'conflict', difficulty: 'Hard', xp: 400, description: 'Async voice response + AI prosody analysis.', mechanics: 'Partner records ≤10-sec answer. AI scores fluency and steadiness.', marcieIntro: '24/25. Only slipped on ‘uh’ once. I’ll allow it… this time.' },
  { id: 'missing-2', name: 'Transparency Toss', category: 'conflict', difficulty: 'Medium', xp: 200, description: 'Real-time text relay of low-stakes truths.', mechanics: 'Each “toss” = truth. Partner must tap ✅ to verify.', marcieIntro: 'You tossed ‘I scrolled TikTok while you talked’… and they confirmed? Bold.' },
  { id: 'missing-3', name: 'Boundary Bingo', category: 'conflict', difficulty: 'Medium', xp: 250, description: 'Async shared grid of boundaries.', mechanics: 'Mark squares after mutual ✅. Line = +20.', marcieIntro: 'BINGO on ‘I asked for space and didn’t feel guilty’? Someone upgraded their firmware.' },
  { id: 'missing-4', name: 'Vibe Sync', category: 'emotional', difficulty: 'Easy', xp: 150, description: 'Synchronous slider for emotional battery.', mechanics: 'A sets level (0–100) → B guesses. Match = points.', marcieIntro: 'You guessed 68… they’re at 69. Psychic or just that in love?' },
  { id: 'missing-5', name: 'Rewrite the Memory', category: 'emotional', difficulty: 'Hard', xp: 350, description: 'Shared canvas + AI narrative scoring.', mechanics: 'One types fragment, both edit with hope/absurdity.', marcieIntro: '‘…and then a raccoon stole his phone’? 28/30. Poetic and feral.' },
  { id: 'missing-6', name: 'Guilt vs. Shame Sort', category: 'emotional', difficulty: 'Easy', xp: 100, description: 'Rapid swipe (Tinder-style) for emotions.', mechanics: '“I messed up” (Guilt) vs. “I’m a failure” (Shame).', marcieIntro: 'Swiped ‘I’m unlovable’ left? Wrong. Hard right to the trash.' },
  { id: 'missing-7', name: 'Flashback Frenzy', category: 'emotional', difficulty: 'Medium', xp: 250, description: 'Async image association game.', mechanics: 'A sees image → types emotion → B guesses why.', marcieIntro: '‘Rain’ = ‘that night you didn’t come home’… and they guessed exactly? Listening level: 100.' },
  { id: 'missing-8', name: 'The Denial Detector', category: 'conflict', difficulty: 'Medium', xp: 200, description: 'Voice-to-text audit for the word "fine".', mechanics: 'Say “Everything’s fine.” <2x “fine” = points.', marcieIntro: 'You said ‘fine’ 7 times. Congrats—you’ve unlocked Emotional Bottleneck. 🏆' },
  { id: 'missing-9', name: 'Vulnerability Volley', category: 'emotional', difficulty: 'Hard', xp: 300, description: 'Timed text ping-pong.', mechanics: 'A replies ≤15s → B validates ≤15s.', marcieIntro: 'You blocked with ‘lol same’? That’s not a volley—that’s a miss.' },
  { id: 'missing-10', name: 'The Touch Map: Lite', category: 'romance', difficulty: 'Medium', xp: 200, description: 'Abstract body outline coloring.', mechanics: 'Tap zones for Green/Yellow/Red comfort levels.', marcieIntro: 'They marked ‘triangle’ yellow… you green. Wanna unpack over sparkling water?' },
  { id: 'missing-11', name: 'Avoidance Arcade', category: 'conflict', difficulty: 'Easy', xp: 150, description: 'Whac-A-Mole for avoidance phrases.', mechanics: 'Moles = “I’ll tell them later”. Whack with “Say It Now”.', marcieIntro: 'Missed ‘We should talk’? Congrats—now they think you’re leaving for a barista.' },
  { id: 'missing-12', name: 'The Needs Decoder', category: 'emotional', difficulty: 'Medium', xp: 200, description: 'Emoji cipher for needs.', mechanics: 'A sends 3 emojis. B guesses unmet need.', marcieIntro: '🌧️☕️🐶 = ‘Let me sulk in peace with snacks and the dog’? Genius.' },
  { id: 'missing-13', name: 'Escapism Escape Room', category: 'conflict', difficulty: 'Hard', xp: 350, description: '60-sec puzzle to escape habits.', mechanics: 'Solve riddle. Clues = real-life escapes.', marcieIntro: 'Escaped in 42s! …Wait, you used ‘work email’ as a clue? Touché.' },
  { id: 'missing-14', name: 'The Blame Flip', category: 'conflict', difficulty: 'Medium', xp: 200, description: 'Drag-and-drop rewrite of blame.', mechanics: 'Fix “You make me feel…” → drag “I feel…” to front.', marcieIntro: '‘You never listen’ → ‘I feel unheard when…’—YES.' },
  { id: 'missing-15', name: 'Micro-Betrayal Mini-Golf', category: 'creative', difficulty: 'Easy', xp: 150, description: 'Physics putt-putt for repair.', mechanics: 'Ball = small breach. Navigate assumption → hole (repair).', marcieIntro: 'Sunk it in 2 strokes? Impressive. Now apply that to actual texting.' },
  { id: 'req-1', name: 'Bid Radar', category: 'emotional', difficulty: 'Easy', xp: 150, description: 'Log real-world bids. AI checks if partner noticed.', mechanics: 'Log bids like "sighed while cooking". AI cross-matches with partner logs.', marcieIntro: 'Oh, you thought "staring mournfully at the trash can" was a cry for help? Cute.' },
  { id: 'req-2', name: 'Gentle Start-Up Gauntlet', category: 'conflict', difficulty: 'Hard', xp: 300, description: 'Rewrite harsh startups into gentle ones.', mechanics: 'Rewrite "You never listen!" using "I feel... about... I need..." in <20 sec.', marcieIntro: 'Ooh, "I feel like a solo podcast host" — creative, but stick to the script, Picasso.' },
  { id: 'req-3', name: 'Love Map Speedrun', category: 'romance', difficulty: 'Medium', xp: 200, description: 'Kahoot-style quiz on partner details.', mechanics: 'Timed quiz on recent favorites. Answers pulled from shared journal.', marcieIntro: 'They changed their fave ice cream three weeks ago. If you missed that, you’re emotionally GPS-less.' },
  { id: 'req-4', name: 'Antidote Arena', category: 'conflict', difficulty: 'Hard', xp: 350, description: 'Identify antidotes to the Four Horsemen.', mechanics: 'Hear "Four Horsemen" clip. Pick correct antidote (e.g. Gentle Start-Up).', marcieIntro: 'Contempt level: chef’s kiss. Now neutralize it before I lose faith in humanity.' },
  { id: 'req-5', name: 'Mirror Mode', category: 'emotional', difficulty: 'Medium', xp: 250, description: 'Video response analysis.', mechanics: 'Record 15s video. AI analyzes tone/smiles. Partner guesses keywords.', marcieIntro: 'You said "resilient" — and your voice cracked. I’m filing that under "adorable."' },
  { id: 'req-6', name: 'Dream Decoder', category: 'emotional', difficulty: 'Hard', xp: 400, description: 'Find the dream behind the conflict.', mechanics: 'One picks conflict, partner guesses underlying dream (e.g. "order = safety").', marcieIntro: 'The dishes aren’t about dishes, darling. They’re about control. Let’s not pretend.' },
  { id: 'req-7', name: 'Tone Shift Challenge', category: 'conflict', difficulty: 'Medium', xp: 300, description: 'Say sentence in 4 tones.', mechanics: 'Read neutral sentence in Sarcastic, Anxious, Warm, Playful tones. AI scores warmth.', marcieIntro: 'That "warm" sounded like a robot ordering coffee. Try again, Siri.' },
  { id: 'req-8', name: 'Ritual Builder', category: 'creative', difficulty: 'Easy', xp: 150, description: 'Drag-and-drop ritual creation.', mechanics: 'Combine ingredients (Coffee + News) to build rituals. Partner rates realism.', marcieIntro: '"Midnight stargazing"? Cute. Add "blanket" and "no mosquitoes" or I’m revoking your romance license.' },
  { id: 'req-9', name: 'Conflict Dice', category: 'conflict', difficulty: 'Medium', xp: 250, description: 'Roll for conflict scenario and constraint.', mechanics: 'Get scenario + constraint (e.g. no "you" statements). Record resolution.', marcieIntro: 'Defensiveness detected! Penalty lap: Say "I contributed by..." three times.' },
  { id: 'req-10', name: 'Appreciation Auction', category: 'emotional', difficulty: 'Medium', xp: 200, description: 'Bid on real appreciations.', mechanics: 'Bid "Emotional Coins" to identify real appreciations vs AI decoys.', marcieIntro: 'Lot 3: "You fold laundry like a Zen master." Is it real? Place your bets...' },
  { id: 'req-11', name: 'Flooding Forecast', category: 'conflict', difficulty: 'Hard', xp: 350, description: 'Manage heart rate during mock conflict.', mechanics: 'Monitor HR. AI predicts flooding. Partner guesses calm-down method.', marcieIntro: 'Your heart’s doing salsa. Suggest: 20 minutes, a walk, and no texting me your grievances.' },
  { id: 'req-12', name: 'Love Map Gap Quest', category: 'romance', difficulty: 'Easy', xp: 150, description: 'Find and fill gaps in knowledge.', mechanics: 'AI finds unknown areas. Partner asks curious Q to close gap.', marcieIntro: 'Darling, your Love Map has a "Here Be Dragons" zone. Time to explore.' },
  { id: 'req-13', name: 'Shared Meaning Mural', category: 'creative', difficulty: 'Medium', xp: 250, description: 'Collaborative digital art.', mechanics: 'Add symbols representing "us". AI detects alignment.', marcieIntro: 'You both chose "storm clouds with rainbows." Trauma-bonding? Or just poetic?' },
  { id: 'req-14', name: 'Text Tone Translator', category: 'conflict', difficulty: 'Medium', xp: 200, description: 'Rewrite risky texts.', mechanics: 'AI flags risk tones. Rewrite safer versions. Partner guesses best one.', marcieIntro: '"K." sent at 11:47 PM? That’s not a text — it’s a war crime.' },
  { id: 'req-15', name: 'Repair Relay', category: 'conflict', difficulty: 'Hard', xp: 300, description: 'Race to repair conflict escalation.', mechanics: 'Marcie describes escalation. Players type repair attempts.', marcieIntro: 'They’re stonewalling. Your move: Humor? Touch? Or just hand them wine and walk away? GO.' },
  { id: 'req-16', name: 'Soundtrack Sync', category: 'creative', difficulty: 'Easy', xp: 150, description: 'Pick a song for "Us This Week".', mechanics: 'Pick song. Partner guesses from clues. Mood match bonus.', marcieIntro: 'You picked "Dancing On My Own"? ...Should I call someone?' },
  { id: 'req-17', name: 'Micro-Moment Museum', category: 'romance', difficulty: 'Easy', xp: 100, description: 'Curate small connection moments.', mechanics: 'Upload photo of tiny moment. Partner writes caption.', marcieIntro: 'Exhibit A: "Fingers brushing while reaching for toast." Title: "The Great Carb Heist." I’m crying.' },
  { id: 'req-18', name: 'Stress Synergy Lab', category: 'emotional', difficulty: 'Medium', xp: 250, description: 'Coordinate stress management.', mechanics: 'Log stressors. AI finds overlap. Craft mutual soothing plan.', marcieIntro: 'Stress hormones detected. Prescribing: 10 mins, couch, no phones. Side effects: cuddles.' },
  { id: 'req-19', name: 'Dream Support Sprint', category: 'romance', difficulty: 'Medium', xp: 200, description: 'Plan support for partner\'s dream.', mechanics: 'Partner names dream. You list 3 specific supports.', marcieIntro: '"Be supportive" isn’t a plan. "Buy tuner, hide my phone during practice" — now we’re talking.' },
  { id: 'req-20', name: 'Turning Toward Tally', category: 'emotional', difficulty: 'Easy', xp: 150, description: 'Track responses to bids.', mechanics: 'Passive tracker for responding to texts/calls in <5 min.', marcieIntro: 'You left their "🌧️ u up?" text for 47 minutes. Bold choice. Let’s discuss.' },
  { id: 'req-21', name: 'Commitment Dice', category: 'romance', difficulty: 'Easy', xp: 100, description: 'Roll for commitment prompt.', mechanics: 'Roll dice, get prompt (e.g. "Text one reason you chose them").', marcieIntro: '"Because you tolerate my snoring" — low effort, high truth. I respect it.' },
  { id: 'req-22', name: 'Empathy Echo', category: 'emotional', difficulty: 'Hard', xp: 300, description: 'Practice validation without fixing.', mechanics: 'Partner records worry. You record validation only. AI scores empathy.', marcieIntro: 'You said "Have you tried not worrying?" — and I felt that in my soul. Try again.' },
  { id: 'req-23', name: 'Compromise Jenga', category: 'conflict', difficulty: 'Medium', xp: 250, description: 'Build a tower of compromises.', mechanics: 'Each block is a concession. Tower stability wins.', marcieIntro: 'You put "I’ll do dishes" on top of "You’ll plan dates"? Honey, gravity always wins.' },
  { id: 'req-24', name: 'Ritual Roulette', category: 'creative', difficulty: 'Medium', xp: 200, description: 'Spin for random ritual combo.', mechanics: 'Spin wheel, get combo (Wine + Stargazing). Try IRL.', marcieIntro: '"Microwave popcorn + Wikipedia rabbit holes" — not romantic, but so you. 10/10.' },
  { id: 'req-25', name: 'Role Swap', category: 'conflict', difficulty: 'Hard', xp: 350, description: 'Swap roles in a conflict replay.', mechanics: 'Text replay of conflict, swapping roles. AI scores perspective.', marcieIntro: 'You nailed their "I’m fine" face. Oscar speech ready?' },
  { id: 'req-26', name: 'Memory Lane Dash', category: 'romance', difficulty: 'Medium', xp: 200, description: 'Race to recall relationship details.', mechanics: 'AI asks about old journals/events. Speed + accuracy.', marcieIntro: 'You forgot the hotel name? But you remember how they laughed. Okay, fine — points for heart.' },
  { id: 'req-27', name: 'Admiration Aim', category: 'romance', difficulty: 'Easy', xp: 150, description: 'Shoot compliments at partner.', mechanics: 'AR mode: Point phone at partner, shoot positive words.', marcieIntro: 'Aim for "resilient," not "stubborn." They’re synonyms, but one gets you kissed.' },
  { id: 'req-28', name: 'Vow Remix', category: 'romance', difficulty: 'Medium', xp: 200, description: 'Update wedding vows for today.', mechanics: 'Rewrite vows with current reality (e.g. hangry handling).', marcieIntro: '"I vow to pretend I don’t see you scrolling TikTok at 2 AM" — modern romance.' },
  { id: 'req-29', name: 'Legacy Dice', category: 'creative', difficulty: 'Medium', xp: 200, description: 'Discuss shared values/legacy.', mechanics: 'Roll for prompt about values/legacy. Record voice note.', marcieIntro: '"Sarcasm and snacks" isn’t a legacy. But I’m not judging. Much.' },
  { id: 'req-30', name: 'Connection Conundrum', category: 'creative', difficulty: 'Hard', xp: 500, description: 'Grand finale mix of all games.', mechanics: '10-round rapid-fire mix. Unlocks custom ritual.', marcieIntro: 'You survived. Barely. Here’s your prize: A date night plan I designed. Don’t screw it up.' },
];

export default function GameLibraryScreen({ navigation }: any) {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState<CategoryKey>('emotional');
  const { isPremium } = useAccess();
  const previewMode = useAppStore(s => s.previewMode);

  useEffect(() => {
    listGames().then((g) => { setGames(g); setLoading(false); });
  }, []);

  const filtered = useMemo(() => {
    let list = [...games, ...MISSING_GAMES].filter((g) => g.category === cat);
    if (previewMode) {
      list = [...list, ...UPCOMING_GAMES.filter(g => g.category === cat)];
    }
    return list;
  }, [games, cat, previewMode]);

  function openGame(g: Game) {
    if (g.id.startsWith('upcoming-')) {
      Alert.alert('Coming Soon', 'This game is in development. Beta testers will get early access soon!');
      return;
    }

    // All req- games are now implemented

    // Premium Check
    if (g.difficulty === 'Hard' && !isPremium) {
      // Launch Demo Mode
      Alert.alert(
        'Premium Preview',
        'Launching 30-second preview of this premium game.',
        [
          {
            text: 'Start Preview',
            onPress: () => {
              // Log event
              supabase.from('feedback_events').insert({
                user_id: useAppStore.getState().user_id, // Ensure user_id is in store or fetched
                event_type: 'game_demo_start',
                payload: { game_id: g.id }
              });
              
              // Navigate with demo flag
              if (g.name === 'Truth or Trust') navigation.navigate('PlayTruthOrTrust', { gameId: g.id, demo: true });
              // Add other mappings as needed or generic runner
            }
          },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
      return; 
    }

    if (g.name === 'Truth or Trust') navigation.navigate('PlayTruthOrTrust', { gameId: g.id });
    else if (g.name === 'Apology Auction') navigation.navigate('PlayApologyAuction', { gameId: g.id });
    else if (g.name === 'Gratitude Cloud') navigation.navigate('PlayGratitudeCloud', { gameId: g.id });
    else if (g.name === 'Eye Contact Challenge') navigation.navigate('PlayEyeContactChallenge', { gameId: g.id });
    else if (g.name === 'Memory Lane Map') navigation.navigate('PlayMemoryLaneMap', { gameId: g.id });
    else if (g.name === 'The Slap of Truth') navigation.navigate('PlaySlapOfTruth', { gameId: g.id });
    else if (g.name === 'Defensiveness Detox') navigation.navigate('PlayDefensivenessDetox', { gameId: g.id });
    else if (g.name === "Who's Right?") navigation.navigate('PlayWhosRight', { gameId: g.id });
    else if (g.name === 'Stress Test') navigation.navigate('PlayStressTest', { gameId: g.id });
    else if (g.name === 'Role-Swap Roast') navigation.navigate('PlayRoleSwapRoast', { gameId: g.id });
    else if (g.name === 'Windows & Walls') navigation.navigate('PlayWindowsAndWalls', { gameId: g.id });
    else if (g.name === 'Trigger Triage') navigation.navigate('PlayTriggerTriage', { gameId: g.id });
    else if (g.name === 'Trust Bank') navigation.navigate('PlayTrustBank', { gameId: g.id });
    else if (g.name === 'The Iceberg') navigation.navigate('PlayTheIceberg', { gameId: g.id });
    else if (g.name === 'Secrecy Audit') navigation.navigate('PlaySecrecyAudit', { gameId: g.id });
    else if (g.name === 'Lie Detector: Lite') navigation.navigate('PlayLieDetector', { gameId: g.id });
    else if (g.name === 'Transparency Toss') navigation.navigate('PlayTransparencyToss', { gameId: g.id });
    else if (g.name === 'Boundary Bingo') navigation.navigate('PlayBoundaryBingo', { gameId: g.id });
    else if (g.name === 'Vibe Sync') navigation.navigate('PlayVibeSync', { gameId: g.id });
    else if (g.name === 'Rewrite the Memory') navigation.navigate('PlayRewriteMemory', { gameId: g.id });
    else if (g.name === 'Guilt vs. Shame Sort') navigation.navigate('PlayGuiltShameSort', { gameId: g.id });
    else if (g.name === 'Flashback Frenzy') navigation.navigate('PlayFlashbackFrenzy', { gameId: g.id });
    else if (g.name === 'The Denial Detector') navigation.navigate('PlayDenialDetector', { gameId: g.id });
    else if (g.name === 'Vulnerability Volley') navigation.navigate('PlayVulnerabilityVolley', { gameId: g.id });
    else if (g.name === 'The Touch Map: Lite') navigation.navigate('PlayTouchMap', { gameId: g.id });
    else if (g.name === 'Avoidance Arcade') navigation.navigate('PlayAvoidanceArcade', { gameId: g.id });
    else if (g.name === 'The Needs Decoder') navigation.navigate('PlayNeedsDecoder', { gameId: g.id });
    else if (g.name === 'Escapism Escape Room') navigation.navigate('PlayEscapismRoom', { gameId: g.id });
    else if (g.name === 'The Blame Flip') navigation.navigate('PlayBlameFlip', { gameId: g.id });
    else if (g.name === 'Micro-Betrayal Mini-Golf') navigation.navigate('PlayMicroBetrayalGolf', { gameId: g.id });
    else if (g.name === 'Bid Radar') navigation.navigate('PlayBidRadar', { gameId: g.id });
    else if (g.name === 'Gentle Start-Up Gauntlet') navigation.navigate('PlayGentleStartUpGauntlet', { gameId: g.id });
    else if (g.name === 'Love Map Speedrun') navigation.navigate('PlayLoveMapSpeedrun', { gameId: g.id });
    else if (g.name === 'Antidote Arena') navigation.navigate('PlayAntidoteArena', { gameId: g.id });
    else if (g.name === 'Mirror Mode') navigation.navigate('PlayMirrorMode', { gameId: g.id });
    else if (g.name === 'Dream Decoder') navigation.navigate('PlayDreamDecoder', { gameId: g.id });
    else if (g.name === 'Tone Shift Challenge') navigation.navigate('PlayToneShiftChallenge', { gameId: g.id });
    else if (g.name === 'Ritual Builder') navigation.navigate('PlayRitualBuilder', { gameId: g.id });
    else if (g.name === 'Conflict Dice') navigation.navigate('PlayConflictDice', { gameId: g.id });
    else if (g.name === 'Appreciation Auction') navigation.navigate('PlayAppreciationAuction', { gameId: g.id });
    else if (g.name === 'Flooding Forecast') navigation.navigate('PlayFloodingForecast', { gameId: g.id });
    else if (g.name === 'Love Map Gap Quest') navigation.navigate('PlayLoveMapGapQuest', { gameId: g.id });
    else if (g.name === 'Shared Meaning Mural') navigation.navigate('PlaySharedMeaningMural', { gameId: g.id });
    else if (g.name === 'Text Tone Translator') navigation.navigate('PlayTextToneTranslator', { gameId: g.id });
    else if (g.name === 'Repair Relay') navigation.navigate('PlayRepairRelay', { gameId: g.id });
    else if (g.name === 'Soundtrack Sync') navigation.navigate('PlaySoundtrackSync', { gameId: g.id });
    else if (g.name === 'Micro-Moment Museum') navigation.navigate('PlayMicroMomentMuseum', { gameId: g.id });
    else if (g.name === 'Stress Synergy Lab') navigation.navigate('PlayStressSynergyLab', { gameId: g.id });
    else if (g.name === 'Dream Support Sprint') navigation.navigate('PlayDreamSupportSprint', { gameId: g.id });
    else if (g.name === 'Turning Toward Tally') navigation.navigate('PlayTurningTowardTally', { gameId: g.id });
    else if (g.name === 'Commitment Dice') navigation.navigate('PlayCommitmentDice', { gameId: g.id });
    else if (g.name === 'Empathy Echo') navigation.navigate('PlayEmpathyEcho', { gameId: g.id });
    else if (g.name === 'Compromise Jenga') navigation.navigate('PlayCompromiseJenga', { gameId: g.id });
    else if (g.name === 'Ritual Roulette') navigation.navigate('PlayRitualRoulette', { gameId: g.id });
    else if (g.name === 'Role Swap') navigation.navigate('PlayRoleSwap', { gameId: g.id });
    else if (g.name === 'Memory Lane Dash') navigation.navigate('PlayMemoryLaneDash', { gameId: g.id });
    else if (g.name === 'Admiration Aim') navigation.navigate('PlayAdmirationAim', { gameId: g.id });
    else if (g.name === 'Vow Remix') navigation.navigate('PlayVowRemix', { gameId: g.id });
    else if (g.name === 'Legacy Dice') navigation.navigate('PlayLegacyDice', { gameId: g.id });
    else if (g.name === 'Connection Conundrum') navigation.navigate('PlayConnectionConundrum', { gameId: g.id });
  }
  function selectCategory(c: CategoryKey) {
    setCat(c);
    const lines: Record<CategoryKey, string> = {
      emotional: 'Intimacy builds with honest presence. Keep it tender.',
      conflict: 'Fix the fight, not the person. Repair over blame.',
      creative: 'Play together. Novelty unlocks connection.',
      romance: 'Spice respectfully. Consent plus curiosity, always.',
    };
    speakMarcie(lines[c]);
  }
  const scale1 = useSharedValue(1), scale2 = useSharedValue(1), scale3 = useSharedValue(1), scale4 = useSharedValue(1);
  const s1 = useAnimatedStyle(() => ({ transform: [{ scale: scale1.value }] }));
  const s2 = useAnimatedStyle(() => ({ transform: [{ scale: scale2.value }] }));
  const s3 = useAnimatedStyle(() => ({ transform: [{ scale: scale3.value }] }));
  const s4 = useAnimatedStyle(() => ({ transform: [{ scale: scale4.value }] }));
  function hover(v: typeof scale1, on: boolean) { v.value = withTiming(on ? 1.05 : 1, { duration: 150 }); }
  return (
    <ScrollView contentContainerStyle={styles.root}>
      <View style={styles.headerRow}>
        <SquishyButton onPress={() => navigation.goBack()} style={styles.back}><Text variant="header">Back</Text></SquishyButton>
        <Text variant="header">Game Library</Text>
        <Text variant="keyword">🎮</Text>
      </View>
      <View style={styles.grid}>
        <Animated.View style={[styles.card, s1]}>
          <Pressable
            onPress={() => selectCategory('emotional')}
            onHoverIn={() => hover(scale1, true)}
            onHoverOut={() => hover(scale1, false)}
            style={styles.cardInner}
          >
            <Text variant="header" style={{ color: '#FA1F63' }}>♥</Text>
            <Text variant="header">Emotional Connection</Text>
            <Text variant="body">Build intimacy</Text>
          </Pressable>
        </Animated.View>
        <Animated.View style={[styles.card, s2]}>
          <Pressable onPress={() => selectCategory('conflict')} onHoverIn={() => hover(scale2, true)} onHoverOut={() => hover(scale2, false)} style={styles.cardInner}>
            <Text variant="header" style={{ color: '#E4E831' }}>🛡️</Text>
            <Text variant="header">Conflict Resolution</Text>
            <Text variant="body">Fix fights</Text>
          </Pressable>
        </Animated.View>
        <Animated.View style={[styles.card, s3]}>
          <Pressable onPress={() => selectCategory('creative')} onHoverIn={() => hover(scale3, true)} onHoverOut={() => hover(scale3, false)} style={styles.cardInner}>
            <Text variant="header" style={{ color: '#BE1980' }}>🎨</Text>
            <Text variant="header">Creative Chaos</Text>
            <Text variant="body">Play together</Text>
          </Pressable>
        </Animated.View>
        <Animated.View style={[styles.card, s4]}>
          <Pressable onPress={() => selectCategory('romance')} onHoverIn={() => hover(scale4, true)} onHoverOut={() => hover(scale4, false)} style={styles.cardInner}>
            <Text variant="header" style={{ color: '#33DEA5' }}>🔥</Text>
            <Text variant="header">Romance Hub</Text>
            <Text variant="body">Spice things up</Text>
          </Pressable>
        </Animated.View>
      </View>

      <View style={{ marginTop: 12 }}>
        {loading && <GlassCard><Text variant="body">Loading games…</Text></GlassCard>}
        {!loading && filtered.length === 0 && <GlassCard><Text variant="body">No games found</Text></GlassCard>}
        {!loading && filtered.map((g) => (
          <GlassCard key={g.id}>
            <View style={{ padding: 8 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text variant="header">{g.name}</Text>
                <View style={[styles.badge, g.difficulty === 'Easy' ? styles.badgeEasy : g.difficulty === 'Medium' ? styles.badgeMed : styles.badgeHard]}>
                  <Text variant="keyword">{g.difficulty}</Text>
                </View>
              </View>
              <Text variant="body" style={{ color: '#d1d5db' }}>{g.description}</Text>
              <Text variant="body" style={{ color: '#33DEA5' }}>{g.xp} XP</Text>
              <View style={{ marginTop: 8 }}>
                <LinearGradient colors={['#FA1F63', '#BE1980']} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={styles.primaryBtn}>
                  <SquishyButton onPress={() => openGame(g)} style={{ backgroundColor: 'transparent' }}>
                    <Text variant="header">Play</Text>
                  </SquishyButton>
                </LinearGradient>
              </View>
            </View>
          </GlassCard>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { padding: 16, gap: 12 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  back: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#5C1459', borderRadius: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: { width: '48%' },
  cardInner: { padding: 12, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', gap: 6 },
  gameCard: { },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  badgeEasy: { backgroundColor: '#33DEA5' },
  badgeMed: { backgroundColor: '#E4E831' },
  badgeHard: { backgroundColor: '#E11637' },
  primaryBtn: { borderRadius: 20, overflow: 'hidden' },
});
