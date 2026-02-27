/**
 * Trust Bank - Healing Hospital Game
 * Couples track trust deposits and withdrawals
 * 
 * Backend Integration:
 * - Creates game session via useGameSession
 * - Tracks all transactions
 * - Calculates final balance
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

// Backend integration
import { useGameSession } from '../../hooks/useGameSession';

// Components
import { GlassCard, Text } from '../../components/ui';

// Game Constants
const GAME_ID = 'trust-bank';
const CATEGORY_ID = 'healing-hospital';

type Transaction = { 
    id: string;
    type: 'deposit' | 'withdrawal'; 
    description: string; 
    amount: number;
    timestamp: number;
};

const TrustBank: React.FC = () => {
    const navigation = useNavigation();
    
    // Backend session
    const { 
        session, 
        updateScore, 
        completeGame, 
        isLoading: sessionLoading, 
        isSyncing 
    } = useGameSession(GAME_ID, CATEGORY_ID);

    // Game state
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('10');
    const [gameCompleted, setGameCompleted] = useState(false);

    // Add transaction
    const addTransaction = async (type: 'deposit' | 'withdrawal') => {
        const val = parseInt(amount) || 0;
        if (val <= 0 || !description.trim()) {
            Alert.alert('Required', 'Please enter a description and amount');
            return;
        }

        const newTransaction: Transaction = {
            id: Date.now().toString(),
            type,
            description: description.trim(),
            amount: val,
            timestamp: Date.now()
        };

        const newTransactions = [newTransaction, ...transactions];
        setTransactions(newTransactions);
        
        const newBalance = type === 'deposit' ? balance + val : balance - val;
        setBalance(newBalance);
        
        // Save to backend
        await updateScore(Math.abs(newBalance), false, [{
            transaction: newTransaction,
            newBalance,
            totalTransactions: newTransactions.length
        }]);

        setDescription('');
        setAmount('10');
    };

    // Finish game
    const finishGame = async () => {
        setGameCompleted(true);
        
        let badge = 'Accountant';
        if (balance >= 100) badge = 'Trust Investor';
        else if (balance >= 50) badge = 'Savings Builder';
        else if (balance >= 0) badge = 'Breaking Even';
        else badge = 'Overdrawn';

        await completeGame(Math.abs(balance), [{
            completed: true,
            badge,
            finalBalance: balance,
            totalTransactions: transactions.length
        }]);

        Alert.alert(
            'Trust Bank Closed! 🏦',
            `Final Balance: ${balance >= 0 ? '+' : ''}${balance}\nBadge: ${badge}\n\n${transactions.length} transactions recorded`,
            [
                { 
                    text: 'View Results', 
                    onPress: () => navigation.navigate('GameResults', { 
                        score: Math.abs(balance), 
                        badge,
                        gameId: GAME_ID,
                        sessionId: session?.id 
                    }) 
                },
                { text: 'Exit', onPress: () => navigation.goBack() }
            ]
        );
    };

    // Loading state
    if (sessionLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <LinearGradient colors={['#181116', '#230f18']} style={styles.background}>
                    <Text style={styles.loadingText}>Opening Trust Bank...</Text>
                </LinearGradient>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#181116', '#230f18']} style={styles.background}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Trust Bank</Text>
                        <Text style={styles.subtitle}>Log your trust deposits & withdrawals</Text>
                    </View>

                    {/* Balance Display */}
                    <GlassCard style={styles.balanceCard}>
                        <Text style={styles.balanceLabel}>Current Balance</Text>
                        <Text style={[
                            styles.balanceAmount,
                            balance >= 0 ? styles.positiveBalance : styles.negativeBalance
                        ]}>
                            {balance >= 0 ? '+' : ''}{balance}
                        </Text>
                        {isSyncing && <Text style={styles.syncText}>💾 Saving...</Text>}
                    </GlassCard>

                    {/* Transaction Form */}
                    <GlassCard style={styles.formCard}>
                        <Text style={styles.formLabel}>New Transaction</Text>
                        
                        <TextInput
                            style={styles.input}
                            placeholder="What happened? (e.g., 'Listened without interrupting')"
                            placeholderTextColor="#999"
                            value={description}
                            onChangeText={setDescription}
                            multiline
                        />
                        
                        <TextInput
                            style={styles.amountInput}
                            placeholder="Amount (1-100)"
                            placeholderTextColor="#999"
                            keyboardType="numeric"
                            value={amount}
                            onChangeText={setAmount}
                        />

                        <View style={styles.buttonRow}>
                            <TouchableOpacity 
                                style={[styles.actionButton, styles.depositButton]}
                                onPress={() => addTransaction('deposit')}
                            >
                                <Text style={styles.buttonText}>+ Deposit</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                style={[styles.actionButton, styles.withdrawalButton]}
                                onPress={() => addTransaction('withdrawal')}
                            >
                                <Text style={styles.buttonText}>- Withdrawal</Text>
                            </TouchableOpacity>
                        </View>
                    </GlassCard>

                    {/* Transaction History */}
                    <Text style={styles.historyTitle}>Transaction History</Text>
                    
                    {transactions.length === 0 ? (
                        <Text style={styles.emptyText}>No transactions yet. Start building trust!</Text>
                    ) : (
                        transactions.map((t) => (
                            <View key={t.id} style={styles.transactionRow}>
                                <View style={[
                                    styles.typeIndicator,
                                    t.type === 'deposit' ? styles.depositIndicator : styles.withdrawalIndicator
                                ]}>
                                    <Text style={styles.typeText}>
                                        {t.type === 'deposit' ? '+' : '-'}
                                    </Text>
                                </View>
                                <View style={styles.transactionInfo}>
                                    <Text style={styles.transactionDesc}>{t.description}</Text>
                                    <Text style={styles.transactionAmount}>
                                        {t.type === 'deposit' ? '+' : '-'}{t.amount}
                                    </Text>
                                </View>
                            </View>
                        ))
                    )}

                    {/* Finish Button */}
                    {transactions.length > 0 && (
                        <TouchableOpacity style={styles.finishButton} onPress={finishGame}>
                            <Text style={styles.finishText}>Close Account & Finish</Text>
                        </TouchableOpacity>
                    )}

                    {session && (
                        <Text style={styles.sessionInfo}>Session: {session.id.slice(0, 8)}...</Text>
                    )}
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

