// src/screens/HomeScreen.js
import React from "react";
import { View } from "react-native";
import Home from "../components/Home";

const HomeScreen = ({ token }) => {
  return (
    <View style={{ flex: 1 }}>
      <Home token={token} />
    </View>
  );
};

export default HomeScreen;
