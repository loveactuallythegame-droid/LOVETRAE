import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import ResultsScreen from '../../components/games/engine/ResultsScreen';
import { speakMarcie } from '../../lib/voice-engine';

export default function ResultsRoastScreen({ route, navigation }: any) {
  const { result, verdict } = route.params || {};
  const [done, setDone] = useState(false);
  useEffect(() => { if (verdict?.callout) speakMarcie(verdict.callout.join(' ')); }, [verdict]);
  if (!result) return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Text variant="header">No results</Text></View>;
  return (
    <View style={styles.root}>
      <ResultsScreen result={result} onDone={() => setDone(true)} />
      {verdict && (
        <>
          <GlassCard>
            <Text variant="header">What You Did Right</Text>
            {verdict.right?.map((r: string, i: number) => (<Text key={i} variant="body">{r}</Text>))}
          </GlassCard>
          <GlassCard>
            <Text variant="header">The Call-Out</Text>
            {verdict.callout?.map((r: string, i: number) => (<Text key={i} variant="sass">{r}</Text>))}
          </GlassCard>
          <View style={styles.actions}>
            <SquishyButton style={styles.btn} onPress={() => navigation.goBack()}><Text variant="header">Back to Home</Text></SquishyButton>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: 16, gap: 12 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end' },
  btn: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#33DEA5', borderRadius: 12 }
});
