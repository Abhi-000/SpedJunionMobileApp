import React from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const BookNotAssignedModal = ({ modalVisible, setModalVisible, onRetry }) => {
console.log("modal visible:",modalVisible);
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
            This book is not assigned to the student. Please try again with a different book.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setModalVisible(false);
              onRetry();
            }}
          >
            <Text style={styles.buttonText}>Retry</Text>
          </TouchableOpacity>
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
    marginBottom: 15,
    textAlign: "center",
    fontSize: 16,
  },
  button: {
    width: "80%",
    borderWidth: 1,
    borderColor: "#FF5733",
    borderRadius: 50,
    padding: 10,
    alignItems: "center",
    backgroundColor: "white",
  },
  buttonText: {
    color: "#FF5733",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
});

export default BookNotAssignedModal;