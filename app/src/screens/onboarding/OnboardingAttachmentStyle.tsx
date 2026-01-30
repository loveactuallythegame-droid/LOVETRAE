
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const AttachmentStyleOption = ({ title, subtitle, color, icon, gradient }) => (
    <TouchableOpacity style={[styles.optionButton, { borderColor: `${color}50` }]}>
         <LinearGradient colors={gradient} style={styles.iconContainer}>
            {/* Icon would go here */}
        </LinearGradient>
        <View style={styles.optionTextContainer}>
            <Text style={[styles.optionTitle, { color }]}>{title}</Text>
            <Text style={styles.optionSubtitle}>{subtitle}</Text>
        </View>
    </TouchableOpacity>
);

const OnboardingAttachmentStyleScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#120d0f', '#181114']} style={styles.background} />
            <ScrollView contentContainerStyle={styles.scrollContent}>

                <View style={styles.progressContainer}>
                    <Text style={styles.stepText}>Step 5 of 8</Text>
                    <Text style={styles.questionCounter}>Question 9 / 10</Text>
                </View>
                <View style={styles.progressBar}>
                    <LinearGradient colors={['#a855f7', '#ee2b8c']} style={styles.progressBarFill} start={{x:0, y:0}} end={{x:1, y:0}}/>
                </View>

                <View style={styles.quizContainer}>
                    <Text style={styles.questionText}>When you feel insecure in a relationship, what is your first instinct?</Text>
                    <Text style={styles.questionSubtitle}>Select the response that feels most natural to you</Text>

                    <View style={styles.optionsGrid}>
                        <AttachmentStyleOption title="Communicate Openly" subtitle="I talk about my feelings calmly" color="#2dd4bf" gradient={['#2dd4bf', '#22d3ee']} />
                        <AttachmentStyleOption title="Seek Reassurance" subtitle="I need constant signs of love" color="#facc15" gradient={['#facc15', '#fb923c']} />
                        <AttachmentStyleOption title="Create Distance" subtitle="I withdraw to protect myself" color="#f472b6" gradient={['#f472b6', '#a855f7']} />
                        <AttachmentStyleOption title="Fluctuating Reactions" subtitle="My reaction varies unpredictably" color="#a855f7" gradient={['#a855f7', '#6d28d9']} />
                    </View>
                </View>

                 <View style={styles.navContainer}>
                    <TouchableOpacity>
                        <Text style={styles.navButton}>PREVIOUS</Text>
                    </TouchableOpacity>
                     <TouchableOpacity style={styles.nextButton}>
                        <Text style={styles.nextButtonText}>NEXT QUESTION</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#120d0f' },
    background: { ...StyleSheet.absoluteFillObject },
    scrollContent: { padding: 24, justifyContent: 'space-between', flexGrow: 1 },
    progressContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    stepText: { color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontSize: 12, fontWeight: 'bold' },
    questionCounter: { color: '#ee2b8c', fontWeight: 'bold' },
    progressBar: { height: 6, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 3, marginBottom: 24 },
    progressBarFill: { height: '100%', width: '90%', borderRadius: 3 },
    quizContainer: { backgroundColor: 'rgba(24, 17, 20, 0.6)', padding: 24, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
    questionText: { color: '#FFF', fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
    questionSubtitle: { color: 'rgba(255,255,255,0.4)', textAlign: 'center', fontStyle: 'italic', marginBottom: 24 },
    optionsGrid: { gap: 16 },
    optionButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.03)', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    iconContainer: { width: 40, height: 40, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    optionTextContainer: { flex: 1 },
    optionTitle: { fontSize: 16, fontWeight: '500', marginBottom: 2 },
    optionSubtitle: { color: 'rgba(255,255,255,0.4)', fontSize: 14 },
    navContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24 },
    navButton: { color: 'rgba(255,255,255,0.4)', fontWeight: 'bold', fontSize: 14 },
    nextButton: { backgroundColor: '#ee2b8c', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 16 },
    nextButtonText: { color: '#FFF', fontWeight: 'bold' },
});

export default OnboardingAttachmentStyleScreen;
