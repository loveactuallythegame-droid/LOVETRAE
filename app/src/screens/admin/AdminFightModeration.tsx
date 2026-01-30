
import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { RadialGradientBackground } from "../../components/ui/RadialGradientBackground";
import { Header } from "../../components/ui/Header";

const AdminFightModeration = ({ fights }) => {

  const renderItem = ({ item }) => (
    <View className="p-4 my-2 bg-white/20 rounded-lg">
      <Text className="text-white font-barbie-dream text-lg">{item.user1} vs {item.user2}</Text>
      <Text className="text-white font-holiday-christmas">{item.issue}</Text>
      <View className="flex-row mt-4">
        <TouchableOpacity className="bg-green-500 p-2 rounded-lg mr-2">
          <Text className="text-white">Approve</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-red-500 p-2 rounded-lg">
          <Text className="text-white">Deny</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <RadialGradientBackground
      colors={["#5C1459", "#FA1F63"]}
    >
      <Header
        logoSource={require("../../../assets/logo/mainlogoone.png")}
      />
      <View className="flex-1 p-4">
        <Text className="text-white text-4xl text-center my-4 font-wonderful-sometimes">Fight Moderation</Text>
        <FlatList
          data={fights}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    </RadialGradientBackground>
  );
};

export default AdminFightModeration;
