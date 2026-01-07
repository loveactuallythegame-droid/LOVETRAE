import React from 'react';
import { View, Image, StyleSheet, Pressable, Text, Linking } from 'react-native';
import { LOGO_IMAGES } from '../../constants/assetManifest';
import { LinearGradient } from 'expo-linear-gradient';

export default function WebSplash() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image source={LOGO_IMAGES[0]} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>Love, Actually... The Game</Text>
        <Text style={styles.subtitle}>How About We Don't Break Up?</Text>
        
        <View style={styles.buttons}>
          <Pressable 
            onPress={() => Linking.openURL('https://trae.ai')}
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          >
            <LinearGradient
              colors={['#FA1F63', '#BE1980']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.gradient}
            >
              <Text style={styles.buttonText}>Download App</Text>
            </LinearGradient>
          </Pressable>
        </View>
        
        <Text style={styles.footer}>Preview Mode • Web</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#120016',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    gap: 24,
    padding: 20,
  },
  logo: {
    width: 200,
    height: 200,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FA1F63',
    textAlign: 'center',
    fontFamily: 'System', 
  },
  subtitle: {
    fontSize: 18,
    color: '#BE1980',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'System',
  },
  buttons: {
    gap: 16,
    width: '100%',
    maxWidth: 300,
  },
  button: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  gradient: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    marginTop: 40,
    color: 'rgba(255,255,255,0.3)',
    fontSize: 12,
  },
});
