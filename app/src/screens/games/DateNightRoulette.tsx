import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { ScreenLayout, GlassCard, Typography, SquishyButton } from '../../components/ui';

import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, GRADIENTS } from '../../theme';

export default function DateNightRoulette({ navigation }: any) {
    useEffect(() => {
        speakMarcie("You got 'Blanket fort + pineapple pizza debate'? Destiny.");
    }, []);

    return (
        <ScreenLayout showHeader={false} scrollable={true}>

                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.header}>
                        <SquishyButton onPress={() => navigation.goBack()} style={styles.backBtn} variant="secondary" size="small">
                            <Typography variant="body">Back</Typography>
                        </SquishyButton>
                        <Typography variant="h1" style={styles.title}>Date Night Roulette</Typography>
                    </View>

                    {/* Dr. Marcie Section */}
                    <View style={styles.drMarcieSection}>
                        <View style={styles.avatarContainer}>
                            <Image source={require('../../assets/images/MarcieAvatar.png')} style={styles.avatar} />
                        </View>
                        <View style={styles.quoteBox}>
                            <Typography variant="sass">Spin the wheel for unique date night ideas! Strengthen your connection with creative activities.</Typography>
                        </View>
                    </View>

                    <GlassCard style={styles.card}>
                        <Typography variant="h2" style={styles.cardTitle}>Type: Wheel spin + filters</Typography>
                        <Typography variant="body">Mechanics: Spin → "Picnic in car, 8 p.m., only songs from 2007."</Typography>
                    </GlassCard>

                    <GlassCard style={styles.card}>
                        <Typography variant="h2" style={styles.cardTitle}>Scoring</Typography>
                        <Typography variant="body">
                            ✅ Did it = +30{'\n'}
                            ✅ Posted proof (no faces) = +10
                        </Typography>
                    </GlassCard>

                    <View style={styles.actionArea}>
                        <SquishyButton onPress={() => alert('Spinning Wheel...')} style={styles.playBtn}>
                            <Typography variant="h2" color={COLORS.textPrimary}>Spin Wheel</Typography>
                        </SquishyButton>
                    </View>
                </ScrollView>

        </ScreenLayout>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1,
        backgroundColor: COLORS.backgroundPrimary,
    },
    content: { 
        padding: SPACING.screenPadding, 
        gap: SPACING.regular 
    },
    header: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: SPACING.small, 
        marginTop: SPACING.regular 
    },
    backBtn: { 
        paddingHorizontal: SPACING.regular, 
        paddingVertical: SPACING.small, 
        backgroundColor: COLORS.backgroundInput, 
        borderRadius: BORDER_RADIUS.large 
    },
    title: { 
        flex: 1,
    },
    drMarcieSection: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: COLORS.backgroundInput,
        borderRadius: BORDER_RADIUS.xlarge,
        padding: SPACING.regular,
        marginBottom: SPACING.regular
    },
    avatarContainer: {
        width: 50,
        height: 50,
        borderRadius: BORDER_RADIUS.round,
        backgroundColor: COLORS.brightYellow,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.regular
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: BORDER_RADIUS.xxlarge,
        resizeMode: 'cover'
    },
    quoteBox: {
        flex: 1,
        backgroundColor: COLORS.backgroundInput,
        borderRadius: BORDER_RADIUS.large,
        padding: SPACING.regular
    },
    card: { 
        padding: SPACING.cardPadding,
        backgroundColor: COLORS.backgroundCard,
        borderWidth: 1,
        borderColor: COLORS.borderSubtle,
    },
    cardTitle: {
        marginBottom: SPACING.small,
    },
    actionArea: { 
        marginTop: SPACING.xxlarge, 
        alignItems: 'center' 
    },
    playBtn: { 
        width: '80%', 
        ...SHADOWS.buttonGlow,
    },
});
