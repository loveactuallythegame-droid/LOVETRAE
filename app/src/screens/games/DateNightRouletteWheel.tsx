
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Svg, Path } from 'react-native-svg';

const WheelSegment = ({ color, d, label, rotation }: { color: string, d: string, label: string, rotation: string }) => (
    <View style={{ position: 'absolute', width: '100%', height: '100%' }}>
        <Svg height="100%" width="100%" viewBox="0 0 100 100">
            <Path d={d} fill={color} />
        </Svg>
        <View style={[styles.labelTextContainer, { transform: [{ rotate: rotation }] }]}>
            <Text style={styles.labelText}>{label}</Text>
        </View>
    </View>
);

const RotationCard = ({ image, label }: { image: any, label: string }) => (
    <ImageBackground source={image} style={styles.card} imageStyle={{ borderRadius: 16 }}>
        <LinearGradient colors={['rgba(20, 20, 20, 0.2)', 'rgba(20, 20, 20, 0.7)']} style={styles.cardOverlay}>
            <Text style={styles.cardLabel}>{label}</Text>
        </LinearGradient>
    </ImageBackground>
);


const DateNightRouletteWheelScreen = () => {
    // Dummy images - replace with actual assets
    const stargazingImg = { uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6Wdtkee3vSldtZVao0GPy7aVfEOOFfJNgmTMOzFHZ4prSClassfCvHldiiUPQG_aPVwYu1dxAChp_MrkLyIvAbBpyb1SvSUCshjFhAR1gvVSta5a8qTNWcEawvjVnk31ACsI92Yzf8qicDmYqu9bGyCmb-pdMB15nshEPnJFLHeTuqUwHvq0nI0zAvZcx70XmTrR44hXC8DUN5Jj16QD3XnmhyvIWyfmSiMl-n7PYLwYeTobd1nmlW7X1poCDmEdDRX0vOM9JsPZm' };
    const cookingImg = { uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXXuzocF9KmEV1O8mwMMDzOxLNueBnTqv62VccX30AYfEgkaZ1D7yA0Ql9s_fyWkNm-aBI7lxDdMsiv4k13o-4eovs56vcOURkKzVb7ULDwAW_nHQo92mgC1hEwlSTrw3Qpx8HghjoLO0KpGJdkU0qE2P2MohyBijmLGVS9whzsmahOc1zZsdHdZn2imwQV0im5EZzgWcUlMQF5cuwsU68j1cJ1rxprtKGHL9JBSjNBA0gPEmx4qcdz4AMbdvKIbjC_HhMOeXHafAN' };
    const wineImg = { uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvv3hZ0aWR4Ari2_qv5TN0ULadpzygp3p1ejUkdchTbDiGAJ2lxwr-EqP6517-4UIc5I5gTbS3L2T4U1B3jbWurjDbT2sf7iiRvOsH4iqUHwkHD24y8fqbGWIglXYWhTAROR8YOAWwXrAHFrUjqx10wBYJgfTRK1oU4lLTD2MLFuSKqTWfJcp63K516X8PAF-DtxO6IqrhsaoyWThWc0ONapJBopN0cx2bnMuBUdNiOKmegk7bX8SXAMaXU7cBgqee_TiGzC0I-GDI' };

    const segments = [
        { color: '#f97316', d: 'M 50 50 L 100 50 A 50 50 0 0 1 75 93.3 Z', label: 'Cooking Class', rotation: '30deg' },
        { color: '#06b6d4', d: 'M 50 50 L 75 93.3 A 50 50 0 0 1 25 93.3 Z', label: 'Stargazing', rotation: '90deg' },
        { color: '#14b8a6', d: 'M 50 50 L 25 93.3 A 50 50 0 0 1 0 50 Z', label: 'Wine Tasting', rotation: '150deg' },
        { color: '#8b5cf6', d: 'M 50 50 L 0 50 A 50 50 0 0 1 25 6.7 Z', label: 'Retro Arcade', rotation: '210deg' },
        { color: '#eab308', d: 'M 50 50 L 25 6.7 A 50 50 0 0 1 75 6.7 Z', label: 'Sunset Hike', rotation: '270deg' },
        { color: '#ee2b8c', d: 'M 50 50 L 75 6.7 A 50 50 0 0 1 100 50 Z', label: 'Spa Night', rotation: '330deg' },
    ];


    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#392830', '#181114']} style={styles.background} />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Date Night Roulette</Text>
                    <Text style={styles.headerSubtitle}>Leave your evening to destiny. Spin to discover your next adventure.</Text>
                </View>

                <View style={styles.wheelSection}>
                    <View style={styles.wheelPointer} />
                    <View style={styles.wheelContainer}>
                        <View style={{ transform: [{ rotate: '-90deg' }] }}>
                             {segments.map((seg) => <WheelSegment key={seg.label} {...seg} />)}
                        </View>
                        <View style={styles.wheelHub} >
                            {/* Heart Icon */}
                        </View>
                    </View>
                </View>

                <TouchableOpacity style={styles.spinButton}>
                    <Text style={styles.spinButtonText}>SPIN</Text>
                </TouchableOpacity>

                <View style={styles.rotationSection}>
                    <Text style={styles.sectionTitle}>In the rotation</Text>
                    <View style={styles.cardGrid}>
                        <RotationCard image={stargazingImg} label="Stargazing" />
                        <RotationCard image={cookingImg} label="Cooking Class" />
                        <RotationCard image={wineImg} label="Wine Tasting" />
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#230f19' },
    background: { ...StyleSheet.absoluteFillObject },
    scrollContainer: { paddingVertical: 20, paddingHorizontal: 10, alignItems: 'center' },
    header: { alignItems: 'center', marginHorizontal: 20, marginBottom: 20 },
    headerTitle: { fontSize: 36, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
    headerSubtitle: { fontSize: 16, color: '#ffffff90', textAlign: 'center', marginTop: 8 },
    wheelSection: { alignItems: 'center', justifyContent: 'center', marginVertical: 20 },
    wheelPointer: {
        position: 'absolute', top: -15, zIndex: 2,
        width: 0, height: 0,
        borderLeftWidth: 15, borderLeftColor: 'transparent',
        borderRightWidth: 15, borderRightColor: 'transparent',
        borderTopWidth: 20, borderTopColor: '#fff',
    },
    wheelContainer: {
        width: 350, height: 350, borderRadius: 175,
        borderWidth: 12, borderColor: '#221019',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5, shadowRadius: 60,
    },
    labelTextContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 150,
        height: 100,
        marginTop: -50,
        marginLeft: -75,
        justifyContent: 'center',
        alignItems: 'center',
    },
    labelText: {
        color: '#221019',
        fontWeight: 'bold',
        fontSize: 12,
        textAlign: 'center',
    },
    wheelHub: {
        position: 'absolute', top: '50%', left: '50%',
        width: 60, height: 60,
        borderRadius: 30,
        backgroundColor: '#230f19',
        borderWidth: 4,
        borderColor: '#ffffff30',
        transform: [{ translateX: -30 }, { translateY: -30 }],
        zIndex: 1
    },
    spinButton: {
        marginVertical: 24,
        width: 180,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#fc0c84',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "rgba(238,43,140,0.4)",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 1,
        shadowRadius: 30,
    },
    spinButtonText: { color: '#fff', fontSize: 20, fontWeight: '900', letterSpacing: 2 },
    rotationSection: { width: '100%', marginTop: 20 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 16, paddingHorizontal: 10 },
    cardGrid: { flexDirection: 'row', justifyContent: 'space-around' },
    card: { width: 110, height: 110, borderRadius: 16, justifyContent: 'flex-end' },
    cardOverlay: { flex: 1, justifyContent: 'flex-end', padding: 8, borderRadius: 16 },
    cardLabel: { color: '#fff', fontSize: 14, fontWeight: 'bold', textAlign: 'center' },
});

export default DateNightRouletteWheelScreen;
