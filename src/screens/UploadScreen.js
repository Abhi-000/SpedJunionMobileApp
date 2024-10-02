import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  SafeAreaView,
  Modal
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { uploadAssignments } from "../services/api";
import * as ImagePicker from "expo-image-picker";
import DuplicateAssignment from "../components/DuplicateAssignment";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const UploadScreen = ({ route }) => {
  const {
    token,
    studentId,
    bookDetails,
    chapterDetails,
    selectedChapters,
    selectedFiles,
    uploadedChapters,
    sessionId
  } = route.params;
  console.log("session id:",sessionId);
  console.log("bookDetails in Upload:",bookDetails);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [score, setScore] = useState("");
  const [observations, setObservations] = useState("");
  const [currentChapter, setCurrentChapter] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [imagePreviewVisible, setImagePreviewVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

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
      formData.append("ChapterId", selectedChapters); // Ensure ChapterId is correctly formatted
      formData.append("BookId", bookDetails.bookId);
      formData.append("SessionNumber", sessionId);
      
      const response = await uploadAssignments(token, formData);
      console.log(response.data);
      console.log("HELLO",successScreen, response.data.data, response.data);
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
      } else if(successScreen || !response.data.success){
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
    console.log("END SESSION");
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
    navigation.navigate("Upload", {
      token,
      studentId,
      bookDetails: bookDetails,
      chapterDetails: chapterDetails,
      selectedFiles: [],
      uploadedChapters: uploadedChapters,
      selectedChapters: selectedChapters,
    });
  };
  const handleImagePreview = (imageUri) => {
    setSelectedImage(imageUri);
    setImagePreviewVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Image style={styles.backButtonText} source={require("../../assets/backButton.png")} />
          </TouchableOpacity>
          <Text style={styles.headerText}>Assignments</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.bookDetailsCard}>
              <View style={styles.bookDetails}>
                <Image source={require("../../assets/booksCategory.png")} style={styles.bookIcon} />
                <View style={styles.bookInfo}>
                  <Text style={styles.bookDifficulty}>{bookDetails.difficulty}</Text>
                  <Text style={styles.bookTitle}>{bookDetails.bookName}</Text>
                </View>
              </View>
            </View>

            {chapterDetails.map((chapter, index) => (
              <View
                key={chapter.chapterId}
                style={[
                  styles.chapterCard,
                  chapter.isCurrent === 1 ? styles.currentChapterCard : null,
                ]}
              >
                <View style={styles.chapterDetails}>
                  <Text style={styles.chapterOrder}>{index + 1}</Text>
                  <View style={styles.chapterTextContainer}>
                    <Text style={styles.chapterTitle}>{chapter.title}</Text>
                    <Text style={styles.chapterName}>{chapter.chapter}</Text>
                  </View>
                  <View style={styles.rightContainer}>
                    {chapter.isCurrent === 1 && selectedFiles.length > 0 && (
                      <>
                        <TouchableOpacity onPress={() => handleImagePreview(selectedFiles[0].uri)}>
                          <Image source={{ uri: selectedFiles[0].uri }} style={styles.thumbnailImage} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleFileSelection} style={styles.uploadIconContainer}>
                          <Image source={require("../../assets/uploadIcon.png")} style={styles.uploadIcon} />
                        </TouchableOpacity>
                      </>
                    )}
                    {chapter.isCurrent !== 1 && (
                      <View
                        style={[
                          styles.checkBox,
                          updatedUploadedChapters.includes(chapter.chapterId)
                            ? styles.greenCheckBox
                            : styles.grayCheckBox,
                        ]}
                      >
                        {updatedUploadedChapters.includes(chapter.chapterId) ? (
                          <Text style={styles.checkMark}>✓</Text>
                        ) : null}
                      </View>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Bottom Container */}
        <View style={styles.bottomContainer}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteFile}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={() => handleUpload(true)}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Image Preview Modal */}
      <Modal visible={imagePreviewVisible} transparent={true} onRequestClose={() => setImagePreviewVisible(false)}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setImagePreviewVisible(false)}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
          <Image source={{ uri: selectedImage }} style={styles.previewImage} resizeMode="contain" />
        </View>
      </Modal>

      <DuplicateAssignment modalVisible={modalVisible} setModalVisible={setModalVisible} />
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },
  container: {
    flex: 1,
  },
  filePreviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  thumbnailImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  uploadIconContainer: {
    backgroundColor: '#63C3A8',
    borderRadius: 25,
    padding: 5,
  },
  uploadIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '90%',
    height: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },

  bottomContainer: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
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
  },
  content: {
    flex: 1,
    backgroundColor: "#6A53A2",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
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
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },

  currentChapterCard: {
    //backgroundColor: "#FFFFE0", // Light yellow background for current chapters
    borderColor: "#FFD700", // Gold border color for current chapters
    borderWidth: 1,
  },
  chapterDetails: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chapterOrder: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d81b60',
    marginRight: 10,
    width: 20,
  },
  chapterTextContainer: {
    flex: 1,
  },
  chapterTitle: {
    fontSize: 16,
    fontWeight:'bold'
  },
  chapterName:
  {
    fontSize: 12,
    fontWeight:'light'
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumbnailImage: {
    width: 40,
    height: 40,
    borderRadius: 5,
    marginRight: 10,
  },
  uploadIconContainer: {
    backgroundColor: '#63C3A8',
    borderRadius: 20,
    padding: 5,
    marginLeft: 5,
  },
  uploadIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },

  checkBox: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  greenCheckBox: {
    backgroundColor: '#63C3A8',
  },
  grayCheckBox: {
    backgroundColor: '#fff',
  },
  checkMark: {
    color: '#fff',
    fontSize: 16,
  },

  yellowCheckBox: {
    backgroundColor: "#FFD700", // Yellow color for the current chapter
  },  input: {
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
  bottomContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deleteButton: {
    backgroundColor: '#d81b60',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#63C3A8',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    flex: 1,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  submitButtonText: {
    fontSize: 16,
    color: '#fff',
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
  deleteButtonText: {
    fontSize: 16,
    color: "#fff",
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
