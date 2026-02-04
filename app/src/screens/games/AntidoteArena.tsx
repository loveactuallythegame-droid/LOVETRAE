import React, { useState, useEffect } from "react";
import { View, Text, Pressable, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { Header } from "../../components/ui/Header";
import { RadialGradientBackground } from "../../components/ui/RadialGradientBackground";
import { MarcieHost } from "../../components/ai-host/MarcieHost";

import firestore from "@react-native-firebase/firestore";

const AntidoteArena = ({ route }) => {
  const { gameId } = route.params;
  const navigation = useNavigation();

  const [gameState, setGameState] = useState(null);
  const [selectedAntidote, setSelectedAntidote] = useState(null);

  useEffect(() => {
    const unsub = firestore()
      .collection("active_games")
      .doc(gameId)
      .onSnapshot((doc) => {
        const data = doc.data();
        if (data) {
          setGameState(data);
        }
      });

    return () => unsub();
  }, [gameId]);

  const handleAntidoteSelection = (antidote) => {
    setSelectedAntidote(antidote);
    const isCorrect = antidote === gameState.correctAntidote;

    firestore()
      .collection("active_games")
      .doc(gameId)
      .update({
        score: firestore.FieldValue.increment(isCorrect ? 100 : -50),
      });

    // Navigate to next round or results
    setTimeout(() => {
      navigation.navigate("NextRound", { gameId });
    }, 1000);
  };

  if (!gameState) {
    return (
      <SafeAreaView className="flex-1 bg-background-dark items-center justify-center">
        <Text className="text-white">Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <RadialGradientBackground>
        <Header
          title="Antidote Arena"
          logo={require("../../../assets/logo/mainlogoone.png")}
        />
        
        {/* Dr. Marcie Section */}
        <View style={styles.drMarcieSection}>
          <View style={styles.avatarContainer}>
            <Image source={require('../../assets/images/MarcieAvatar.png')} style={styles.avatar} />
          </View>
          <View style={styles.quoteBox}>
            <Text style={styles.quoteText}>Fight the four horsemen of relationship apocalypse! Each antidote represents a positive communication strategy.</Text>
          </View>
        </View>
        
        <View className="flex-1 p-4">
          <MarcieHost quote={gameState.quote} />

          <View className="my-8 items-center">
            <MaterialCommunityIcons name="sword-cross" size={64} color="#db147c" />
            <Text className="text-white font-barbie text-2xl text-center mt-4 bg-[#db147c]/20 px-4 py-2 rounded-full">
              The Horseman of {gameState.horseman} is attacking!
            </Text>
          </View>

          <View className="flex-row flex-wrap justify-around">
            {gameState.antidotes.map((antidote) => (
              <Pressable
                key={antidote.name}
                className="w-2/5 bg-gradient-to-br from-[#db147c] to-[#f05d68] p-4 rounded-xl m-2 items-center shadow-lg"
                onPress={() => handleAntidoteSelection(antidote.name)}
              >
                <MaterialCommunityIcons name={antidote.icon} size={32} color="white" />
                <Text className="text-white font-holiday text-center mt-2">{antidote.name}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </RadialGradientBackground>
    </SafeAreaView>
  );
};

const styles = {
  drMarcieSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 16,
    margin: 16,
    marginBottom: 8
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fcc738',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: 'cover'
  },
  quoteBox: {
    flex: 1,
    backgroundColor: 'rgba(252, 199, 56, 0.2)',
    borderRadius: 12,
    padding: 12
  },
  quoteText: {
    color: '#ffffff',
    fontSize: 14,
    lineHeight: 20
  }
};

export default AntidoteArena;