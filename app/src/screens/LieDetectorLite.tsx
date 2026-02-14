import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY, SIZES, SPACING, GLOWS, moderateScale } from '../theme';

const LieDetectorLiteScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient 
                colors={[COLORS.deepCosmicPurple, COLORS.midPurple]} 
                style={styles.background} 
            />
            
            <View style={styles.header}>
                <Text style={styles.headerTitle}>LIE DETECTOR: LITE™</Text>
            </View>

            <View style={styles.mainContent}>
                <Text style={styles.analysisTitle}>VOICE ANALYSIS PROTOCOL</Text>
                
                <View style={styles.panel}>
                    <View style={styles.meterContainer}>
                        <Text style={styles.meterTitle}>PROSODY METER</Text>
                        <Text style={styles.meterValue}>65%</Text>
                    </View>
                    <View style={styles.meterBarContainer}>
                        <LinearGradient 
                            colors={[COLORS.vibrantPink, COLORS.softViolet]} 
                            start={{x:0, y:0}} 
                            end={{x:1, y:0}} 
                            style={[styles.meterBar, {width: '65%'}]} 
                        />
                    </View>
                    <Text style={styles.meterStatus}>HIGH PITCH VARIANCE DETECTED</Text>

                    <TouchableOpacity style={styles.recordButton}>
                        <Text style={styles.recordButtonText}>RECORD</Text>
                    </TouchableOpacity>
                    <Text style={styles.recordSubtext}>HOLD TO ANALYZE VERBAL TRANSPARENCY</Text>
                </View>
            </View>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: COLORS.deepCosmicPurple 
    },
    background: { 
        ...StyleSheet.absoluteFillObject 
    },
    header: { 
        padding: SPACING.lg, 
        borderBottomWidth: 1, 
        borderColor: COLORS.vibrantPink, 
        backgroundColor: COLORS.richPlum 
    },
    headerTitle: { 
        ...TYPOGRAPHY.gameTitle,
        color: COLORS.textPrimary, 
        textAlign: 'center', 
        textTransform: 'uppercase' 
    },
    mainContent: { 
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: SPACING.xl 
    },
    analysisTitle: { 
        ...TYPOGRAPHY.header,
        color: COLORS.textPrimary, 
        marginBottom: SPACING.xl, 
        textTransform: 'uppercase' 
    },
    panel: { 
        backgroundColor: COLORS.inputFieldBg, 
        borderRadius: SIZES.cardBorderRadius, 
        padding: SPACING.xl, 
        width: '90%', 
        alignItems: 'center', 
        borderWidth: SIZES.inputBorderWidth, 
        borderColor: COLORS.vibrantPink,
        ...GLOWS.soft(COLORS.vibrantPink)
    },
    meterContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        width: '100%', 
        marginBottom: SPACING.sm 
    },
    meterTitle: { 
        ...TYPOGRAPHY.button,
        color: COLORS.aquaTeal, 
        textTransform: 'uppercase' 
    },
    meterValue: { 
        ...TYPOGRAPHY.score,
        color: COLORS.aquaTeal 
    },
    meterBarContainer: { 
        width: '100%', 
        height: SIZES.progressBarHeight * 3, 
        backgroundColor: COLORS.nightSky, 
        borderRadius: SIZES.progressBarBorderRadius, 
        padding: SPACING.xs, 
        borderWidth: 1, 
        borderColor: COLORS.vibrantPink 
    },
    meterBar: { 
        height: '100%', 
        borderRadius: SIZES.progressBarBorderRadius 
    },
    meterStatus: { 
        ...TYPOGRAPHY.marcieDialogue,
        color: COLORS.aquaTeal, 
        marginTop: SPACING.sm, 
        textTransform: 'uppercase' 
    },
    recordButton: { 
        width: Math.max(moderateScale(180), 180), 
        height: Math.max(moderateScale(180), 180), 
        borderRadius: Math.max(moderateScale(90), 90), 
        backgroundColor: COLORS.vibrantPink, 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginVertical: SPACING.xl,
        ...GLOWS.strong(COLORS.vibrantPink)
    },
    recordButtonText: { 
        ...TYPOGRAPHY.button,
        color: COLORS.textPrimary, 
        letterSpacing: 4 
    },
    recordSubtext: { 
        ...TYPOGRAPHY.caption,
        color: COLORS.textSecondary, 
        textTransform: 'uppercase', 
        letterSpacing: 2, 
        textAlign: 'center' 
    }
});

export default LieDetectorLiteScreen;
