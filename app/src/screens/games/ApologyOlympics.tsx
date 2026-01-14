import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { LinearGradient } from 'expo-linear-gradient';
import { speakMarcie } from '../../lib/voice-engine';

export default function ApologyOlympics({ navigation }: any) {
    useEffect(() => {
        speakMarcie("‘I shut down and it made you feel abandoned—I’ll pause next time’? 35/35. Gold and my respect.");
    }, []);

    return (
        <LinearGradient colors={['#2A0040', '#000000']} style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <SquishyButton onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Text variant="body">Back</Text>
                    </SquishyButton>
                    <Text variant="header" style={styles.title}>The Apology Olympics</Text>
                </View>

                <GlassCard style={styles.card}>
                    <Text variant="instructions" style={{ marginBottom: 10 }}>Type: Speed rewrite + AI rubric</Text>
                    <Text variant="body">Mechanics: Rewrite “Sorry you felt that way” in {'<'}60s. Must avoid: but, if, you, however.</Text>
                </GlassCard>

                <GlassCard style={styles.card}>
                    <Text variant="instructions" style={{ marginBottom: 10 }}>Scoring (AI Rubric)</Text>
                    <Text variant="body">
                        ✅ Ownership (“I did X”) = +10{'\n'}
                        ✅ Impact named (“…made you feel Y”) = +10{'\n'}
                        ✅ Repair offered (“Next time, I’ll Z”) = +10{'\n'}
                        ✅ No blame-shifting = +5
                    </Text>
                </GlassCard>

                <View style={styles.actionArea}>
                    <SquishyButton onPress={() => alert('Rubric loaded. Ready?')} style={styles.playBtn}>
                        <Text variant="header">Start Rewrite</Text>
                    </SquishyButton>
                </View>
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { padding: 20, gap: 20 },
    header: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 40 },
    backBtn: { paddingHorizontal: 15, paddingVertical: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12 },
    title: { fontSize: 22, color: '#fff', flex: 1 },
    card: { padding: 20 },
    actionArea: { marginTop: 40, alignItems: 'center' },
    playBtn: { width: '80%', paddingVertical: 15, backgroundColor: '#FA1F63', borderRadius: 20, alignItems: 'center' }
});
