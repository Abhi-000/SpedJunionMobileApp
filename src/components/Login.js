import React, { useState } from "react";
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
import { login } from "../services/api.js";
import IncorrectPasswordModal from "./IncorrectPasswordModal.js";
import YourSvgImage from '../../assets/2.svg';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = async () => {
    try {
      const response = await login(email, password);
      console.log("API response:", response.data);

      if (response.data.token) {
        console.log("Login successful:", response.data.referenceId);
        navigation.navigate("HomeTabs", {
          token: response.data.token,
          referenceId: response.data.referenceId,
          roleId: response.data.roleId,
        });
      } else {
        console.log("Login failed: Incorrect credentials or token missing");
      }
    } catch (error) {
      setModalVisible(true);
    }
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
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email / Phone Number"
                value={email}
                onChangeText={setEmail}
              />
            </View>
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
            <View style={styles.actions}>
              <TouchableOpacity
                onPress={handleLogin}
                style={styles.loginButton}
              >
                <Text style={styles.loginButtonText}>Log In</Text>
              </TouchableOpacity>
              <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </View>
            <View style={styles.flexSpacer} />
            <View style={styles.logoContainer}>
              {/* <Image
                source={require("../../assets/2.svg")}
                style={styles.logo}
              /> */}
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
    paddingBottom: 30,
  },
  logo: {
    // width: 100,
    // height: 100,
  },
});

export default Login;
