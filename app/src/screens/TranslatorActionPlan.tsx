
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const actionSteps = [
    {
        title: 'The Approach',
        description: 'Active Listening: Shift your mindset to hear their needs without formulating a rebuttal.',
        category: 'Mindset Shift',
        icon: 'psychology',
        color: '#facc15'
    },
    {
        title: 'The Action',
        description: '10-Minute Check-in: Set aside focused, phone-free time tonight to discuss how you feel.',
        category: 'Behavioral Task',
        icon: 'chat_bubble',
        color: '#2dd4bf'
    },
    {
        title: 'The Maintenance',
        description: 'Gratitude: Express one specific thing you appreciate about how they handled this talk.',
        category: 'Long-term Bond',
        icon: 'favorite',
        color: '#fc0c84'
    },
];

const ActionCard = ({ step }) => (
    <View style={[styles.card, { borderColor: `${step.color}80` }]}>
        <View style={styles.cardHeader}>
            <View style={[styles.iconContainer, { backgroundColor: `${step.color}20` }]}>
                <MaterialIcons name={step.icon} size={30} color={step.color} />
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
            <LinearGradient colors={['#230f19', '#221019']} style={styles.container}>
                <ScrollView contentContainerStyle={styles.contentContainer}>
                    <Text style={styles.headerTitle}>Your Action Plan</Text>
                    <Text style={styles.headerSubtitle}>Concrete steps to honor your decoded connection</Text>

                    <View style={styles.cardsContainer}>
                        {actionSteps.map((step, index) => <ActionCard key={index} step={step} />)}
                    </View>

                    <View style={styles.reflectionContainer}>
                        <View style={{flex: 1}}>
                            <Text style={styles.reflectionTitle}>Schedule Reflection</Text>
                            <Text style={styles.reflectionSubtitle}>Get a reminder to revisit this plan in 48 hours.</Text>
                        </View>
                        <Switch 
                            value={scheduleReflection}
                            onValueChange={setScheduleReflection}
                            trackColor={{ false: '#767577', true: '#14b8a6' }}
                            thumbColor={scheduleReflection ? '#fff' : '#f4f3f4'}
                        />
                    </View>

                    <TouchableOpacity style={styles.commitButton}>
                        <MaterialIcons name="verified_user" size={24} color="#fff" />
                        <Text style={styles.commitButtonText}>Commit to Plan</Text>
                    </TouchableOpacity>
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#230f19' },
    container: { flex: 1 },
    contentContainer: { padding: 20 },
    headerTitle: { color: '#fff', fontSize: 36, fontWeight: '900', textAlign: 'center' },
    headerSubtitle: { color: '#c992ac', fontSize: 18, textAlign: 'center', marginBottom: 30 },
    cardsContainer: { marginBottom: 30 },
    card: { backgroundColor: 'rgba(34,16,25,0.7)', borderRadius: 20, padding: 20, marginBottom: 16, borderWidth: 1 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
    iconContainer: { width: 50, height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    cardTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
    cardDescription: { color: '#c992ac', fontSize: 16, lineHeight: 24, flex: 1, marginBottom: 12 },
    cardCategory: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 },
    reflectionContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(34,16,25,0.8)', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', marginBottom: 30 },
    reflectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    reflectionSubtitle: { color: '#c992ac', fontSize: 14, marginTop: 4 },
    commitButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fc0c84', padding: 20, borderRadius: 16 },
    commitButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
});

export default TranslatorActionPlan;
