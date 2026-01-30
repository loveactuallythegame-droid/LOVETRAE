
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Draggable from 'react-native-draggable'; // Assuming this library for drag-and-drop

const ResentmentTag = ({ text, onRelease }: { text: string, onRelease: () => void }) => {
    // A real implementation would have more sophisticated drag/drop detection
    return (
        <Draggable x={50} y={50} onDragRelease={onRelease}>
            <View style={styles.resentmentTag}>
                <Text style={styles.resentmentTagText}>{text}</Text>
            </View>
        </Draggable>
    );
};

const ApologyAndReleaseWorkshopScreen = () => {
    const [letterText, setLetterText] = useState('');
    const [resentments, setResentments] = useState([
        'Broken Trust',
        'That argument on Friday',
        'Feeling Ignored',
    ]);

    const handleRelease = (index: number) => {
        let newResentments = [...resentments];
        newResentments.splice(index, 1);
        setResentments(newResentments);
    };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#120812', '#230f16']} style={styles.background} />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <Text style={styles.mainTitle}>Apology & Release Workshop</Text>
            <Text style={styles.subtitle}>Burning the Past to Build the Future</Text>
            
            <View style={styles.workshopGrid}>
                <View style={styles.column}>
                    <Text style={styles.columnTitle}>The Apology Letter</Text>
                    <View style={styles.letterInputContainer}>
                         <TextInput 
                            style={styles.letterInput}
                            multiline
                            placeholder="I apologize for... I understand this hurt you because... In the future, I will..."
                            placeholderTextColor="#18111840"
                            onChangeText={setLetterText}
                            value={letterText}
                         />
                    </View>
                </View>

                <View style={styles.column}>
                    <Text style={styles.columnTitle}>The Release Flame</Text>
                    <View style={styles.flameContainer}>
                        {/* Flame visual effect */}
                        <View style={styles.flame} />
                        {resentments.map((text, index) => (
                            <ResentmentTag key={index} text={text} onRelease={() => handleRelease(index)} />
                        ))}
                    </View>
                </View>
            </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#230f16' },
    background: { ...StyleSheet.absoluteFillObject },
    scrollViewContent: { padding: 20 },
    mainTitle: { fontFamily: 'BarbieDream-Regular', fontSize: 36, color: '#FFF', textAlign: 'center' },
    subtitle: { fontFamily: 'SweetPink-Regular', fontSize: 16, color: '#ff005e', textAlign: 'center', marginBottom: 30 },
    workshopGrid: { flexDirection: 'row', justifyContent: 'space-around' },
    column: { flex: 1, marginHorizontal: 10 },
    columnTitle: { fontFamily: 'BarbieDream-Regular', fontSize: 22, color: '#FFF', marginBottom: 15 },
    letterInputContainer: { backgroundColor: '#fdfaf1', borderRadius: 10, minHeight: 400, padding: 20 },
    letterInput: { color: '#181118', fontSize: 16, flex: 1 },
    flameContainer: {
        flex: 1,
        backgroundColor: 'rgba(28, 17, 30, 0.6)',
        borderRadius: 10,
        minHeight: 400,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
    },
    flame: { 
        width: 150, 
        height: 200,
        backgroundColor: '#ee2bee', 
        borderRadius: 75,
        blurRadius: 50,
        position: 'absolute',
        bottom: -50, 
    },
    resentmentTag: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    resentmentTagText: { fontFamily: 'SweetPink-Regular', color: '#FFF' }
});

export default ApologyAndReleaseWorkshopScreen;
