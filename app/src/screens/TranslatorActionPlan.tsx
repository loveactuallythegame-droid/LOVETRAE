
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const actionSteps = [
    {
        title: 'THE APPROACH',
        description: 'Active Listening: Shift your mindset to hear their needs without formulating a rebuttal.',
        category: 'MINDSET SHIFT',
        icon: '🧠',
        color: '#FFD700'
    },
    {
        title: 'THE ACTION',
        description: '10-Minute Check-in: Set aside focused, phone-free time tonight to discuss how you feel.',
        category: 'BEHAVIORAL TASK',
        icon: '💬',
        color: '#00FFFF'
    },
    {
        title: 'THE MAINTENANCE',
        description: 'Gratitude: Express one specific thing you appreciate about how they handled this talk.',
        category: 'LONG-TERM BOND',
        icon: '💖',
        color: '#FF4081'
    },
];

const ActionCard = ({ step }) => (
    <View style={[styles.card, { borderColor: `${step.color}80` }]}>
        <View style={styles.cardHeader}>
            <View style={[styles.iconContainer, { backgroundColor: `${step.color}20` }]}>
                <Text style={{fontSize: 30}}>{step.icon}</Text>
            </View>
        </View>
        <Text style={styles.cardTitle}>{step.title}</Text>
        <Text style={styles.cardDescription}>{step.description}</Text>
        <Text style={[styles.cardCategory, { color: step.color }]}>{step.category}</Text>
    </View>
);

const TranslatorActionPlan = () => {
    const [scheduleReflection, setScheduleReflection] = useState(true);

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['#2A002A', '#5A005A']} style={styles.container}>
                <ScrollView contentContainerStyle={styles.contentContainer}>
                    <Text style={styles.headerTitle}>YOUR ACTION PLAN</Text>
                    <Text style={styles.headerSubtitle}>CONCRETE STEPS TO HONOR YOUR DECODED CONNECTION</Text>

                    <View style={styles.cardsContainer}>
                        {actionSteps.map((step, index) => <ActionCard key={index} step={step} />)}
                    </View>

                    <View style={styles.reflectionContainer}>
                        <View style={{flex: 1}}>
                            <Text style={styles.reflectionTitle}>SCHEDULE REFLECTION</Text>
                            <Text style={styles.reflectionSubtitle}>Get a reminder to revisit this plan in 48 hours.</Text>
                        </View>
                        <Switch 
                            value={scheduleReflection}
                            onValueChange={setScheduleReflection}
                            trackColor={{ false: '#767577', true: '#00FFFF' }}
                            thumbColor={scheduleReflection ? '#fff' : '#f4f3f4'}
                        />
                    </View>

                    <TouchableOpacity style={styles.commitButton}>
                        <Text style={{fontSize: 24}}>✅</Text>
                        <Text style={styles.commitButtonText}>COMMIT TO PLAN</Text>
                    </TouchableOpacity>
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#2A002A' },
    container: { flex: 1 },
    contentContainer: { padding: 20 },
    headerTitle: { color: '#fff', fontSize: 36, fontWeight: '900', textAlign: 'center', textTransform: 'uppercase' },
    headerSubtitle: { color: '#D1C4E9', fontSize: 18, textAlign: 'center', marginBottom: 30, fontWeight: 'bold', textTransform: 'uppercase' },
    cardsContainer: { marginBottom: 30, gap: 16 },
    card: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20, padding: 20, borderWidth: 1 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
    iconContainer: { width: 50, height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    cardTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 8, textTransform: 'uppercase' },
    cardDescription: { color: '#D1C4E9', fontSize: 16, lineHeight: 24, flex: 1, marginBottom: 12 },
    cardCategory: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 },
    reflectionContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)', marginBottom: 30 },
    reflectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', textTransform: 'uppercase' },
    reflectionSubtitle: { color: '#D1C4E9', fontSize: 14, marginTop: 4 },
    commitButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FF4081', padding: 20, borderRadius: 16 },
    commitButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginLeft: 10, textTransform: 'uppercase' },
});

export default TranslatorActionPlan;
