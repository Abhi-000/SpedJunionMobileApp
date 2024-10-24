import React from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
} from "react-native";

const ExitConfirmationModal = ({ modalVisible, setModalVisible, onConfirm }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(false);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>
            Are you sure you want to exit?
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.exitButton]}
              onPress={onConfirm}
            >
              <Text style={[styles.buttonText, styles.exitButtonText]}>Exit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: 300,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 20,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
  },
  button: {
    width: "45%",
    borderWidth: 1,
    borderRadius: 50,
    padding: 10,
    alignItems: "center",
  },
  cancelButton: {
    borderColor: "#6A53A2",
    backgroundColor: "white",
  },
  exitButton: {
    borderColor: "#FF5733",
    backgroundColor: "white",
  },
  buttonText: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  cancelButtonText: {
    color: "#6A53A2",
  },
  exitButtonText: {
    color: "#FF5733",
  },
});

export default ExitConfirmationModal;