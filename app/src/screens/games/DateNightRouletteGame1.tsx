import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Picker, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const DateNightRouletteGame1Screen = () => {

    // Using require for local images
    const hostImage = require('../../assets/images/DrMarcieLiss.png');

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#181114', '#230f15']} style={styles.background} />
            
            {/* Dr. Marcie Section */}
            <View style={styles.drMarcieSection}>
                <View style={styles.avatarContainer}>
                    <Image source={require('../../assets/images/MarcieAvatar.png')} style={styles.avatar} />
                </View>
                <View style={styles.quoteBox}>
                    <Text style={styles.quoteText}>Spin the wheel for unique date night ideas! Strengthen your connection with creative activities.</Text>
                </View>
            </View>
            
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                 <View style={styles.header}>
                    <Text style={styles.headerTitle}>Date Night <Text style={styles.headerTitlePrimary}>Roulette</Text></Text>
                    <Text style={styles.headerSubtitle}>Where will tonight take you?</Text>
                </View>

                <View style={styles.mainLayout}>
                    {/* Left Sidebar */}
                    <LinearGradient
                        colors={['#a22ac4', '#9056ef']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.sidebar}
                    >
                        <LinearGradient
                            colors={['#db147c', '#f05d68']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.glassPanel}
                        >
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
                        </LinearGradient>
                    </LinearGradient>

                    {/* Center Roulette */}
                    <View style={styles.centerContent}>
                        <LinearGradient
                            colors={['#37cf97', '#b37dec']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.wheelContainer}
                        >
                            <View style={styles.wheel} />
                            <TouchableOpacity style={styles.spinButton}>
                                <LinearGradient
                                    colors={['#ffffff', '#ffffff']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.gradientButton}
                                >
                                    <Text style={styles.spinButtonText}>SPIN</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>
                    
                    {/* Right Sidebar */}
                    <LinearGradient
                        colors={['#ff7600', '#ffef1f']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.sidebar}
                    >
                         <LinearGradient
                            colors={['#db147c', '#f05d68']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.speechBubble}
                         >
                             <Text style={styles.speechText}>"Ooh, I love this vibe! Let's see what destiny has in store..."</Text>
                         </LinearGradient>
                        {/* Image would be here if we can resolve the path issue */}
                    </LinearGradient>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#181114' },
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
    scrollContainer: { flexGrow: 1, padding: 20 },
    header: { alignItems: 'center', marginBottom: 24 },
    headerTitle: { fontFamily: 'BarbieDream-Regular', fontSize: 36, color: '#ffffff', textTransform: 'uppercase', fontStyle: 'italic' },
    headerTitlePrimary: { color: '#db147c' },
    headerSubtitle: { fontFamily: 'SweetPink-Regular', color: '#ffffff', fontSize: 18, marginTop: 4, opacity: 0.8 },
    mainLayout: { flexDirection: 'row', justifyContent: 'space-between' },
    sidebar: { 
        width: '25%', 
        padding: 10,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    centerContent: { width: '45%', alignItems: 'center' },
    glassPanel: { 
        borderRadius: 16, 
        padding: 16,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    sidebarTitle: { 
        fontFamily: 'WonderfulSometimes-Regular', 
        color: '#ffffff', 
        fontSize: 22, 
        marginBottom: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    picker: { 
        height: 50, 
        width: '100%', 
        color: '#ffffff', 
        backgroundColor: 'rgba(255,255,255,0.05)', 
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(219, 20, 124, 0.3)',
    },
    wheelContainer: { 
        alignItems: 'center', 
        justifyContent: 'center', 
        width: 350, 
        height: 350,
        borderRadius: 175,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    wheel: {
        width: 350, 
        height: 350, 
        borderRadius: 175,
        backgroundColor: 'transparent', // conic-gradient not supported directly
        borderWidth: 12, 
        borderColor: 'rgba(255,255,255,0.1)',
    },
    spinButton: {
        position: 'absolute', 
        width: 100, 
        height: 100, 
        borderRadius: 50,
        justifyContent: 'center', 
        alignItems: 'center',
        shadowColor: "#db147c",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8, 
        shadowRadius: 15,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    gradientButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        paddingVertical: 15,
    },
    spinButtonText: { 
        fontFamily: 'BarbieDream-Regular', 
        color: '#db147c', 
        fontSize: 24, 
        fontStyle: 'italic',
        fontWeight: 'bold',
    },
    speechBubble: { 
        padding: 15, 
        borderRadius: 12, 
        marginBottom: 20,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    speechText: { 
        color: '#ffffff', 
        fontStyle: 'italic', 
        fontSize: 14, 
        fontFamily: 'SweetPink-Regular',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: 8,
        borderRadius: 8,
    },
});

export default DateNightRouletteGame1Screen;