// src/navigation/AppNavigator.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/LoginScreen";
import BottomTabNavigator from "./BottomTabNavigator";
import AssignBookScreen from "../screens/AssignBookScreen";
import AssignSuccessScreen from "../screens/AssignSuccessScreen";
import SuccessScreen from "../screens/SuccessScreen";
import BookSummaryScreen from "../screens/BookSummaryScreen";
import StudentsScreen from "../screens/StudentsScreen";
import BooksScreen from "../screens/BooksScreen";
import AssignedBooksScreen from "../screens/AssignedBooksScreen";
import ScanScreen from "../screens/ScanScreen";
import QRCodeInputScreen from "../screens/QRCodeInputScreen";
import UploadScreen from "../screens/UploadScreen";
import StudentProfileScreen  from "../screens/StudentProfileScreen";
import SummaryScreen from "../screens/SummaryScreen";
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
        initialParams={{ token: '', studentId: '' }} // Add default params
      />
      <Stack.Screen
        name="Success"
        component={SuccessScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AssignBook"
        component={AssignBookScreen}
        options={{ headerShown: false }}
      />
        <Stack.Screen
        name="StudentProfile"
        component={StudentProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Summary"
        component={SummaryScreen}
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
        name="AssignedBooks"
        component={AssignedBooksScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Scan"
        component={ScanScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="QRCodeInput"
        component={QRCodeInputScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Upload"
        component={UploadScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
