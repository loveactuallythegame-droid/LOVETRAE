import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

type State = { hasError: boolean; error?: any; info?: any };

export default class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { hasError: false, error: undefined, info: undefined };
  static getDerivedStateFromError(error: any) { return { hasError: true, error }; }
  componentDidCatch(error: any, info: any) { 
    try { console.warn('ErrorBoundary', error, info); } catch {}
  }
  handleReload = () => {
    try {
      if (typeof window !== 'undefined' && window.location) window.location.reload();
      else this.setState({ hasError: false, error: undefined, info: undefined });
    } catch {
      this.setState({ hasError: false, error: undefined, info: undefined });
    }
  };
  render() {
    if (this.state.hasError) {
      const msg = typeof this.state.error?.message === 'string' ? this.state.error.message : 'Unexpected error';
      return (
        <View style={styles.wrap}>
          <View style={styles.card}>
            <Text style={styles.title}>Something went wrong</Text>
            <Text style={styles.msg}>{msg}</Text>
            <Pressable onPress={this.handleReload} style={styles.btn}><Text style={styles.btnText}>Reload</Text></Pressable>
          </View>
        </View>
      ) as any;
    }
    return this.props.children as any;
  }
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#120016' },
  card: { width: '88%', maxWidth: 520, padding: 16, borderRadius: 16, backgroundColor: 'rgba(26,10,31,0.9)', borderWidth: 1, borderColor: 'rgba(250,31,99,0.2)', gap: 10 },
  title: { fontSize: 18, color: '#FA1F63' },
  msg: { fontSize: 14, color: '#fff' },
  btn: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#5C1459', borderRadius: 10 },
  btnText: { color: '#fff' },
});
