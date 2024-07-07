// src/screens/HomeScreen.js
import React from "react";
import { View } from "react-native";
import Home from "../components/Home";

const HomeScreen = ({ token, referenceId, roleId }) => {
  return (
    <View style={{ flex: 1 }}>
      <Home token={token} referenceId={referenceId} roleId={roleId} />
    </View>
  );
};

export default HomeScreen;
