import { View, StyleSheet, Linking } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';

export default function SupportScreen() {
  return (
    <View style={styles.root}>
      <GlassCard>
        <Text variant="header">Support</Text>
        <Text variant="body">Need help? Contact our team or browse FAQs.</Text>
        <View style={styles.row}>
          <SquishyButton style={styles.btn} onPress={() => Linking.openURL('mailto:support@lovetrae.app')}>
            <Text variant="header">Email Support</Text>
          </SquishyButton>
          <SquishyButton style={styles.btn} onPress={() => Linking.openURL('https://example.com/support')}>
            <Text variant="header">Open Help Center</Text>
          </SquishyButton>
        </View>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: 16 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
  btn: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#33DEA5', borderRadius: 10 },
});

