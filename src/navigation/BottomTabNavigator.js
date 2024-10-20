import React, { useState, useEffect, useCallback } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import { View, TouchableOpacity, StyleSheet, Text, BackHandler } from "react-native";
  import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import Ionicons from "react-native-vector-icons/Ionicons";
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import PrivacyPolicy from '../screens/PrivacyPolicyScreen';
import TermsOfUse from '../screens/TermsOfUseScreen';
import AssignBookScreen from '../screens/AssignBookScreen';
import SuccessScreen from '../screens/SuccessScreen';
import BooksScreen from '../screens/BooksScreen';
import ScanScreen from '../screens/ScanScreen';
import QRCodeInputScreen from '../screens/QRCodeInputScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MyProfileScreen from '../screens/MyProfileScreen';
import EndSessionScreen from '../screens/EndSessionScreen';
import StudentProfileScreen from "../screens/StudentProfileScreen";
import SummaryScreen  from "../screens/SummaryScreen";
import AssignSuccessScreen from "../screens/AssignSuccessScreen";
import BookSummaryScreen from "../screens/BookSummaryScreen";
import YourSvgImage from '../../assets/1.svg';
import AssignedBooksScreen from "../screens/AssignedBooksScreen";
import StudentsScreen from "../screens/StudentsScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const defaultStackScreenOptions = {
  headerShown: false,
  gestureEnabled: true,
  cardOverlayEnabled: true,
  ...TransitionPresets.DefaultTransition,
};

