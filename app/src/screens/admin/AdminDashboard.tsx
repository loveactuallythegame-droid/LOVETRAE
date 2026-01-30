
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { RadialGradientBackground } from "../../components/ui/RadialGradientBackground";
import { Header } from "../../components/ui/Header";

const AdminDashboard = ({ navigation }) => {


  return (
    <RadialGradientBackground
      colors={["#5C1459", "#FA1F63"]}
    >
      <Header
        logoSource={require("../../../assets/logo/mainlogoone.png")}
      />
      <View className="flex-1 justify-center items-center">
        <Text className="text-white text-4xl font-wonderful-sometimes mb-8">Admin Dashboard</Text>
        <TouchableOpacity onPress={() => navigation.navigate("AdminAnalytics")} className="bg-white/20 p-4 rounded-lg mb-4">
          <Text className="text-white font-barbie-dream text-lg">View Analytics</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("AdminFightModeration")} className="bg-white/20 p-4 rounded-lg mb-4">
          <Text className="text-white font-barbie-dream text-lg">Moderate Fights</Text>
        </TouchableOpacity>
      </View>
    </RadialGradientBackground>
  );
};

export default AdminDashboard;
