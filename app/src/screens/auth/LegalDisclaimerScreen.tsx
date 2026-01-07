import { View, StyleSheet } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';

type Props = {
  onContinue: () => void;
};

export default function LegalDisclaimerScreen({ onContinue }: Props) {
  return (
    <View style={styles.root}>
      <BlurView intensity={60} tint="dark" style={styles.blur} />
      <GlassCard>
        <Text variant="header">Legal Disclaimer</Text>
        <Text variant="body">
          This app is designed for entertainment and communication facilitation. It does not substitute for professional therapy. Results are not guaranteed.
        </Text>
        <SquishyButton onPress={() => { Haptics.selectionAsync(); onContinue(); }} style={styles.btn}>
          <Text variant="header">I Understand</Text>
        </SquishyButton>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: 16, justifyContent: 'center' },
  blur: { ...StyleSheet.absoluteFillObject },
  btn: { alignSelf: 'flex-end', paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#33DEA5', borderRadius: 12, marginTop: 12 },
});
