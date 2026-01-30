
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const categories = [
    { title: 'Communication', icon: 'forum', color: '#22d3ee' },
    { title: 'Intimacy', icon: 'favorite', color: '#fc0c84' },
    { title: 'Trust', icon: 'shield-with-heart', color: '#34d399' },
    { title: 'Growth', icon: 'trending-up', color: '#8b5cf6' },
    { title: 'Fun & Play', icon: 'celebration', color: '#fbbf24' },
    { title: 'Shared Values', icon: 'diamond', color: '#e5e7eb' },
];

const Hexagon = ({ title, icon, color }) => (
    <TouchableOpacity style={styles.hexContainer}>
        <View style={[styles.hexagon, {borderColor: color}]}>
            <View style={styles.hexagonInner}>
                 <MaterialIcons name={icon} size={40} color={color} />
                <Text style={styles.hexTitle}>{title}</Text>
            </View>
        </View>
    </TouchableOpacity>
);

const CategorySelectionScreen = () => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['#0f0f12', '#221019']} style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollView}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Choose Your Path</Text>
                        <Text style={styles.headerSubtitle}>Select a cosmic pillar to begin your journey.</Text>
                    </View>

                    <View style={styles.progressContainer}>
                        <Text style={styles.progressText}>Journey Progress: 35%</Text>
                        <View style={styles.progressBar}>
                            <View style={[styles.progressFill, {width: '35%'}]} />
                        </View>
                    </View>

                    <View style={styles.grid}>
                        {categories.map(cat => <Hexagon key={cat.title} {...cat} />)}
                    </View>
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#0f0f12' },
    container: { flex: 1 },
    scrollView: { padding: 24, alignItems: 'center' },
    header: { alignItems: 'center', marginBottom: 24 },
    headerTitle: { color: '#fff', fontSize: 28, fontWeight: 'bold', textTransform: 'uppercase' },
    headerSubtitle: { color: 'rgba(255,255,255,0.6)', fontSize: 16, marginTop: 4, textAlign: 'center' },
    progressContainer: { width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', padding: 16, borderRadius: 12, marginBottom: 32 },
    progressText: { color: '#fff', fontWeight: 'bold', marginBottom: 8 },
    progressBar: { height: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 4 },
    progressFill: { height: '100%', backgroundColor: '#fc0c84', borderRadius: 4 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 24 },
    hexContainer: { width: 150, height: 170, alignItems: 'center', justifyContent: 'center' },
    hexagon: {
        width: 140,
        height: 160,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderRadius: 20, // Simplified shape for React Native
        transform: [{ rotate: '90deg'}],
    },
    hexagonInner: {
        transform: [{ rotate: '-90deg'}],
        alignItems: 'center',
        gap: 8,
    },
    hexTitle: { color: '#fff', fontWeight: 'bold', textTransform: 'uppercase', fontSize: 14, textAlign: 'center' },
});

export default CategorySelectionScreen;
