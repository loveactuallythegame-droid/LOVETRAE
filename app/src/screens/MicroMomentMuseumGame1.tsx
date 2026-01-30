
import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const ExhibitImage = () => (
    <View style={styles.exhibitContainer}>
        <Image 
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBuq3SI9wxecuDq67gvyWqWOEAKXZZuG7pAbmv3Kriz9WwQ9-M7bBxu_7iiO-QWT0nI_8ruf0hcXAX4HCnSILNgHGMRoxA9hqKsxPxS-74HOT21tChUqr_AUNx-iLWJ3uug4ZRgotG9WSbLKz6sg8gsxOnUZCxUVm-YGb03jo0IzFxJxtf21TFbc5AhVx32TPzr_dutv-fXbhkgpqfFJRWiOXsvdRgIxd2HoGQoPTKVn1toD8RU6R9vLJAWyFA3IVAzrFHlP3OuFjxj' }}
            style={styles.exhibitImage}
        />
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.imageOverlay} />
        <View style={styles.exhibitTextContainer}>
            <Text style={styles.exhibitTag}>Micro-Moment</Text>
            <Text style={styles.exhibitTitle}>The Tactile Connection</Text>
        </View>
    </View>
);

const CuratorInsight = () => (
    <View style={styles.insightCard}>
        <Text style={styles.insightTitle}>Marcie's Curator Insight</Text>
        <Text style={styles.insightText}>"The tactile connection recorded at the bakery... A testament to the silent pact made over sourdough."</Text>
    </View>
);

const EditorPanel = () => (
    <View style={styles.editorPanel}>
        <Text style={styles.editorTitle}>Caption Editor</Text>
        <TextInput 
            style={styles.captionInput}
            placeholder="Describe this moment together..."
            placeholderTextColor="rgba(255,255,255,0.3)"
            multiline
        />
        {/* Sliders would be implemented here with a library like @react-native-community/slider */}
        <TouchableOpacity style={styles.finalizeButton}>
            <Text style={styles.finalizeButtonText}>Finalize Exhibit</Text>
        </TouchableOpacity>
    </View>
);

const MicroMomentMuseumGame1 = () => {
    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#230f15', '#230f15']} style={styles.background} />
            <ScrollView contentContainerStyle={styles.scrollContent}>

                <Text style={styles.pageTitle}>Exhibit 07: The Great Carb Heist</Text>
                
                <View style={styles.mainContent}>
                    <View style={styles.leftColumn}>
                        <ExhibitImage />
                        <CuratorInsight />
                    </View>
                    <View style={styles.rightColumn}>
                        <EditorPanel />
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#230f15' },
    background: { ...StyleSheet.absoluteFillObject },
    scrollContent: { padding: 16 },
    pageTitle: { color: '#FFF', fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 16, color: '#f90248' },
    mainContent: { flexDirection: 'row', gap: 16 },
    leftColumn: { flex: 2, gap: 16 },
    rightColumn: { flex: 1 },
    exhibitContainer: { borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(249,2,72,0.5)' },
    exhibitImage: { width: '100%', height: 250 },
    imageOverlay: { ...StyleSheet.absoluteFillObject },
    exhibitTextContainer: { position: 'absolute', bottom: 12, left: 12 },
    exhibitTag: { backgroundColor: '#f90248', color: '#FFF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, textTransform: 'uppercase', fontSize: 10, fontWeight: 'bold', alignSelf: 'flex-start' },
    exhibitTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginTop: 4 },
    insightCard: { backgroundColor: 'rgba(38,25,51,0.6)', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    insightTitle: { color: '#f90248', fontWeight: 'bold', marginBottom: 8 },
    insightText: { color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' },
    editorPanel: { backgroundColor: 'rgba(38,25,51,0.6)', padding: 16, borderRadius: 16, flex: 1, borderWidth: 1, borderColor: 'rgba(115,17,212,0.5)' },
    editorTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
    captionInput: { backgroundColor: 'rgba(255,255,255,0.05)', color: '#FFF', borderRadius: 12, padding: 12, height: 100, textAlignVertical: 'top', marginBottom: 12 },
    finalizeButton: { backgroundColor: '#f90248', padding: 16, borderRadius: 12, alignItems: 'center' },
    finalizeButtonText: { color: '#FFF', fontWeight: 'bold' },
});

export default MicroMomentMuseumGame1;
