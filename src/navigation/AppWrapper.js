// AppWrapper.js
import React, { createContext, useContext, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Loader from '../components/Loader'; // Adjust the path as needed

// Create a context to manage the loading state
const LoadingContext = createContext();

export const useLoading = () => {
  return useContext(LoadingContext);
};

const AppWrapper = ({ children }) => {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      <View style={styles.container}>
        {children}
        {loading && <Loader loading={loading} />}
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
