
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const jeopardyCategories = [
    'SHARED HISTORY', 'THE TRUTH HURTS', 'FUTURE ECHOES', 'RED FLAGS', 'EMOTIONAL DEBT'
];
const pointValues = [100, 200, 300, 400, 500];

const JeopardyTile = ({ points, category, onPress, answered }) => (
    <TouchableOpacity
        style={[styles.tile, answered && styles.tileAnswered]}
        onPress={() => !answered && onPress(category, points)}
    >
        {answered ? (
            <Text>✅</Text>
        ) : (
            <Text style={styles.tileText}>${points}</Text>
        )}
    </TouchableOpacity>
);

const RelationalJeopardyScreen = () => {
    const [answeredTiles, setAnsweredTiles] = useState([]);
    const [activeChallenge, setActiveChallenge] = useState('Select a challenge from the board.');
    const [score, setScore] = useState(2450);

    const handleTilePress = (category, points) => {
        setActiveChallenge(`For $${points} in ${category}: [Challenge text would appear here]`);
        setAnsweredTiles([...answeredTiles, `${category}-${points}`]);
        setScore(score + points);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['#2A002A', '#5A005A']} style={styles.container}>
                <ScrollView>
                    <Text style={styles.mainTitle}>ROUND 4: <Text style={styles.titleHighlight}>THE RECONSTRUCTION</Text></Text>
                    <Text style={styles.subtitle}>Navigate the debris of deception to earn Truth Credits.</Text>

                    <View style={styles.gameContainer}>
                        <View style={styles.gameBoard}>
                            <View style={styles.headerRow}>
                                {jeopardyCategories.map(cat => <Text key={cat} style={styles.headerText}>{cat}</Text>)}
                            </View>
                            {pointValues.map(points => (
                                <View key={points} style={styles.row}>
                                    {jeopardyCategories.map(cat => (
                                        <JeopardyTile
                                            key={`${cat}-${points}`}
                                            points={points}
                                            category={cat}
                                            onPress={handleTilePress}
                                            answered={answeredTiles.includes(`${cat}-${points}`)}
                                        />
                                    ))}
                                </View>
                            ))}
                        </View>

                        <View style={styles.sidebar}>
                            <View style={styles.hostCard}>
                                <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDS1ktnh6XHzI_hYICSUMOk3mD_JdG-qG0xuVTn-OQHJG0NtPyluPJzSRFymjhhFEU135-FdKbLamcK5siB9iVQUFNNjAJWKp3VhkjkZLi1cg45Ia3h9-ifsb9CGlI8d-sjWiGmgpX3uEwvU3WCRtyIfaFIctGn_SQVdsovoU3vKrXG6NmMryD2x_45HBkjgX2q-QjgvpybWa1vx51Q4ZN7EqVR5BhI3eM97CkLRxj-k_tcY9sP_H81IaqsY7TVBUuBdLrRrgbTPAjT' }} style={styles.hostImage} />
                                <Text style={styles.hostName}>DR. MARCIE LISS</Text>
                                <Text style={styles.hostTitle}>QUIZMASTER</Text>
                                <Text style={styles.hostQuote}>"Don't blink. Deception thrives in the moments we look away from the truth."</Text>
                            </View>
                            <View style={styles.scoreCard}>
                                <Text style={styles.scoreLabel}>TRUST POINTS</Text>
                                <Text style={styles.scoreValue}>{score.toLocaleString()}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.actionArea}>
                         <View style={styles.challengeDisplay}>
                            <Text style={styles.challengeLabel}>ACTIVE CHALLENGE</Text>
                            <Text style={styles.challengeText}>{activeChallenge}</Text>
                        </View>
                        <TouchableOpacity style={styles.buzzButton}>
                            <Text style={{fontSize: 40}}>⚡️</Text>
                            <Text style={styles.buzzButtonText}>BUZZ IN</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#2A002A' },
    container: { flex: 1 },
    mainTitle: { fontSize: 32, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginTop: 20, textTransform: 'uppercase' },
    titleHighlight: { fontStyle: 'italic', color: '#FF4081' },
    subtitle: { fontSize: 16, color: '#D1C4E9', textAlign: 'center', marginBottom: 20, fontWeight: 'bold' },
    gameContainer: { flexDirection: 'row', paddingHorizontal: 10 },
    gameBoard: { flex: 3 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-around' },
    headerText: { color: '#FFD700', fontWeight: 'bold', textAlign: 'center', padding: 8, fontSize: 10, textTransform: 'uppercase' },
    row: { flexDirection: 'row' },
    tile: { flex: 1, margin: 4, height: 80, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 8, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)' },
    tileAnswered: { backgroundColor: 'rgba(0,0,0,0.3)' },
    tileText: { color: '#FFD700', fontSize: 28, fontWeight: 'bold' },
    sidebar: { flex: 1, paddingLeft: 10 },
    hostCard: { backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 12, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)' },
    hostImage: { width: '100%', height: 120, borderRadius: 8, marginBottom: 8 },
    hostName: { color: '#fff', fontSize: 18, fontWeight: 'bold', textTransform: 'uppercase' },
    hostTitle: { color: '#FF4081', textTransform: 'uppercase', fontSize: 12, marginBottom: 8, fontWeight: 'bold' },
    hostQuote: { color: '#D1C4E9', fontStyle: 'italic' },
    scoreCard: { backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 12, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)' },
    scoreLabel: { color: '#D1C4E9', textTransform: 'uppercase', fontSize: 12, fontWeight: 'bold' },
    scoreValue: { color: '#FF4081', fontSize: 36, fontWeight: 'bold' },
    actionArea: { padding: 20, alignItems: 'center' },
    challengeDisplay: { backgroundColor: 'rgba(255, 64, 129, 0.2)', borderRadius: 12, padding: 16, marginBottom: 16, width: '100%', borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)' },
    challengeLabel: { color: '#D1C4E9', textTransform: 'uppercase', fontSize: 12, textAlign: 'center', fontWeight: 'bold' },
    challengeText: { color: '#fff', fontStyle: 'italic', fontSize: 16, textAlign: 'center', marginTop: 4 },
    buzzButton: { width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: 'rgba(255, 64, 129, 0.5)' },
    buzzButtonText: { color: '#FF4081', fontWeight: 'bold', marginTop: 4, textTransform: 'uppercase' },
});

export default RelationalJeopardyScreen;
