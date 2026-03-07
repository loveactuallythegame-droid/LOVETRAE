import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { ScreenLayout, GlassCard, Typography, SquishyButton } from '../../components/ui';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../../theme';

const wordBank = [
    { text: 'TONIGHT', style: 'ransom' },
    { text: 'PIZZA', style: 'spooky' },
    { text: 'BEHOLD', style: 'marker' },
    { text: 'MY', style: 'ransom' },
    { text: 'ETERNAL', style: 'spooky' },
    { text: 'FEAST', style: 'marker' },
    { text: 'WITH', style: 'ransom' },
    { text: 'YOU', style: 'spooky' },
];

const RansomWord = ({ word, onSelect }: { word: any, onSelect: (word: any) => void }) => (
    <SquishyButton onPress={() => onSelect(word)} style={[styles.clipping, styles[word.style as keyof typeof styles]]}>
        <Typography variant="body" style={styles.clippingText}>{word.text}</Typography>
    </SquishyButton>
);

const TheRansomNoteGame = ({ navigation }: any) => {
    const [note, setNote] = useState<any[]>([]);

    const addWordToNote = (word: any) => {
        setNote([...note, word]);
    };

    return (
        <ScreenLayout showHeader={false} scrollable={true}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <SquishyButton onPress={() => navigation.goBack()} style={styles.backBtn} variant="secondary" size="small">
                        <Typography variant="body">Back</Typography>
                    </SquishyButton>
                    <Typography variant="h1" style={styles.headerTitle}>The Ransom Note</Typography>
                    <View style={styles.spacer} />
                </View>

                <Typography variant="h2" style={styles.objective}>Invite your partner on a date... or else.</Typography>

                <GlassCard style={styles.canvas}>
                    {note.length > 0 ? (
                        <View style={styles.noteContainer}>
                            {note.map((word, i) => (
                                <View key={i} style={[styles.noteWord, styles[word.style as keyof typeof styles]]}>
                                    <Typography variant="body" style={styles.noteText}>{word.text}</Typography>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <Typography variant="body" style={styles.placeholder}>Tap words to add them here</Typography>
                    )}
                </GlassCard>

                <ScrollView horizontal contentContainerStyle={styles.wordBank} showsHorizontalScrollIndicator={false}>
                    {wordBank.map((word, i) => <RansomWord key={i} word={word} onSelect={addWordToNote} />)}
                </ScrollView>

                <SquishyButton onPress={() => setNote([])} style={styles.clearBtn} variant="secondary">
                    <Typography variant="body">Clear Note</Typography>
                </SquishyButton>
            </ScrollView>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    safeArea: { 
        flex: 1, 
        backgroundColor: COLORS.backgroundPrimary 
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
        paddingHorizontal: SPACING.regular,
        paddingVertical: SPACING.small,
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
    },
    spacer: {
        width: 24,
    },
    objective: { 
        color: COLORS.textSecondary, 
        marginBottom: SPACING.xlarge,
        textAlign: 'center',
    },
    canvas: {
        width: '100%',
        height: 300,
        backgroundColor: COLORS.backgroundInput,
        borderRadius: BORDER_RADIUS.large,
        borderWidth: 8,
        borderColor: COLORS.backgroundSecondary,
        padding: SPACING.regular,
        marginBottom: SPACING.xlarge,
        justifyContent: 'center',
    },
    noteContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.small,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    noteWord: {
        paddingHorizontal: SPACING.small,
        paddingVertical: SPACING.tiny,
    },
    noteText: { 
        color: COLORS.backgroundPrimary,
        fontWeight: TYPOGRAPHY.fontWeight.bold,
    },
    placeholder: { 
        color: COLORS.textHint, 
        fontStyle: 'italic', 
        alignSelf: 'center',
        textAlign: 'center',
    },
    wordBank: { 
        gap: SPACING.regular, 
        paddingVertical: SPACING.regular 
    },
    clipping: { 
        paddingHorizontal: SPACING.regular, 
        paddingVertical: SPACING.regular, 
        borderRadius: BORDER_RADIUS.small, 
        elevation: 3,
        marginRight: SPACING.small,
    },
    clippingText: { 
        color: COLORS.backgroundPrimary,
        fontWeight: TYPOGRAPHY.fontWeight.bold,
    },
    ransom: { 
        backgroundColor: COLORS.textPrimary, 
    },
    marker: { 
        backgroundColor: COLORS.info,
    },
    spooky: { 
        backgroundColor: COLORS.error,
    },
    clearBtn: {
        marginTop: SPACING.xlarge,
        width: '60%',
    },
});

export default TheRansomNoteGame;
