import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getChapterDetailsByQR, uploadAssignments } from "../services/api";
import CustomCheckBox from "../components/CustomCheckBox";
import * as ImagePicker from "expo-image-picker";

const QRCodeInputScreen = ({ route }) => {
  const { token, studentId } = route.params; // Accept studentId from route params
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [qrCodeValue, setQrCodeValue] = useState("");
  const [chapterDetails, setChapterDetails] = useState(null);
  const [selectedChapters, setSelectedChapters] = useState([]);
  const [isModalVisible, setModalVisible] = useState(true);
  const [selectedImages, setSelectedImages] = useState([]);

  const fetchChapterDetails = async (qrValue) => {
    try {
      const response = await getChapterDetailsByQR(qrValue, token);
      setChapterDetails(response.data);
      setModalVisible(false);
    } catch (error) {
      console.error("Error fetching chapter details:", error);
    }
  };

  const handleSubmit = () => {
    fetchChapterDetails(qrCodeValue);
  };

  const handleCheckBoxPress = (chapterId) => {
    setSelectedChapters((prevSelected) =>
      prevSelected.includes(chapterId)
        ? prevSelected.filter((id) => id !== chapterId)
        : [...prevSelected, chapterId]
    );
  };

  const handleUploadAssignments = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsMultipleSelection: true,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });

      if (!result.canceled) {
        const formData = new FormData();
        result.assets.forEach((image, index) => {
          formData.append("files", {
            uri: image.uri,
            name: `photo_${index}.jpg`,
            type: "image/jpeg",
          });
        });

        // Adding StudentId, ChapterId, and BookId to formData
        formData.append("StudentId", studentId);
        formData.append("ChapterId", chapterDetails.id);
        formData.append("BookId", chapterDetails.bookId);

        const response = await uploadAssignments(token, formData);

        if (response.data.success) {
          Alert.alert("Success", "Assignments uploaded successfully.");
        } else {
          Alert.alert("Error", "Failed to upload assignments.");
        }
      }
    } catch (error) {
      console.error("Error uploading assignments:", error);
      Alert.alert("Error", "An error occurred while uploading assignments.");
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>Scan To Pay</Text>
      </View>
      <View style={styles.qrCodeContainer}>
        <View style={styles.qrCodeBox}>
          <Text style={styles.qrCodeText}>Enter QR Code Manually</Text>
        </View>
      </View>
      {chapterDetails && (
        <View style={styles.chapterDetailsContainer}>
          <View style={styles.chapterDetails}>
            <Text style={styles.chapterOrder}>{chapterDetails.order}</Text>
            <Text style={styles.chapterTitle}>{chapterDetails.chapter}</Text>
            <CustomCheckBox
              isChecked={selectedChapters.includes(chapterDetails.id)}
              onPress={() => handleCheckBoxPress(chapterDetails.id)}
            />
          </View>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handleUploadAssignments}
          >
            <Text style={styles.uploadButtonText}>Upload Assignments</Text>
          </TouchableOpacity>
        </View>
      )}
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter QR Code</Text>
            <TextInput
              style={styles.qrInput}
              placeholder="Enter QR Code"
              value={qrCodeValue}
              onChangeText={setQrCodeValue}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={handleSubmit}
                style={styles.submitButton}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    fontSize: 18,
    color: "#000",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  qrCodeContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  qrCodeBox: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  qrCodeText: {
    fontSize: 18,
    color: "#888",
  },
  chapterDetailsContainer: {
    backgroundColor: "#f0f0f0",
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    alignItems: "center",
    marginTop: 20,
  },
  chapterDetails: {
    marginBottom: 20,
    alignItems: "center",
  },
  levelBox: {
    backgroundColor: "#d81b60",
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  levelText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  chapterDescription: {
    fontSize: 14,
    marginBottom: 10,
    textAlign: "center",
  },
  chapterOrder: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#d81b60",
    marginBottom: 5,
  },
  chapterTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  uploadButton: {
    backgroundColor: "#00FF8B",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  uploadButtonText: {
    fontSize: 16,
    color: "#fff",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  qrInput: {
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  submitButton: {
    backgroundColor: "#00FF8B",
    padding: 10,
    borderRadius: 5,
  },
  submitButtonText: {
    fontSize: 16,
    color: "#fff",
  },
  cancelButton: {
    backgroundColor: "#ff0000",
    padding: 10,
    borderRadius: 5,
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#fff",
  },
});

export default QRCodeInputScreen;
