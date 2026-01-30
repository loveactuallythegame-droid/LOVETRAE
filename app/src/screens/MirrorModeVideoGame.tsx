
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const VideoPanel = () => (
    <View style={styles.videoPanel}>
        <ImageBackground 
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiN6Q4CManweyEOrh4Efqh_CmqAMTBWRxVdWm5H804g8IVZstS17iL9nOhbfo0gSVBLVtot5_ZjNalRBifWwSm-O9WJQuchs8wZvmzc_Kms-k27Giyu3OI_jSUSOp0nCMSSWVCL8VvJsF0k0Jp0OXGIEovJQYdSC0FvBELVpi2nrRAfbrKUQmcFCJ_dYSSjgnPvGuXp7CBoJZNufWxKT9Wq6B7aheKPEa4zKx2rht7RPRRgto4vZzfdY7Nb6HEbO5USIl1WKO7Mgrk' }}
            style={styles.videoBackground}
            imageStyle={{ borderRadius: 16 }}
        >
            <View style={styles.recBadge}>
                <View style={styles.recDot} />
                <Text style={styles.recText}>REC</Text>
            </View>
        </ImageBackground>
    </View>
);

const WordChoice = ({ number, word, onClear }) => (
    <View style={styles.wordChoiceContainer}>
        <Text style={styles.wordNumber}>{number}.</Text>
        <Text style={styles.wordText}>{word || '...'}</Text>
        {word && <TouchableOpacity onPress={onClear}><MaterialIcons name="close" size={20} color="#FFF" /></TouchableOpacity>}
    </View>
);

const MirrorModeVideoGame = () => {

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#0d0b14', '#101f22']} style={styles.background} />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                
                <Text style={styles.headerTitle}>Mirror Mode: Describe me in 3 words</Text>

                <View style={styles.mainContent}>
                    <View style={styles.leftPanel}>
                        <VideoPanel />
                        <View style={styles.analysisContainer}>
                            {/* Gauges would be implemented here */}
                            <Text style={{color: 'white', textAlign: 'center'}}>Vocal Tone & Authenticity Gauges</Text>
                        </View>
                    </View>
                    
                    <View style={styles.rightPanel}>
                        <View style={styles.wordSelectionPanel}>
                            <Text style={styles.wordSelectionTitle}>Your Word Choices</Text>
                            <WordChoice number="01" word="Radiant" onClear={() => {}} />
                            <WordChoice number="02" />
                            <WordChoice number="03" />
                             <TouchableOpacity style={styles.submitButton}>
                                <Text style={styles.submitButtonText}>Submit Selection</Text>
                            </TouchableOpacity>
                        </View>
                         <View style={styles.critiquePanel}>
                            <Text style={styles.critiqueTitle}>The Stylist's Critique</Text>
                            <Text style={styles.critiqueText}>"Ooh, the emotional alignment here is sparkling!"</Text>
                        </View>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0d0b14' },
    background: { ...StyleSheet.absoluteFillObject },
    scrollContent: { padding: 16 },
    headerTitle: { color: '#FFF', fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
    mainContent: { flexDirection: 'row', gap: 16 },
    leftPanel: { flex: 1.5, gap: 16 },
    rightPanel: { flex: 1, gap: 16 },
    videoPanel: { height: 250, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    videoBackground: { flex: 1, padding: 12 },
    recBadge: { flexDirection: 'row', backgroundColor: 'red', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, alignItems: 'center', alignSelf: 'flex-start' },
    recDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'white', marginRight: 4 },
    recText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
    analysisContainer: { backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: 16, flex: 1, justifyContent: 'center' },
    wordSelectionPanel: { backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: 16, gap: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    wordSelectionTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
    wordChoiceContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)', padding: 12, borderRadius: 8 },
    wordNumber: { color: '#13c8ec', fontWeight: 'bold', marginRight: 8 },
    wordText: { color: '#FFF', flex: 1, fontSize: 16 },
    submitButton: { backgroundColor: '#13c8ec', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 8 },
    submitButtonText: { color: '#0d0b14', fontWeight: 'bold' },
    critiquePanel: { backgroundColor: 'rgba(244,114,182,0.05)', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: 'rgba(244,114,182,0.3)' },
    critiqueTitle: { color: '#f472b6', textTransform: 'uppercase', fontSize: 10, fontWeight: 'bold' },
    critiqueText: { color: '#FFF', fontStyle: 'italic', marginTop: 8 },
});

export default MirrorModeVideoGame;

