
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const XPDisplay = ({ label, value, color, icon }) => (
    <View style={styles.xpBox}>
        <Text style={{fontSize: 20}}>{icon}</Text>
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
                colors={['#2A002A', '#5A005A']}
                style={styles.background}
            />

            <View style={styles.mainContent}>
                <View style={styles.glassPanel}>
                    <Text style={styles.subHeader}>REPAIR SESSION COMPLETE</Text>
                    <Text style={styles.mainHeader}>DO YOU FEEL BETTER?</Text>
                    <Text style={styles.description}>Take a moment to reflect on your progress together.</Text>

                    <View style={styles.ratingContainer}>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <TouchableOpacity key={i}>
                                <Text style={[styles.star, i <= rating ? styles.filledStar : {}]}>★</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity style={styles.finishButton}>
                        <Text style={styles.finishButtonText}>FINISH SESSION</Text>
                    </TouchableOpacity>
                     <TouchableOpacity>
                        <Text style={styles.noteButton}>ADD A PRIVATE NOTE</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.xpContainer}>
                    <XPDisplay label="CONNECTION" value="+250 XP" color="#FFD700" icon="🤝"/>
                    <XPDisplay label="INSIGHT" value="+120 XP" color="#00FFFF" icon="💡"/>
                    <XPDisplay label="HARMONY" value="LEVEL UP!" color="#FF4081" icon="🎶"/>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#2A002A' },
    background: { ...StyleSheet.absoluteFillObject },
    mainContent: { flex: 1, justifyContent: 'center', padding: 24 },
    glassPanel: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 24,
        padding: 32,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 64, 129, 0.5)',
    },
    subHeader: { color: '#D1C4E9', textTransform: 'uppercase', letterSpacing: 3, marginBottom: 8, fontWeight: 'bold' },
    mainHeader: { color: '#FFF', fontSize: 36, fontWeight: 'bold', marginBottom: 8, textTransform: 'uppercase' },
    description: { color: '#D1C4E9', fontSize: 16, textAlign: 'center', marginBottom: 24 },
    ratingContainer: { flexDirection: 'row', gap: 16, marginBottom: 24 },
    star: { fontSize: 40, color: 'rgba(255,255,255,0.2)' },
    filledStar: { color: '#FFD700', textShadowColor: '#FFD700', textShadowRadius: 8 },
    finishButton: {
        width: '100%',
        padding: 20,
        borderRadius: 16,
        backgroundColor: '#FF4081',
    },
    finishButtonText: { color: '#FFF', fontWeight: 'bold', textAlign: 'center', textTransform: 'uppercase', letterSpacing: 1 },
    noteButton: { color: '#D1C4E9', marginTop: 16, textTransform: 'uppercase', letterSpacing: 1, fontSize: 12, fontWeight: 'bold' },
    xpContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24, gap: 16 },
    xpBox: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 64, 129, 0.5)',
        flexDirection: 'row',
        gap: 8,
    },
    xpLabel: { color: '#D1C4E9', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 'bold' },
    xpValue: { fontSize: 14, fontWeight: 'bold', marginTop: 4 },
});

export default PostRepairScreen;
