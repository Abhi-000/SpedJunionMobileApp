import React, { useState, useEffect,useRef,useCallback  } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BarCodeScanner } from "expo-barcode-scanner";
import * as ImagePicker from "expo-image-picker";
import { Animated, Easing } from "react-native";
import { getSessionWiseAssessmentDetails } from "../services/api";
import * as FileSystem from "expo-file-system";

const QRCodeInputScreen = ({ route }) => {
  const { token, studentId } = route.params;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [flashlight, setFlashlight] = useState(false);
  const [bookDetails, setBookDetails] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [chapterDetails, setChapterDetails] = useState(null);
  const [uploadedChapters, setUploadedChapters] = useState([]);
  const [selectedChapters, setSelectedChapters] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isCameraVisible, setIsCameraVisible] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const containerSize = useRef(new Animated.Value(1)).current;
  const expandContainer = () => {
    Animated.timing(containerSize, {
      toValue: 1,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  };
  
  const shrinkContainer = () => {
    Animated.timing(containerSize, {
      toValue: 0.5,  // This will make the container half its original size
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  };
  
  useEffect(() => {
    console.log("Updated sessionId:", sessionId);
  }, [sessionId]);


  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = async ({ data }) => {
    console.log("scann", data);
  setScanned(true);
  setIsCameraVisible(false);
  setShowDetails(true);  // Add this line
  //shrinkContainer();
    try {
      const response = await getSessionWiseAssessmentDetails(
        data,
        studentId,
        token
      );
      // const response = 
      // {"bookDetails": {"bookId": 1, "bookName": "COMPREHENSIVE LEARNING FOR FUNCTIONAL LITERACY & NUMERACY SKILLS", "difficulty": "BEGINNER"}, "chapterDetails": [{"bookId": 1, "chapter": "Synonyms", "chapterId": 1, "isCurrent": 1, "isUploaded": 0, "order": 1, "title": "Circle the correct words for beautiful"}, {"bookId": 1, "chapter": "Missing Number", "chapterId": 2, "isCurrent": 0, "isUploaded": 1, "order": 2, "title": "Fill each egg with the missing numbers"}, {"bookId": 1, "chapter": "Common Noun", "chapterId": 3, "isCurrent": 0, "isUploaded": 1, "order": 3, "title": "People, Places, Animals and Things"}]}
      setBookDetails(response.bookDetails);
      setChapterDetails(response.chapterDetails);
      const currentChapter = response.chapterDetails.find(chapter => chapter.isCurrent === 1);
    if (currentChapter) {
      console.log("session",currentChapter.sessionId);
      
      setSessionId(currentChapter.sessionId);
    } else {
      console.log("No current chapter found");
      setSessionId(null); // or handle this case as needed
    }
    
      const selectedChapters = response.chapterDetails
        .filter((chapter) => chapter.isCurrent)
        .map((chapter) => chapter.chapterId);
      setSelectedChapters(selectedChapters);

      const uploadedChapters = response.chapterDetails
        .filter((chapter) => chapter.isUploaded)
        .map((chapter) => chapter.chapterId);
      setUploadedChapters(uploadedChapters);
    } catch (error) {
      console.error("Error fetching qr:", error);
    }
    console.log(sessionId);
  };

  const handleUploadAssignments = () => {
    setModalVisible(true);
  };

  const handleOpenCamera = useCallback(async () => {
    setModalVisible(false);
    
    if (!sessionId) {
      Alert.alert("Error", "Session ID is not available. Please scan the QR code first.");
      return;
    }
    console.log(sessionId);
    try {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
      });
      
      if (!result.canceled) {
        navigation.navigate("Upload", {
          token,
          studentId,
          bookDetails,
          chapterDetails,
          selectedFiles: result.assets,
          selectedChapters,
          uploadedChapters,
          sessionId
        });
      }
    } catch (error) {
      console.error("Error selecting files:", error);
      Alert.alert("Error", "An error occurred while selecting files.");
    }
  }, [
    navigation, 
    token, 
    studentId, 
    bookDetails, 
    chapterDetails, 
    selectedChapters, 
    uploadedChapters, 
    sessionId  // Include sessionId in the dependency array
  ]);


  const handlePickImage = async () => {
    setModalVisible(false);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
      });

      if (!result.canceled) {
        const image = result.assets[0];
        const imageUri = image.uri;
        const barcodeScanned = await scanImageForQRCode(imageUri);

        if (barcodeScanned) {
          handleBarCodeScanned({ data: barcodeScanned });
        } else {
          Alert.alert("Error", "No QR code detected in the selected image.");
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "An error occurred while picking the image.");
    }
  };
  const handlePickAssignmentFile = useCallback(async () => {
    setModalVisible(false);
    console.log("sesh",sessionId);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsMultipleSelection: true,
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
          sessionId:sessionId
        });
      }
    } catch (error) {
      console.error("Error selecting assignment files:", error);
      Alert.alert("Error", "An error occurred while selecting files.");
    }
  },[
    navigation, 
    token, 
    studentId, 
    bookDetails, 
    chapterDetails, 
    selectedChapters, 
    uploadedChapters, 
    sessionId

  ]);

  const scanImageForQRCode = async (imageUri) => {
    try {
      const imageData = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const binaryString = atob(imageData);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const results = await BarCodeScanner.scanFromURLAsync(imageUri);
      if (results.length > 0) {
        return results[0].data;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error scanning image for QR code:", error);
      return null;
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

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
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Scan", { token: route.params?.token })
            }
            style={styles.backButton}
          >
            <Image
              style={styles.backButtonText}
              source={require("../../assets/backButton.png")}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Scan to Upload</Text>
        </View>
        <Animated.View 
  style={[
    styles.qrCodeContainer,
    {
      transform: [
        {
          scale: containerSize,
        },
      ],
    },
  ]}
>
  {isCameraVisible ? (
    <BarCodeScanner
      onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      style={StyleSheet.absoluteFillObject}
      torchMode={flashlight ? "on" : "off"}
    />
  ) : showDetails ? (
    <View style={styles.detailsContainer}>
      <ScrollView
        style={styles.chapterDetailsContainer}
        contentContainerStyle={styles.chapterDetailsContent}
      >
        {chapterDetails && (
            <View style={styles.detailsContainer}>
              <ScrollView
                style={styles.chapterDetailsContainer}
                contentContainerStyle={styles.chapterDetailsContent}
              >
                <View style={styles.bookDetailsCard}>
                  <View style={styles.bookDetails}>
                    <Image
                      source={require("../../assets/booksCategory.png")}
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
                      chapter.isCurrent && !chapter.isUploaded && styles.currentChapterCard,
                    ]}
                  >
                    <View style={styles.chapterDetails}>
                      <Text style={styles.chapterOrder}>{chapter.order}</Text>
                      <View style={styles.chapterTextContainer}>
                        <Text style={styles.chapterTitle}>{chapter.title}</Text>
                      </View>
                      <View
                        style={[
                          styles.statusIndicator,
                          chapter.isUploaded
                            ? styles.uploadedIndicator
                            : chapter.isCurrent
                            ? styles.currentIndicator
                            : styles.defaultIndicator,
                        ]}
                      >
                        {chapter.isUploaded ? (
                          <Text style={styles.checkMark}>✓</Text>
                        ) : chapter.isCurrent ? (
                          <View style={styles.yellowMark} />
                        ) : null}
                      </View>
                    </View>
                  </View>
                  
                ))}
                 <TouchableOpacity
        style={styles.uploadButton}
        onPress={handleUploadAssignments}
      >
        <Text style={styles.uploadButtonText}>Upload Assignments</Text>
      </TouchableOpacity>
              </ScrollView>
            </View>
          ) }
      </ScrollView>
     
    </View>
  ) : null}
  {scanned && (
    <TouchableOpacity
      onPress={() => {
        setScanned(false);
        setIsCameraVisible(true);
        setShowDetails(false);  // Add this line
        //expandContainer();
      }}
      style={styles.rescanButton}
    >
      <Text style={styles.rescanButtonText}>Tap to Scan Again</Text>
    </TouchableOpacity>
  )}
