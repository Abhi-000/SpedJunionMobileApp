import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { forgotPassword } from '../services/api';
const ForgotPasswordScreen = () => {
    const route = useRoute();
    const token = route.params;
  const [username, setUsername] = useState('');
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const handleGetPassword = async () => {
    try {
      const response = await forgotPassword(token,username)
      if (response.success) {
        navigation.navigate('Success', {
          title: 'Password Reset',
          message: response.message,
          buttonText: 'Continue',
          nextScreen:"Login"
        });
      } else {
        Alert.alert('Error', 'Failed to reset password. Please try again.');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      Alert.alert('Error', 'Failed to reset password. Please try again.');
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
    >
      <View style={styles.topContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image style={styles.backButtonText} source={require('../../assets/backButton.png')} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Forgot Password</Text>
      </View>
      <View style={styles.header}>
        <Text style={styles.headerText}>Enter your email address and we will send you a code</Text>
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Enter your registered email address here</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Email / Phone Number"
          keyboardType="email-address"
        />
        <TouchableOpacity style={styles.button} onPress={handleGetPassword}>
          <Text style={styles.buttonText}>Get Password</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    paddingBottom: 30,
    backgroundColor: '#f7f7f7',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    width: 50,
    height: 50,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  header: {
    backgroundColor: '#6A53A2',
    paddingVertical: 35,
    paddingHorizontal: 10,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  input: {
    
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingVertical:20,
    paddingHorizontal: 15,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
    elevation: 2,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#63C3A8',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ForgotPasswordScreen;
