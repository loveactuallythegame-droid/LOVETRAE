
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const PartnerCard = ({ partner, answer, color, avatar, align }) => (
    <View style={styles.cardContainer}>
        <LinearGradient 
            colors={[`${color}20`, '#1d0b16']} 
            style={[styles.card, { borderColor: `${color}80`, alignItems: align === 'left' ? 'flex-start' : 'flex-end' }]}>
            <Image source={{ uri: avatar }} style={styles.avatar} />
            <Text style={[styles.answerText, { color }]}>{answer}</Text>
            <Text style={styles.partnerLabel}>{partner}</Text>
        </LinearGradient>
    </View>
);

const TranslatorActionPlan9 = () => {

    const question = "Who is the better driver?";
    const partner1 = { name: 'Partner 1', answer: 'ME', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAAJA0w-6d6olkTsMYKG8VlcOuiZohvhxv-0kIltZ6E2RuIaOBCPCadOD7maCtRAUWzQ1s1UeoigCsx4y6Fw__gxH2mwM6oDUSFc3X2QbkPyuJ5I-gTurhLnGInmdt29TFjxFPRq-AOjefIZ3CntF6vHycq0xeoCLyAllLWJV_xJMEtZmAYxz9mbhI4BcqfJvpf8GX5cr_vsDEzj6pS3ctSWkqtF7P6SJgWCbZItKtwuzboCOPtHTyA3u9sV7QgqjhTJht2RqDAi-MK' };
    const partner2 = { name: 'Partner 2', answer: 'HER', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQ-1Te1BiX9bhVJ24w0-1dtVgVmdhrU0ek4P7BU_Vi72i4LSwFor63vGyvAYuYuCpUtx3o5lO7cxa53uSCroE-PbMW64L4gxD48V-L6RgrpP6Rh9b3gextPA2O_TQktRbBqI8RqdLyWmF9yUf_jRfXAD79kaqkX6GVhUZl0jj0nOGsTNyfOLfIeH80TxTqnrgbu_4ek6lPtz4ortyW0rG0rIyo_o6he3ieduWDBmRbX_d9Vu0sYMESrBxXhLvfYs5m4WFpwiAWw7vz' };
    const roast = "Ouch! Someone's living in a fantasy world. Those parking tickets don't lie, Mark!";

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['#120810', '#1d0b16']} style={styles.container}>
                <Text style={styles.header}>The Big Reveal</Text>
                <View style={styles.questionContainer}>
                    <Text style={styles.questionText}>"{question}"</Text>
                </View>
                
                <View style={styles.revealContainer}>
                    <PartnerCard partner={partner1.name} answer={partner1.answer} color="#2dd4bf" avatar={partner1.avatar} align="left" />
                    
                    <View style={styles.roastContainer}>
                        <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDk_aTW4MbpEPoKcJ7J9so5udKgmhztqFRhZlMjXwaxZBzYUy_CH85HG2QoeY7emOh1vfFmFpUaHFnfHrt2hJr4-XFvHLEo8zvyZFyO9OGdoxmiejXbj03jL_TGGQ0sOi7proHpxNQZ2sShaAYaracCiwyMl4XmuH9rlNHonxAU-zD3JStjlsROVzqY-E9fXfWvCF03hpWY_UW-E1EeejiVUtn3vv7HCgMS2WQEjPXGaKHdCiSOIhlzbUFxjCijfhvqgImA-KzTH4Im' }} style={styles.hostAvatar} />
                        <View style={styles.speechBubble}>
                            <Text style={styles.roastText}>{roast}</Text>
                        </View>
                        <View style={styles.syncScore}><Text style={styles.syncText}>MISMATCH</Text></View>
                    </View>
                    
                    <PartnerCard partner={partner2.name} answer={partner2.answer} color="#f472b6" avatar={partner2.avatar} align="right" />
                </View>

                <TouchableOpacity style={styles.nextButton}>
                    <Text style={styles.nextButtonText}>Next Question</Text>
                    <MaterialIcons name="arrow-forward" size={20} color="#fff" />
                </TouchableOpacity>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#120810' },
    container: { flex: 1, alignItems: 'center', justifyContent: 'space-around', padding: 16 },
    header: { color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 3, fontSize: 14, marginBottom: 16 },
    questionContainer: { backgroundColor: 'rgba(29,11,22,0.8)', paddingVertical: 16, paddingHorizontal: 24, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    questionText: { color: '#fff', fontStyle: 'italic', fontSize: 18, fontWeight: 'bold' },
    revealContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
    cardContainer: { flex: 1, padding: 8 },
    card: { height: 250, borderRadius: 32, borderWidth: 2, justifyContent: 'center', padding: 16 },
    avatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)', alignSelf: 'center', marginBottom: 16 },
    answerText: { fontSize: 48, fontWeight: '900', textAlign: 'center', textTransform: 'uppercase' },
    partnerLabel: { color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginTop: 8 },
    roastContainer: { alignItems: 'center', marginHorizontal: -20, zIndex: 1 },
    hostAvatar: { width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: '#fc0c84' },
    speechBubble: { backgroundColor: '#fff', borderRadius: 20, padding: 12, marginTop: -20, zIndex: -1 },
    roastText: { color: '#000', fontWeight: '600', textAlign: 'center' },
    syncScore: { backgroundColor: '#000', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', marginTop: 12 },
    syncText: { color: '#fc0c84', fontWeight: 'bold' },
    nextButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fc0c84', paddingVertical: 16, paddingHorizontal: 32, borderRadius: 16 },
    nextButtonText: { color: '#fff', fontWeight: 'bold', marginRight: 8, textTransform: 'uppercase' },
});

export default TranslatorActionPlan9;
