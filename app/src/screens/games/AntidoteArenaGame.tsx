import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Header } from '../../components/ui/Header'; 

const AntidoteButton = ({ title, description, color, icon }: { title: string, description: string, color: string, icon: string }) => (
    <LinearGradient
        colors={['#db147c', '#f05d68']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.antidoteButton, { borderColor: `${color}80` }]}
    >
        <View style={[styles.antidoteIconContainer, { backgroundColor: `${color}30` }]}>
            <Text style={[styles.antidoteIcon, { color: '#ffffff' }]}>{icon}</Text>
        </View>
        <View>
            <Text style={styles.antidoteTitle}>{title}</Text>
            <Text style={styles.antidoteDescription}>{description}</Text>
        </View>
    </LinearGradient>
)

const AntidoteArenaGameScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#191022', '#2a1142']} style={styles.background} />
      
      {/* Dr. Marcie Section */}
      <View style={styles.drMarcieSection}>
        <View style={styles.avatarContainer}>
          <Image source={require('../../assets/images/MarcieAvatar.png')} style={styles.avatar} />
        </View>
        <View style={styles.quoteBox}>
          <Text style={styles.quoteText}>The horsemen of relationship apocalypse can be defeated! Use these antidotes to counter destructive communication patterns.</Text>
        </View>
      </View>
      
      <Header title="Antidote Arena" />
      <View style={styles.content}>
        <View style={styles.headerSection}>
            <Text style={styles.mainTitle}>ANTIDOTE ARENA</Text>
            <Text style={styles.subtitle}>The "Horseman" of Contempt is attacking! Buzz in with the cure.</Text>
        </View>

        <LinearGradient
            colors={['#a22ac4', '#9056ef']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.soundwaveContainer}
        >
            {/* Simplified soundwave visualization */}
            <Text style={styles.soundwaveIcon}>graphic_eq</Text>
            <Text style={styles.soundwaveStatus}>Contemptuous Tone Detected</Text>
        </LinearGradient>

        <View style={styles.antidoteGrid}>
            <AntidoteButton title="Gentle Start-Up" description="Counter criticism with soft phrasing." color="#22d3ee" icon="psychology"/>
            <AntidoteButton title="Appreciation" description="Build culture of admiration." color="#ec4899" icon="favorite" />
            <AntidoteButton title="Responsibility" description="Accept your part of the conflict." color="#34d399" icon="task_alt" />
            <AntidoteButton title="Self-Soothing" description="Calm your physiological response." color="#f59e0b" icon="self_improvement" />
        </View>

        <LinearGradient
            colors={['#37cf97', '#b37dec']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.marcieHostFeed}
        >
             <Text style={styles.marcieTitle}>Dr. Marcie Liss</Text>
             <Text style={styles.marcieQuote}>"Chef's kiss contempt level, honey. Quick, what's the cure?"</Text>
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#191022' },
    background: { ...StyleSheet.absoluteFillObject },
    drMarcieSection: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 20,
        padding: 16,
        margin: 16,
        marginBottom: 8
    },
    avatarContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#fcc738',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        resizeMode: 'cover'
    },
    quoteBox: {
        flex: 1,
        backgroundColor: 'rgba(252, 199, 56, 0.2)',
        borderRadius: 12,
        padding: 12
    },
    quoteText: {
        color: '#ffffff',
        fontSize: 14,
        lineHeight: 20
    },
    content: { flex: 1, padding: 20, justifyContent: 'space-between' },
    headerSection: { alignItems: 'center', marginBottom: 20 },
    mainTitle: { 
        fontFamily: 'BarbieDream-Regular', 
        fontSize: 42, 
        color: '#ffffff', 
        fontStyle: 'italic',
        textShadowColor: 'rgba(219, 20, 124, 0.7)',
        textShadowOffset: {width: 0, height: 0},
        textShadowRadius: 10,
    },
    subtitle: { 
        fontFamily: 'SweetPink-Regular', 
        fontSize: 16, 
        color: '#db147c', 
        textAlign: 'center',
        backgroundColor: 'rgba(219, 20, 124, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    soundwaveContainer: {
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    soundwaveIcon: { 
        fontFamily: 'Material Icons', 
        fontSize: 60, 
        color: '#ffffff', 
        marginBottom: 10,
    },
    soundwaveStatus: { 
        fontFamily: 'Space Grotesk', 
        color: '#ff7600', 
        textTransform: 'uppercase', 
        letterSpacing: 3,
        backgroundColor: 'rgba(255, 118, 0, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    antidoteGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' },
    antidoteButton: {
        width: '45%',
        borderRadius: 16,
        padding: 15,
        marginBottom: 15,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    antidoteIconContainer: { 
        width: 50, 
        height: 50, 
        borderRadius: 10, 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginBottom: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    antidoteIcon: { 
        fontFamily: 'Material Icons', 
        fontSize: 30 
    },
    antidoteTitle: { 
        fontFamily: 'BarbieDream-Regular', 
        fontSize: 16, 
        color: '#ffffff', 
        textTransform: 'uppercase',
        textAlign: 'center',
    },
    antidoteDescription: { 
        fontFamily: 'SweetPink-Regular', 
        fontSize: 12, 
        color: '#ffffff', 
        marginTop: 4,
        textAlign: 'center',
        opacity: 0.8,
    },
    marcieHostFeed: {
        borderRadius: 16,
        padding: 15,
        marginTop: 20,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    marcieTitle: { 
        fontFamily: 'SweetPink-Regular', 
        textTransform: 'uppercase', 
        color: '#ffffff', 
        fontSize: 12, 
        marginBottom: 5,
        textAlign: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
    },
    marcieQuote: { 
        fontFamily: 'SweetPink-Regular', 
        fontStyle: 'italic', 
        color: '#ffffff',
        textAlign: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 8,
        borderRadius: 8,
    }
});

export default AntidoteArenaGameScreen;