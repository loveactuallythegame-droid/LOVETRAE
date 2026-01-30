
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Svg, Path } from 'react-native-svg';

const ToolButton = ({ icon, label, active }: { icon: string, label: string, active?: boolean }) => (
    <TouchableOpacity style={[styles.toolButton, active && styles.activeTool]}>
        {/* Icon would be here */}
        <Text style={[styles.toolLabel, active && styles.activeToolLabel]}>{label}</Text>
    </TouchableOpacity>
);

const GuessMessage = ({ user, message, highlight }: { user: string, message: string, highlight?: boolean }) => (
    <View style={[styles.messageBubble, highlight && styles.highlightBubble]}>
        <Text style={styles.messageUser}>{user}</Text>
        <Text style={styles.messageText}>{message}</Text>
    </View>
);

const DrawYourFeelingsGameScreen = () => {

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#230f19', '#181014']} style={styles.background} />
            <View style={styles.mainLayout}>
                {/* Left Sidebar */}
                <View style={styles.sidebar}>
                    <View style={styles.toolPanel}>
                        <Text style={styles.panelTitle}>Art Tools</Text>
                        <ToolButton icon="brush" label="Brush" active />
                        <ToolButton icon="eraser" label="Eraser" />
                        <ToolButton icon="stroke" label="Stroke Size" />
                        <ToolButton icon="palette" label="Turquoise Fixed" />
                    </View>
                    <View style={styles.drMarciePanel}>
                        <Text style={styles.drMarcieText}>"Notice the jagged turquoise lines... Let that vulnerability flow."</Text>
                    </View>
                </View>

                {/* Center Canvas */}
                <View style={styles.canvasContainer}>
                    <Text style={styles.canvasTitle}>Draw <Text style={{ fontStyle: 'italic', color: '#fd0d85' }}>"Vulnerability"</Text></Text>
                    <View style={styles.canvas}>
                        <Svg height="100%" width="100%" viewBox="0 0 800 600">
                            <Path d="M150 450 Q 250 150 400 300 T 650 100" fill="none" stroke="#40E0D0" strokeWidth="6" />
                            <Path d="M200 500 C 300 400, 350 550, 450 450" fill="none" stroke="#40E0D0" strokeWidth="4" strokeDasharray="8, 4" />
                        </Svg>
                    </View>
                    <TouchableOpacity style={styles.submitButton}>
                        <Text style={styles.submitButtonText}>Submit Art</Text>
                    </TouchableOpacity>
                </View>

                {/* Right Sidebar */}
                <View style={styles.sidebar}>
                    <View style={styles.chatPanel}>
                        <Text style={styles.panelTitle}>Partner's Guesses</Text>
                        <ScrollView>
                            <GuessMessage user="Alex" message="Is it a broken heart? 💔" />
                            <GuessMessage user="Alex" message="Fragility? Like a glass box?" highlight />
                             <GuessMessage user="Alex" message="EXPOSURE? 👁️" />
                        </ScrollView>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#181014' },
    background: { ...StyleSheet.absoluteFillObject },
    mainLayout: { flexDirection: 'row', flex: 1, padding: 16 },
    sidebar: { width: 250, gap: 16 },
    toolPanel: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 16, borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 },
    panelTitle: { color: '#FFF', fontWeight: 'bold', fontSize: 16, marginBottom: 16 },
    toolButton: { padding: 12, borderRadius: 8, marginBottom: 8 },
    activeTool: { backgroundColor: '#fd0d85', shadowColor: '#fd0d85', shadowRadius: 10, shadowOpacity: 0.5 },
    toolLabel: { color: '#FFFFFFa0' },
    activeToolLabel: { color: '#FFF', fontWeight: 'bold' },
    drMarciePanel: { marginTop: 'auto', backgroundColor: '#3a2730', borderRadius: 12, padding: 12, borderColor: '#fd0d8530', borderWidth: 1 },
    drMarcieText: { color: '#FFFFFFe0', fontStyle: 'italic', fontSize: 13 },
    canvasContainer: { flex: 1, paddingHorizontal: 16, alignItems: 'center' },
    canvasTitle: { color: '#FFF', fontSize: 28, fontWeight: 'bold', marginBottom: 16 },
    canvas: { width: '100%', aspectRatio: 4 / 3, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 12, borderWidth: 2, borderColor: 'rgba(255,255,255,0.1)', borderStyle: 'dashed' },
    submitButton: { marginTop: 24, backgroundColor: '#fd0d85', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 99 },
    submitButtonText: { color: '#FFF', fontWeight: 'bold' },
    chatPanel: { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1, overflow: 'hidden' },
    messageBubble: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 10, borderRadius: 8, borderTopLeftRadius: 0, marginBottom: 8, marginHorizontal: 8 },
    highlightBubble: { backgroundColor: 'rgba(253, 13, 133, 0.2)', borderColor: 'rgba(253, 13, 133, 0.3)', borderWidth: 1 },
    messageUser: { color: '#FFFFFF50', fontSize: 10, textTransform: 'uppercase', marginBottom: 4 },
    messageText: { color: '#FFFFFFd0' },
});

export default DrawYourFeelingsGameScreen;
