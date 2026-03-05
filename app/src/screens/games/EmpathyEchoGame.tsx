import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { ScreenLayout, GlassCard, Text, SquishyButton } from '../../components/ui';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../theme';

const WaveformBar = ({ height, color }: { height: number, color: string }) => (
    <View style={{ height, width: 4, backgroundColor: color, borderRadius: BORDER_RADIUS.small, marginHorizontal: 2 }} />
);

const EmpathyEchoGameScreen = () => {
    const partnerAWave = [8, 12, 20, 32, 24, 40, 28, 16, 36, 20, 12, 8];
    const partnerBWave = [10, 24, 48, 32, 20, 40, 16];

    return (
        <ScreenLayout showHeader={false} scrollable={true}>

                <LinearGradient colors={[COLORS.backgroundPrimary, COLORS.backgroundSecondary]} style={styles.background} />
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.header}>
                        <Text variant="h1" center>The Love Arcade</Text>
                        <Text variant="h2" center>+100 Games to Deepen Connection</Text>
                    </View>

                    <View style={styles.gameLayout}>
                        {/* Partner A Panel */}
                        <GlassCard style={styles.partnerPanel}>
                            <Text variant="h3">Partner A's Heart</Text>
                            <View style={styles.waveformContainer}>
                                {partnerAWave.map((h, i) => <WaveformBar key={i} height={h * 2} color={COLORS.mintGreen} />)}
                            </View>
                            <SquishyButton variant="secondary" onPress={() => {}}>
                                <Text variant="button">Play</Text>
                            </SquishyButton>
                        </GlassCard>

                        {/* Partner B Panel */}
                        <GlassCard style={[styles.partnerPanel, { borderColor: COLORS.softViolet }]}>
                            <Text variant="h3">Your Echo</Text>
                            <View style={styles.waveformContainer}>
                                {partnerBWave.map((h, i) => <WaveformBar key={i} height={h * 1.5} color={COLORS.lavenderPurple} />)}
                            </View>
                            <SquishyButton variant="secondary" onPress={() => {}}>
                                <Text variant="button">Stop</Text>
                            </SquishyButton>
                        </GlassCard>
                    </View>

                    <GlassCard style={styles.gaugeContainer}>
                        <Text variant="h2" center>Empathy Score: 72</Text>
                        <Text variant="body" center style={styles.gaugeFeedback}>"You're drifting toward 'fixing'. Try acknowledging the feeling without offering a solution yet."</Text>
                        <View style={styles.buttonRow}>
                            <SquishyButton variant="ghost" onPress={() => {}} style={styles.actionButton}>
                                <Text variant="button">Try Again</Text>
                            </SquishyButton>
                            <SquishyButton onPress={() => {}} style={styles.actionButton}>
                                <Text variant="button">Submit Echo</Text>
                            </SquishyButton>
                        </View>
                    </GlassCard>
                </ScrollView>

        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: COLORS.backgroundPrimary 
    },
    background: { 
        ...StyleSheet.absoluteFillObject 
    },
    scrollContainer: { 
        padding: SPACING.screenPadding 
    },
    header: { 
        alignItems: 'center', 
        marginBottom: SPACING.xlarge 
    },
    gameLayout: { 
        flexDirection: 'row', 
        gap: SPACING.regular, 
        marginBottom: SPACING.xlarge 
    },
    partnerPanel: { 
        flex: 1,
        borderWidth: 1, 
        borderColor: COLORS.borderSubtle
    },
    waveformContainer: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: 150, 
        marginVertical: SPACING.regular 
    },
    gaugeContainer: { 
        alignItems: 'center' 
    },
    gaugeFeedback: { 
        marginVertical: SPACING.regular,
        fontStyle: 'italic'
    },
    buttonRow: { 
        flexDirection: 'row', 
        gap: SPACING.regular, 
        marginTop: SPACING.regular,
        width: '100%'
    },
    actionButton: { 
        flex: 1 
    },
});

export default EmpathyEchoGameScreen;
