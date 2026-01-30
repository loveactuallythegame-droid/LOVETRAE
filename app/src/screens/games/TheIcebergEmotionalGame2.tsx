
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const TheIcebergEmotionalGame2 = () => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['#05010a', '#1a052e']} style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>The Iceberg Excavation</Text>
                </View>

                <View style={styles.icebergCanvas}>
                    {/* Placeholder for the iceberg visual */}
                    <View style={styles.icebergVisual} />

                    {/* Emotion Nodes */}
                    <TouchableOpacity style={[styles.node, styles.surfaceNode]}>
                        <MaterialIcons name="priority-high" size={16} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.node, styles.midNode]}>
                        <MaterialIcons name="water-drop" size={20} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.node, styles.deepNode]}>
                        <MaterialIcons name="lock" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                <View style={styles.insightCard}>
                    <Text style={styles.insightTitle}>Insight Discovered</Text>
                    <Text style={styles.insightText}>"Anger is often a shield for sadness. Why is it safer to be angry?"</Text>
                    <TouchableOpacity style={styles.discussButton}>
                        <Text style={styles.discussButtonText}>Discuss Prompt</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#05010a' },
    container: { flex: 1, padding: 16, alignItems: 'center' },
    header: { padding: 16, alignItems: 'center' },
    headerTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
    icebergCanvas: { flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center', position: 'relative' },
    icebergVisual: {
        width: 300,
        height: 500,
        backgroundColor: 'rgba(165, 243, 252, 0.2)',
        // A simplified representation of the iceberg polygon
        transform: [{ rotate: '45deg' }],
        borderRadius: 50,
    },
    node: {
        position: 'absolute',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
    },
    surfaceNode: {
        top: '20%',
        left: '55%',
        width: 30,
        height: 30,
        backgroundColor: '#f97316',
        borderColor: '#fff',
    },
    midNode: {
        top: '45%',
        left: '65%',
        width: 40,
        height: 40,
        backgroundColor: '#ff0048',
        borderColor: '#fff',
    },
    deepNode: {
        top: '75%',
        left: '40%',
        width: 50,
        height: 50,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderColor: '#fff',
    },
    insightCard: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 280,
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#ff0048',
    },
    insightTitle: { color: '#fff', fontWeight: 'bold', marginBottom: 8 },
    insightText: { color: 'rgba(255,255,255,0.8)', marginBottom: 16, fontStyle: 'italic' },
    discussButton: { backgroundColor: '#ff0048', padding: 12, borderRadius: 8, alignItems: 'center' },
    discussButtonText: { color: '#fff', fontWeight: 'bold' },
});

export default TheIcebergEmotionalGame2;
