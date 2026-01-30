
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Header } from '../../components/ui/Header';

const attachmentBlocks = [
    { name: 'Consistency', type: 'Foundation Element', icon: 'view_in_ar' },
    { name: 'Reassurance', type: 'Core Support', icon: 'shield_with_heart' },
    { name: 'Validation', type: 'Connector', icon: 'check_circle' },
    { name: 'Boundaries', type: 'Structural Safety', icon: 'grid_view' },
];

const AttachmentBlock = ({ block }: { block: { name: string, type: string, icon: string } }) => (
    <View style={styles.block}>
        <Text style={styles.blockIcon}>{block.icon}</Text>
        <View>
            <Text style={styles.blockName}>{block.name}</Text>
            <Text style={styles.blockType}>{block.type}</Text>
        </View>
    </View>
);

const ConnectionConstructorScreen = () => {
    const [safetyLevel, setSafetyLevel] = useState(68);

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#230f16', '#4a212f']} style={styles.background} />
            <Header title="Connection Constructor" />
            <View style={styles.mainLayout}>
                <View style={styles.toolbox}>
                    <Text style={styles.toolboxTitle}>The Toolbox</Text>
                    <ScrollView>
                        {attachmentBlocks.map((block, index) => <AttachmentBlock key={index} block={block} />)}
                    </ScrollView>
                </View>
                <View style={styles.blueprintArea}>
                    <View style={styles.blueprintGrid} />
                    <View style={styles.dropZone}>
                        <Text style={styles.dropZoneText}>Drop Block Here</Text>
                    </View>
                    <View style={styles.safetyBarContainer}>
                        <Text style={styles.safetyBarTitle}>Relationship Safety Level</Text>
                        <View style={styles.safetyBar}>
                            <LinearGradient colors={['#ff005e', '#purple']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ width: `${safetyLevel}%`, height: '100%' }} />
                        </View>
                         <Text style={styles.safetyPercentage}>{safetyLevel}%</Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#230f16' },
    background: { ...StyleSheet.absoluteFillObject },
    mainLayout: { flexDirection: 'row', flex: 1 },
    toolbox: { width: 220, backgroundColor: 'rgba(35,15,22,0.6)', padding: 15 },
    toolboxTitle: { fontFamily: 'BarbieDream-Regular', fontSize: 20, color: '#FFF', marginBottom: 15 },
    block: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 12, marginBottom: 10 },
    blockIcon: { fontSize: 24, color: '#ff005e', marginRight: 10 },
    blockName: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
    blockType: { color: 'rgba(255,255,255,0.4)', fontSize: 10, textTransform: 'uppercase' },
    blueprintArea: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
    blueprintGrid: { ...StyleSheet.absoluteFillObject, opacity: 0.1 /* Visual effect only */ },
    dropZone: { width: '80%', height: 300, borderWidth: 2, borderColor: 'rgba(255,0,94,0.2)', borderStyle: 'dashed', borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
    dropZoneText: { color: 'rgba(255,255,255,0.2)', fontFamily: 'SweetPink-Regular', textTransform: 'uppercase' },
    safetyBarContainer: { position: 'absolute', bottom: 20, width: '90%', backgroundColor: 'rgba(0,0,0,0.5)', padding: 15, borderRadius: 16 },
    safetyBarTitle: { fontFamily: 'BarbieDream-Regular', color: '#FFF', fontSize: 16, textTransform: 'uppercase' },
    safetyBar: { height: 12, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 6, marginTop: 5, overflow: 'hidden' },
    safetyPercentage: { position: 'absolute', right: 20, top: 15, color: '#FFF', fontSize: 20, fontWeight: 'bold' },
});

export default ConnectionConstructorScreen;
