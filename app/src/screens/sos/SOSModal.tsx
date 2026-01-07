import { useEffect } from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import { MarcieHost } from '../../components/ai-host';
import { Text, SquishyButton } from '../../components/ui';

type SOSModalProps = {
  visible: boolean;
  onProceed: () => void;
  onCancel: () => void;
};

export default function SOSModal({ visible, onProceed, onCancel }: SOSModalProps) {
  useEffect(() => {}, [visible]);
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <MarcieHost mode="idle" size={240} float position={{ x: 24, y: 24 }} />
        <View style={styles.card}>
          <Text variant="header">Put down the weapons. To the booths. Now.</Text>
          <View style={{ height: 12 }} />
          <View style={styles.row}>
            <SquishyButton style={styles.btn} onPress={onCancel}><Text variant="header">Cancel</Text></SquishyButton>
            <SquishyButton style={styles.btn} onPress={onProceed}><Text variant="header">Proceed</Text></SquishyButton>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center' },
  card: { width: '88%', backgroundColor: '#1a0a1f', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(250,31,99,0.2)', padding: 16 },
  row: { flexDirection: 'row', gap: 12, justifyContent: 'flex-end' },
  btn: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#5C1459', borderRadius: 12 },
});
