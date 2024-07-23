import React, { useState, useEffect } from "react";
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
import * as ImagePicker from "expo-image-picker";
import DuplicateAssignment from "../components/DuplicateAssignment";

const UploadScreen = ({ route }) => {
  const {
    token,
    studentId,
    bookDetails,
    chapterDetails,
    selectedChapters,
    selectedFiles,
    uploadedChapters,
  } = route.params;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [score, setScore] = useState("");
  const [observations, setObservations] = useState("");
  const [currentChapter, setCurrentChapter] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [updatedUploadedChapters, setUpdatedUploadedChapters] =
    useState(uploadedChapters);

    
  const allChaptersUploaded = chapterDetails.length-1 <= updatedUploadedChapters.length;
  useEffect(() => {
    if (selectedChapters.length > 0) {
      setCurrentChapter(selectedChapters[0]); // Set the first selected chapter as the current chapter
    }
  }, [selectedChapters]);

  const handleUpload = async (successScreen) => {
    try {
      const formData = new FormData();
      selectedFiles.forEach((file, index) => {
        formData.append("UploadUrl", {
          uri: file.uri,
          name: file.name,
          type: "image/jpeg",
        });
      });
      formData.append("StudentId", studentId);
      formData.append("ChapterId", selectedChapters.join(",")); // Ensure ChapterId is correctly formatted
      formData.append("BookId", bookDetails.bookId);

      const response = await uploadAssignments(token, formData);
      console.log(response.data);
      if (response.data.success && successScreen) {
        setUpdatedUploadedChapters((prev) => [...prev, currentChapter]);
        setCurrentChapter(null); // Reset current chapter after upload
        navigation.navigate("Success", {
          title: "Successfully Submitted",
          message: "Assignment submitted sucesfully",
          buttonText: "Continue",
          nextScreen: "Scan",
          nextScreenParams: { token },
        });
        // Navigate to ScanScreen on successful upload
        // navigation.navigate("Scan", {
        //   token,
        //   studentId,
        // });
      } else if(successScreen || !response.data.data){
        setModalVisible(true);
        //Alert.alert("Error", "Failed to upload assignments.");
      }
      else if(!successScreen && response.data.success)
      {
        const selectedFileName = selectedFiles.length > 0 ? selectedFiles[0].fileName : "No file selected";
    navigation.navigate("EndSession", { 
      token, 
      studentId, 
      bookDetails, 
      chapterDetails, 
      uploadedChapters,
      selectedFileName
    });
      }
    } catch (error) {
      console.error("Error uploading assignments:", error);
      Alert.alert("Error", "An error occurred while uploading assignments.");
    }
  };

  const handleEndSession = async () => {
    await handleUpload(false);
    
    console.log("Selected Files:", selectedFiles);
  };
  
  const handleChapterPress = (chapterId) => {
    setCurrentChapter(chapterId);
  };
  const handleFileSelection = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsMultipleSelection: true,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });
      if (!result.canceled) {
        navigation.navigate("Upload", {
          token,
          studentId,
          bookDetails: bookDetails,
          chapterDetails: chapterDetails,
          selectedFiles: result.assets,
          selectedChapters: selectedChapters,
          uploadedChapters: uploadedChapters,
        });
      }
    } catch (error) {
      console.error("Error selecting files:", error);
      Alert.alert("Error", "An error occurred while selecting files.");
    }
  };

  const handleDeleteFile = () => {
    const updatedFiles = [];
    navigation.navigate("Upload", {
      token,
      studentId,
      bookDetails: bookDetails,
      chapterDetails: chapterDetails,
      selectedFiles: updatedFiles,
      uploadedChapters: uploadedChapters,
      selectedChapters: selectedChapters,
    });
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
          <Image
            style={styles.backButtonText}
            source={require("../../assets/backButton.png")}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Assignments</Text>
      </View>
      <View style={styles.parentContainer}>
        <View
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
            <View
              key={chapter.chapterId}
              style={[
                styles.chapterCard,
                chapter.isCurrent === 1 ? styles.currentChapterCard : null,
              ]}
            >
              <View style={styles.chapterDetails}>
                <Text style={styles.chapterOrder}>{chapter.order}</Text>
                <View style={styles.chapterTextContainer}>
                  {chapter.isCurrent === 1 && selectedFiles.length > 0 ? (
                    selectedFiles.map((file, index) => (
                      <TouchableOpacity
                        onPress={handleFileSelection}
                        key={index}
                      >
                        <Text style={styles.chapterTitle}>{file.fileName}</Text>
                      </TouchableOpacity>
                    ))
                  ) : (
                    <Text style={styles.chapterTitle}>{chapter.title}</Text>
                  )}
                </View>
                <View
                  style={[
                    styles.checkBox,
                    currentChapter === chapter.chapterId &&
                    chapter.isUploaded != 1
                      ? styles.yellowCheckBox
                      : updatedUploadedChapters.includes(chapter.chapterId)
                      ? styles.greenCheckBox
                      : styles.grayCheckBox,
                  ]}
                  onPress={() => handleChapterPress(chapter.chapterId)}
                >
                  {updatedUploadedChapters.includes(chapter.chapterId) ? (
                    <Text style={styles.checkMark}>✓</Text>
                  ) : null}
                </View>
              </View>
            </View>
          ))}
        </View>
        <View style={styles.bottomContainer}>
        
        <View style={styles.buttonContainer}>
          {allChaptersUploaded ? (
            <TouchableOpacity
              style={styles.endSessionButton}
              onPress={handleEndSession}
            >
              <Text style={styles.endSessionButtonText}>End Session</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDeleteFile}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleUpload(true)}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
      <DuplicateAssignment
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
  },
  bottomContainer: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 30,
    alignItems: "center",
  },
  parentContainer: {
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    backgroundColor: "#6A53A2",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    paddingBottom: 30,
    backgroundColor: "#f7f7f7",
  },
  backButton: {
    position: "absolute",
    left: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    width: 50,
    height: 50,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    padding: 20,
  },
  uploadIcon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  detailsContainer: {
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
  currentChapterCard: {
    //backgroundColor: "#FFFFE0", // Light yellow background for current chapters
    borderColor: "#FFD700", // Gold border color for current chapters
    borderWidth: 1,
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
  yellowCheckBox: {
    backgroundColor: "#FFD700", // Yellow color for the current chapter
  },
  greenCheckBox: {
    backgroundColor: "#63C3A8", // Green color for uploaded chapters
  },
  grayCheckBox: {
    backgroundColor: "#fff", // Default color for non-selected chapters
  },
  checkMark: {
    color: "#fff",
  },
  input: {
    borderWidth: 1,
    width: "100%",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 15,
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
    marginTop:20,
    justifyContent: "center",
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
  fileCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    width: "100%",
  },
  fileInfo: {
    flexDirection: "column",
  },
  fileName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  fileSize: {
    fontSize: 14,
    color: "#666",
  },
  deleteFileButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  uploadCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#63C3A8",
    borderStyle: "dashed",
  },
  uploadCardText: {
    fontSize: 16,
    color: "#63C3A8",
    fontWeight: "bold",
  },
  endSessionButton: {
    backgroundColor: "#FF2C2C", // Green color for end session button
    paddingVertical: 10,
    borderRadius: 25,
    alignSelf:'center',
    alignItems: "center",
    width: "50%",
  },
  endSessionButtonText: {
    fontSize: 16,
    color: "#fff",
  },

});

export default UploadScreen;
