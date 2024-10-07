import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from "../services/api.js";
import IncorrectPasswordModal from "./IncorrectPasswordModal.js";
import YourSvgImage from '../../assets/2.svg';
import { Checkbox } from 'react-native-paper';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const navigation = useNavigation();
  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const storedCredentials = await AsyncStorage.getItem('userCredentials');
      console.log(storedCredentials);
      if (storedCredentials) {
        const { email, password, token, referenceId,roleId, lastLoginTime } = JSON.parse(storedCredentials);
        const currentTime = new Date().getTime();
        const timeDifference = currentTime - lastLoginTime;
        const hoursPassed = timeDifference / (1000 * 60 * 60);

        if (hoursPassed >= 24) {
          // If 24 hours have passed, attempt to refresh the token
          await handleLogin(email, password, true);
        } else {

          // If less than 24 hours have passed, navigate to the home screen
          navigation.replace('HomeTabs',{ token, referenceId, roleId });
        }
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  };

  const storeCredentials = async (email, password, token, referenceId, roleId) => {
    try {
      const credentials = {
        email,
        password,
        token,
        referenceId,
        roleId,
        lastLoginTime: new Date().getTime()
      };
      await AsyncStorage.setItem('userCredentials', JSON.stringify(credentials));
    } catch (error) {
      console.error('Error storing credentials:', error);
    }
  };


  const validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleEmailChange = (text) => {
    setEmail(text);
    setIsEmailValid(validateEmail(text));
    setErrorMessage(""); // Clear any previous error messages
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = async (emailInput, passwordInput, isAutoLogin = false) => {
    const loginEmail = isAutoLogin ? emailInput : email;
    const loginPassword = isAutoLogin ? passwordInput : password;

    if (!isAutoLogin) {
      if (!agreed) {
        alert("Please agree to the Privacy Policy and Terms of Use before logging in.");
        return;
      }
      if (!isEmailValid) {
        setErrorMessage("Please enter a valid email address.");
        return;
      }
    }

    try {
      const response = await login(loginEmail, loginPassword);
      console.log("API response:", response.data);

      if (response.data.token) {
        const { token, referenceId, roleId } = response.data;
        if ([1, 2, 4].includes(roleId)) {
          console.log("Login successful:", referenceId);
          await storeCredentials(loginEmail, loginPassword, token, referenceId, roleId);
          navigation.replace('HomeTabs', { token, referenceId, roleId });
        } else {
          setErrorMessage("You do not have permission to access this application.");
        }
      } else {
        console.log("Login failed: Incorrect credentials or token missing");
        setModalVisible(true);
      }
    } catch (error) {
      if (error.message === "Network Error") {
        setErrorMessage("Not connected to internet. Please check your connection and try again.");
      } else {
        setModalVisible(true);
      }
    }
  };
  const handlePrivacyPolicy = () => {
    navigation.navigate("PrivacyPolicy");
  };

  const handleTermsOfUse = () => {
    navigation.navigate("TermsOfUse");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <IncorrectPasswordModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
          />
          <View style={styles.topSection}>
            <Image
              source={require("../../assets/loginBg.png")}
              style={styles.iconBoyImage}
            />
            <Text style={styles.title}>
              Login to your account to access all the features in Sped Junior
            </Text>
          </View>
          <View style={styles.loginContainer}>
            <View style={[styles.passwordContainer, !isEmailValid ? styles.inputError : null]}>
              <TextInput
                style={styles.input}
                placeholder="Email / Phone Number"
                value={email}
                onChangeText={handleEmailChange}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {!isEmailValid && <Text style={styles.errorText}>Please enter a valid email address</Text>}
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!passwordVisible}
              />
              <TouchableWithoutFeedback onPress={togglePasswordVisibility}>
                <Ionicons
                  name={passwordVisible ? "eye" : "eye-off"}
                  size={24}
                  color="gray"
                  style={styles.eyeIcon}
                />
              </TouchableWithoutFeedback>
            </View>
            <View style={styles.checkboxContainer}>
              <Checkbox
                status={agreed ? 'checked' : 'unchecked'}
                onPress={() => setAgreed(!agreed)}
                color="#00bfa5"
              />
              <Text style={styles.checkboxText}>
                I agree to the{' '}
                <Text style={styles.linkText} onPress={handlePrivacyPolicy}>
                  Privacy Policy
                </Text>{' '}
                and{' '}
                <Text style={styles.linkText} onPress={handleTermsOfUse}>
                  Terms of Use
                </Text>
              </Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity
                onPress={handleLogin}
                style={[styles.loginButton, (!agreed || !isEmailValid) && styles.loginButtonDisabled]}
                disabled={!agreed || !isEmailValid}
              >
                <Text style={styles.loginButtonText}>Log In</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("ForgotPassword")}>
                <Text style={styles.forgotPassword}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
            {errorMessage ? <Text style={styles.errorTextGeneral}>{errorMessage}</Text> : null}
            <View style={styles.logoContainer}>
              <YourSvgImage width={200} height={200} />
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6A53A2",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  topSection: {
    paddingTop: 50,
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 20, // Add padding to the sides to center text
  },
  iconBoyImage: {
    resizeMode: "contain",
    width: 450,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    textAlign: "center",
    color: "#FFFFFF",
    marginBottom: 20,
  },
  loginContainer: {
    width: "100%",
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flex: 1,
    justifyContent: 'space-between', // This will push the logo to the bottom
  },

  input: {
    width: "100%",
    padding: 15,
    borderColor: "#ccc",
    borderRadius: 25,
    backgroundColor: "#fff",
  },
  actions: {
    width: "100%",
    alignItems: "center",
  },
  loginButton: {
    backgroundColor: "#00bfa5",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 10,
    width: "100%",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingRight: 30,
    borderWidth: 0.5,
    borderRadius: 25,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  eyeIcon: {
    marginLeft: -30, // Adjust margin to position the icon inside the input field
  },
  forgotPassword: {
    color: "#007aff",
  },
  flexSpacer: {
    flex: 1,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20, // Add some top margin to separate from inputs
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1,
  },
  errorText: {
    marginTop:-10,
    color: 'red',
    marginLeft: 10,
    marginBottom: 20,
    textAlign: 'left',
  },
  errorTextGeneral:
  {
    marginTop:10,
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',

  },


  logo: {
    // width: 100,
    // height: 100,
  },

  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkboxText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  linkText: {
    color: '#007aff',
    textDecorationLine: 'underline',
  },
  loginButtonDisabled: {
    backgroundColor: '#cccccc',
  },

});

export default Login;
