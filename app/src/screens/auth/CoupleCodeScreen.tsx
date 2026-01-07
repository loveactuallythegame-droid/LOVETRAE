import { useEffect, useState } from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Text, GlassCard, SquishyButton } from '../../components/ui';
import { supabase, upsertProfile } from '../../lib/supabase';

type CoupleCodeScreenProps = {
  onNext: (code: string) => void;
};

export default function CoupleCodeScreen({ onNext }: CoupleCodeScreenProps) {
  const [code, setCode] = useState(generateCoupleCode());
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const user = data.session?.user;
      if (user) await upsertProfile({ user_id: user.id, couple_code: code });
    });
  }, [code]);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <GlassCard>
        <Text variant="header">Share This Code</Text>
        <Text variant="keyword">{code}</Text>
        <View style={styles.row}>
          <SquishyButton style={styles.btn} onPress={() => Clipboard.setStringAsync(code)}>
            <Text variant="body">Copy</Text>
          </SquishyButton>
          <SquishyButton style={styles.btn} onPress={() => Linking.openURL(`sms:&body=${encodeURIComponent(code)}`)}>
            <Text variant="body">SMS</Text>
          </SquishyButton>
          <SquishyButton style={styles.btn} onPress={() => Linking.openURL(`whatsapp://send?text=${encodeURIComponent(code)}`)}>
            <Text variant="body">WhatsApp</Text>
          </SquishyButton>
        </View>
      </GlassCard>
      <SquishyButton style={styles.next} onPress={() => onNext(code)}>
        <Text variant="header">Next</Text>
      </SquishyButton>
    </View>
  );
}

function generateCoupleCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const segment = () => new Array(4).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `LA-${segment()}-LOVE`;
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8, marginTop: 12 },
  btn: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#5C1459', borderRadius: 10 },
  next: { alignSelf: 'flex-end', marginTop: 16, paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#33DEA5', borderRadius: 12 },
});
