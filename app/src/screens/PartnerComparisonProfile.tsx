
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const USER_COLOR = '#00FFFF';
const PARTNER_COLOR = '#FFD700';

const ProfileStat = ({ label, value }) => (
    <View style={styles.profileStatContainer}>
        <Text style={styles.profileStatValue}>{value}</Text>
        <Text style={styles.profileStatLabel}>{label}</Text>
    </View>
);

const ProgressBar = ({ label, value, color }) => (
    <View style={{width: '100%'}}>
        <View style={styles.progressLabelContainer}>
            <Text style={styles.progressLabel}>{label}</Text>
            <Text style={[styles.progressValue, { color }]}>{value}</Text>
        </View>
        <View style={styles.progressTrack}>
            <LinearGradient colors={[color, `${color}80`]} start={{x:0, y:0}} end={{x:1, y:0}} style={[styles.progressFill, { width: value }]} />
        </View>
    </View>
);

const ProfileCard = ({ name, title, avatarUri, score, consistency, streak, loveLanguage, color }) => (
    <View style={[styles.profileCard, { borderLeftColor: color, borderRightColor: color }]}>
        <Image source={{ uri: avatarUri }} style={[styles.avatar, { borderColor: color }]} />
        <Text style={styles.profileName}>{name}</Text>
        <Text style={[styles.profileTitle, { color, backgroundColor: `${color}20` }]}>{title}</Text>
        <View style={styles.statsBlock}>
            <ProgressBar label="WEEKLY SCORE" value={`${score}%`} color={color} />
            <ProgressBar label="CONSISTENCY" value={`${consistency}%`} color={color} />
        </View>
        <View style={styles.statsRow}>
            <ProfileStat label="DAILY STREAK" value={streak} />
            <ProfileStat label="LOVE LANGUAGE" value={loveLanguage} />
        </View>
    </View>
);

const PartnerComparisonProfile = () => {
    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#2A002A', '#5A005A']} style={styles.background} />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.headerTitle}>PARTNER COMPARISON</Text>
                <Text style={styles.headerSubtitle}>A cosmic look at your relationship alignment</Text>

                <View style={styles.comparisonGrid}>
                    <ProfileCard 
                        name="ALEX"
                        title="STAR VOYAGER"
                        avatarUri='https://lh3.googleusercontent.com/aida-public/AB6AXuAaEpXrVa6vTdya0fN1hBHpAklNewL62GPQQ0QAGTEAmJPEO8QfkxkQU18_mAnX877vo_mG6ZIx0QT_Y-k7BVA_qUHBns-7cL4jNwx0NwA13J0mU0PDhZSchY1AEI9-Ki5XQSU4eb64O0YOq7PphD5-AOf9W9CI1g7Pm_gmJ2mJVaxU-AJqeH3kDTJXZ4t3SM7NSriVUKC4E3zmT2-YHwWWNDFH6VeYKzAtgCz75Scnj_zL9Y5hE5Dwg0Aw7rRhaUOL1LmwtIZd20gQ'
                        score={84}
                        consistency={92}
                        streak={12}
                        loveLanguage="Words"
                        color={USER_COLOR}
                    />
                    <View style={styles.matchContainer}>
                        <View style={styles.matchRing}>
                            <Text style={styles.matchPercentage}>88%</Text>
                             <Text style={styles.matchLabel}>ALIGNMENT</Text>
                        </View>
                    </View>
                    <ProfileCard 
                        name="JORDAN"
                        title="GALAXY GUARDIAN"
                        avatarUri='https://lh3.googleusercontent.com/aida-public/AB6AXuC2Gi4fonAjY3RRaACqv-ikoUhyv2dt4ZLYbpDRjWHZ9SdguUT_JtC0xWxixVnY7GFrs53GXEu1EAvDxHgqbwmezeFHgZqsFuOVCJIf7eAnWoBypNtoFaCLkqSTFJO0zMUwQNa7jdLno6hZ6KjsfdepIRcnbfgCbQIwx7jdekhCWs630X1AmRK-zebX_A72hVigUD_KlnAl8d2fIg42jIH0nRXZ9-krJWZzvGaGsyMHsCa3Ynx85yE3qwebhhYA9NG2R8NrUsJ1lWSm'
                        score={79}
                        consistency={88}
                        streak={8}
                        loveLanguage="Quality"
                        color={PARTNER_COLOR}
                    />
                </View>
                 <TouchableOpacity style={styles.recalculateButton}>
                    <Text style={{fontSize: 16}}>🔄</Text>
                    <Text style={styles.recalculateButtonText}>RECALCULATE SYNC</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#2A002A' },
    background: { ...StyleSheet.absoluteFillObject },
    scrollContent: { padding: 16 },
    headerTitle: { color: '#FFF', fontSize: 32, fontWeight: 'bold', textAlign: 'center', textTransform: 'uppercase' },
    headerSubtitle: { color: '#D1C4E9', textAlign: 'center', marginBottom: 24, fontWeight: 'bold', textTransform: 'uppercase' },
    comparisonGrid: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
    profileCard: { flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)', borderBottomColor: 'rgba(255,255,255,0.2)', borderLeftWidth: 2, borderRightWidth: 2 },
    avatar: { width: 90, height: 90, borderRadius: 45, borderWidth: 3, marginBottom: 12 },
    profileName: { color: '#FFF', fontSize: 22, fontWeight: 'bold', textTransform: 'uppercase' },
    profileTitle: { textTransform: 'uppercase', fontSize: 10, fontWeight: 'bold', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginTop: 4, letterSpacing: 1 },
    statsBlock: { marginVertical: 16, width: '100%', gap: 16 },
    progressLabelContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
    progressLabel: { color: '#D1C4E9', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
    progressValue: { fontSize: 12, fontWeight: 'bold' },
    progressTrack: { height: 10, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 5 },
    progressFill: { height: '100%', borderRadius: 5, shadowOpacity: 0.8, shadowRadius: 5, elevation: 5 },
    statsRow: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', gap: 8 },
    profileStatContainer: { alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 8, padding: 8, flex: 1 },
    profileStatValue: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
    profileStatLabel: { color: '#D1C4E9', fontSize: 8, textTransform: 'uppercase', marginTop: 2, fontWeight: 'bold' },
    matchContainer: { paddingHorizontal: 8, alignItems: 'center' },
    matchRing: { width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)' },
    matchPercentage: { color: '#FFF', fontSize: 42, fontWeight: 'bold' },
    matchLabel: { color: '#D1C4E9', textTransform: 'uppercase', fontSize: 10, letterSpacing: 2, fontWeight: 'bold' },
    recalculateButton: { flexDirection: 'row', alignSelf: 'center', alignItems: 'center', gap: 8, padding: 12, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)', marginTop: 24},
    recalculateButtonText: { color: '#FFF', fontWeight: 'bold', textTransform: 'uppercase', fontSize: 10 }
});

export default PartnerComparisonProfile;
