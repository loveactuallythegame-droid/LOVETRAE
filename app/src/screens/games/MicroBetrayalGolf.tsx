import { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { LinearGradient } from 'expo-linear-gradient';

export default function MicroBetrayalGolf({ navigation }: any) {
  const [angle, setAngle] = useState(0); // -45 to 45
  const [power, setPower] = useState(50); // 0 to 100
  const [strokes, setStrokes] = useState(0);
  const [hole, setHole] = useState(false);
  const [feedback, setFeedback] = useState("Aim for Repair.");

  function putt() {
    setStrokes(strokes + 1);
    // Mock physics
    if (Math.abs(angle) < 10 && power > 40 && power < 80) {
      setHole(true);
      setFeedback("HOLE IN ONE (or close enough)!");
    } else {
      if (power < 40) setFeedback("Too weak. Like your apology.");
      else if (power > 80) setFeedback("Too strong! You're escalating.");
      else setFeedback("Off course. You missed the repair ramp.");
    }
  }

  function reset() {
    setStrokes(0);
    setHole(false);
    setAngle(0);
    setPower(50);
    setFeedback("Aim for Repair.");
  }

  return (
    <LinearGradient colors={['#001000', '#000000']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <SquishyButton onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text variant="body">Back</Text>
          </SquishyButton>
          <Text variant="header">Micro-Betrayal Golf</Text>
        </View>

        <GlassCard style={styles.course}>
           <View style={[styles.hole, hole ? {backgroundColor: '#33DEA5'} : {}]}>
             <Text style={{fontSize: 10}}>REPAIR</Text>
           </View>

           {/* Visualization of "Ball" would be here */}
           <View style={{ height: 150, justifyContent: 'center', alignItems: 'center' }}>
              <Text variant="header" style={{fontSize: 30}}>{hole ? '⛳️' : '⚪️'}</Text>
           </View>

           <View style={styles.controls}>
             <Text variant="body">Angle: {Math.round(angle)}°</Text>
             <Slider
               style={{ width: '100%', height: 40 }}
               minimumValue={-45}
               maximumValue={45}
               value={angle}
               onValueChange={setAngle}
               minimumTrackTintColor="#33DEA5"
             />

             <Text variant="body">Power: {Math.round(power)}%</Text>
             <Slider
               style={{ width: '100%', height: 40 }}
               minimumValue={0}
               maximumValue={100}
               value={power}
               onValueChange={setPower}
               minimumTrackTintColor="#FA1F63"
             />
           </View>

           {!hole ? (
             <SquishyButton onPress={putt} style={styles.btn}>
               <Text variant="header">PUTT</Text>
             </SquishyButton>
           ) : (
             <SquishyButton onPress={reset} style={[styles.btn, {backgroundColor: '#33DEA5'}]}>
               <Text variant="header">Next Hole</Text>
             </SquishyButton>
           )}

           <Text variant="body" style={{marginTop: 20, textAlign: 'center', color: hole ? '#33DEA5' : '#fff'}}>
              {feedback}
           </Text>

           {hole && (
             <Text variant="body" style={{marginTop: 10, textAlign: 'center', fontStyle: 'italic'}}>
               Marcie: "Sunk it in {strokes} strokes? Impressive."
             </Text>
           )}
        </GlassCard>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, gap: 20 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  backBtn: { paddingHorizontal: 15, paddingVertical: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12 },
  course: { padding: 20, minHeight: 400 },
  hole: { width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: '#fff', alignItems: 'center', justifyContent: 'center', alignSelf: 'center' },
  controls: { gap: 10, marginVertical: 20 },
  btn: { backgroundColor: '#fff', padding: 15, borderRadius: 12, alignItems: 'center' }
});
