import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Login'); // Change 'Login' to your initial screen
    }, 3000); // Duration for the splash screen
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/FlashImage.png')}
        style={styles.mainImage}
      />
      <Image
        source={require('../../assets/logo.png')}
        style={styles.bottomImage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 50,
  },
  mainImage: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    marginTop: 150,
  },
  bottomImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 30,
  },
});

export default SplashScreen;
