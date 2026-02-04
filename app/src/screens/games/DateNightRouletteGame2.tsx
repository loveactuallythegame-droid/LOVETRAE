import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Picker, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const FilterOption = ({ label, options }: { label: string, options: string[] }) => (
    <View style={styles.filterGroup}>
        <Text style={styles.filterLabel}>{label}</Text>
        <View style={styles.pickerContainer}>
            <Picker style={styles.picker} dropdownIconColor="#FFFFFF50">
                {options.map(opt => <Picker.Item key={opt} label={opt} value={opt.toLowerCase()} />)}
            </Picker>
        </View>
    </View>
);

const DateNightRouletteGame2Screen = () => {
    // Image for Dr. Marcie would be required locally
    const marcieImage = require('../../assets/images/DrMarcieLissHoldingClipboard.png');

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#1e1b4b', '#102220']} style={styles.background} />
            
            {/* Dr. Marcie Section */}
            <View style={styles.drMarcieSection}>
                <View style={styles.avatarContainer}>
                    <Image source={require('../../assets/images/MarcieAvatar.png')} style={styles.avatar} />
                </View>
                <View style={styles.quoteBox}>
                    <Text style={styles.quoteText}>Spin the wheel for unique date night ideas! Strengthen your connection with creative activities.</Text>
                </View>
            </View>
            
            <View style={styles.mainLayout}>
                {/* Left Sidebar */}
                <LinearGradient
                    colors={['#a22ac4', '#9056ef']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.sidebar}
                >
                    <Text style={styles.sidebarTitle}>Date Night Roulette</Text>
                    <Text style={styles.sidebarSubtitle}>Fine-tune your spin parameters</Text>
                    <FilterOption label="Budget Preference" options={["Select Budget", "$ - Thrifty & Fun"]}/>
                    <FilterOption label="Energy Level" options={["Chill, Active, or Spicy", "Chill - Low Energy"]}/>
                    <FilterOption label="Vibe Check" options={["Select Theme", "Romantic Evening"]}/>
                </LinearGradient>

                {/* Center Content */}
                <View style={styles.centerContent}>
                    <LinearGradient
                        colors={['#37cf97', '#b37dec']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.wheelContainer}
                    >
                        <View style={styles.wheelPointer} />
                        <View style={styles.wheel}>
                             <LinearGradient
                                colors={['#db147c', '#f05d68']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.innerWheelCircle}
                             >
                                 {/* Heart Icon can be placed here */}
                             </LinearGradient>
                        </View>
                    </LinearGradient>
                    <TouchableOpacity style={styles.spinButton}>
                        <LinearGradient
                            colors={['#ffffff', '#ffffff']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.gradientButton}
                        >
                            <Text style={styles.spinButtonText}>SPIN THE WHEEL</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {/* Dr. Marcie Overlay */}
                <LinearGradient
                    colors={['#ff7600', '#ffef1f']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.marcieOverlay}
                >
                    <LinearGradient
                        colors={['#db147c', '#f05d68']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.clipboard}
                    >
                        <Text style={styles.clipboardTitle}>Dr. Marcie's Advice</Text>
                        <Text style={styles.clipboardHeading}>Connection is the key!</Text>
                        <Text style={styles.clipboardText}>"Remember, it's not about how much you spend, but how much you engage..."</Text>
                    </LinearGradient>
                    {/* <Image source={marcieImage} style={styles.marcieImage} resizeMode="contain" /> */}
                </LinearGradient>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#230f18' },
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
    mainLayout: { flex: 1, flexDirection: 'row' },
    sidebar: { 
        width: 300, 
        padding: 24, 
        borderRightWidth: 1, 
        borderRightColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    sidebarTitle: { 
        fontFamily: 'BarbieDream-Regular', 
        fontSize: 24, 
        fontWeight: '900', 
        color: '#ffffff',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    sidebarSubtitle: { 
        fontFamily: 'SweetPink-Regular', 
        color: '#ffffff', 
        fontSize: 14, 
        marginBottom: 24,
        opacity: 0.8,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    filterGroup: { marginBottom: 16 },
    filterLabel: { 
        fontFamily: 'WonderfulSometimes-Regular', 
        color: '#db147c', 
        fontSize: 12, 
        fontWeight: '700', 
        textTransform: 'uppercase', 
        marginBottom: 8,
        backgroundColor: 'rgba(219, 20, 124, 0.2)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
    },
    pickerContainer: { 
        backgroundColor: 'rgba(26,43,41,0.5)', 
        borderRadius: 12, 
        borderWidth: 1, 
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 2,
        borderColor: 'rgba(219, 20, 124, 0.3)',
    },
    picker: { 
        height: 50, 
        width: '100%', 
        color: '#ffffff' 
    },
    centerContent: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 48 },
    wheelContainer: { 
        width: 400, 
        height: 400, 
        alignItems: 'center', 
        justifyContent: 'center', 
        marginBottom: 48,
        borderRadius: 200,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    wheelPointer: { 
        position: 'absolute', 
        top: -10, 
        width: 32, 
        height: 40, 
        backgroundColor: '#db147c', 
        zIndex: 3, 
        borderBottomLeftRadius: 16, 
        borderBottomRightRadius: 16 
    },
    wheel: { 
        width: '100%', 
        height: '100%', 
        borderRadius: 200, 
        borderWidth: 12, 
        borderColor: '#1a2b29', 
        backgroundColor: 'rgba(34,58,55,0.5)',
        justifyContent: 'center', 
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    innerWheelCircle: { 
        width: 100, 
        height: 100, 
        borderRadius: 50, 
        borderWidth: 4, 
        borderColor: 'rgba(219,20,124,0.4)',
        borderRadius: 50,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    spinButton: { 
        width: '100%', 
        maxWidth: 350, 
        height: 70, 
        borderRadius: 16, 
        justifyContent: 'center', 
        alignItems: 'center',
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
        borderRadius: 16,
        paddingVertical: 15,
    },
    spinButtonText: { 
        color: '#db147c', 
        fontSize: 22, 
        fontWeight: '900', 
        letterSpacing: 2,
        fontWeight: 'bold',
    },
    marcieOverlay: { 
        position: 'absolute', 
        bottom: 0, 
        right: 0, 
        width: 450, 
        height: 500, 
        alignItems: 'flex-end', 
        justifyContent: 'flex-end',
        borderRadius: 16,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    clipboard: {
        position: 'absolute', 
        right: 350, 
        bottom: 50,
        width: 280, 
        borderRadius: 12, 
        padding: 20, 
        transform: [{ rotate: '-3deg' }],
        shadowColor: '#000', 
        shadowRadius: 20, 
        shadowOpacity: 0.5,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    clipboardTitle: { 
        color: '#ffffff', 
        fontSize: 10, 
        fontWeight: '700', 
        textTransform: 'uppercase',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
    },
    clipboardHeading: { 
        color: '#ffffff', 
        fontSize: 18, 
        fontWeight: '700', 
        marginVertical: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    clipboardText: { 
        color: '#ffffff', 
        fontSize: 14, 
        fontStyle: 'italic',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 8,
        borderRadius: 8,
    },
    marcieImage: { width: 380, height: 500 },
});

export default DateNightRouletteGame2Screen;