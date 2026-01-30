
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Header } from '../../components/ui/Header'; 

const AntidoteButton = ({ title, description, color, icon }: { title: string, description: string, color: string, icon: string }) => (
    <TouchableOpacity style={[styles.antidoteButton, { borderColor: `${color}80` }]}>
        <View style={[styles.antidoteIconContainer, { backgroundColor: `${color}30` }]}>
            <Text style={[styles.antidoteIcon, { color }]}>{icon}</Text>
        </View>
        <View>
            <Text style={styles.antidoteTitle}>{title}</Text>
            <Text style={styles.antidoteDescription}>{description}</Text>
        </View>
    </TouchableOpacity>
)

const AntidoteArenaGameScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#191022', '#2a1142']} style={styles.background} />
      <Header title="Antidote Arena" />
      <View style={styles.content}>
        <View style={styles.headerSection}>
            <Text style={styles.mainTitle}>ANTIDOTE ARENA</Text>
            <Text style={styles.subtitle}>The "Horseman" of Contempt is attacking! Buzz in with the cure.</Text>
        </View>

        <View style={styles.soundwaveContainer}>
            {/* Simplified soundwave visualization */}
            <Text style={styles.soundwaveIcon}>graphic_eq</Text>
            <Text style={styles.soundwaveStatus}>Contemptuous Tone Detected</Text>
        </View>

        <View style={styles.antidoteGrid}>
            <AntidoteButton title="Gentle Start-Up" description="Counter criticism with soft phrasing." color="#22d3ee" icon="psychology"/>
            <AntidoteButton title="Appreciation" description="Build culture of admiration." color="#ec4899" icon="favorite" />
            <AntidoteButton title="Responsibility" description="Accept your part of the conflict." color="#34d399" icon="task_alt" />
            <AntidoteButton title="Self-Soothing" description="Calm your physiological response." color="#f59e0b" icon="self_improvement" />
        </View>

        <View style={styles.marcieHostFeed}>
             <Text style={styles.marcieTitle}>Dr. Marcie Liss</Text>
             <Text style={styles.marcieQuote}>"Chef's kiss contempt level, honey. Quick, what's the cure?"</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#191022' },
    background: { ...StyleSheet.absoluteFillObject },
    content: { flex: 1, padding: 20, justifyContent: 'space-between' },
    headerSection: { alignItems: 'center', marginBottom: 20 },
    mainTitle: { fontFamily: 'BarbieDream-Regular', fontSize: 42, color: '#FFF', fontStyle: 'italic' },
    subtitle: { fontFamily: 'SweetPink-Regular', fontSize: 16, color: '#ab9db9', textAlign: 'center' },
    soundwaveContainer: {
        backgroundColor: 'rgba(20, 17, 24, 0.8)',
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(127, 19, 236, 0.3)',
        shadowColor: 'rgba(127, 19, 236, 0.3)',
        shadowRadius: 20,
        marginBottom: 20,
    },
    soundwaveIcon: { fontFamily: 'Material Icons', fontSize: 60, color: '#7f13ec', marginBottom: 10 },
    soundwaveStatus: { fontFamily: 'Space Grotesk', color: '#f87171', textTransform: 'uppercase', letterSpacing: 3 },
    antidoteGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' },
    antidoteButton: {
        width: '45%',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
    },
    antidoteIconContainer: { width: 50, height: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
    antidoteIcon: { fontFamily: 'Material Icons', fontSize: 30 },
    antidoteTitle: { fontFamily: 'BarbieDream-Regular', fontSize: 16, color: '#FFF', textTransform: 'uppercase' },
    antidoteDescription: { fontFamily: 'SweetPink-Regular', fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 4 },
    marcieHostFeed: {
        backgroundColor: 'rgba(48, 40, 57, 0.5)',
        borderRadius: 16,
        padding: 15,
        marginTop: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)'
    },
    marcieTitle: { fontFamily: 'SweetPink-Regular', textTransform: 'uppercase', color: '#7f13ec', fontSize: 12, marginBottom: 5 },
    marcieQuote: { fontFamily: 'SweetPink-Regular', fontStyle: 'italic', color: '#FFF' }
});

export default AntidoteArenaGameScreen;
