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
  const [bookDetails, setBookDetails] = useState([]);
  const [chapterDetails, setChapterDetails] = useState(null);
  const [uploadedChapters, setUploadedChapters] = useState([]);
  const [selectedChapters, setSelectedChapters] = useState([]);
  
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = async ({data }) => {
    console.log("scann", data);
    setScanned(true);
    try {
      const response = await getSessionWiseAssessmentDetails(
        data,
        studentId,
        token
      );
      setBookDetails(response.bookDetails);
      setChapterDetails(response.chapterDetails);
      const selectedChapters = response.chapterDetails
        .filter(chapter => chapter.isCurrent)
        .map(chapter => chapter.chapterId);
        setSelectedChapters(selectedChapters);

      const uploadedChapters = response.chapterDetails
        .filter(chapter => chapter.isUploaded)
        .map(chapter => chapter.chapterId);
      setUploadedChapters(uploadedChapters);

    } catch (error) {
      console.error("Error fetching qr:", error);
    }
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
          bookDetails: bookDetails,
          chapterDetails: chapterDetails,
          selectedFiles: result.assets,
          selectedChapters:selectedChapters,
          uploadedChapters:uploadedChapters
          
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
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Scan", { token: route.params?.token })}
            style={styles.backButton}
          >
            <Image
              style={styles.backButtonText}
              source={require("../../assets/backButton.png")}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Scan to Upload</Text>
        </View>
      {/* <TouchableOpacity
      onPress={handleBarCodeScanned}
      >
        <Text>Fake Scan</Text>
      </TouchableOpacity> */}
      <View style={styles.qrCodeContainer}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
        {scanned && (
          <TouchableOpacity
            onPress={() => setScanned(true)}
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
                    {bookDetails.difficulty}
                  </Text>
                  <Text style={styles.bookTitle}>
                    {bookDetails.bookName}
                  </Text>
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
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    paddingBottom: 30,
    backgroundColor: "#f7f7f7",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
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
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    padding: 20,
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

});

export default QRCodeInputScreen;
