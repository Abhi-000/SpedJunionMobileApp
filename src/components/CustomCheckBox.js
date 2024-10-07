import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const CustomCheckBox = ({
  isChecked,
  onPress,
  checkBoxStyle,
  checkedStyle,
  checkMarkStyle,
  disabled
}) => {
  return (
    <TouchableOpacity disabled = {disabled} onPress={onPress} style={styles.container}>
      <View
        style={[
          styles.checkBox,
          checkBoxStyle,
          isChecked && [styles.checked, checkedStyle],
        ]}
      >
        {isChecked && <Text style={[styles.checkMark, checkMarkStyle]}>✓</Text>}
      </View>
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
    backgroundColor: "#fff",
  },
  checked: {
    backgroundColor: "#00FF8B",
  },
  checkMark: {
    color: "#fff",
  },
});

export default CustomCheckBox;
