
import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import GlobalMarcieOverlay from '../../components/ai-host/GlobalMarcieOverlay';
import { Header } from '../../components/ui/Header';
import { SquishyButton } from '../../components/ui';

const ApologyAuctionScreen = () => {
  // Placeholder for game state and logic
  const currentItem = {
    name: 'Vintage Regret',
    description: 'A classic, heartfelt apology for that thing you did.',
    highBid: 150,
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#5C1459', '#1a0a1a']} style={styles.background} />
      <Header title="Apology Auction" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.auctionItemContainer}>
          <Image source={require('../../../assets/images/apology-item-placeholder.png')} style={styles.itemImage} />
          <Text style={styles.itemName}>{currentItem.name}</Text>
          <Text style={styles.itemDescription}>{currentItem.description}</Text>
        </View>

        <View style={styles.biddingContainer}>
          <View style={styles.highBidContainer}>
            <Text style={styles.highBidLabel}>High Bid</Text>
            <Text style={styles.highBidValue}>${currentItem.highBid}</Text>
          </View>
          <View style={styles.biddingControls}>
            <SquishyButton style={styles.bidButton}>
              <Text style={styles.bidButtonText}>Place Bid</Text>
            </SquishyButton>
            <SquishyButton style={[styles.bidButton, styles.passButton]}>
              <Text style={styles.bidButtonText}>Pass</Text>
            </SquishyButton>
          </View>
        </View>
      </ScrollView>
      <GlobalMarcieOverlay quote={`Going once, going twice... Are you going to let them win this one?`} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a0a1a' },
  background: { ...StyleSheet.absoluteFillObject },
  content: { padding: 20 },
  auctionItemContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(92, 20, 89, 0.2)', // #5C1459 with opacity
    borderColor: 'rgba(250, 31, 99, 0.3)', // #FA1F63 with opacity
    borderWidth: 1,
    borderRadius: 16,
    marginBottom: 20,
  },
  itemImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  itemName: {
    fontFamily: 'BarbieDream-Regular',
    color: '#FFF',
    fontSize: 28,
    marginBottom: 10,
  },
  itemDescription: {
    fontFamily: 'SweetPink-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    textAlign: 'center',
  },
  biddingContainer: {
    padding: 20,
    backgroundColor: 'rgba(92, 20, 89, 0.2)', // #5C1459 with opacity
    borderColor: 'rgba(250, 31, 99, 0.3)', // #FA1F63 with opacity
    borderWidth: 1,
    borderRadius: 16,
  },
  highBidContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  highBidLabel: {
    fontFamily: 'HolidayChristmas-Regular',
    color: '#33DEA5',
    fontSize: 16,
    textTransform: 'uppercase',
  },
  highBidValue: {
    fontFamily: 'WonderfulSometimes-Regular',
    color: '#FFF',
    fontSize: 48,
  },
  biddingControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  bidButton: {
    backgroundColor: '#FA1F63',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  passButton: {
      backgroundColor: '#5C1459'
  },
  bidButtonText: {
    fontFamily: 'BarbieDream-Regular',
    color: '#FFF',
    fontSize: 20,
  },
});

export default ApologyAuctionScreen;
