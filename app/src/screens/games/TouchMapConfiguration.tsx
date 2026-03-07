import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { ScreenLayout, GlassCard, Typography, SquishyButton } from '../../components/ui';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';

// Define the colors for the different states using theme tokens
const stateColors = {
    like: COLORS.success,
    dislike: COLORS.error,
    none: COLORS.backgroundInput,
};

const bodyParts = [
    { id: 'head', label: 'Head' },
    { id: 'neck', label: 'Neck' },
    { id: 'shoulders', label: 'Shoulders' },
    { id: 'chest', label: 'Chest' },
    { id: 'stomach', label: 'Stomach' },
    { id: 'back', label: 'Back' },
    { id: 'arms', label: 'Arms' },
    { id: 'hands', label: 'Hands' },
    { id: 'legs', label: 'Legs' },
    { id: 'feet', label: 'Feet' },
];

const TouchMapConfiguration = ({ navigation }: any) => {
    const [touchMap, setTouchMap] = useState<Record<string, keyof typeof stateColors>>(
        bodyParts.reduce((acc, part) => ({ ...acc, [part.id]: 'none' }), {})
    );

    const toggleState = (partId: string) => {
        setTouchMap(prevMap => {
            const currentState = prevMap[partId];
            const nextState: keyof typeof stateColors = currentState === 'none' ? 'like' : currentState === 'like' ? 'dislike' : 'none';
            return { ...prevMap, [partId]: nextState };
        });
    };

    const handleSave = () => {
        console.log("Saving Touch Map:", touchMap);
        // In a real app, this would be sent to a server.
        navigation.goBack();
    };

    return (
        <ScreenLayout showHeader={false} scrollable={true}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <SquishyButton onPress={() => navigation.goBack()} style={styles.backBtn} variant="ghost" size="small">
                        <MaterialIcons name="arrow-back" size={24} color={COLORS.textPrimary} />
                    </SquishyButton>
                    <Typography variant="h1" style={styles.headerTitle}>Touch Map</Typography>
                    <View style={styles.headerSpacer} />
                </View>

                <Typography variant="body" center style={styles.subtitle}>
                    Tap each body part to cycle through your touch preferences.
                </Typography>

                <GlassCard style={styles.touchMapContainer}>
                    <TouchableOpacity style={[styles.bodyPart, styles.head, { backgroundColor: stateColors[touchMap.head] }]} onPress={() => toggleState('head')} />
                    <TouchableOpacity style={[styles.bodyPart, styles.neck, { backgroundColor: stateColors[touchMap.neck] }]} onPress={() => toggleState('neck')} />
                    <View style={styles.torsoContainer}>
                        <TouchableOpacity style={[styles.bodyPart, styles.arms, { backgroundColor: stateColors[touchMap.arms] }]} onPress={() => toggleState('arms')} />
                        <View style={styles.mainTorso}>
                            <TouchableOpacity style={[styles.bodyPart, styles.shoulders, { backgroundColor: stateColors[touchMap.shoulders] }]} onPress={() => toggleState('shoulders')} />
                            <TouchableOpacity style={[styles.bodyPart, styles.chest, { backgroundColor: stateColors[touchMap.chest] }]} onPress={() => toggleState('chest')} />
                            <TouchableOpacity style={[styles.bodyPart, styles.stomach, { backgroundColor: stateColors[touchMap.stomach] }]} onPress={() => toggleState('stomach')} />
                        </View>
                        <TouchableOpacity style={[styles.bodyPart, styles.arms, { backgroundColor: stateColors[touchMap.arms] }]} onPress={() => toggleState('arms')} />
                    </View>
                    <TouchableOpacity style={[styles.bodyPart, styles.legs, { backgroundColor: stateColors[touchMap.legs] }]} onPress={() => toggleState('legs')} />
                    <TouchableOpacity style={[styles.bodyPart, styles.feet, { backgroundColor: stateColors[touchMap.feet] }]} onPress={() => toggleState('feet')} />
                </GlassCard>

                <View style={styles.legend}>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: stateColors.like }]} />
                        <Typography variant="body">Like</Typography>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: stateColors.dislike }]} />
                        <Typography variant="body">Dislike</Typography>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: stateColors.none }]} />
                        <Typography variant="body">Neutral / Ask</Typography>
                    </View>
                </View>

                <SquishyButton onPress={handleSave} style={styles.saveButton}>
                    <Typography variant="h2" color={COLORS.textPrimary}>Save Preferences</Typography>
                </SquishyButton>
            </ScrollView>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.backgroundPrimary,
    },
    scrollContent: {
        padding: SPACING.screenPadding,
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: SPACING.regular,
    },
    backBtn: {
        paddingHorizontal: SPACING.small,
        paddingVertical: SPACING.small,
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
    },
    headerSpacer: {
        width: 24,
    },
    subtitle: {
        color: COLORS.textSecondary,
        marginBottom: SPACING.xxlarge,
    },
    touchMapContainer: {
        alignItems: 'center',
        marginBottom: SPACING.xxlarge,
        padding: SPACING.xlarge,
        transform: [{ scale: 0.8 }]
    },
    bodyPart: {
        borderWidth: 2,
        borderColor: COLORS.borderSubtle,
        borderRadius: BORDER_RADIUS.medium,
    },
    head: {
        width: 80,
        height: 80,
        borderRadius: BORDER_RADIUS.round,
        marginBottom: SPACING.tiny,
    },
    neck: {
        width: 30,
        height: 20,
        marginBottom: SPACING.tiny,
    },
    torsoContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    mainTorso: {
        width: 120,
        alignItems: 'center',
    },
    shoulders: {
        width: 140,
        height: 40,
        borderBottomWidth: 0,
        borderTopLeftRadius: BORDER_RADIUS.xlarge,
        borderTopRightRadius: BORDER_RADIUS.xlarge,
    },
    chest: {
        width: 120,
        height: 60,
        borderBottomWidth: 0,
        borderRadius: BORDER_RADIUS.none,
    },
    stomach: {
        width: 110,
        height: 70,
        borderBottomLeftRadius: BORDER_RADIUS.xlarge,
        borderBottomRightRadius: BORDER_RADIUS.xlarge,
    },
    arms: {
        width: 40,
        height: 150,
        marginHorizontal: SPACING.tiny,
        marginTop: SPACING.xlarge,
        borderRadius: BORDER_RADIUS.xlarge,
    },
    legs: {
        width: 100,
        height: 180,
        marginTop: SPACING.tiny,
    },
    feet: {
        width: 120,
        height: 40,
        marginTop: SPACING.tiny,
        borderRadius: BORDER_RADIUS.xlarge,
    },
    legend: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: SPACING.xxlarge,
        padding: SPACING.regular,
        backgroundColor: COLORS.backgroundInput,
        borderRadius: BORDER_RADIUS.xlarge,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    legendColor: {
        width: 20,
        height: 20,
        borderRadius: BORDER_RADIUS.small,
        marginRight: SPACING.small,
    },
    saveButton: {
        width: '80%',
    },
});

export default TouchMapConfiguration;
