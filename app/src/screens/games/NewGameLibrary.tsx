
import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ImageBackground, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '../../components/ui';
import { Ionicons } from '@expo/vector-icons';
import { Game } from '../../lib/supabase';
import { MarcieHost } from '../../components/ai-host';

const ALL_GAMES: Game[] = [
    { id: '1', name: 'Lie Detector: Lite™', category: 'conflict', difficulty: 'Easy', xp: 50, description: 'Async voice response + AI prosody analysis', mechanics: 'Partner records ≤10-sec answer. Marcie measures fluency, vocal steadiness.', marcieIntro: 'Ooh—24/25. Only slipped on ‘uh’ once.' },
    { id: '2', name: 'Transparency Toss', category: 'conflict', difficulty: 'Easy', xp: 50, description: 'Real-time text relay', mechanics: 'Each “toss” = low-stakes truth. Partner must tap ✅ to verify.', marcieIntro: 'You tossed ‘I scrolled TikTok while you talked’… and they confirmed? Bold.' },
    { id: '3', name: 'Boundary Bingo', category: 'conflict', difficulty: 'Medium', xp: 100, description: 'Async shared grid', mechanics: 'Auto-generated 4×4 grid. Mark only after mutual ✅.', marcieIntro: 'BINGO on ‘I asked for space and didn’t feel guilty’? Someone upgraded their firmware.' },
    { id: '4', name: 'The Apology Olympics', category: 'conflict', difficulty: 'Hard', xp: 150, description: 'Speed rewrite + AI rubric', mechanics: 'Rewrite “Sorry you felt that way” in <60s. Avoid: but, if, you, however.', marcieIntro: '‘I shut down and it made you feel abandoned—I’ll pause next time’? Gold and my respect.' },
    { id: '5', name: 'Vibe Sync', category: 'emotional', difficulty: 'Medium', xp: 75, description: 'Synchronous slider', mechanics: 'A sets emotional battery (0–100) → B guesses.', marcieIntro: 'You guessed 68… they’re at 69. Psychic or just that in love?' },
  ];


export default function NewGameLibrary({ navigation }: any) {
  const [games, setGames] = useState<Game[]>(ALL_GAMES);
  const [cat, setCat] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let list = [...games];
    if (cat !== 'all') {
      list = list.filter((g) => g.category.toLowerCase() === cat.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(g => g.name.toLowerCase().includes(q) || g.description.toLowerCase().includes(q));
    }
    return list;
  }, [games, cat, search]);

  return (
    <View style={styles.root}>
      <ImageBackground 
        source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2mvjLAlTkLBW6D1eAUM0_bh2_Onn0TXmy_xLxCfZi4J5tFOBsatN7uoTmlFEJoCL3TmXoy5vd_OJa_LaNLwnXk5r-G-4CW4CTVw0uRf7vY08JuNxxzcEfxQM1-55jZXAdY-Akry-e3wYNgYWHfDJ1aehH7fGTFugOK_l-zzz-2kypLf6NBtBJrYzQj32sLhc2G31ofrKNKzM29sl54-jiP-7asfjUgb_LBWKrDTRqoZtjBIv_vhG_6ex5MpmiYsLVOEnSDcs34GyZ' }}
        style={styles.cosmicBg}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <Button title="Admin Portal" onPress={() => navigation.navigate('AdminPortal')} />
          <ScrollView contentContainerStyle={styles.gridScroll}>
            {filtered.map((g, i) => (
              <View key={g.id} style={styles.gameCardWrapper}>
                <TouchableOpacity onPress={() => {}} activeOpacity={0.9}>
                  <View style={styles.gameCard}>
                    <Text style={styles.gameTitle}>{g.name}</Text>
                    <Text style={styles.gameDescription}>{g.description}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
        <MarcieHost mode={'idle'} size={180} float position={{ x: 0, y: 150 }} />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#102222' },
  cosmicBg: {
    flex: 1,
  },
  gridScroll: { padding: 20 },
  gameCardWrapper: { width: '100%', marginBottom: 16 },
  gameCard: {
    backgroundColor: 'rgba(26, 46, 46, 0.8)', 
    borderRadius: 16,
    padding: 20,
    borderColor: 'rgba(19, 236, 236, 0.3)',
    borderWidth: 1,
  },
  gameTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'barbie',
  },
  gameDescription: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontFamily: 'barbie',
  },
});
