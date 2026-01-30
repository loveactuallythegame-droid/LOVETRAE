
import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const StatDisplay = ({ label, value, color }: { label: string, value: string, color?: string }) => (
    <View>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={[styles.statValue, color ? { color } : {}]}>{value}</Text>
    </View>
);

const EyeContactChallengeGameScreen = () => {
    const player1Img = { uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAw6jQN4G3_ozOpHskHdgCEZtIVE3rvW6dvr0CMLJA2dnDVViNjOuxGfZp2ok-GfZ16kHawoc5cBTOpg50Eub-9ZbOYvl7rDEF6vI_kKwz9SVwMMthh8fYMm_fsmQWT6Y2erghqbrxQ1Nm5aXjxeyodkzt7waYWtmb47BcEFAqO7M4wvoVh9fYp3X0mgG5ZvJWlU5q6Kx4X9PSHGds-UJBDjig7rIAGbN-NP1-CeQVaeliRg-TKyQVzsaCMSqJ__qqBE02fQ2Ewz2ib' };
    const player2Img = { uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlObUMoIqneOJIiB970-VU-F71iwgSMBoDrsH2duaW04-tBgqYvjaLGwa2SIqyjMgFImBchzdQSzIg1Noho8h8nJHrGe0s3bF0ei5pqk0SM4Ugko564K04vG0bis_Uav6wpGo7WYVtwBD6PfqH5seILc48ZcKWOlusDGG9ABC8pBMRkqz_ID4tQZCXAqlB17rpYEAOKNYj1tHRKZYJ2B5rQmjXujqztM-8_WieCOE_oizSytoCZoJV4xpxFUuTn380EL8JQh1yS8ya' };

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#102220', '#230f16']} style={styles.background} />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>Eye Contact Challenge</Text>
            </View>

            <View style={styles.videoFeedsContainer}>
                <ImageBackground source={player1Img} style={styles.videoFeed} imageStyle={styles.videoImage}>
                    <Text style={styles.playerName}>PLAYER 1: ALEX</Text>
                </ImageBackground>

                <View style={styles.timerContainer}>
                    <Text style={styles.timerText}>00:48</Text>
                    <Text style={styles.timerLabel}>Don't Look Away</Text>
                </View>

                <ImageBackground source={player2Img} style={styles.videoFeed} imageStyle={styles.videoImage}>
                    <Text style={styles.playerName}>PLAYER 2: SAM</Text>
                </ImageBackground>
            </View>

            <View style={styles.footer}>
                <StatDisplay label="Time Locked" value="00:12:45" />
                <StatDisplay label="Pupil Dilat." value="NORMAL" color="#ff005e" />
                <StatDisplay label="Heart Sync" value="88 BPM" color="#d4145a" />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#102220' },
    background: { ...StyleSheet.absoluteFillObject },
    header: { padding: 16, alignItems: 'center' },
    headerTitle: { fontFamily: 'WorkSans-Bold', fontSize: 24, color: '#FFF' },
    videoFeedsContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', padding: 16, gap: 16 },
    videoFeed: { flex: 1, aspectRatio: 16 / 9, backgroundColor: '#000', borderRadius: 16, justifyContent: 'flex-end' },
    videoImage: { borderRadius: 16, opacity: 0.8 },
    playerName: { color: '#FFF', fontWeight: 'bold', padding: 8, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 8, alignSelf: 'flex-start' },
    timerContainer: { backgroundColor: 'rgba(35, 15, 22, 0.9)', padding: 24, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,0,94,0.4)' },
    timerText: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 48, color: '#ff005e' },
    timerLabel: { color: '#FFF', textTransform: 'uppercase', fontSize: 10, marginTop: 4, backgroundColor: '#d4145a', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 99 },
    footer: { flexDirection: 'row', justifyContent: 'space-around', padding: 16, backgroundColor: 'rgba(35,15,22,0.9)', borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    statLabel: { color: '#ffffff60', textTransform: 'uppercase', fontSize: 10, fontWeight: 'bold' },
    statValue: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
});

export default EyeContactChallengeGameScreen;
