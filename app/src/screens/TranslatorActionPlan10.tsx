
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

categories = ['Our Firsts', 'Pet Peeves', 'Dream Vacay', 'Deep Secrets', 'Future Us'];
const values = [100, 200, 300, 400, 500];

const JeopardyTile = ({ value, category, onSelect }) => {
    const [selected, setSelected] = useState(false);
    
    const handlePress = () => {
        if (!selected) {
            onSelect(category, value);
            setSelected(true);
        }
    };
    
    return (
        <TouchableOpacity onPress={handlePress} style={[styles.tile, selected && styles.tileSelected]}>
            <Text style={[styles.tileValue, selected && styles.tileValueSelected]}>${value}</Text>
        </TouchableOpacity>
    );
};

const PlayerPod = ({ name, score, color, avatar }) => (
    <View style={[styles.pod, {borderColor: color}]}>
        <Text style={styles.playerName}>{name}</Text>
        <Text style={styles.playerScore}>${score}</Text>
    </View>
);

const TranslatorActionPlan10 = () => {
    const [scores, setScores] = useState({ alex: 1200, jordan: 800 });
    const [currentPlayer, setCurrentPlayer] = useState('alex');

    const handleSelect = (category, value) => {
        // In a real game, this would involve answering a question
        setScores(prev => ({...prev, [currentPlayer]: prev[currentPlayer] + value}));
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['#0f070b', '#1a1a1a']} style={styles.container}>
                <ScrollView>
                    <Text style={styles.header}>Couple's Jeopardy</Text>
                    <View style={styles.podsContainer}>
                        <PlayerPod name="Alex" score={scores.alex} color="#2dd4bf" />
                        <PlayerPod name="Jordan" score={scores.jordan} color="#fc0c84" />
                    </View>
                    
                    <View style={styles.board}>
                        <View style={styles.categoriesContainer}>
                            {categories.map(cat => <Text key={cat} style={styles.categoryText}>{cat}</Text>)}
                        </View>
                        <View style={styles.tilesContainer}>
                            {categories.map(category => (
                                <View key={category} style={styles.column}>
                                    {values.map(value => <JeopardyTile key={`${category}-${value}`} value={value} category={category} onSelect={handleSelect} />)}
                                </View>
                            ))}
                        </View>
                    </View>
                    <TouchableOpacity style={styles.buzzButton} onPress={() => setCurrentPlayer(p => p === 'alex' ? 'jordan' : 'alex')}>
                        <Text style={styles.buzzButtonText}>Buzz In</Text>
                    </TouchableOpacity>
                    <Text style={{color: '#fff', textAlign: 'center', marginTop: 10}}>Current Player: {currentPlayer}</Text>
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#0f070b' },
    container: { flex: 1, padding: 8 },
    header: { color: '#fff', fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginVertical: 16, textTransform: 'uppercase' },
    podsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
    pod: { backgroundColor: 'rgba(26,26,26,0.7)', padding: 16, borderRadius: 16, borderWidth: 2, alignItems: 'center', width: '40%' },
    playerName: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    playerScore: { color: '#fff', fontSize: 24, fontWeight: '900' },
    board: { backgroundColor: 'rgba(0,0,0,0.3)', padding: 8, borderRadius: 16 },
    categoriesContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 8 },
    categoryText: { color: '#fc0c84', fontWeight: 'bold', textAlign: 'center', flex: 1, fontSize: 12 },
    tilesContainer: { flexDirection: 'row', justifyContent: 'space-around' },
    column: { flex: 1, marginHorizontal: 4 },
    tile: { backgroundColor: '#262626', borderRadius: 8, paddingVertical: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
    tileSelected: { backgroundColor: '#444' },
    tileValue: { color: '#facc15', fontSize: 18, fontWeight: '900' },
    tileValueSelected: { textDecorationLine: 'line-through', color: '#888' },
    buzzButton: { backgroundColor: '#14b8a6', padding: 20, borderRadius: 99, alignItems: 'center', marginHorizontal: 40, marginTop: 20 },
    buzzButtonText: { color: '#fff', fontSize: 22, fontWeight: 'bold', textTransform: 'uppercase' }
});

export default TranslatorActionPlan10;
