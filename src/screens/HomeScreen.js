// src/screens/HomeScreen.js
import React from "react";
import { View } from "react-native";
import Home from "../components/Home";
import { useRoute } from "@react-navigation/native";

const HomeScreen = () => {
  const route = useRoute();
  const { token } = route.params;

  return (
    <View style={{ flex: 1 }}>
      <Home token={token} />
    </View>
  );
};

export default HomeScreen;