</Animated.View>

{!scanned && (<View style={styles.bottomContainer}>
          <TouchableOpacity
            onPress={handlePickImage}
            style={styles.bottomButton}
          >
            <Image
              source={require("../../assets/gallerySelect.png")}
              style={styles.bottomIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
  onPress={() => {
    setScanned(false);
    setIsCameraVisible(true);
    setShowDetails(false);  // Add this line
  }}
  style={styles.bottomButton}
>
  <Image
    source={require("../../assets/scan.png")}
    style={styles.bottomIcon}
  />
</TouchableOpacity>

          {/* <TouchableOpacity
            onPress={() => setFlashlight(!flashlight)}
            style={styles.bottomButton}
          >
            <Image
              source={require("../../assets/flashlightIcon.png")}
              style={styles.bottomIcon}
            />
          </TouchableOpacity> */}
        </View>)}
        
      </View>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Upload Assignments</Text>
            <Text style={styles.modalSubtitle}>Choose an option</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleOpenCamera}
            >
              <Text style={styles.modalButtonText}>Open Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handlePickAssignmentFile}
            >
              <Text style={styles.modalButtonText}>Select from Files</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "white",
  },
  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    backgroundColor: "white",
    paddingHorizontal: 15,
  },
  backButton: {
    position: "absolute",
    left: 15,
  },
  backButtonText: {
    width: 50,
    height: 50,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
 
  qrCodeContainer: {
    flex:1,
    width: "95%",  // or whatever size you prefer
    height: "100%",  // or whatever size you prefer
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'visible',
  },
  rescanButton: {
    position: "absolute",
    bottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#3E4C59",
    borderRadius: 5,
  },
  rescanButtonText: {
    color: "white",
    fontSize: 16,
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 100,
    backgroundColor: "white",
  },
  bottomButton: {
    padding: 10,
  },
  bottomIcon: {
    width: 70,
    height: 70,
  },
  detailsContainer: {
    flexGrow:1,
    width:"100%",
    height:"100%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: "white",
    paddingTop: 20,
    paddingHorizontal: 5,
    
  },
  chapterDetailsContainer: {
    flexGrow: 1,
  },
  chapterDetailsContent: {
    paddingHorizontal: 2,
  },
  bookDetailsCard: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 20,
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
    width: 50, // Increase the size of the book image
    height: 50, // Increase the size of the book image
    marginRight: 10,
  },
  bookInfo: {
    flex: 1,
  },
  bookDifficulty: {
    fontSize: 18, // Increase the font size of the book difficulty text
    fontWeight: "bold",
    color: "#d81b60",
  },
  bookTitle: {
    fontSize: 12, // Decrease the font size of the book title text
    fontWeight: "bold",
    color: "#000",
  },
  chapterCard: {
    width: "100%",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 20,
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
    borderWidth: 1.2,
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
  statusIndicator: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  uploadedIndicator: {
    backgroundColor: "#63C3A8",
  },
  currentIndicator: {
    backgroundColor: "#FFD700",
  },
  defaultIndicator: {
    backgroundColor: "#ccc",
  },
  checkMark: {
    color: "#fff",
    fontSize: 16,
  },
  yellowMark: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FFD700",
  },
  uploadButton: {
    backgroundColor: "#63C3A8",
    padding: 20,
    margin: 10,
    borderRadius: 25,
    marginTop: 20,
    alignItems: "center",
  },
  uploadButtonText: {
    fontSize: 20,
    color: "#fff",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
    color: "black",
  },
  modalSubtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: "black",
  },
  modalButton: {
    width: "100%",
    padding: 15,
    backgroundColor: "#6A53A2",
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    padding: 15,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#4C2F15",
    fontSize: 16,
  },
});

export default QRCodeInputScreen;
