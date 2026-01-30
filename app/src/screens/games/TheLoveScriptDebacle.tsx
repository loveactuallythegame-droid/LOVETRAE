
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const falseScripts = [
    { title: "If they loved me, they'd know.", category: 'Mind Reading Script' },
    { title: 'Conflict is a sign of failure.', category: 'Avoidance Logic' },
    { title: 'Love is always easy.', category: 'Disneyfied Expectation' },
];

const LoveScriptCard = ({ script, onDeconstruct }) => (
    <TouchableOpacity style={styles.card} onPress={() => onDeconstruct(script)}>
        <Text style={styles.cardTitle}>{script.title}</Text>
        <Text style={styles.cardCategory}>{script.category}</Text>
    </TouchableOpacity>
);

const TheLoveScriptDebacle = () => {
    const [scripts, setScripts] = useState(falseScripts);
    const [deconstructed, setDeconstructed] = useState([]);

    const handleDeconstruct = (scriptToDeconstruct) => {
        setScripts(scripts.filter(s => s.title !== scriptToDeconstruct.title));
        setDeconstructed([...deconstructed, scriptToDeconstruct]);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['#121212', '#1e1b4b']} style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Text style={styles.header}>The Love-Script Debacle</Text>
                    
                    <View style={styles.grid}>
                        {scripts.map(script => (
                            <LoveScriptCard key={script.title} script={script} onDeconstruct={handleDeconstruct} />
                        ))}
                    </View>

                    <View style={styles.deconstructionZone}>
                        <MaterialIcons name="delete-forever" size={48} color="#f97316" />
                        <Text style={styles.zoneTitle}>Deconstruction Zone</Text>
                        <Text style={styles.zoneSubtitle}>Drag false scripts here to analyze.</Text>
                        {deconstructed.length > 0 && <Text style={styles.deconstructedCount}>{deconstructed.length} deconstructed</Text>}
                    </View>

                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#121212' },
    container: { flex: 1 },
    scrollContent: { padding: 24, alignItems: 'center' },
    header: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 16, marginBottom: 24 },
    card: { backgroundColor: 'rgba(28,28,28,0.8)', width: 300, padding: 20, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    cardTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
    cardCategory: { color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontSize: 10 },
    deconstructionZone: {
        width: '100%',
        padding: 32,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#f97316',
        borderStyle: 'dashed',
        borderRadius: 16,
        backgroundColor: 'rgba(249, 115, 22, 0.05)',
    },
    zoneTitle: { color: '#f97316', fontSize: 22, fontWeight: 'bold', textTransform: 'uppercase', marginTop: 8 },
    zoneSubtitle: { color: 'rgba(255,255,255,0.6)', marginTop: 8, textAlign: 'center' },
    deconstructedCount: { color: '#00ffd9', marginTop: 16, fontWeight: 'bold' },
});

export default TheLoveScriptDebacle;
