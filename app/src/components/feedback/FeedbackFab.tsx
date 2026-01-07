import { useState } from 'react';
import { Modal, View, StyleSheet, TextInput, Pressable, Platform } from 'react-native';
import { Text, SquishyButton } from '../ui';
import { supabase } from '../../lib/supabase';
import { navigationRef } from '../../lib/navigation';
import { ENV } from '../../lib/env';

export default function FeedbackFab() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  async function submit() {
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user;
    const route = navigationRef.getCurrentRoute()?.name;
    const ADMIN_BASE = ENV.ADMIN_BASE_URL;
    if (!ADMIN_BASE) return;
    await fetch(`${ADMIN_BASE}/api/feedback/submit`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user?.id, email: (user as any)?.email, route, priority, message, context: { os: Platform.OS } })
    });
    setMessage('');
    setOpen(false);
  }
  return (
    <>
      <Pressable onPress={() => setOpen(true)} style={styles.fab}><Text variant="header">✍️</Text></Pressable>
      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <View style={styles.backdrop}>
          <View style={styles.card}>
            <Text variant="header">Beta Feedback</Text>
            <TextInput multiline placeholder="What happened?" value={message} onChangeText={setMessage} style={styles.input} />
            <View style={styles.row}>
              {(['low','medium','high','critical'] as const).map((p) => (
                <SquishyButton key={p} style={styles.btn} onPress={() => setPriority(p)}><Text variant="header">{p}</Text></SquishyButton>
              ))}
            </View>
            <View style={styles.row}>
              <SquishyButton style={styles.btn} onPress={() => setOpen(false)}><Text variant="header">Close</Text></SquishyButton>
              <SquishyButton style={styles.btn} onPress={submit}><Text variant="header">Submit</Text></SquishyButton>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: { position: 'absolute', left: 20, bottom: 20, zIndex: 1001, paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#33DEA5', borderRadius: 20 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center' },
  card: { width: '88%', backgroundColor: '#1a0a1f', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(250,31,99,0.2)', padding: 16 },
  input: { minHeight: 120, backgroundColor: '#0d0610', borderWidth: 1, borderColor: 'rgba(250,31,99,0.2)', borderRadius: 10, padding: 10, color: '#fff', marginTop: 8 },
  row: { flexDirection: 'row', gap: 12, justifyContent: 'flex-end', marginTop: 12 },
  btn: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#5C1459', borderRadius: 10 }
});
