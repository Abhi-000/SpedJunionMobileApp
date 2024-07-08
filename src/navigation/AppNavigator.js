// AppNavigator.js
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import BottomTabNavigator from './BottomTabNavigator';
import AssignBookScreen from '../screens/AssignBookScreen';
import AssignSuccessScreen from '../screens/AssignSuccessScreen';
import SuccessScreen from '../screens/SuccessScreen';
import BookSummaryScreen from '../screens/BookSummaryScreen';
import StudentsScreen from '../screens/StudentsScreen';
import BooksScreen from '../screens/BooksScreen';
import AssignedBooksScreen from '../screens/AssignedBooksScreen';
import ScanScreen from '../screens/ScanScreen';
import QRCodeInputScreen from '../screens/QRCodeInputScreen';
import UploadScreen from '../screens/UploadScreen';
import StudentProfileScreen from '../screens/StudentProfileScreen';
import SummaryScreen from '../screens/SummaryScreen';
import StudentsSearchScreen from '../screens/StudentSearchScreen'; // Import the new screen
import MyProfileScreen from '../screens/MyProfileScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import AppWrapper from './AppWrapper'; // Import AppWrapper
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import * as React from 'react';
import { TransitionPresets } from '@react-navigation/stack';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <AppWrapper>
      <Stack.Navigator 
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        cardOverlayEnabled: true,
        ...TransitionPresets.DefaultTransition,
      }}
      initialRouteName="Login">
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
          initialParams={{ token: '', studentId: '', referenceId: '', roleId: '' }} // Add default params
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
          name="MyProfile"
          component={MyProfileScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
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
        <Stack.Screen
          name="StudentsSearch"
          component={StudentsSearchScreen} // Add the new screen
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </AppWrapper>
  );
};

export default AppNavigator;
