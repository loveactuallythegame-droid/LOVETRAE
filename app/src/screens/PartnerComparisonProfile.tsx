
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const USER_COLOR = '#13ecec';
const PARTNER_COLOR = '#ff7e47';

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
            <View style={[styles.progressFill, { width: value, backgroundColor: color, shadowColor: color }]} />
        </View>
    </View>
);

const ProfileCard = ({ name, title, avatarUri, score, consistency, streak, loveLanguage, color }) => (
    <View style={[styles.profileCard, { borderLeftColor: color, borderRightColor: color }]}>
        <Image source={{ uri: avatarUri }} style={[styles.avatar, { borderColor: color }]} />
        <Text style={styles.profileName}>{name}</Text>
        <Text style={[styles.profileTitle, { color, backgroundColor: `${color}20` }]}>{title}</Text>
        <View style={styles.statsBlock}>
            <ProgressBar label="Weekly Score" value={`${score}%`} color={color} />
            <ProgressBar label="Consistency" value={`${consistency}%`} color={color} />
        </View>
        <View style={styles.statsRow}>
            <ProfileStat label="Daily Streak" value={streak} />
            <ProfileStat label="Love Language" value={loveLanguage} />
        </View>
    </View>
);

const PartnerComparisonProfile = () => {
    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#0a1414', '#230f19']} style={styles.background} />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.headerTitle}>Partner Comparison</Text>
                <Text style={styles.headerSubtitle}>A cosmic look at your relationship alignment</Text>

                <View style={styles.comparisonGrid}>
                    <ProfileCard 
                        name="Alex"
                        title="Star Voyager"
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
                             <Text style={styles.matchLabel}>Alignment</Text>
                        </View>
                    </View>
                    <ProfileCard 
                        name="Jordan"
                        title="Galaxy Guardian"
                        avatarUri='https://lh3.googleusercontent.com/aida-public/AB6AXuC2Gi4fonAjY3RRaACqv-ikoUhyv2dt4ZLYbpDRjWHZ9SdguUT_JtC0xWxixVnY7GFrs53GXEu1EAvDxHgqbwmezeFHgZqsFuOVCJIf7eAnWoBypNtoFaCLkqSTFJO0zMUwQNa7jdLno6hZ6KjsfdepIRcnbfgCbQIwx7jdekhCWs630X1AmRK-zebX_A72hVigUD_KlnAl8d2fIg42jIH0nRXZ9-krJWZzvGaGsyMHsCa3Ynx85yE3qwebhhYA9NG2R8NrUsJ1lWSm'
                        score={79}
                        consistency={88}
                        streak={8}
                        loveLanguage="Quality"
                        color={PARTNER_COLOR}
                    />
                </View>
                 <TouchableOpacity style={styles.recalculateButton}>
                    <MaterialIcons name="autorenew" size={16} color={USER_COLOR} />
                    <Text style={styles.recalculateButtonText}>Recalculate Sync</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a1414' },
    background: { ...StyleSheet.absoluteFillObject },
    scrollContent: { padding: 16 },
    headerTitle: { color: '#FFF', fontSize: 32, fontWeight: 'bold', textAlign: 'center' },
    headerSubtitle: { color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginBottom: 24 },
    comparisonGrid: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
    profileCard: { flex: 1, backgroundColor: 'rgba(22, 37, 37, 0.7)', borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', borderBottomColor: 'rgba(255,255,255,0.1)', borderLeftWidth: 2, borderRightWidth: 2 },
    avatar: { width: 90, height: 90, borderRadius: 45, borderWidth: 3, marginBottom: 12 },
    profileName: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
    profileTitle: { textTransform: 'uppercase', fontSize: 10, fontWeight: 'bold', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginTop: 4, letterSpacing: 1 },
    statsBlock: { marginVertical: 16, width: '100%', gap: 16 },
    progressLabelContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
    progressLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 12 },
    progressValue: { fontSize: 12, fontWeight: 'bold' },
    progressTrack: { height: 10, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 5 },
    progressFill: { height: '100%', borderRadius: 5, shadowOpacity: 0.8, shadowRadius: 5, elevation: 5 },
    statsRow: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
    profileStatContainer: { alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: 8, flex: 1, margin: 4 },
    profileStatValue: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
    profileStatLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 8, textTransform: 'uppercase', marginTop: 2 },
    matchContainer: { paddingHorizontal: 8, alignItems: 'center' },
    matchRing: { width: 150, height: 150, borderRadius: 75, backgroundColor: '#162525', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    matchPercentage: { color: '#FFF', fontSize: 42, fontWeight: 'bold' },
    matchLabel: { color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontSize: 10, letterSpacing: 2 },
    recalculateButton: { flexDirection: 'row', alignSelf: 'center', alignItems: 'center', gap: 8, padding: 12, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', marginTop: 24},
    recalculateButtonText: { color: '#FFF', fontWeight: 'bold', textTransform: 'uppercase', fontSize: 10 }
});

export default PartnerComparisonProfile;
