
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

// Mock data for the chat
const initialMessages = [
    {
        id: 1, user: 'Partner A', as: 'Alex', text: "Why do you always leave your socks on the nebula floor? It's like a black hole of laundry!", userColor: '#f40b61'
    },
    {
        id: 2, user: 'Partner B', as: 'Jordan', text: "I'm just creating a gravitational pull for the washing machine, honey! It's 'functional space clutter'.", userColor: '#d946ef', isSelf: true
    },
];

const RoleSwapGame = () => {
    const [messages, setMessages] = useState(initialMessages);
    const [inputText, setInputText] = useState('');
    const score = 88;

    const handleSend = () => {
        if (inputText.trim()) {
            const newMessage = { id: messages.length + 1, user: 'Partner B', as: 'Jordan', text: inputText, userColor: '#d946ef', isSelf: true };
            setMessages([...messages, newMessage]);
            setInputText('');
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['#102220', '#0f0720']} style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Role Swap</Text>
                    <Text style={styles.headerSubtitle}>Step Into Their Shoes</Text>
                </View>

                <ScrollView style={styles.chatContainer}>
                    {messages.map(msg => (
                        <View key={msg.id} style={[styles.messageRow, msg.isSelf ? styles.messageRowSelf : {}]}>
                            <View style={[styles.messageBubble, msg.isSelf ? styles.messageBubbleSelf : {}, { borderColor: msg.userColor }]}>
                                <Text style={[styles.messageUser, { color: msg.userColor }]}>{msg.user} as {msg.as}</Text>
                                <Text style={styles.messageText}>{msg.text}</Text>
                            </View>
                        </View>
                    ))}
                </ScrollView>

                <View style={styles.inputSection}>
                    <View style={styles.scoreBarContainer}>
                        <Text style={styles.scoreLabel}>AI Perspective Score: {score}%</Text>
                        <View style={styles.scoreBarBackground}>
                            <View style={[styles.scoreBar, { width: `${score}%` }]} />
                        </View>
                    </View>
                    <View style={styles.inputRow}>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Type your performance..."
                            placeholderTextColor="rgba(255,255,255,0.3)"
                            value={inputText}
                            onChangeText={setInputText}
                        />
                        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                             <MaterialIcons name="send" size={22} color="#102220" />
                        </TouchableOpacity>
                    </View>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#102220' },
    container: { flex: 1 },
    header: { padding: 20, alignItems: 'center', borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    headerTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
    headerSubtitle: { color: '#d946ef', fontStyle: 'italic' },
    chatContainer: { flex: 1, padding: 16 },
    messageRow: { flexDirection: 'row', marginBottom: 16 },
    messageRowSelf: { justifyContent: 'flex-end' },
    messageBubble: { backgroundColor: 'rgba(35, 72, 69, 0.4)', borderRadius: 16, padding: 12, maxWidth: '80%', borderLeftWidth: 4, borderLeftColor: '#f40b61' },
    messageBubbleSelf: { backgroundColor: 'rgba(217, 70, 239, 0.2)', borderLeftWidth: 0, borderRightWidth: 4, borderRightColor: '#d946ef' },
    messageUser: { fontSize: 12, fontWeight: 'bold', marginBottom: 4, textTransform: 'uppercase' },
    messageText: { color: '#fff', fontSize: 16 },
    inputSection: { padding: 16, borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    scoreBarContainer: { marginBottom: 16 },
    scoreLabel: { color: '#f40b61', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 4 },
    scoreBarBackground: { height: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 4 },
    scoreBar: { height: '100%', backgroundColor: '#f40b61', borderRadius: 4 },
    inputRow: { flexDirection: 'row', gap: 12 },
    textInput: { flex: 1, height: 50, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, paddingHorizontal: 16, color: '#fff' },
    sendButton: { width: 50, height: 50, borderRadius: 12, backgroundColor: '#f40b61', justifyContent: 'center', alignItems: 'center' },
});

export default RoleSwapGame;
