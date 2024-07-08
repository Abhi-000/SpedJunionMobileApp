import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import {login} from "../services/api.js"
import IncorrectPasswordModal from "./IncorrectPasswordModal.js";
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
      // const response = await axios.post(
      //   "https://testing.spedathome.com:7253/api/Users/login",
      //   {
      //     Username: email,
      //     Password: password,
      //   }
      // );
      const response = await login(email,password);

      console.log("API response:", response.data);

      if (response.data.token) {
        console.log("Login successful:", response.data.referenceId);
        navigation.navigate("HomeTabs", { token: response.data.token,referenceId : response.data.referenceId, roleId:response.data.roleId });
      } else {
        console.log("Login failed: Incorrect credentials or token missing");
      }
    } catch (error) {
      setModalVisible(true);
      //console.error("Error logging in:", error.message);
    }
  };

  return (
    <View style={styles.container}>
       <IncorrectPasswordModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
      <View style={styles.topSection}>
        <Image
          source={require("../../assets/loginBg.png")} // Add your image here
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
        <Text style={styles.eyeIcon}>{passwordVisible ? '👁️' : '👁️‍🗨️'}</Text>    
  </TouchableWithoutFeedback>
  </View>
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
    paddingTop:50,
    alignItems: "center",
    marginBottom: 20,
  },
  iconBoyImage: {
    resizeMode:'contain',
    width:450,
    height:200,
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
    //borderWidth: 1,
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
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',   
    paddingRight:30,
    borderWidth:.5,
    borderRadius: 25,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
 
  eyeIcon: {
    width: 24,
    height: 24,
  },
  forgotPassword: {
    color: "#007aff",
  },
});

export default Login;
