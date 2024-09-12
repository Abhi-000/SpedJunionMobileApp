import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import { View, TouchableOpacity, StyleSheet,Text } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import HomeScreen from "../screens/HomeScreen";
import BooksScreen from "../screens/BooksScreen";
import ProfileScreen from "../screens/ProfileScreen";
import YourSvgImage from '../../assets/1.svg';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const defaultStackScreenOptions = {
  headerShown: false,
  gestureEnabled: true,
  cardOverlayEnabled: true,
  ...TransitionPresets.DefaultTransition,
};

const HomeStack = ({ token, referenceId, roleId }) => (
  <Stack.Navigator screenOptions={defaultStackScreenOptions}>
    <Stack.Screen name="Home">
      {() => <HomeScreen token={token} referenceId={referenceId} roleId={roleId} />}
    </Stack.Screen>
  </Stack.Navigator>
);

const BooksStack = ({ token }) => (
  <Stack.Navigator screenOptions={defaultStackScreenOptions}>
    <Stack.Screen name="Books">
      {() => <BooksScreen token={token} />}
    </Stack.Screen>
  </Stack.Navigator>
);

const ProfileStack = ({ token, referenceId, roleId }) => (
  <Stack.Navigator screenOptions={defaultStackScreenOptions}>
    <Stack.Screen name="Profile" options={{ headerShown: false }}>
      {(props) => (
        <ProfileScreen
          {...props}
          token={token}
          referenceId={referenceId}
          roleId={roleId}
        />
      )}
    </Stack.Screen>
  </Stack.Navigator>
);

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.tabContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel !== undefined ? options.tabBarLabel : route.name;
        const isFocused = state.index === index;

        const onPress = () => {
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
            <TouchableOpacity
              key={index}
              onPress={onPress}
              style={styles.homeButton}
            >
              <YourSvgImage top={15} width={100} height={100} />
              {/* <Text style={styles.label}>Home</Text> */}
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={index}
            onPress={onPress}
            style={styles.tabButton}
          >
            <Ionicons
              name={route.name === 'Books' ? 'book' : 'person'}
              size={24}
              color={isFocused ? '#6A53A2' : '#AEB0B9'}
            />
            <Text style={[styles.label, isFocused && styles.focusedLabel]}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const BottomTabNavigator = ({ route }) => {
  const { token, referenceId, roleId } = route.params;

  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Home"
    >
      <Tab.Screen 
        name="Books"
        options={{ tabBarLabel: 'Books' }}
      >
        {(props) => <BooksStack {...props} token={token} />}
      </Tab.Screen>
      <Tab.Screen 
        name="Home"
        options={{ tabBarLabel: 'Home' }}
      >
        {(props) => <HomeStack {...props} token={token} referenceId={referenceId} roleId={roleId} />}
      </Tab.Screen>
      <Tab.Screen 
        name="Profile"
        options={{ tabBarLabel: 'Profile' }}
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
});

export default BottomTabNavigator;