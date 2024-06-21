// src/navigation/BottomTabNavigator.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import BooksScreen from "../screens/BooksScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = ({ route }) => {
  const { token } = route.params;

  return (
    <Tab.Navigator initialRouteName="Home"
    screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home">{() => <HomeScreen token={token} />}</Tab.Screen>
      <Tab.Screen name="Books">
        {() => <BooksScreen token={token} />}
      </Tab.Screen>
      <Tab.Screen name="Profile">
        {() => <ProfileScreen token={token} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
