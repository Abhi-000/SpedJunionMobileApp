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
import StudentsSearchScreen from '../screens/StudentSearchScreen'; 
import MyProfileScreen from '../screens/MyProfileScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import EndSessionScreen from '../screens/EndSessionScreen'; 
import ProfileScreen from '../screens/ProfileScreen';
import SplashScreen from '../screens/SplashScreen'; // Import SplashScreen
import AppWrapper from './AppWrapper'; 
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import * as React from 'react';
import { TransitionPresets } from '@react-navigation/stack';
import { StatusBar } from 'react-native';
import PrivacyPolicy from '../screens/PrivacyPolicyScreen';
import TermsOfUse from '../screens/TermsOfUseScreen';
const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    
    <AppWrapper>
      <StatusBar backgroundColor="#6A53A2" barStyle="light-content" />
      <Stack.Navigator 
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          cardOverlayEnabled: true,
          ...TransitionPresets.DefaultTransition,
        }}
        initialRouteName="Splash" // Set Splash as the initial route
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
        <Stack.Screen name="TermsOfUse" component={TermsOfUse} />

       
         <Stack.Screen
          name="HomeTabs"
          component={BottomTabNavigator}
          options={{ headerShown: false }}
          initialParams={{ token: '', studentId: '', referenceId: '', roleId: '', hasStudents: false }}
        />
         {/* <Stack.Screen
          name="Books"
          component={BooksScreen}
          options={{ headerShown: false }}
        /> */}
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
          component={StudentsSearchScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EndSession"
          component={EndSessionScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </AppWrapper>
  );
};

export default AppNavigator;
