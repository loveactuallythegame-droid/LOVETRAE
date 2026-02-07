
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const HomeScreen = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#2A002A', '#5A005A']} style={styles.background} />
            <View style={styles.content}>
                <Text style={styles.title}>HOME SCREEN</Text>
                <TouchableOpacity onPress={() => navigation.navigate('TouchMapConfiguration')}>
                    <Text style={styles.link}>GO TO TOUCH MAP CONFIGURATION</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        ...StyleSheet.absoluteFillObject,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 20,
        textTransform: 'uppercase',
    },
    link: {
        fontSize: 16,
        color: '#FF4081',
        textTransform: 'uppercase',
        fontWeight: 'bold',
    },
});

export default HomeScreen;
