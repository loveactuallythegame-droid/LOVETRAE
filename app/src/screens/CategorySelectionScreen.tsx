
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const categories = [
    { title: 'Communication', icon: '💬', color: '#22d3ee' },
    { title: 'Intimacy', icon: '❤️', color: '#fc0c84' },
    { title: 'Trust', icon: '🤝', color: '#34d399' },
    { title: 'Growth', icon: '📈', color: '#8b5cf6' },
    { title: 'Fun & Play', icon: '🎉', color: '#fbbf24' },
    { title: 'Shared Values', icon: '💎', color: '#e5e7eb' },
];

const CategoryButton = ({ title, icon, color }) => (
    <TouchableOpacity style={styles.hexContainer}>
        <LinearGradient
            colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
            style={[styles.hexagon, {borderColor: color}]}>
            <View style={styles.hexagonInner}>
                 <Text style={styles.hexIcon}>{icon}</Text>
                <Text style={styles.hexTitle}>{title}</Text>
            </View>
        </LinearGradient>
    </TouchableOpacity>
);

const CategorySelectionScreen = () => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['#2A002A', '#5A005A']} style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollView}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>CHOOSE YOUR PATH</Text>
                        <Text style={styles.headerSubtitle}>Select a cosmic pillar to begin your journey.</Text>
                    </View>

                    <View style={styles.progressCard}>
                        <Text style={styles.progressText}>JOURNEY PROGRESS: 35%</Text>
                        <View style={styles.progressBar}>
                            <LinearGradient
                                colors={['#FF4081', '#E040FB']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={[styles.progressFill, {width: '35%'}]} />
                        </View>
                    </View>

                    <View style={styles.grid}>
                        {categories.map(cat => <CategoryButton key={cat.title} {...cat} />)}
                    </View>
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#2A002A' },
    container: { flex: 1 },
    scrollView: { padding: 24, alignItems: 'center' },
    header: { alignItems: 'center', marginBottom: 24 },
    headerTitle: { color: '#fff', fontSize: 28, fontWeight: 'bold', textTransform: 'uppercase' },
    headerSubtitle: { color: '#D1C4E9', fontSize: 16, marginTop: 4, textAlign: 'center' },
    progressCard: {
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 16,
        borderRadius: 20,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: 'rgba(255, 64, 129, 0.5)',
    },
    progressText: { color: '#fff', fontWeight: 'bold', marginBottom: 8, textTransform: 'uppercase' },
    progressBar: { height: 8, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 4 },
    progressFill: { height: '100%', borderRadius: 4 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 16 },
    hexContainer: { width: 160, height: 160, alignItems: 'center', justifyContent: 'center' },
    hexagon: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderRadius: 20,
        padding: 8,
    },
    hexagonInner: {
        alignItems: 'center',
        gap: 8,
    },
    hexIcon: {
        fontSize: 40,
    },
    hexTitle: { color: '#fff', fontWeight: 'bold', textTransform: 'uppercase', fontSize: 14, textAlign: 'center' },
});

export default CategorySelectionScreen;
