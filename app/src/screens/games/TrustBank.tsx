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
    supabase.auth.getSession().then(async ({ data }: any) => {
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
        <Text variant="header" style={{alignSelf: 'center', color: balance >= 0 ? COLORS.mintGreen : COLORS.vibrantPink}}>Balance: {balance}</Text>
        <View style={{gap: SPACING.sm, marginVertical: SPACING.md}}>
            <TextInput placeholder="Description (e.g. Kept promise)" style={styles.input} value={desc} onChangeText={setDesc} />
            <TextInput placeholder="Amount (1-100)" keyboardType="numeric" style={styles.input} value={amount} onChangeText={setAmount} />
            <View style={{flexDirection: 'row', gap: SPACING.md, justifyContent: 'center'}}>
                <SquishyButton onPress={() => addTransaction('deposit')} style={[styles.btn, {backgroundColor: COLORS.mintGreen}]}>
                    <Text variant="header">Deposit</Text>
                </SquishyButton>
                <SquishyButton onPress={() => addTransaction('withdrawal')} style={[styles.btn, {backgroundColor: COLORS.vibrantPink}]}>
                    <Text variant="header">Withdraw</Text>
                </SquishyButton>
            </View>
        </View>
        <ScrollView style={{maxHeight: 200}}>
            {transactions.map((t, i) => (
                <View key={i} style={styles.row}>
                    <Text variant="body">{t.description}</Text>
                    <Text variant="keyword" style={{color: t.type === 'deposit' ? COLORS.mintGreen : COLORS.vibrantPink}}>
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
  input: {
    backgroundColor: COLORS.inputFieldBg,
    borderWidth: SIZES.inputBorderWidth,
    borderColor: COLORS.vibrantPink,
    borderRadius: SIZES.borderRadius,
    padding: SPACING.md,
    color: COLORS.textPrimary,
    ...GLOWS.soft(COLORS.vibrantPink)
  },
  btn: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: SIZES.buttonBorderRadius,
    minWidth: Math.max(moderateScale(100), 100), // Ensure minimum touch target
    minHeight: Math.max(moderateScale(44), 44)
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.dividerLines
  }
});
