import React, { createContext, useContext, useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { useNavigation } from '@react-navigation/native';
import Loader from '../components/Loader'; // Adjust the path as needed

// Create a context to manage the loading state
const LoadingContext = createContext();

export const useLoading = () => {
  return useContext(LoadingContext);
};

const AppWrapper = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    let isNavigating = false; // Flag to prevent multiple navigations

    const unsubscribe = NetInfo.addEventListener(state => {
      if (!state.isConnected && !isNavigating) {
        isNavigating = true; // Set flag before navigation
        Alert.alert(
          'No Internet Connection',
          'You are not connected to the internet. Please try again later',
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
                });
              },
            },
          ],
          { cancelable: false }
        );
      }
    });

    // Check connection state immediately on mount
    NetInfo.fetch().then(state => {
      if (!state.isConnected && !isNavigating) {
        isNavigating = true;
        Alert.alert(
          'No Internet Connection',
          'You are not connected to the internet. Please try again later',
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
                });
              },
            },
          ],
          { cancelable: false }
        );
      }
    });

    return () => {
      unsubscribe();
    };
  }, [navigation]);


  // Custom hook to handle screen transitions
  const useScreenTransition = () => {
    useEffect(() => {
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 100);
      return () => clearTimeout(timer);
    }, []);
  };

  return (
    <LoadingContext.Provider value={{ loading, setLoading, useScreenTransition }}>
      <View style={styles.container}>
        {children}
        <Loader loading={loading} />
      </View>
    </LoadingContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AppWrapper;