import { Alert } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingTop: 60,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
    },
    subtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        marginTop: 5,
    },
    loadingText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 100,
    },
    balanceCard: {
        padding: 25,
        marginBottom: 20,
        alignItems: 'center',
    },
    balanceLabel: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        marginBottom: 10,
    },
    balanceAmount: {
        fontSize: 48,
        fontWeight: 'bold',
    },
    positiveBalance: {
        color: '#33DEA5',
    },
    negativeBalance: {
        color: '#ff4444',
    },
    syncText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 12,
        marginTop: 10,
    },
    formCard: {
        padding: 20,
        marginBottom: 20,
    },
    formLabel: {
        fontSize: 16,
        color: '#FFD700',
        marginBottom: 15,
        fontWeight: '600',
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 10,
        padding: 15,
        color: '#fff',
        fontSize: 14,
        marginBottom: 10,
        minHeight: 60,
    },
    amountInput: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 10,
        padding: 15,
        color: '#fff',
        fontSize: 16,
        marginBottom: 15,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 10,
    },
    actionButton: {
        flex: 1,
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    depositButton: {
        backgroundColor: '#33DEA5',
    },
    withdrawalButton: {
        backgroundColor: '#ff4444',
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    historyTitle: {
        fontSize: 18,
        color: '#fff',
        marginBottom: 15,
        fontWeight: '600',
    },
    emptyText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 14,
        textAlign: 'center',
        fontStyle: 'italic',
        marginBottom: 20,
    },
    transactionRow: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 12,
        borderRadius: 10,
        marginBottom: 8,
    },
    typeIndicator: {
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    depositIndicator: {
        backgroundColor: '#33DEA5',
    },
    withdrawalIndicator: {
        backgroundColor: '#ff4444',
    },
    typeText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    transactionInfo: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    transactionDesc: {
        color: '#fff',
        fontSize: 14,
        flex: 1,
    },
    transactionAmount: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    finishButton: {
        backgroundColor: '#FFD700',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    finishText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    sessionInfo: {
        color: 'rgba(255,255,255,0.3)',
        fontSize: 10,
        textAlign: 'center',
        marginTop: 20,
    },
});

export default TrustBank;
