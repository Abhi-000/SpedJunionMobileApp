import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const CustomCheckBox = ({ isChecked, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={[styles.checkBox, isChecked && styles.checked]}>
        {isChecked && <Text style={styles.checkMark}>✓</Text>}
      </View>
      <Text style={styles.label}>Check this box</Text> {/* Example label */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkBox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  checked: {
    backgroundColor: "#00FF8B",
  },
  checkMark: {
    color: "#fff",
  },
  label: {
    marginLeft: 10,
  },
});

export default CustomCheckBox;
