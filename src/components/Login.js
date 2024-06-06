// src/components/Login.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
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

      // Assuming the presence of a token indicates a successful login
      if (response.data.token) {
        console.log("Login successful:", response.data);
        navigation.navigate("Home", { token: response.data.token });
        // Handle the response data as needed
      } else {
        console.log("Login failed: Incorrect credentials");
      }
    } catch (error) {
      console.error("Error logging in:", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Login to your account to access all the features in Barber Shop
      </Text>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
  },
  actions: {
    width: "100%",
    alignItems: "center",
  },
  loginButton: {
    backgroundColor: "#00bfa5",
    padding: 15,
    borderRadius: 5,
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
