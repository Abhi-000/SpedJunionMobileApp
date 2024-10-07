import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Ensure AsyncStorage is imported

const LogoutModal = ({modalVisible, setModalVisible}) => {
  const navigation = useNavigation();

  // Handle logout logic
  const handleLogout = async () => {
    try {
      // Clear AsyncStorage or specific user credentials
      await AsyncStorage.removeItem('userCredentials');

      // You can log this to check if the item has been removed
      const credentialsAfterRemoval = await AsyncStorage.getItem('userCredentials');
      console.log('Credentials after removal:', credentialsAfterRemoval); // Should be null

      // Close the modal
      setModalVisible(false);

      // Reset the navigation stack and navigate to the Login screen
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Are you sure you want to log out?</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout} // Call the handleLogout function here
            >
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    paddingVertical: 50,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
  },
  modalText: {
    marginBottom: 20,
    fontSize: 25,
    fontWeight: '500',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    marginRight: 10,
    padding: 20,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#FF3B30',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontWeight: 'bold',
    color: '#FF3B30',
    fontSize: 16,
  },
  logoutButton: {
    flex: 1,
    marginLeft: 10,
    padding: 20,
    borderRadius: 30,
    backgroundColor: '#6A53A2',
    alignItems: 'center',
  },
  logoutButtonText: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 16,
  },
});

export default LogoutModal;
