import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

const SuccessScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { title, message, buttonText, nextScreen, nextScreenParams } = route.params;

  const handleNavigation = () => {
    console.log("next screen: " + nextScreen);
    // First pop back to remove the Success screen from the stack
    navigation.goBack();
    // Then pop back again to remove the AssignBook screen
    navigation.goBack();
    // Finally, ensure we're on the Books screen with the correct params
    navigation.navigate(nextScreen, nextScreenParams);
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <View style={styles.iconBackground}>
          <Text style={styles.icon}>✔</Text>
        </View>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      <TouchableOpacity style={styles.button} onPress={handleNavigation}>
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6A53A2",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  iconBackground: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#00FF8B",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    fontSize: 50,
    color: "#fff",
  },
  title: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  message: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#70E6C4",
    paddingVertical: 15,
    paddingHorizontal: 100,
    borderRadius: 25,
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "medium",
    textAlign: "center",
  },
});

export default SuccessScreen;
