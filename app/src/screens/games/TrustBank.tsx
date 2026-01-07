import { useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, TextInput, ScrollView } from 'react-native';
import { Text, GlassCard, SquishyButton } from '../../components/ui';
import { GameContainer } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';

type Transaction = { type: 'deposit' | 'withdrawal'; description: string; amount: number };

export default function TrustBank({ route, navigation }: any) {
  const { gameId } = route.params || { gameId: 'trust-bank' };
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('10');
  const sessionId = useRef<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const user = data.session?.user;
      const couple_id = (await supabase.from('profiles').select('couple_code').eq('user_id', user?.id || '').single()).data?.couple_code;
      if (user && couple_id) {
        const session = await createGameSession(gameId, user.id, couple_id);
        sessionId.current = session.id;
      }
    });
  }, [gameId]);

  useEffect(() => {
    if (balance < 0) {
        speakMarcie("Your trust account is overdrawn. Time for some emotional austerity measures.");
    }
  }, [balance]);

  function addTransaction(type: 'deposit' | 'withdrawal') {
    const val = parseInt(amount) || 0;
    if (val <= 0 || !desc) return;
    const item: Transaction = { type, description: desc, amount: val };
    setTransactions(prev => [item, ...prev]);
    setBalance(prev => type === 'deposit' ? prev + val : prev - val);
    setDesc('');
    setAmount('10');
  }

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Trust Bank',
    description: 'Log deposits and withdrawals to the relationship trust account',
    category: 'healing' as const,
    difficulty: 'medium' as const,
    xpReward: 60,
    currentStep: 0,
    totalTime: 300, // Long running potentially? or just a session
    playerData: { vulnerabilityScore: 50, honestyScore: 70, completionTime: 0, partnerSync: 0 },
  }), [gameId]);

  function onComplete(res: { score: number; xpEarned: number }) {
    const growth = Math.max(0, balance);
    const bonus = Math.min(30, Math.floor(growth / 10));
    const xp = Math.min(90, 60 + bonus);
    if (sessionId.current) updateGameSession(sessionId.current, { finished_at: new Date().toISOString(), score: res.score, state: JSON.stringify({ transactions, balance, xp }) });
    navigation.goBack();
  }

  const inputArea = (
    <View style={{flex: 1}}>
      <GlassCard>
        <Text variant="header" style={{alignSelf: 'center', color: balance >= 0 ? '#33DEA5' : '#E11637'}}>Balance: {balance}</Text>
        <View style={{gap: 8, marginVertical: 16}}>
            <TextInput placeholder="Description (e.g. Kept promise)" style={styles.input} value={desc} onChangeText={setDesc} />
            <TextInput placeholder="Amount (1-100)" keyboardType="numeric" style={styles.input} value={amount} onChangeText={setAmount} />
            <View style={{flexDirection: 'row', gap: 16, justifyContent: 'center'}}>
                <SquishyButton onPress={() => addTransaction('deposit')} style={[styles.btn, {backgroundColor: '#33DEA5'}]}>
                    <Text variant="header">Deposit</Text>
                </SquishyButton>
                <SquishyButton onPress={() => addTransaction('withdrawal')} style={[styles.btn, {backgroundColor: '#E11637'}]}>
                    <Text variant="header">Withdraw</Text>
                </SquishyButton>
            </View>
        </View>
        <ScrollView style={{maxHeight: 200}}>
            {transactions.map((t, i) => (
                <View key={i} style={styles.row}>
                    <Text variant="body">{t.description}</Text>
                    <Text variant="keyword" style={{color: t.type === 'deposit' ? '#33DEA5' : '#E11637'}}>
                        {t.type === 'deposit' ? '+' : '-'}{t.amount}
                    </Text>
                </View>
            ))}
        </ScrollView>
      </GlassCard>
    </View>
  );

  return <GameContainer state={baseState} inputs={["text"]} inputArea={inputArea} onComplete={onComplete} />;
}

const styles = StyleSheet.create({
  input: { backgroundColor: '#1a0a1f', borderWidth: 1, borderColor: 'rgba(250,31,99,0.2)', borderRadius: 10, padding: 10, color: '#fff' },
  btn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' }
});
