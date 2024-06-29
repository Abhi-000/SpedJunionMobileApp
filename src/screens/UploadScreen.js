import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { uploadAssignments } from "../services/api";

const UploadScreen = ({ route }) => {
  const {
    token,
    studentId,
    bookDetails,
    chapterDetails,
    selectedFiles,
    selectedChapters,
  } = route.params;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [score, setScore] = useState("");
  const [observations, setObservations] = useState("");

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      selectedFiles.forEach((file, index) => {
        formData.append("UploadUrl", {
          uri: file.uri,
          name: `photo_${index}.jpg`,
          type: "image/jpeg",
        });
      });
      formData.append("StudentId", studentId);
      formData.append("ChapterId", selectedChapters.join(",")); // Ensure ChapterId is correctly formatted
      formData.append("BookId", bookDetails.bookId);

      const response = await uploadAssignments(token, formData);

      if (response.data.success) {
        Alert.alert("Success", "Assignments uploaded successfully.");
      } else {
        Alert.alert("Error", "Failed to upload assignments.");
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
        <Text style={styles.headerText}>Assignments</Text>
      </View>
      <ScrollView
        style={styles.detailsContainer}
        contentContainerStyle={styles.detailsContent}
      >
        <View style={styles.bookDetailsCard}>
          <View style={styles.bookDetails}>
            <Image
              source={require("../../assets/booksCategory.png")} // Replace with your image source
              style={styles.bookIcon}
            />
            <View style={styles.bookInfo}>
              <Text style={styles.bookDifficulty}>
                {bookDetails.difficulty}
              </Text>
              <Text style={styles.bookTitle}>{bookDetails.bookName}</Text>
            </View>
          </View>
        </View>
        {chapterDetails.map((chapter) => (
          <View key={chapter.chapterId} style={styles.chapterCard}>
            <View style={styles.chapterDetails}>
              <Text style={styles.chapterOrder}>{chapter.order}</Text>
              <View style={styles.chapterTextContainer}>
                <Text style={styles.chapterTitle}>{chapter.title}</Text>
              </View>
              <View
                style={[
                  styles.checkBox,
                  chapter.isUploaded ||
                  selectedChapters.includes(chapter.chapterId)
                    ? styles.greenCheckBox
                    : styles.grayCheckBox,
                ]}
              >
                {chapter.isUploaded ||
                selectedChapters.includes(chapter.chapterId) ? (
                  <Text style={styles.checkMark}>✓</Text>
                ) : null}
              </View>
            </View>
          </View>
        ))}
        <TextInput
          style={styles.input}
          placeholder="Enter score here"
          value={score}
          onChangeText={setScore}
        />
        <TextInput
          style={styles.textArea}
          placeholder="Observations"
          value={observations}
          onChangeText={setObservations}
          multiline
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitButton} onPress={handleUpload}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  detailsContainer: {
    flex: 1,
    backgroundColor: "#f0f0f0", // Grey background for the outermost container
    padding: 20,
  },
  detailsContent: {
    alignItems: "center",
  },
  bookDetailsCard: {
    backgroundColor: "#fff", // Card background color
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    width: "100%",
  },
  bookDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  bookIcon: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 12,
    color: "#666",
  },
  bookDifficulty: {
    fontSize: 18,
    color: "#d81b60",
  },
  chapterCard: {
    width: "100%",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  chapterDetails: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  chapterOrder: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#d81b60",
    marginRight: 10,
  },
  chapterTextContainer: {
    flex: 1,
  },
  chapterTitle: {
    fontSize: 18,
  },
  checkBox: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ccc", // Initial border color for checkboxes
  },
  greenCheckBox: {
    backgroundColor: "#63C3A8", // Updated green color
  },
  grayCheckBox: {
    backgroundColor: "#ccc", // Initial gray color for checkboxes
  },
  checkMark: {
    color: "#fff",
  },
  input: {
    width: "100%",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 10,
  },
  textArea: {
    width: "100%",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 10,
    height: 100,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  deleteButton: {
    backgroundColor: "#d81b60",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  deleteButtonText: {
    fontSize: 16,
    color: "#fff",
  },
  submitButton: {
    backgroundColor: "#63C3A8", // Updated green color
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: "center",
    flex: 1,
  },
  submitButtonText: {
    fontSize: 16,
    color: "#fff",
  },
});

export default UploadScreen;
