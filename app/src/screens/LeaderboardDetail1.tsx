
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const XPDisplay = ({ label, value, color, icon }) => (
    <View style={styles.xpBox}>
        {/* Icon can be added here */}
        <View>
            <Text style={styles.xpLabel}>{label}</Text>
            <Text style={[styles.xpValue, { color }]}>{value}</Text>
        </View>
    </View>
);

const PostRepairScreen = () => {
    const rating = 4;

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={['#0a0508', 'rgba(157, 78, 221, 0.05)', '#0a0508']}
                style={styles.background}
            />

            <View style={styles.mainContent}>
                <View style={styles.glassPanel}>
                    <Text style={styles.subHeader}>Repair Session Complete</Text>
                    <Text style={styles.mainHeader}>Do you feel better?</Text>
                    <Text style={styles.description}>Take a moment to reflect on your progress together.</Text>

                    <View style={styles.ratingContainer}>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <TouchableOpacity key={i}>
                                {/* Star Icon would go here - using text for now */}
                                <Text style={[styles.star, i <= rating ? styles.filledStar : {}]}>★</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity style={styles.finishButton}>
                        <Text style={styles.finishButtonText}>Finish Session</Text>
                    </TouchableOpacity>
                     <TouchableOpacity>
                        <Text style={styles.noteButton}>Add a private note</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.xpContainer}>
                    <XPDisplay label="Connection" value="+250 XP" color="#FF8C00" />
                    <XPDisplay label="Insight" value="+120 XP" color="#9d4edd" />
                    <XPDisplay label="Harmony" value="Level Up!" color="#ff00ff" />
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0508' },
    background: { ...StyleSheet.absoluteFillObject },
    mainContent: { flex: 1, justifyContent: 'center', padding: 24 },
    glassPanel: {
        backgroundColor: 'rgba(26, 19, 23, 0.85)',
        borderRadius: 24,
        padding: 32,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    subHeader: { color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 3, marginBottom: 8 },
    mainHeader: { color: '#FFF', fontSize: 36, fontWeight: 'bold', marginBottom: 8 },
    description: { color: 'rgba(255,255,255,0.6)', fontSize: 16, textAlign: 'center', marginBottom: 24 },
    ratingContainer: { flexDirection: 'row', gap: 16, marginBottom: 24 },
    star: { fontSize: 40, color: 'rgba(255,255,255,0.2)' },
    filledStar: { color: '#FFD700', textShadowColor: '#FFD700', textShadowRadius: 8 },
    finishButton: {
        width: '100%',
        padding: 20,
        borderRadius: 16,
        backgroundColor: '#ee2b8c', // Fallback, LinearGradient would be better
    },
    finishButtonText: { color: '#FFF', fontWeight: 'bold', textAlign: 'center', textTransform: 'uppercase', letterSpacing: 1 },
    noteButton: { color: 'rgba(255,255,255,0.4)', marginTop: 16, textTransform: 'uppercase', letterSpacing: 1, fontSize: 12 },
    xpContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24, gap: 16 },
    xpBox: {
        flex: 1,
        backgroundColor: 'rgba(26, 19, 23, 0.85)',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    xpLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 },
    xpValue: { fontSize: 14, fontWeight: 'bold', marginTop: 4 },
});

export default PostRepairScreen;
