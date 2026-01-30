
import React from "react";
import { View, Text } from "react-native";
import { RadialGradientBackground } from "../../components/ui/RadialGradientBackground";
import { Header } from "../../components/ui/Header";

const AdminAnalytics = () => {


  return (
    <RadialGradientBackground
      colors={["#5C1459", "#FA1F63"]}
    >
      <Header
        logoSource={require("../../../assets/logo/mainlogoone.png")}
      />
      <View className="flex-1 justify-center items-center">
        <Text className="text-white text-4xl font-wonderful-sometimes">Admin Analytics</Text>
        {/* Add charts and data visualizations here */}
      </View>
    </RadialGradientBackground>
  );
};

export default AdminAnalytics;
