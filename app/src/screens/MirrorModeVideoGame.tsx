
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

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
        {word && <TouchableOpacity onPress={onClear}><Text>❌</Text></TouchableOpacity>}
    </View>
);

const MirrorModeVideoGame = () => {

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#2A002A', '#5A005A']} style={styles.background} />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                
                <Text style={styles.headerTitle}>MIRROR MODE: DESCRIBE ME IN 3 WORDS</Text>

                <View style={styles.mainContent}>
                    <View style={styles.leftPanel}>
                        <VideoPanel />
                        <View style={styles.analysisContainer}>
                            <Text style={{color: 'white', textAlign: 'center', textTransform: 'uppercase', fontWeight: 'bold'}}>VOCAL TONE & AUTHENTICITY GAUGES</Text>
                        </View>
                    </View>
                    
                    <View style={styles.rightPanel}>
                        <View style={styles.wordSelectionPanel}>
                            <Text style={styles.wordSelectionTitle}>YOUR WORD CHOICES</Text>
                            <WordChoice number="01" word="RADIANT" onClear={() => {}} />
                            <WordChoice number="02" />
                            <WordChoice number="03" />
                             <TouchableOpacity style={styles.submitButton}>
                                <Text style={styles.submitButtonText}>SUBMIT SELECTION</Text>
                            </TouchableOpacity>
                        </View>
                         <View style={styles.critiquePanel}>
                            <Text style={styles.critiqueTitle}>THE STYLIST'S CRITIQUE</Text>
                            <Text style={styles.critiqueText}>"Ooh, the emotional alignment here is sparkling!"</Text>
                        </View>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#2A002A' },
    background: { ...StyleSheet.absoluteFillObject },
    scrollContent: { padding: 16 },
    headerTitle: { color: '#FFF', fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 16, textTransform: 'uppercase' },
    mainContent: { flexDirection: 'row', gap: 16 },
    leftPanel: { flex: 1.5, gap: 16 },
    rightPanel: { flex: 1, gap: 16 },
    videoPanel: { height: 250, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)' },
    videoBackground: { flex: 1, padding: 12 },
    recBadge: { flexDirection: 'row', backgroundColor: 'red', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, alignItems: 'center', alignSelf: 'flex-start' },
    recDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'white', marginRight: 4 },
    recText: { color: 'white', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
    analysisContainer: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20, padding: 16, flex: 1, justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)' },
    wordSelectionPanel: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20, padding: 16, gap: 12, borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)' },
    wordSelectionTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 8, textTransform: 'uppercase' },
    wordChoiceContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)', padding: 12, borderRadius: 12 },
    wordNumber: { color: '#00FFFF', fontWeight: 'bold', marginRight: 8 },
    wordText: { color: '#FFF', flex: 1, fontSize: 16, fontWeight: 'bold', textTransform: 'uppercase' },
    submitButton: { backgroundColor: '#00FFFF', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
    submitButtonText: { color: '#000', fontWeight: 'bold', textTransform: 'uppercase' },
    critiquePanel: { backgroundColor: 'rgba(255, 64, 129, 0.2)', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)' },
    critiqueTitle: { color: '#FF4081', textTransform: 'uppercase', fontSize: 10, fontWeight: 'bold' },
    critiqueText: { color: '#FFF', fontStyle: 'italic', marginTop: 8 },
});

export default MirrorModeVideoGame;
