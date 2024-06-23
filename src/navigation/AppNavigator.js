// src/navigation/AppNavigator.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/LoginScreen";
import BottomTabNavigator from "./BottomTabNavigator";
import AssignBookScreen from "../screens/AssignBookScreen";
import AssignSuccessScreen from "../screens/AssignSuccessScreen";
import BookSummaryScreen from "../screens/BookSummaryScreen";
import StudentsScreen from "../screens/StudentsScreen";
import BooksScreen from "../screens/BooksScreen";
import AssignedBooksScreen from "../screens/AssignedBooksScreen"; // Import the new screen
import { SafeAreaWrapper } from "../components/SafeAreaWrapper";
const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />    
      <Stack.Screen
        name="Books"
        component={BooksScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HomeTabs"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AssignBook"
        component={AssignBookScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AssignSuccess"
        component={AssignSuccessScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BookSummary"
        component={BookSummaryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Students"
        component={StudentsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AssignedBooks" // Add the new screen
        component={AssignedBooksScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
