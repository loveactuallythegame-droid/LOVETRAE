import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { LinearGradient } from 'expo-linear-gradient';
import { speakMarcie } from '../../lib/voice-engine';

export default function SixSecondStareDown({ navigation }: any) {
    useEffect(() => {
        speakMarcie("2.3 seconds before laughing? Adorable. Try again—no smiling. (…liar.)");
    }, []);

    return (
        <LinearGradient colors={['#2A0040', '#000000']} style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <SquishyButton onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Text variant="body">Back</Text>
                    </SquishyButton>
                    <Text variant="header" style={styles.title}>Six-Second Stare-Down</Text>
                </View>

                <GlassCard style={styles.card}>
                    <Text variant="instructions" style={{ marginBottom: 10 }}>Type: Real-time camera sync</Text>
                    <Text variant="body">Mechanics: Front cams → AI detects mutual gaze → 6-sec timer.</Text>
                </GlassCard>

                <GlassCard style={styles.card}>
                    <Text variant="instructions" style={{ marginBottom: 10 }}>Scoring</Text>
                    <Text variant="body">
                        ✅ 6 sec eye contact = +25{'\n'}
                        ✅ Sync blink (±0.5s) = +10
                    </Text>
                </GlassCard>

                <View style={styles.actionArea}>
                    <SquishyButton onPress={() => alert('Starting Gaze Detection...')} style={styles.playBtn}>
                        <Text variant="header">Start Detection</Text>
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