const HomeStack = ({ token, referenceId, roleId, setHasStudents }) => {
  const navigation = useNavigation();
  const route = useRoute();

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        // Get the navigation state
        const navState = navigation.getState();
        
        // Check if we're in the HomeStack and on the first screen
        const isInHomeTab = navState.routes[navState.index].name === 'Home';
        let isFirstScreenInStack;
        if(navState.routes[navState.index].state){
         isFirstScreenInStack = navState.routes[navState.index].state.index==0;
        }
        else 
        {
           isFirstScreenInStack = navState.routes[navState.index].state ==null
        }
        const parentNav = navigation.getParent();
          const parentState = parentNav?.getState();
          console.log("parent nav:",parentNav);
          console.log("parent state:",parentState.routes.state);
          console.log("nav state:",navState.routes[navState.index].state)
        console.log(isInHomeTab, isFirstScreenInStack);
        // If we're in the Home tab and on the first screen (main Home screen)
        if (isInHomeTab && isFirstScreenInStack) {
          // Check if we're in HomeTabs
          // const parentNav = navigation.getParent();
          // const parentState = parentNav?.getState();
          // console.log("parent nav:",parentNav);
          // console.log("parent state:",parentState);
          BackHandler.exitApp();
                return true;
          // If we're in HomeTabs and on the Home tab
    
          // if (parentState?.routes[parentState.index].name === 'HomeTabs') {
           
          // }
        }
        
        // // For other screens, go back normally
        // if (navigation.canGoBack()) {
        //   navigation.goBack();
        //   return true;
        // }
        
        return false;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );


  return (
    <Stack.Navigator screenOptions={defaultStackScreenOptions}>
      <Stack.Screen 
        name="Home"
        options={{ headerShown: false }}
      >
        {() => (
          <HomeScreen 
            token={token} 
            referenceId={referenceId} 
            roleId={roleId} 
            setHasStudents={setHasStudents} 
          />
        )}
      </Stack.Screen>
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
        name="AssignBook" 
        component={AssignBookScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};



const BooksStack = ({ token, navigation }) => {
  const route = useRoute(); // Use this to access navigation parameters

  return (
    <Stack.Navigator screenOptions={defaultStackScreenOptions}>
      <Stack.Screen name="Books">
        {() => <BooksScreen token={token} studentId={route.params?.studentId} />}
      </Stack.Screen>
      {/* Add other screens to Books stack */}
      <Stack.Screen name="StudentProfile" component={StudentProfileScreen} />
      <Stack.Screen name="BookSummary" component={BookSummaryScreen} />
      <Stack.Screen name="AssignBook" component={AssignBookScreen} />
      <Stack.Screen name="Students" component={StudentsScreen} />
      <Stack.Screen name="AssignedBooks" component={AssignedBooksScreen} />
      <Stack.Screen name="AssignSuccess" component={AssignSuccessScreen} />
    </Stack.Navigator>
  );
};

const ProfileStack = ({ token, referenceId, roleId }) => (
  <Stack.Navigator screenOptions={defaultStackScreenOptions}>
    <Stack.Screen name="Profile">
      {(props) => (
        <ProfileScreen
          {...props}
          token={token}
          referenceId={referenceId}
          roleId={roleId}
        />
      )}
    </Stack.Screen>
    {/* Add screens to Profile stack */}
    <Stack.Screen name="MyProfile" component={MyProfileScreen} />
    <Stack.Screen name="EndSession" component={EndSessionScreen} />
  </Stack.Navigator>
);

const CustomTabBar = ({ state, descriptors, navigation, hasStudents }) => {
  return (
    <View style={styles.tabContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel !== undefined ? options.tabBarLabel : route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          if (route.name === 'Books' && !hasStudents) {
            // Books tab is not interactable when there are no students
            return;
          }

          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        if (route.name === 'Home') {
          return (
            <View>
            <TouchableOpacity
              key={index}
              onPress={onPress}
              //style={styles.homeButton}
            >
              <YourSvgImage top={-20} width={100} height={100} />
             
            </TouchableOpacity>
             <Text style  = {{ position:'absolute', top:50, left:30}}>
             {label}
           </Text>
           </View>
          );
        }

        return (
          <TouchableOpacity
            key={index}
            onPress={onPress}
            style={[
              styles.tabButton,
              route.name === 'Books' && !hasStudents && styles.disabledTab
            ]}
            disabled={route.name === 'Books' && !hasStudents}
          >
            <Ionicons
              name={route.name === 'Books' ? 'book' : 'person'}
              size={24}
              color={isFocused ? '#6A53A2' : (route.name === 'Books' && !hasStudents ? '#D3D3D3' : '#AEB0B9')}
            />
            <Text style={[
              styles.label,
              isFocused && styles.focusedLabel,
              route.name === 'Books' && !hasStudents && styles.disabledLabel
            ]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const BottomTabNavigator = ({ route }) => {
  const { token, referenceId, roleId } = route.params;
  const studentId = null;
  const [hasStudents, setHasStudents] = useState(false);
  const [currentTab, setCurrentTab] = useState('Home');
  const navigation = useNavigation();
  const handleTabPress = (tabName) => {
    setCurrentTab(tabName);
  };
  


  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} hasStudents={hasStudents} />}
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Home"
    >
      <Tab.Screen 
        name="Books"
        options={{ tabBarLabel: 'Books', unmountOnBlur: true }}
        listeners={{
          tabPress: () => handleTabPress('Books'),
        }}
      >
        {(props) => <BooksStack {...props} token={token} studentId={studentId} />}
      </Tab.Screen>
      
      <Tab.Screen 
        name="Home"
        options={{ tabBarLabel: 'Home', unmountOnBlur: true }}
        listeners={{
          tabPress: () => handleTabPress('Home'),
        }}
      >
        {(props) => (
          <HomeStack 
            {...props} 
            token={token} 
            referenceId={referenceId} 
            roleId={roleId} 
            setHasStudents={setHasStudents} 
          />
        )}
      </Tab.Screen>

      <Tab.Screen 
        name="Profile"
        options={{ tabBarLabel: 'Profile', unmountOnBlur: true }}
        listeners={{
          tabPress: () => handleTabPress('Profile'),
        }}
      >
        {() => <ProfileStack token={token} referenceId={referenceId} roleId={roleId} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 20,
    elevation: 5,
    shadowColor: "#8A2BE2",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  disabledTab: {
    opacity: 0.5,
  },
  disabledLabel: {
    color: '#D3D3D3',
  },

});

export default BottomTabNavigator;