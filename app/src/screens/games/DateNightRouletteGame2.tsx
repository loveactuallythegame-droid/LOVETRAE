
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
            <View style={styles.mainLayout}>
                {/* Left Sidebar */}
                <View style={styles.sidebar}>
                    <Text style={styles.sidebarTitle}>Date Night Roulette</Text>
                    <Text style={styles.sidebarSubtitle}>Fine-tune your spin parameters</Text>
                    <FilterOption label="Budget Preference" options={["Select Budget", "$ - Thrifty & Fun"]}/>
                    <FilterOption label="Energy Level" options={["Chill, Active, or Spicy", "Chill - Low Energy"]}/>
                    <FilterOption label="Vibe Check" options={["Select Theme", "Romantic Evening"]}/>
                </View>

                {/* Center Content */}
                <View style={styles.centerContent}>
                    <View style={styles.wheelContainer}>
                        <View style={styles.wheelPointer} />
                        <View style={styles.wheel}>
                             <View style={styles.innerWheelCircle} >
                                 {/* Heart Icon can be placed here */}
                             </View>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.spinButton}>
                        <Text style={styles.spinButtonText}>SPIN THE WHEEL</Text>
                    </TouchableOpacity>
                </View>

                {/* Dr. Marcie Overlay */}
                <View style={styles.marcieOverlay}>
                    <View style={styles.clipboard}>
                        <Text style={styles.clipboardTitle}>Dr. Marcie's Advice</Text>
                        <Text style={styles.clipboardHeading}>Connection is the key!</Text>
                        <Text style={styles.clipboardText}>"Remember, it's not about how much you spend, but how much you engage..."</Text>
                    </View>
                    {/* <Image source={marcieImage} style={styles.marcieImage} resizeMode="contain" /> */}
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#230f18' },
    background: { ...StyleSheet.absoluteFillObject },
    mainLayout: { flex: 1, flexDirection: 'row' },
    sidebar: { width: 300, backgroundColor: 'rgba(35,15,24,0.4)', padding: 24, borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.05)' },
    sidebarTitle: { fontFamily: 'BarbieDream-Regular', fontSize: 24, fontWeight: '900', color: '#FFF' },
    sidebarSubtitle: { fontFamily: 'SweetPink-Regular', color: '#FFFFFF80', fontSize: 14, marginBottom: 24 },
    filterGroup: { marginBottom: 16 },
    filterLabel: { fontFamily: 'WonderfulSometimes-Regular', color: '#ff006d', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', marginBottom: 8 },
    pickerContainer: { backgroundColor: '#1a2b29', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    picker: { height: 50, width: '100%', color: '#FFF' },
    centerContent: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 48 },
    wheelContainer: { width: 400, height: 400, alignItems: 'center', justifyContent: 'center', marginBottom: 48 },
    wheelPointer: { position: 'absolute', top: -10, width: 32, height: 40, backgroundColor: '#ff006d', zIndex: 3, borderBottomLeftRadius: 16, borderBottomRightRadius: 16 },
    wheel: { width: '100%', height: '100%', borderRadius: 200, borderWidth: 12, borderColor: '#1a2b29', backgroundColor: '#223a37', justifyContent: 'center', alignItems: 'center' },
    innerWheelCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#230f18', borderWidth: 4, borderColor: 'rgba(255,0,109,0.4)' },
    spinButton: { width: '100%', maxWidth: 350, height: 70, borderRadius: 16, backgroundColor: '#db2777', justifyContent: 'center', alignItems: 'center' },
    spinButtonText: { color: '#FFF', fontSize: 22, fontWeight: '900', letterSpacing: 2 },
    marcieOverlay: { position: 'absolute', bottom: 0, right: 0, width: 450, height: 500, alignItems: 'flex-end', justifyContent: 'flex-end' },
    clipboard: {
        position: 'absolute', right: 350, bottom: 50,
        width: 280, backgroundColor: '#FFF', borderRadius: 12, padding: 20, transform: [{ rotate: '-3deg' }],
        shadowColor: '#000', shadowRadius: 20, shadowOpacity: 0.5,
    },
    clipboardTitle: { color: '#9ca3af', fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
    clipboardHeading: { color: '#111827', fontSize: 18, fontWeight: '700', marginVertical: 4 },
    clipboardText: { color: '#4b5563', fontSize: 14, fontStyle: 'italic' },
    marcieImage: { width: 380, height: 500 },
});

export default DateNightRouletteGame2Screen;
