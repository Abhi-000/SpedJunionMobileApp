import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "https://testing.spedathome.com:7253/api/Users/login",
        {
          Username: email,
          Password: password,
        }
      );

      console.log("API response:", response.data);

      if (response.data.token) {
        console.log("Login successful:", response.data);
        navigation.navigate("HomeTabs", { token: response.data.token, studentId: response.data.studentId });
      } else {
        console.log("Login failed: Incorrect credentials or token missing");
      }
    } catch (error) {
      console.error("Error logging in:", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Image
          source={require("../../assets/loginBg.png")} // Add your image here
          style={styles.iconBoyImage}
        />
        <Text style={styles.title}>
          Login to your account to access all the features in Barber Shop
        </Text>
      </View>
      <View style={styles.loginContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email / Phone Number"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <View style={styles.actions}>
          <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Log In</Text>
          </TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#6A53A2", // Background color from the provided image
  },
  topSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  iconBoyImage: {
    width: 150, // Adjust as necessary
    height: 150, // Adjust as necessary
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    textAlign: "center",
    color: "#FFFFFF",
    marginBottom: 20,
  },
  loginContainer: {
    flex: 1,
    width: "100%", // Adjust as necessary
    height: "70%",
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
  },
  input: {
    width: "100%",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    marginBottom: 15,
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
  forgotPassword: {
    color: "#007aff",
  },
});

export default Login;
