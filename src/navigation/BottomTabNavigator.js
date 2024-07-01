// src/navigation/BottomTabNavigator.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import BooksScreen from "../screens/BooksScreen";
import ProfileScreen from "../screens/ProfileScreen";
import AssignBookScreen from "../screens/AssignBookScreen";
import AssignSuccessScreen from "../screens/AssignSuccessScreen";
import BookSummaryScreen from "../screens/BookSummaryScreen";
import StudentsScreen from "../screens/StudentsScreen";
import AssignedBooksScreen from "../screens/AssignedBooksScreen";
import ScanScreen from "../screens/ScanScreen";
import QRCodeInputScreen from "../screens/QRCodeInputScreen";
import Ionicons from "react-native-vector-icons/Ionicons";
import { View } from "react-native";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = ({ token }) => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" options={{ headerShown: false }}>
      {() => <HomeScreen token={token} />}
    </Stack.Screen>
    <Stack.Screen name="AssignBook" component={AssignBookScreen} />
    <Stack.Screen name="AssignSuccess" component={AssignSuccessScreen} />
    <Stack.Screen name="BookSummary" component={BookSummaryScreen} />
    <Stack.Screen name="Students" component={StudentsScreen} />
    <Stack.Screen name="AssignedBooks" component={AssignedBooksScreen} />
    <Stack.Screen name="Scan" component={ScanScreen} />
    <Stack.Screen name="QRCodeInput" component={QRCodeInputScreen} />
  </Stack.Navigator>
);

const BooksStack = ({ token }) => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Books" options={{ headerShown: false }}>
      {() => <BooksScreen token={token} />}
    </Stack.Screen>
  </Stack.Navigator>
);

const ProfileStack = ({ token, studentId }) => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Profile" options={{ headerShown: false }}>
      {() => <ProfileScreen token={token} studentId={studentId} />}
    </Stack.Screen>
  </Stack.Navigator>
);

const BottomTabNavigator = ({ route }) => {
  const { token, studentId } = route.params;
  console.log("student id:",studentId);
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Books") {
            iconName = focused ? "book" : "book-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: focused ? "#8A2BE2" : "transparent",
                borderRadius: 10,
                paddingVertical: 5,
                paddingHorizontal: 15,
              }}
            >
              <Ionicons
                name={iconName}
                size={size}
                color={focused ? "#FFFFFF" : color}
              />
            </View>
          );
        },
        tabBarActiveTintColor: "#6A53A2",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
        },
      })}
    >
      <Tab.Screen name="Home">{() => <HomeStack token={token} />}</Tab.Screen>
      <Tab.Screen name="Books">{() => <BooksStack token={token} />}</Tab.Screen>
      <Tab.Screen name="Profile">
        {() => <ProfileStack token={token} studentId={studentId} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
