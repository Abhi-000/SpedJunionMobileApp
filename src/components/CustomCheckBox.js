// src/components/CustomCheckBox.js
import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";

const CustomCheckBox = ({ isChecked, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.checkBoxContainer}>
      <View style={[styles.checkBox, isChecked && styles.checkedBox]}>
        {isChecked && <Text style={styles.checkMark}>✔</Text>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkBoxContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  checkBox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  checkedBox: {
    backgroundColor: "#00bfa5",
  },
  checkMark: {
    color: "#fff",
    fontSize: 14,
  },
});

export default CustomCheckBox;
