import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BarCodeScanner } from "expo-barcode-scanner";
import * as ImagePicker from "expo-image-picker";
import { getSessionWiseAssessmentDetails } from "../services/api";
const QRCodeInputScreen = ({ route }) => {
  const { token, studentId } = route.params;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [chapterDetails, setChapterDetails] = useState(null);
  const [selectedChapters, setSelectedChapters] = useState([]);
  const [uploadedChapters, setUploadedChapters] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    try {
      const response = await getSessionWiseAssessmentDetails(
        data,
        studentId,
        token
      );
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching qr:", error);
    }

    //fetchChapterDetails(data, studentId);
  };

  const fetchChapterDetails = (qrValue, studentId) => {
    console.log(
      `Fetching chapter details for QR: ${qrValue}, Student ID: ${studentId}`
    );

    const staticResponse = {
      bookDetails: {
        bookId: 1,
        bookName:
          "COMPREHENSIVE LEARNING FOR FUNCTIONAL LITERACY & NUMERACY SKILLS",
        difficulty: "Intermediate",
      },
      chapterDetails: [
        {
          isCurrent: 0,
          order: 1,
          title: "Place words",
          chapter: "Synonyms",
          chapterId: 1,
          bookId: 1,
          isUploaded: 1,
        },
        {
          isCurrent: 1,
          order: 2,
          title: "Place words",
          chapter: "Missing Number",
          chapterId: 2,
          bookId: 1,
          isUploaded: 0,
        },
        {
          isCurrent: 0,
          order: 3,
          title: "Place words",
          chapter: "Common Noun",
          chapterId: 3,
          bookId: 1,
          isUploaded: 0,
        },
        {
          isCurrent: 0,
          order: 4,
          title: "Place words",
          chapterId: 4,
          bookId: 1,
          isUploaded: 0,
        },
      ],
    };

    setChapterDetails(staticResponse);

    const currentChapters = staticResponse.chapterDetails
      .filter((chapter) => chapter.isCurrent === 1)
      .map((chapter) => chapter.chapterId);
    setSelectedChapters(currentChapters);

    const uploadedChapters = staticResponse.chapterDetails
      .filter((chapter) => chapter.isUploaded === 1)
      .map((chapter) => chapter.chapterId);
    setUploadedChapters(uploadedChapters);
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
        navigation.navigate("Upload", {
          token,
          studentId,
          bookDetails: chapterDetails.bookDetails,
          chapterDetails: chapterDetails.chapterDetails,
          selectedFiles: result.assets,
          selectedChapters,
          uploadedChapters,
        });
      }
    } catch (error) {
      console.error("Error selecting files:", error);
      Alert.alert("Error", "An error occurred while selecting files.");
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
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
        {scanned && (
          <TouchableOpacity
            onPress={() => setScanned(false)}
            style={styles.rescanButton}
          >
            <Text style={styles.rescanButtonText}>Tap to Scan Again</Text>
          </TouchableOpacity>
        )}
      </View>
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
                    {chapterDetails.bookDetails.difficulty}
                  </Text>
                  <Text style={styles.bookTitle}>
                    {chapterDetails.bookDetails.bookName}
                  </Text>
                </View>
              </View>
            </View>
            {chapterDetails.chapterDetails.map((chapter) => (
              <View key={chapter.chapterId} style={styles.chapterCard}>
                <View style={styles.chapterDetails}>
                  <Text style={styles.chapterOrder}>{chapter.order}</Text>
                  <View style={styles.chapterTextContainer}>
                    <Text style={styles.chapterTitle}>{chapter.title}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleCheckBoxPress(chapter.chapterId)}
                    style={[
                      styles.checkBox,
                      chapter.isUploaded
                        ? styles.greenCheckBox
                        : selectedChapters.includes(chapter.chapterId)
                        ? styles.yellowCheckBox
                        : styles.grayCheckBox,
                    ]}
                  >
                    {chapter.isUploaded ||
                    selectedChapters.includes(chapter.chapterId) ? (
                      <Text style={styles.checkMark}>✓</Text>
                    ) : null}
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handleUploadAssignments}
          >
            <Text style={styles.uploadButtonText}>Upload Assignments</Text>
          </TouchableOpacity>
        </View>
      )}
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
  rescanButton: {
    position: "absolute",
    bottom: 50,
    padding: 10,
    backgroundColor: "#63C3A8",
    borderRadius: 5,
  },
  rescanButtonText: {
    fontSize: 16,
    color: "#fff",
  },
  detailsContainer: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  chapterDetailsContainer: {
    marginTop: 20,
    width: "100%",
  },
  chapterDetailsContent: {
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
    borderColor: "#ccc",
  },
  greenCheckBox: {
    backgroundColor: "#63C3A8",
  },
  yellowCheckBox: {
    backgroundColor: "#FFD700",
  },
  grayCheckBox: {
    backgroundColor: "#ccc",
  },
  checkMark: {
    color: "#fff",
  },
  uploadButton: {
    backgroundColor: "#63C3A8",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 20,
    alignItems: "center",
  },
  uploadButtonText: {
    fontSize: 16,
    color: "#fff",
  },
});

export default QRCodeInputScreen;
