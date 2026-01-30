
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Picker } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const DateNightRouletteGame1Screen = () => {

    // Using require for local images
    const hostImage = require('../../assets/images/DrMarcieLiss.png');

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#181114', '#230f15']} style={styles.background} />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                 <View style={styles.header}>
                    <Text style={styles.headerTitle}>Date Night <Text style={styles.headerTitlePrimary}>Roulette</Text></Text>
                    <Text style={styles.headerSubtitle}>Where will tonight take you?</Text>
                </View>

                <View style={styles.mainLayout}>
                    {/* Left Sidebar */}
                    <View style={styles.sidebar}>
                        <View style={styles.glassPanel}>
                            <Text style={styles.sidebarTitle}>Set the Vibe</Text>
                            <Picker style={styles.picker}>
                                <Picker.Item label="Balanced ($$)" value="mid" />
                                <Picker.Item label="Thrifty ($)" value="low" />
                                <Picker.Item label="Bougie ($$$)" value="high" />
                            </Picker>
                            <Picker style={styles.picker}>
                                <Picker.Item label="Casual Fun (Mid)" value="mid" />
                                <Picker.Item label="Netflix & Chill (Low)" value="low" />
                                <Picker.Item label="Adrenaline Junkie (High)" value="high" />
                            </Picker>
                        </View>
                    </View>

                    {/* Center Roulette */}
                    <View style={styles.centerContent}>
                        <View style={styles.wheelContainer}>
                            <View style={styles.wheel} />
                            <TouchableOpacity style={styles.spinButton}>
                                <Text style={styles.spinButtonText}>SPIN</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    
                    {/* Right Sidebar */}
                    <View style={styles.sidebar}>
                         <View style={styles.speechBubble}>
                             <Text style={styles.speechText}>"Ooh, I love this vibe! Let's see what destiny has in store..."</Text>
                         </View>
                        {/* Image would be here if we can resolve the path issue */}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#181114' },
    background: { ...StyleSheet.absoluteFillObject },
    scrollContainer: { flexGrow: 1, padding: 20 },
    header: { alignItems: 'center', marginBottom: 24 },
    headerTitle: { fontFamily: 'BarbieDream-Regular', fontSize: 36, color: '#FFF', textTransform: 'uppercase', fontStyle: 'italic' },
    headerTitlePrimary: { color: '#ff0048' },
    headerSubtitle: { fontFamily: 'SweetPink-Regular', color: '#FFFFFFa0', fontSize: 18, marginTop: 4 },
    mainLayout: { flexDirection: 'row', justifyContent: 'space-between' },
    sidebar: { width: '25%', padding: 10 },
    centerContent: { width: '45%', alignItems: 'center' },
    glassPanel: { backgroundColor: 'rgba(57, 40, 48, 0.4)', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderRadius: 16, padding: 16 },
    sidebarTitle: { fontFamily: 'WonderfulSometimes-Regular', color: '#FFF', fontSize: 22, marginBottom: 16 },
    picker: { height: 50, width: '100%', color: '#FFF', backgroundColor: 'rgba(255,255,255,0.05)', marginBottom: 16 },
    wheelContainer: { alignItems: 'center', justifyContent: 'center', width: 350, height: 350 },
    wheel: {
        width: 350, height: 350, borderRadius: 175,
        backgroundColor: 'transparent', // conic-gradient not supported directly
        borderWidth: 12, borderColor: '#FFFFFF1a',
    },
    spinButton: {
        position: 'absolute', width: 100, height: 100, borderRadius: 50,
        backgroundColor: '#ff0048',
        justifyContent: 'center', alignItems: 'center',
        shadowColor: "#ff0048",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8, shadowRadius: 15,
    },
    spinButtonText: { fontFamily: 'BarbieDream-Regular', color: '#FFF', fontSize: 24, fontStyle: 'italic' },
    speechBubble: { backgroundColor: 'rgba(57, 40, 48, 0.6)', padding: 15, borderRadius: 12, marginBottom: 20 },
    speechText: { color: '#FFF', fontStyle: 'italic', fontSize: 14, fontFamily: 'SweetPink-Regular' },
});

export default DateNightRouletteGame1Screen;
