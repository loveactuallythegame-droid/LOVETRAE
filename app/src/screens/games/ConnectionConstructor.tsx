import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
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
    <LinearGradient
        colors={['#db147c', '#f05d68']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.block}
    >
        <Text style={styles.blockIcon}>{block.icon}</Text>
        <View>
            <Text style={styles.blockName}>{block.name}</Text>
            <Text style={styles.blockType}>{block.type}</Text>
        </View>
    </LinearGradient>
);

const ConnectionConstructorScreen = () => {
    const [safetyLevel, setSafetyLevel] = useState(68);

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#230f16', '#4a212f']} style={styles.background} />
            
            {/* Dr. Marcie Section */}
            <View style={styles.drMarcieSection}>
                <View style={styles.avatarContainer}>
                    <Image source={require('../../assets/images/MarcieAvatar.png')} style={styles.avatar} />
                </View>
                <View style={styles.quoteBox}>
                    <Text style={styles.quoteText}>Build your connection with essential elements! Construct a safe and secure relationship.</Text>
                </View>
            </View>
            
            <Header title="Connection Constructor" />
            <View style={styles.mainLayout}>
                <LinearGradient
                    colors={['#a22ac4', '#9056ef']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.toolbox}
                >
                    <Text style={styles.toolboxTitle}>The Toolbox</Text>
                    <ScrollView>
                        {attachmentBlocks.map((block, index) => <AttachmentBlock key={index} block={block} />)}
                    </ScrollView>
                </LinearGradient>
                <View style={styles.blueprintArea}>
                    <View style={styles.blueprintGrid} />
                    <LinearGradient
                        colors={['#37cf97', '#b37dec']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.dropZone}
                    >
                        <Text style={styles.dropZoneText}>Drop Block Here</Text>
                    </LinearGradient>
                    <LinearGradient
                        colors={['#ff7600', '#ffef1f']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.safetyBarContainer}
                    >
                        <Text style={styles.safetyBarTitle}>Relationship Safety Level</Text>
                        <View style={styles.safetyBar}>
                            <LinearGradient 
                                colors={['#db147c', '#f05d68']} 
                                start={{ x: 0, y: 0 }} 
                                end={{ x: 1, y: 0 }} 
                                style={{ width: `${safetyLevel}%`, height: '100%' }} 
                            />
                        </View>
                         <Text style={styles.safetyPercentage}>{safetyLevel}%</Text>
                    </LinearGradient>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#230f16' },
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
    mainLayout: { flexDirection: 'row', flex: 1 },
    toolbox: { 
        width: 220, 
        padding: 15,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    toolboxTitle: { 
        fontFamily: 'BarbieDream-Regular', 
        fontSize: 20, 
        color: '#ffffff', 
        marginBottom: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    block: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        borderRadius: 12, 
        padding: 12, 
        marginBottom: 10,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    },
    blockIcon: { 
        fontSize: 24, 
        color: '#ffffff', 
        marginRight: 10 
    },
    blockName: { 
        color: '#ffffff', 
        fontWeight: 'bold', 
        fontSize: 14 
    },
    blockType: { 
        color: 'rgba(255,255,255,0.8)', 
        fontSize: 10, 
        textTransform: 'uppercase' 
    },
    blueprintArea: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
    blueprintGrid: { ...StyleSheet.absoluteFillObject, opacity: 0.1 /* Visual effect only */ },
    dropZone: { 
        width: '80%', 
        height: 300, 
        borderRadius: 24, 
        justifyContent: 'center', 
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.2)',
        borderStyle: 'dashed',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    dropZoneText: { 
        color: '#ffffff', 
        fontFamily: 'SweetPink-Regular', 
        textTransform: 'uppercase',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    safetyBarContainer: { 
        position: 'absolute', 
        bottom: 20, 
        width: '90%', 
        padding: 15, 
        borderRadius: 16,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    safetyBarTitle: { 
        fontFamily: 'BarbieDream-Regular', 
        color: '#ffffff', 
        fontSize: 16, 
        textTransform: 'uppercase',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    safetyBar: { 
        height: 12, 
        backgroundColor: 'rgba(255,255,255,0.1)', 
        borderRadius: 6, 
        marginTop: 5, 
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    safetyPercentage: { 
        position: 'absolute', 
        right: 20, 
        top: 15, 
        color: '#ffffff', 
        fontSize: 20, 
        fontWeight: 'bold',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
});

export default ConnectionConstructorScreen;