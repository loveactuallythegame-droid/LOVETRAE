import { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, GlassCard, RadialGradientBackground } from '../../components/ui';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppStore } from '../../state/store';
import { listGames, Game, supabase } from '../../lib/supabase';
import { useAccess } from '../../lib/gating';

type CategoryKey = 'all' | 'emotional' | 'conflict' | 'romance' | 'creative' | 'arcade';

export default function GameLibraryScreen({ navigation }: any) {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState<CategoryKey>('all');
  const [search, setSearch] = useState('');
  const { isPremium } = useAccess();
  const previewMode = useAppStore(s => s.previewMode);

  useEffect(() => {
    // Seed data from User Request
    const ALL_GAMES: Game[] = [
      { id: '1', name: 'Lie Detector: Lite™', category: 'conflict', difficulty: 'Easy', xp: 50, description: 'Async voice response + AI prosody analysis', mechanics: 'Partner records ≤10-sec answer. Marcie measures fluency, vocal steadiness.', marcieIntro: 'Ooh—24/25. Only slipped on ‘uh’ once.' },
      { id: '2', name: 'Transparency Toss', category: 'conflict', difficulty: 'Easy', xp: 50, description: 'Real-time text relay', mechanics: 'Each “toss” = low-stakes truth. Partner must tap ✅ to verify.', marcieIntro: 'You tossed ‘I scrolled TikTok while you talked’… and they confirmed? Bold.' },
      { id: '3', name: 'Boundary Bingo', category: 'conflict', difficulty: 'Medium', xp: 100, description: 'Async shared grid', mechanics: 'Auto-generated 4×4 grid. Mark only after mutual ✅.', marcieIntro: 'BINGO on ‘I asked for space and didn’t feel guilty’? Someone upgraded their firmware.' },
      { id: '4', name: 'The Apology Olympics', category: 'conflict', difficulty: 'Hard', xp: 150, description: 'Speed rewrite + AI rubric', mechanics: 'Rewrite “Sorry you felt that way” in <60s. Avoid: but, if, you, however.', marcieIntro: '‘I shut down and it made you feel abandoned—I’ll pause next time’? Gold and my respect.' },
      { id: '5', name: 'Vibe Sync', category: 'emotional', difficulty: 'Medium', xp: 75, description: 'Synchronous slider', mechanics: 'A sets emotional battery (0–100) → B guesses.', marcieIntro: 'You guessed 68… they’re at 69. Psychic or just that in love?' },
      { id: '6', name: 'Trigger Takedown', category: 'conflict', difficulty: 'Medium', xp: 100, description: 'Async AR interaction', mechanics: 'Camera → point at object/song → “squash” trigger → select grounding.', marcieIntro: 'You neutralized ‘that hotel logo’ with a glitter bomb. Still shaky?' },
      { id: '7', name: 'Rewrite the Memory', category: 'emotional', difficulty: 'Hard', xp: 120, description: 'Shared canvas + AI narrative scoring', mechanics: 'One types fragment; both edit with hope/absurdity.', marcieIntro: '‘…and then a raccoon stole his phone’? Poetic and feral.' },
      { id: '8', name: 'Guilt vs. Shame Sort', category: 'emotional', difficulty: 'Easy', xp: 40, description: 'Rapid swipe (Tinder-style)', mechanics: '“I messed up” (✅ Guilt) vs. “I’m a failure” (❌ Shame).', marcieIntro: 'Swiped ‘I’m unlovable’ left? Wrong. Hard right to the trash.' },
      { id: '9', name: 'Flashback Frenzy', category: 'emotional', difficulty: 'Medium', xp: 90, description: 'Async image association', mechanics: 'A sees rainy window → types emotional word → B guesses why.', marcieIntro: '‘Rain’ = ‘that night you didn’t come home’… and they guessed exactly?' },
      { id: '10', name: 'The Denial Detector', category: 'conflict', difficulty: 'Medium', xp: 80, description: 'Voice-to-text audit', mechanics: 'Say “Everything’s fine.” <2x “fine” = pass.', marcieIntro: 'You said ‘fine’ 7 times. Congrats—you’ve unlocked Emotional Bottleneck.' },
      { id: '11', name: 'Six-Second Stare-Down', category: 'romance', difficulty: 'Medium', xp: 100, description: 'Real-time camera sync', mechanics: 'Front cams → AI detects mutual gaze → 6-sec timer.', marcieIntro: '2.3 seconds before laughing? Adorable. Try again.' },
      { id: '12', name: 'Gratitude Graffiti', category: 'emotional', difficulty: 'Easy', xp: 60, description: 'Shared mural', mechanics: '60 sec to write/draw appreciation—only metaphors.', marcieIntro: '‘You’re the guac to my toast’? Snackable and profound.' },
      { id: '13', name: 'Vulnerability Volley', category: 'emotional', difficulty: 'Medium', xp: 100, description: 'Timed text ping-pong', mechanics: 'A replies ≤15s → B validates ≤15s.', marcieIntro: 'You blocked with ‘lol same’? That’s not a volley—that’s a miss.' },
      { id: '14', name: 'The Touch Map: Lite', category: 'romance', difficulty: 'Medium', xp: 110, description: 'Abstract body outline (shapes only)', mechanics: 'Tap zones for Green/Yellow/Red signaling.', marcieIntro: 'They marked ‘triangle’ yellow… you green. Wanna unpack over sparkling water?' },
      { id: '15', name: 'Memory Lane GPS', category: 'emotional', difficulty: 'Easy', xp: 70, description: 'Map pin + media proof', mechanics: 'Drop pin → label → upload one photo both took that day.', marcieIntro: 'Pinned Trader Joe’s parking lot? Iconic. Love and frozen dumplings.' },
      { id: '16', name: 'Avoidance Arcade', category: 'conflict', difficulty: 'Medium', xp: 95, description: 'Whac-A-Mole', mechanics: 'Moles = avoidance phrases. Whack with “Say It Now” hammer.', marcieIntro: 'Missed ‘We should talk’? Congrats—now they think you’re leaving for a barista.' },
      { id: '17', name: 'The Needs Decoder', category: 'conflict', difficulty: 'Hard', xp: 130, description: 'Emoji cipher', mechanics: 'A sends 3 emojis. B guesses unmet need.', marcieIntro: '🌧️☕️🐶 = ‘Let me sulk in peace’? Genius. Hire this one.' },
      { id: '18', name: 'Escapism Escape Room', category: 'conflict', difficulty: 'Hard', xp: 140, description: '60-sec puzzle', mechanics: 'Solve riddle to escape “Netflix Binge Basement”.', marcieIntro: 'Escaped in 42s! …Wait, you used ‘work email’ as a clue? Touché.' },
      { id: '19', name: 'The Blame Flip', category: 'conflict', difficulty: 'Medium', xp: 85, description: 'Drag-and-drop rewrite', mechanics: 'Fix “You make me feel…” → drag “I feel…” to front.', marcieIntro: '“You never listen” → “I feel unheard when…”—YES.' },
      { id: '20', name: 'Micro-Betrayal Mini-Golf', category: 'conflict', difficulty: 'Medium', xp: 90, description: 'Physics putt-putt', mechanics: 'Navigate assumption, silence → hole (repair).', marcieIntro: 'Sunk it in 2 strokes? Impressive. Now apply that to actual texting.' },
      { id: '21', name: 'The 6-Second Kiss Timer', category: 'romance', difficulty: 'Medium', xp: 120, description: 'Dual thumb-hold', mechanics: 'Both hold thumb → bar fills. Sustain 6s.', marcieIntro: 'You peaked early. Again. Pace yourselves, loves.' },
      { id: '22', name: 'Foreplay Forecast', category: 'romance', difficulty: 'Hard', xp: 150, description: 'Live mood slider', mechanics: 'A sets arousal bar (0–100). B performs non-sexual acts to raise it.', marcieIntro: 'Hit 82 with eye contact + hair tuck? Someone’s been studying.' },
      { id: '23', name: 'Ransom Note Romance', category: 'romance', difficulty: 'Easy', xp: 60, description: 'Drag-and-drop cutout', mechanics: 'Build threat: “GIVE ME… TACOS… OR… I… SERENADE YOU.”', marcieIntro: '‘OR I WILL REORGANIZE YOUR SOCK DRAWER BY MOOD’? Chef’s kiss.' },
      { id: '24', name: 'GIF the Feels', category: 'creative', difficulty: 'Easy', xp: 50, description: 'Giphy integration', mechanics: 'Prompt: “My face when you actually listen.” Submit best GIF.', marcieIntro: 'You chose Distracted Boyfriend but swapped him for ‘Me ignoring my boundaries’?' },
      { id: '25', name: 'Karaoke Confessional', category: 'creative', difficulty: 'Hard', xp: 200, description: 'Auto-lyric rewrite + duet', mechanics: 'Pick song → AI rewrites chorus → record duet.', marcieIntro: 'Harmonized on ‘We don’t talk—we just scroll and sigh’? That’s not a song—that’s a diagnosis.' },
      { id: '26', name: 'Date Night Roulette', category: 'romance', difficulty: 'Easy', xp: 100, description: 'Wheel spin + filters', mechanics: 'Spin → “Picnic in car, 8 p.m., only songs from 2007.”', marcieIntro: 'You got ‘Blanket fort + pineapple pizza debate’? Destiny.' },
      { id: '27', name: 'The Repair Report Card', category: 'conflict', difficulty: 'Medium', xp: 110, description: 'Weekly slider survey', mechanics: 'Rate 5 areas (Listening, Space, Humor, Touch, Honesty).', marcieIntro: 'Honesty up 20%? Wow. You actually said ‘I was wrong’ without vomiting. Growth!' },
      { id: '28', name: 'Healing Bingo', category: 'emotional', difficulty: 'Medium', xp: 90, description: 'Weekly 5×5 grid', mechanics: 'Squares: “Said ‘I need space’ without guilt.”', marcieIntro: 'BINGO on ‘We disagreed—and stayed connected’? Stop. I need a moment.' },
      { id: '29', name: 'The Iceberg Dive', category: 'conflict', difficulty: 'Hard', xp: 150, description: 'Nested dropdown', mechanics: 'Surface (“I’m annoyed”) → drill down → Unlock “Core Need”.', marcieIntro: 'You got to ‘I need to feel chosen’? Honey… grab tissues. And chocolate.' },
      { id: '30', name: 'The Commitment Countdown', category: 'emotional', difficulty: 'Medium', xp: 100, description: 'Shared 30-day streak', mechanics: 'Daily micro-action (“Text one appreciation”).', marcieIntro: 'Day 12: You both said ‘thank you’ unprompted? Alert the New York Times.' },
      { id: '31', name: 'Bid Radar', category: 'emotional', difficulty: 'Easy', xp: 150, description: 'Log real-world bids for attention.', mechanics: 'Each partner logs bids (e.g., “sighed while cooking”). AI Cross-matches.', marcieIntro: 'Oh, you thought “staring mournfully at the trash” was a cry for help? Cute.' },
      { id: '32', name: 'Gentle Start-Up Gauntlet', category: 'conflict', difficulty: 'Hard', xp: 300, description: 'Rewrite harsh starters.', mechanics: 'Rewrite “You never listen” using “I feel… about… I need…” in <20s.', marcieIntro: 'Ooh, “I feel like a solo podcast host” — creative, but stick to the script, Picasso.' },
      { id: '33', name: 'Love Map Speedrun', category: 'emotional', difficulty: 'Medium', xp: 100, description: 'Live quiz on partner knowledge.', mechanics: 'Timed, 10 Qs like “Current favorite snack?”. Answers from journal.', marcieIntro: 'They changed their fave ice cream three weeks ago. If you missed that, you’re lost.' },
      { id: '34', name: 'Antidote Arena', category: 'conflict', difficulty: 'Medium', xp: 120, description: 'Neutralize the Four Horsemen.', mechanics: 'Hear exaggerated conflict audio. Pick the correct antidote (e.g. Self-Soothing).', marcieIntro: 'Contempt level: chef’s kiss. Now neutralize it before I lose faith in humanity.' },
      { id: '35', name: 'Mirror Mode', category: 'emotional', difficulty: 'Medium', xp: 100, description: 'Guess the emotion word.', mechanics: 'Record 15s video describing partner. Partner guesses the word (e.g., “Resilient”).', marcieIntro: 'You said “resilient” — and your voice cracked. I’m filing that under “adorable.”' },
      { id: '36', name: 'Dream Decoder', category: 'conflict', difficulty: 'Hard', xp: 150, description: 'Find the dream within the conflict.', mechanics: 'Pick a surface conflict (dishes). Partner guesses underlying dream (Order/Safety).', marcieIntro: 'The dishes aren’t about dishes, darling. They’re about control. Let’s not pretend.' },
      { id: '37', name: 'Tone Shift Challenge', category: 'creative', difficulty: 'Medium', xp: 80, description: 'Read neutral sentence in 4 tones.', mechanics: 'Read “We need to talk” as Sarcastic, Anxious, etc. Partner guesses.', marcieIntro: 'That “warm” sounded like a robot ordering coffee. Try again, Siri.' },
      { id: '38', name: 'Ritual Builder', category: 'emotional', difficulty: 'Easy', xp: 50, description: 'Drag-and-drop ritual creation.', mechanics: 'Combine ingredients (Coffee + News). Partner rates realism.', marcieIntro: '“Midnight stargazing”? Cute. Add “blanket” or I’m revoking your romance license.' },
      { id: '39', name: 'Conflict Dice', category: 'conflict', difficulty: 'Medium', xp: 100, description: 'Roll for scenario and constraint.', mechanics: 'Roll dice. Act out resolution without “You” statements.', marcieIntro: 'Defensiveness detected! Penalty lap: Say “I contributed by…” three times.' },
      { id: '40', name: 'Appreciation Auction', category: 'emotional', difficulty: 'Medium', xp: 100, description: 'Bid on real vs fake appreciations.', mechanics: 'Write 3 appreciations. AI mixes in fakes. Partner bids on real ones.', marcieIntro: 'Lot 3: “You fold laundry like a Zen master.” Is it real? Place your bets…' },
      { id: '41', name: 'Flooding Forecast', category: 'conflict', difficulty: 'Medium', xp: 90, description: 'Predict and manage flooding.', mechanics: 'Measure heart rate. AI predicts risk. Partner guesses calm-down method.', marcieIntro: 'Your heart’s doing salsa. Suggest: 20 minutes, a walk, and no texting me.' },
      { id: '42', name: 'Love Map Gap Quest', category: 'emotional', difficulty: 'Medium', xp: 80, description: 'Find and fill map gaps.', mechanics: 'AI finds missing data (Hobbies?). Partner asks curious question.', marcieIntro: 'Darling, your Love Map has a “Here Be Dragons” zone. Time to explore.' },
      { id: '43', name: 'Shared Meaning Mural', category: 'creative', difficulty: 'Easy', xp: 60, description: 'Collaborative digital art.', mechanics: 'Add symbols/words for “Us”. AI checks alignment.', marcieIntro: 'You both chose “storm clouds with rainbows.” Trauma-bonding? I’m invested.' },
      { id: '44', name: 'Text Tone Translator', category: 'conflict', difficulty: 'Medium', xp: 90, description: 'Rewrite risky texts.', mechanics: 'AI flags passive-aggression. Rewrite to be safer.', marcieIntro: '“K.” sent at 11:47 PM? That’s not a text — it’s a war crime.' },
      { id: '45', name: 'Repair Relay', category: 'conflict', difficulty: 'Hard', xp: 150, description: 'Race to repair escalation.', mechanics: 'Marcie narrates escalation. Type best repair ASAP.', marcieIntro: 'They’re stonewalling. Your move: Humor? Touch? Or wine? GO.' },
      { id: '46', name: 'Soundtrack Sync', category: 'creative', difficulty: 'Easy', xp: 50, description: 'Pick a song for “Us”.', mechanics: 'Choose song for the week. Partner guesses from clues.', marcieIntro: 'You picked “Dancing On My Own”? …Should I call someone?' },
      { id: '47', name: 'Micro-Moment Museum', category: 'emotional', difficulty: 'Easy', xp: 40, description: 'Photo of tiny connection.', mechanics: 'Upload photo (holding hands). Partner captions it.', marcieIntro: 'Exhibit A: “Fingers brushing.” Title: “The Great Carb Heist.” I’m crying.' },
      { id: '48', name: 'Stress Synergy Lab', category: 'emotional', difficulty: 'Medium', xp: 100, description: 'Co-manage stress.', mechanics: 'Log stressors. AI finds overlap. Craft soothing plan.', marcieIntro: 'Stress hormones detected. Prescribing: 10 mins, couch, no phones.' },
      { id: '49', name: 'Dream Support Sprint', category: 'emotional', difficulty: 'Medium', xp: 80, description: 'Plan specific dream support.', mechanics: 'A names dream. B lists 3 specific supports.', marcieIntro: '“Be supportive” isn’t a plan. “Buy tuner” is. Now we’re talking.' },
      { id: '50', name: 'Turning Toward Tally', category: 'emotional', difficulty: 'Easy', xp: 50, description: 'Track bid responses.', mechanics: '24h passive tracker of bid responses.', marcieIntro: 'You left their “🌧️ u up?” text for 47 minutes. Bold choice. Let’s discuss.' },
      { id: '51', name: 'Commitment Dice', category: 'emotional', difficulty: 'Easy', xp: 50, description: 'Roll for commitment prompt.', mechanics: 'Roll -> Get prompt (“Text one reason you chose them”).', marcieIntro: '“Because you tolerate my snoring” — low effort, high truth. I respect it.' },
      { id: '52', name: 'Empathy Echo', category: 'emotional', difficulty: 'Hard', xp: 120, description: 'Validate, don’t fix.', mechanics: 'Partner A records worry. B records ONLY validation.', marcieIntro: 'You said “Have you tried not worrying?” — and I felt that in my soul. Try again.' },
      { id: '53', name: 'Compromise Jenga', category: 'conflict', difficulty: 'Medium', xp: 100, description: 'Build a tower of concessions.', mechanics: 'Add blocks representing compromises. Don’t collapse.', marcieIntro: 'You put “I’ll do dishes” on top of “You’ll plan dates”? Gravity wins.' },
      { id: '54', name: 'Ritual Roulette', category: 'romance', difficulty: 'Medium', xp: 100, description: 'Spin for random date ritual.', mechanics: 'Spin -> Get combo (Wine + Stargazing). Log proof.', marcieIntro: '“Microwave popcorn + Wikipedia rabbit holes” — not romantic, but so you.' },
      { id: '55', name: 'Role Swap', category: 'conflict', difficulty: 'Hard', xp: 150, description: 'Swap perspectives in conflict.', mechanics: 'Replay conflict via text, swapping roles.', marcieIntro: 'You nailed their “I’m fine” face. Oscar speech ready?' },
      { id: '56', name: 'Memory Lane Dash', category: 'emotional', difficulty: 'Medium', xp: 80, description: 'Race to recall memories.', mechanics: 'AI pulls journal details. You recall them fast.', marcieIntro: 'You forgot the hotel name? But you remember the laugh. Points for heart.' },
      { id: '57', name: 'Admiration Aim', category: 'romance', difficulty: 'Easy', xp: 50, description: 'AR target practice with compliments.', mechanics: 'Shoot floating “strength” words (Witty, Patient).', marcieIntro: 'Aim for “resilient,” not “stubborn.” They’re synonyms, but one gets you kissed.' },
      { id: '58', name: 'Vow Remix', category: 'romance', difficulty: 'Medium', xp: 100, description: 'Update vows for today.', mechanics: 'Rewrite vows based on current reality (“I vow to not hide cookies”).', marcieIntro: '“I vow to pretend I don’t see you scrolling TikTok at 2 AM” — modern romance.' },
      { id: '59', name: 'Legacy Dice', category: 'emotional', difficulty: 'Medium', xp: 80, description: 'Define your relationship legacy.', mechanics: 'Roll -> Prompt (“Values for kids/dog”). Record answer.', marcieIntro: '“Sarcasm and snacks” isn’t a legacy. But I’m not judging. Much.' },
      { id: '60', name: 'Connection Conundrum', category: 'creative', difficulty: 'Hard', xp: 500, description: 'Marcie’s Grand Finale.', mechanics: '10-round rapid fire mix. Unlocks custom ritual.', marcieIntro: 'You survived. Barely. Here’s your prize: A date night plan I designed.' },
      { id: '61', name: 'Truth Teller Tower', category: 'arcade', difficulty: 'Hard', xp: 200, description: 'Scale the lie-avalanche.', mechanics: 'Answer 5 questions. Predict partner’s answer. Win badges.', marcieIntro: 'Five questions. Three lifelines. One shared brain—if you’re lucky.' },
      { id: '62', name: 'Escape from the Echo Chamber', category: 'arcade', difficulty: 'Hard', xp: 250, description: 'Break the love script.', mechanics: 'Solve 5 encrypted files by combining clues. <90s per puzzle.', marcieIntro: 'You’re not escaping a room. You’re escaping repetition.' },
      { id: '63', name: 'The Intimacy Feud', category: 'arcade', difficulty: 'Medium', xp: 200, description: 'You vs. 100 recovered couples.', mechanics: 'Guess top survey answers. Match partner for bonus points.', marcieIntro: 'Tonight’s opponent? The Ghost of the Old Script. Let’s go!' },
      { id: '64', name: 'Relational Jeopardy!', category: 'arcade', difficulty: 'Hard', xp: 300, description: 'Categories by rebuilt couples.', mechanics: 'Buzz in, wager points, face Final Jeopardy. 3 categories.', marcieIntro: 'Welcome to Relational Jeopardy! Categories are “Potent Promises.”' },
      { id: '65', name: 'Family Feud: New Reality', category: 'arcade', difficulty: 'Medium', xp: 200, description: 'You vs. The Ghosts of the Past.', mechanics: 'Guess top survey answers from couples who forged families. Match partner for double points.', marcieIntro: 'You’re building something truer. Stop saying “just a”. Let’s go!' },
      { id: '66', name: 'The Newlywed Game', category: 'arcade', difficulty: 'Medium', xp: 250, description: 'Heart-to-Heart Edition.', mechanics: 'Guess partner’s emotional needs (e.g., “What does your heart need?”). Points for empathy.', marcieIntro: 'You’re not guessing snacks. You’re guessing soul weather.' },
      { id: '67', name: 'Chopped: Family Kitchen', category: 'arcade', difficulty: 'Hard', xp: 300, description: 'Cook a response to chaos.', mechanics: 'Choose Base + Seasoning to handle a meltdown/trigger. Judges are your future selves.', marcieIntro: 'No perfection. Just presence. Let’s see what you can make from the scraps.' },
      { id: '68', name: 'Legacy Dash', category: 'arcade', difficulty: 'Hard', xp: 400, description: 'The Amazing Race.', mechanics: '5 challenges to unlock your family legacy. Finish line: Child’s 18th birthday.', marcieIntro: 'Build a legacy that outlasts the lie. Ready? GO!' },
      { id: '69', name: 'BPD Pattern Detective', category: 'arcade', difficulty: 'Hard', xp: 200, description: 'Decode the storm cycle.', mechanics: 'Watch a scenario. Drag clues to map Trigger, Thought, Reaction, Aftermath.', marcieIntro: 'Love isn’t blind—it’s forensic. Decode the cycle before it hits.' },
      { id: '70', name: 'Validation Game Show', category: 'arcade', difficulty: 'Medium', xp: 250, description: 'Spin for connection.', mechanics: 'Spin the wheel of responses. Choose the one that builds a bridge, not a wall.', marcieIntro: 'Welcome to The Validation Game Show. The jackpot is “I feel seen.”' },
      { id: '71', name: 'Connection Constructor', category: 'arcade', difficulty: 'Hard', xp: 300, description: 'Build Secure Harbor City.', mechanics: 'Complete challenges to build landmarks like the Identity Library and Repair Shop.', marcieIntro: 'Love isn’t a feeling. It’s infrastructure. Let’s lay the first brick.' },
      { id: '72', name: 'Harbor Master’s Challenge', category: 'arcade', difficulty: 'Hard', xp: 400, description: 'Choose Your Own Adventure.', mechanics: 'Co-captains face 5 future scenarios. Align choices for harmony.', marcieIntro: 'You’ve built your harbor. Now, let’s see if it holds in a squall.' },

      // PHOENIX PROTOCOL EDITION
      { id: '73', name: 'Truth & Transparency Gauntlet', category: 'arcade', difficulty: 'Hard', xp: 200, description: 'Cash Cab for integrity.', mechanics: 'Rapid-fire questions in a cab driving through storm of lies. Match answers for bonus.', marcieIntro: 'Welcome to the cab. The fare is integrity. Don’t make me pull over.' },
      { id: '74', name: 'Timeline Detective', category: 'arcade', difficulty: 'Hard', xp: 500, description: 'Reconstruct the double life.', mechanics: 'Partner A holds evidence cards. Partner B asks Qs to fill blank timeline.', marcieIntro: 'The lie wasn’t an act. It was a system. Let’s dismantle it.' },
      { id: '75', name: 'Layers of Hurt Escape Room', category: 'arcade', difficulty: 'Hard', xp: 500, description: 'Escape the debris field.', mechanics: 'Unlock 3 boxes (Social, Digital, Grief) using split-info collaboration.', marcieIntro: 'You’re escaping repetition. Solve it together or stay in the loop.' },
      { id: '76', name: 'Trust-Building Bingo', category: 'arcade', difficulty: 'Medium', xp: 500, description: 'Micro-actions for trust.', mechanics: 'Complete 5x5 grid of tiny truths over 7 days.', marcieIntro: 'This isn’t bingo. It’s trust compound interest. Lay the first brick.' },
      { id: '77', name: 'The Future Council', category: 'arcade', difficulty: 'Hard', xp: 500, description: 'Draft your new laws.', mechanics: 'Co-create decrees for future scenarios (e.g. relapse prevention).', marcieIntro: 'You survived the fire. Now design the city that rises from the ashes.' },

      // TRUST RENOVATION EDITION
      { id: '78', name: 'The De-Escalation Lab', category: 'arcade', difficulty: 'Medium', xp: 300, description: 'Simulated trigger training.', mechanics: 'Separate fact from injury in safe scenarios.', marcieIntro: 'This isn’t a battlefield. It’s a lab. Let’s calibrate your system.' },
      { id: '79', name: 'Cycle Breaker Board Game', category: 'arcade', difficulty: 'Hard', xp: 200, description: 'Escape the loop.', mechanics: 'Move token across Distrust Spiral. Rewrite the cycle to escape.', marcieIntro: 'You’re playing against The Loop. Break the pattern, not the person.' },
      { id: '80', name: 'Apology & Release Workshop', category: 'arcade', difficulty: 'Hard', xp: 250, description: 'Build apologies, release weight.', mechanics: 'Forge 4-pillar apology. Release old identities at the altar.', marcieIntro: 'No groveling. Just structural integrity. Build it strong.' },
      { id: '81', name: 'Trust Wiring Simulator', category: 'arcade', difficulty: 'Hard', xp: 500, description: 'Rewire the circuit board.', mechanics: 'Co-op: One sees alarm, one holds tools. Describe and fix.', marcieIntro: 'The ghost is flickering. Rewire the circuit before it blows.' },
      { id: '82', name: 'The Relationship Council', category: 'arcade', difficulty: 'Hard', xp: 500, description: 'Draft your constitution.', mechanics: 'Draft 5 articles for your new home/covenant.', marcieIntro: 'This isn’t a contract. It’s a covenant. Legislate your future.' },

      // WORD-WOUND EDITION
      { id: '83', name: 'Deal or No Deal: Accountability', category: 'arcade', difficulty: 'Hard', xp: 500, description: 'The suitcases hold truth.', mechanics: 'Open cases of defensive vs accountability statements. Accept the deal.', marcieIntro: 'The Banker offers one deal: Full Responsibility. Take it or walk.' },
      { id: '84', name: 'Family Feud: Safety Edition', category: 'arcade', difficulty: 'Medium', xp: 500, description: 'You vs. Ghosts of Past.', mechanics: 'Guess top answers from trauma therapists. Sync for safety.', marcieIntro: 'Tonight’s opponent? The Ghosts of the Past. Let’s play.' },
      { id: '85', name: 'Newlywed Game: Heart Edition', category: 'arcade', difficulty: 'Medium', xp: 450, description: 'Guess soul weather.', mechanics: 'Guess partner’s deep emotional state. Points for empathetic accuracy.', marcieIntro: 'Not guessing snacks. Guessing soul weather after the storm.' },
      { id: '86', name: 'Jeopardy: Rebuilding Round', category: 'arcade', difficulty: 'Hard', xp: 2000, description: 'The new social contract.', mechanics: 'Categories: Linguistic Geneva Convention, Amends as Architecture.', marcieIntro: 'Categories are Potent Promises. Win Relational Integrity.' },
      { id: '87', name: 'The Amazing Race: Crossroads', category: 'arcade', difficulty: 'Hard', xp: 600, description: 'Race to conscious choice.', mechanics: '5 challenges leading to The Crossroads: Commitment or Dignified Separation.', marcieIntro: 'The prize is conscious choice. Run to the crossroads.' },
    ];
    setGames(ALL_GAMES);
    setLoading(false);
  }, []);

  const filtered = useMemo(() => {
    let list = [...games];

    // Filter by Category
    if (cat !== 'all') {
      list = list.filter((g) => g.category.toLowerCase() === cat.toLowerCase());
    }

    // Filter by Search
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(g => g.name.toLowerCase().includes(q) || g.description.toLowerCase().includes(q));
    }

    return list;
  }, [games, cat, search, previewMode]);

  function openGame(g: Game) {
    if (g.difficulty === 'Hard' && !isPremium) {
      Alert.alert(
        'Premium Preview',
        'Launching 30-second preview of this premium game.',
        [
          {
            text: 'Start Preview',
            onPress: () => {
              supabase.from('feedback_events').insert({
                user_id: useAppStore.getState().user_id,
                event_type: 'game_demo_start',
                payload: { game_id: g.id }
              });

              if (g.name === 'Truth or Trust') navigation.navigate('PlayTruthOrTrust', { gameId: g.id, demo: true });
            }
          },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
      return;
    }

    // Dynamic navigation based on mapping
    const map: Record<string, string> = {
      'Truth or Trust': 'PlayTruthOrTrust',
      'Apology Auction': 'PlayApologyAuction',
      'Gratitude Cloud': 'PlayGratitudeCloud',
      'Eye Contact Challenge': 'PlayEyeContactChallenge',
      'Memory Lane Map': 'PlayMemoryLaneMap',
      'The Slap of Truth': 'PlaySlapOfTruth',
      'Defensiveness Detox': 'PlayDefensivenessDetox',
      "Who's Right?": 'PlayWhosRight',
      'Stress Test': 'PlayStressTest',
      'Role-Swap Roast': 'PlayRoleSwapRoast',
      'Windows & Walls': 'PlayWindowsAndWalls',
      'Trigger Triage': 'PlayTriggerTriage',
      'Trust Bank': 'PlayTrustBank',
      'The Iceberg': 'PlayTheIceberg',
      'Secrecy Audit': 'PlaySecrecyAudit',
      'Lie Detector': 'PlayLieDetector',
      'Transparency Toss': 'PlayTransparencyToss',
      'Boundary Bingo': 'PlayBoundaryBingo',
      'Vibe Sync': 'PlayVibeSync',
      'Rewrite the Memory': 'PlayRewriteMemory',
      'Guilt vs. Shame Sort': 'PlayGuiltShameSort',
      'Flashback Frenzy': 'PlayFlashbackFrenzy',
      'The Denial Detector': 'PlayDenialDetector',
      'Vulnerability Volley': 'PlayVulnerabilityVolley',
      'The Touch Map': 'PlayTouchMap',
      'Avoidance Arcade': 'PlayAvoidanceArcade',
      'The Needs Decoder': 'PlayNeedsDecoder',
      'Escapism Escape Room': 'PlayEscapismRoom',
      'The Blame Flip': 'PlayBlameFlip',
      'Micro-Betrayal Mini-Golf': 'PlayMicroBetrayalGolf',
      'Bid Radar': 'PlayBidRadar',
      'Gentle Start-Up Gauntlet': 'PlayGentleStartUpGauntlet',
      'Love Map Speedrun': 'PlayLoveMapSpeedrun',
      'Antidote Arena': 'PlayAntidoteArena',
      'Mirror Mode': 'PlayMirrorMode',
      'Dream Decoder': 'PlayDreamDecoder',
      'Tone Shift Challenge': 'PlayToneShiftChallenge',
      'Ritual Builder': 'PlayRitualBuilder',
      'Conflict Dice': 'PlayConflictDice',
      'Appreciation Auction': 'PlayAppreciationAuction',
      'Flooding Forecast': 'PlayFloodingForecast',
      'Love Map Gap Quest': 'PlayLoveMapGapQuest',
      'Shared Meaning Mural': 'PlaySharedMeaningMural',
      'Text Tone Translator': 'PlayTextToneTranslator',
      'Repair Relay': 'PlayRepairRelay',
      'Soundtrack Sync': 'PlaySoundtrackSync',
      'Micro-Moment Museum': 'PlayMicroMomentMuseum',
      'Stress Synergy Lab': 'PlayStressSynergyLab',
      'Dream Support Sprint': 'PlayDreamSupportSprint',
      'Turning Toward Tally': 'PlayTurningTowardTally',
      'Commitment Dice': 'PlayCommitmentDice',
      'Empathy Echo': 'PlayEmpathyEcho',
      'Compromise Jenga': 'PlayCompromiseJenga',
      'Ritual Roulette': 'PlayRitualRoulette',
      'Role Swap': 'PlayRoleSwap',
      'Memory Lane Dash': 'PlayMemoryLaneDash',
      'Admiration Aim': 'PlayAdmirationAim',
      'Vow Remix': 'PlayVowRemix',
      'Legacy Dice': 'PlayLegacyDice',
      'Connection Conundrum': 'PlayConnectionConundrum',
      'Trigger Takedown': 'PlayTriggerTakedown',
      'Six-Second Stare-Down': 'PlaySixSecondStareDown',
      'Gratitude Graffiti': 'PlayGratitudeGraffiti',
      'Memory Lane GPS': 'PlayMemoryLaneGPS',
      'The 6-Second Kiss Timer': 'PlaySixSecondKiss',
      'Foreplay Forecast': 'PlayForeplayForecast',
      'Ransom Note Romance': 'PlayRansomNoteRomance',
      'GIF the Feels': 'PlayGifTheFeels',
      'Karaoke Confessional': 'PlayKaraokeConfessional',
      'Date Night Roulette': 'PlayDateNightRoulette',
      'The Repair Report Card': 'PlayRepairReportCard',
      'Healing Bingo': 'PlayHealingBingo',
      'The Iceberg Dive': 'PlayTheIcebergDive',
      'The Commitment Countdown': 'PlayCommitmentCountdown',
      'The Apology Olympics': 'PlayApologyOlympics',
      'Lie Detector: Lite™': 'PlayLieDetector',
      'The Touch Map: Lite': 'PlayTouchMap',
      'Truth Teller Tower': 'PlayTruthTellerTower',
      'Escape from the Echo Chamber': 'PlayEscapeEchoChamber',
      'The Intimacy Feud': 'PlayIntimacyFeud',
      'Relational Jeopardy!': 'PlayRelationalJeopardy',
      'Family Feud: New Reality': 'PlayFamilyFeudNewReality',
      'The Newlywed Game': 'PlayNewlywedGame',
      'Chopped: Family Kitchen': 'PlayChoppedFamily',
      'Legacy Dash': 'PlayLegacyDash',
      'BPD Pattern Detective': 'PlayBPDPatternDetective',
      'Validation Game Show': 'PlayValidationGameShow',
      'Connection Constructor': 'PlayConnectionConstructor',
      'Harbor Master’s Challenge': 'PlayHarborMasterChallenge',
      'Truth & Transparency Gauntlet': 'PlayTruthTransparencyGauntlet',
      'Timeline Detective': 'PlayTimelineDetective',
      'Layers of Hurt Escape Room': 'PlayLayersOfHurt',
      'Trust-Building Bingo': 'PlayTrustBingo',
      'The Future Council': 'PlayFutureCouncil',
      'The De-Escalation Lab': 'PlayDeEscalationLab',
      'Cycle Breaker Board Game': 'PlayCycleBreaker',
      'Apology & Release Workshop': 'PlayApologyWorkshop',
      'Trust Wiring Simulator': 'PlayTrustWiring',
      'The Relationship Council': 'PlayRelationshipCouncil',
      'Deal or No Deal: Accountability': 'PlayDealOrNoDealAccountability',
      'Family Feud: Safety Edition': 'PlayFamilyFeudSafety',
      'Newlywed Game: Heart Edition': 'PlayNewlywedHeart',
      'Jeopardy: Rebuilding Round': 'PlayJeopardyRebuilding',
      'The Amazing Race: Crossroads': 'PlayAmazingRaceCrossroads',
    };

    const route = map[g.name];
    if (route) {
      // @ts-ignore
      navigation.navigate(route, { gameId: g.id });
    } else {
      Alert.alert("Available in Full Version", "This game is coming in the next update!");
    }
  }

  const CategoryTab = ({ id, label, icon }: { id: CategoryKey; label: string; icon: string }) => (
    <TouchableOpacity
      onPress={() => setCat(id)}
      style={[styles.tabItem, cat === id ? styles.tabItemActive : {}]}
    >
      <Text variant="body" style={[styles.tabText, cat === id && { color: '#fc0c84' }]}>{label}</Text>
      {cat === id && <View style={styles.activeLine} />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.root}>
      <RadialGradientBackground />
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text variant="header" style={styles.title}>Game Library</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="notifications-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search & Sort */}
        <View style={styles.controls}>
          <GlassCard style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#fc0c84" style={{ marginRight: 10 }} />
            <TextInput
              style={styles.input}
              placeholder="Find a mini-game to play..."
              placeholderTextColor="rgba(255,255,255,0.4)"
              value={search}
              onChangeText={setSearch}
            />
          </GlassCard>
          <TouchableOpacity style={styles.sortBtn}>
            <Ionicons name="filter" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <View style={styles.tabsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContent}>
            <CategoryTab id="all" label="All Experiences" icon="apps" />
            <CategoryTab id="emotional" label="Connection" icon="heart" />
            <CategoryTab id="conflict" label="Conflict" icon="flash" />
            <CategoryTab id="romance" label="Intimacy" icon="flame" />
            <CategoryTab id="creative" label="Fun & Play" icon="color-palette" />
            <CategoryTab id="arcade" label="Koalaville Arcade" icon="game-controller" />
          </ScrollView>
        </View>

        {/* Game Grid */}
        <ScrollView contentContainerStyle={styles.gridScroll}>
          <View style={styles.grid}>
            {loading && <Text variant="body">Loading games...</Text>}
            {!loading && filtered.length === 0 && (
              <View style={{ width: '100%', alignItems: 'center', marginTop: 40 }}>
                <Text variant="body" style={{ opacity: 0.5 }}>No games found matching your search.</Text>
              </View>
            )}
            {!loading && filtered.map((g, i) => (
              <View key={g.id} style={styles.gameCardWrapper}>
                <TouchableOpacity onPress={() => openGame(g)} activeOpacity={0.9}>
                  <View style={styles.gameCard}>
                    {/* Gradient Placeholder for Image */}
                    <LinearGradient
                      colors={
                        g.category === 'emotional' ? ['#2A1A31', '#5C1459'] :
                          g.category === 'conflict' ? ['#2A1A31', '#E11637'] :
                            g.category === 'romance' ? ['#2A1A31', '#FA1F63'] :
                              g.category === 'arcade' ? ['#2A1A31', '#FFD700'] :
                                ['#2A1A31', '#33DEA5']
                      }
                      style={styles.cardImage}
                    >
                      <View style={styles.cardOverlay} />
                      {g.difficulty === 'Hard' && (
                        <View style={styles.badge}>
                          <View style={styles.badgeDot} />
                          <Text variant="keyword" style={styles.badgeText}>PREMIUM</Text>
                        </View>
                      )}
                    </LinearGradient>

                    <View style={styles.cardContent}>
                      <Text variant="header" style={styles.gameTitle} numberOfLines={1}>{g.name}</Text>
                      <View style={styles.metaRow}>
                        <Ionicons name="time-outline" size={12} color="rgba(255,255,255,0.5)" />
                        <Text variant="body" style={styles.metaText}>{g.category} • {g.xp} XP</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </View>
          <View style={{ height: 100 }} />
        </ScrollView>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0a0708' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  title: { fontSize: 20, fontWeight: 'bold', color: 'white' },
  iconBtn: { padding: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12 },

  controls: { flexDirection: 'row', paddingHorizontal: 20, gap: 10, marginTop: 10 },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, height: 50, borderRadius: 16, backgroundColor: 'rgba(42, 26, 49, 0.6)' },
  input: { flex: 1, color: 'white', fontSize: 16, fontFamily: 'System' },
  sortBtn: { width: 50, height: 50, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },

  tabsContainer: { marginTop: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  tabsContent: { paddingHorizontal: 20, gap: 20, paddingBottom: 0 },
  tabItem: { paddingBottom: 12, alignItems: 'center', justifyContent: 'center' },
  tabItemActive: {},
  tabText: { fontSize: 14, color: 'rgba(255,255,255,0.5)', fontWeight: '600' },
  activeLine: { position: 'absolute', bottom: 0, height: 2, width: '100%', backgroundColor: '#fc0c84', borderRadius: 2 },

  gridScroll: { padding: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  gameCardWrapper: { width: '47%', marginBottom: 8 },
  gameCard: { backgroundColor: '#2A1A31', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  cardImage: { height: 100, justifyContent: 'space-between', padding: 10 },
  cardOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.2)' },
  cardContent: { padding: 12 },
  gameTitle: { fontSize: 14, marginBottom: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 10, color: 'rgba(255,255,255,0.5)', textTransform: 'capitalize' },

  badge: { alignSelf: 'flex-end', flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 12, borderWidth: 1, borderColor: '#FFC107' },
  badgeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFC107' },
  badgeText: { fontSize: 8, color: '#FFC107', fontWeight: 'bold' }
});
