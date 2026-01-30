
import React from 'react';
import { View, Text, StyleSheet, ImageBackground, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const ArtifactImage = () => (
    <View style={styles.artifactContainer}>
        <ImageBackground 
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGshh1GoAVFeQHjdwfKpXl9JFK6rzXCAjL8XrxqcVCfeUYAIeUC3DWT1E0fvq7MdgODLk2CE9QCFOqlYCMAFYxtuXE4epUYHFDu8zLv8Dtt-eHomplxJiXr0OvwtrNySfRf2P0T7fHES2eM8YrXNfa5mCd4HbeAtmqkGuikVB9jboKIwcCAF5r4CxIf0lRrhrqfc7Nyp54djpN6CLDvlp6-VvVpKoti19lCNdB6Wh7lPiPaGj4d5jkIX7O_f88nGrprmqt9IPD1upO' }}
            style={styles.artifactImage}
            imageStyle={{ borderRadius: 16 }}
        >
            <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.imageOverlay} />
            <View style={styles.artifactTextContainer}>
                <Text style={styles.artifactTag}>Connection Artifact #7</Text>
                <Text style={styles.artifactTitle}>Hand-Holding at Midnight</Text>
            </View>
        </ImageBackground>
    </View>
);

const CurationPanel = () => (
    <View style={styles.curationPanel}>
        <Text style={styles.curationTitle}>Curate the Caption</Text>
        <TextInput 
            style={styles.captionInput}
            placeholder="Describe this micro-moment..."
            placeholderTextColor="rgba(255,255,255,0.3)"
            multiline
        />
        <View style={styles.meterContainer}>
            <Text style={styles.meterLabel}>Warmth Meter</Text>
            <View style={styles.meterTrack}><View style={[styles.meterFill, {width: '85%'}]} /></View>
        </View>
        <View style={styles.meterContainer}>
            <Text style={styles.meterLabel}>Specificity Meter</Text>
            <View style={styles.meterTrack}><View style={[styles.meterFill, {width: '42%', backgroundColor: '#20e3b2'}]} /></View>
        </View>
        <TouchableOpacity style={styles.curateButton}>
            <Text style={styles.curateButtonText}>Curate This Moment</Text>
        </TouchableOpacity>
    </View>
);

const MicroMomentMuseumGame2 = () => {
    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#181113', '#230f16']} style={styles.background} />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.pageTitle}>Micro-Moment Museum</Text>
                <View style={styles.mainContent}>
                    <View style={styles.leftColumn}>
                        <ArtifactImage />
                    </View>
                    <View style={styles.rightColumn}>
                        <CurationPanel />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#230f16' },
    background: { ...StyleSheet.absoluteFillObject },
    scrollContent: { padding: 16 },
    pageTitle: { color: '#FFF', fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
    mainContent: { flexDirection: 'row', gap: 16 },
    leftColumn: { flex: 1.5 },
    rightColumn: { flex: 1 },
    artifactContainer: { borderRadius: 16, overflow: 'hidden', borderWidth: 2, borderColor: '#39282e' },
    artifactImage: { width: '100%', height: 400, justifyContent: 'flex-end' },
    imageOverlay: { ...StyleSheet.absoluteFillObject },
    artifactTextContainer: { padding: 16 },
    artifactTag: { color: '#ff0a64', textTransform: 'uppercase', fontSize: 12, fontWeight: 'bold', marginBottom: 4 },
    artifactTitle: { color: '#FFF', fontSize: 28, fontWeight: 'bold' },
    curationPanel: { backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: 16, borderRadius: 16, flex: 1, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    curationTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
    captionInput: { backgroundColor: 'rgba(0,0,0,0.5)', color: '#FFF', borderRadius: 12, padding: 12, height: 120, textAlignVertical: 'top', marginBottom: 16, borderWidth: 1, borderColor: '#39282e' },
    meterContainer: { marginBottom: 16 },
    meterLabel: { color: '#FFF', fontSize: 14, fontWeight: 'bold', marginBottom: 8 },
    meterTrack: { height: 16, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8 },
    meterFill: { height: '100%', backgroundColor: '#ff0a64', borderRadius: 8 },
    curateButton: { backgroundColor: '#ff0a64', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 'auto' },
    curateButtonText: { color: '#FFF', fontWeight: 'bold' },
});

export default MicroMomentMuseumGame2;
