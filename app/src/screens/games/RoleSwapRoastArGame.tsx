
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { Camera } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const RoleSwapRoastArGame = () => {
    const [hasPermission, setHasPermission] = useState(null);
    const [isRecording, setIsRecording] = useState(false);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    if (hasPermission === null) {
        return <View style={styles.permissionContainer}><Text style={styles.permissionText}>Requesting camera permission...</Text></View>;
    }
    if (hasPermission === false) {
        return <View style={styles.permissionContainer}><Text style={styles.permissionText}>No access to camera</Text></View>;
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['#181311', '#2d1b4e']} style={styles.container}>
                <Text style={styles.headerTitle}>Role-Swap Roast</Text>

                <View style={styles.cameraContainer}>
                    <Camera style={styles.camera} type={Camera.Constants.Type.front}>
                        {/* AR Overlays */}
                        <View style={styles.arHudTop}>
                            <View style={styles.hudItem}><Text style={styles.hudText}>🔴 LIVE FEEDBACK</Text></View>
                        </View>
                        <View style={styles.marcieOverlay}>
                             <Text style={styles.marcieScore}>88/100</Text>
                             <Text style={styles.marcieComment}>"Ooh, that was particularly petty!"</Text>
                        </View>
                    </Camera>
                </View>

                <View style={styles.controlsContainer}>
                    <View style={styles.statsContainer}>
                        <Text style={styles.streakLabel}>Current Pettiness Streak</Text>
                        <Text style={styles.streakValue}>x4.5</Text>
                    </View>
                    <TouchableOpacity style={styles.recordButton} onPress={() => setIsRecording(!isRecording)}>
                        <MaterialIcons name={isRecording ? 'stop' : 'radio-button-checked'} size={40} color="#fff" />
                    </TouchableOpacity>
                    <View style={styles.actionsContainer}>
                        <TouchableOpacity style={styles.actionButton}>
                            <MaterialIcons name="face-retouching-natural" size={24} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                             <MaterialIcons name="share" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#181311' },
    container: { flex: 1, padding: 16, justifyContent: 'space-between' },
    permissionContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#181311' },
    permissionText: { color: '#fff', fontSize: 18 },
    headerTitle: { color: '#fff', fontSize: 32, fontWeight: 'bold', textAlign: 'center', textTransform: 'uppercase' },
    cameraContainer: { aspectRatio: 16 / 9, borderRadius: 24, overflow: 'hidden', borderWidth: 2, borderColor: 'rgba(255,255,255,0.1)' },
    camera: { flex: 1, justifyContent: 'space-between' },
    arHudTop: { position: 'absolute', top: 16, left: 16, gap: 8 },
    hudItem: { backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
    hudText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
    marcieOverlay: { position: 'absolute', bottom: 16, right: 16, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 12, padding: 12, alignItems: 'center' },
    marcieScore: { color: '#f46a25', fontSize: 24, fontWeight: 'bold' },
    marcieComment: { color: '#181311', fontSize: 12 },
    controlsContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16 },
    statsContainer: { flex: 1 },
    streakLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 12 },
    streakValue: { color: '#f46a25', fontSize: 24, fontWeight: 'bold' },
    recordButton: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#f46a25', justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: 'rgba(255,255,255,0.2)' },
    actionsContainer: { flex: 1, flexDirection: 'row', justifyContent: 'flex-end', gap: 16 },
    actionButton: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
});

export default RoleSwapRoastArGame;
