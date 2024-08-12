import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getBookSummary } from "../services/api";

const SummaryScreen = () => {
  const [studentData, setStudentData] = useState(null);
  const [bookData, setBookData] = useState(null);
  const [chapters, setChapters] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const { token, studentId, bookId } = route.params;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await getBookSummary(studentId, bookId, token);
        console.log(response.data);
    
        // Unescape the JSON string
        const unescapedData = response.data.data.replace(/\\"/g, '"').replace(/\\\\n/g, '\\n');
        
        // Remove the surrounding quotes if they exist
        const cleanedData = unescapedData.replace(/^"(.*)"$/, '$1');
    
        // Parse the cleaned JSON string
        const parsedData = JSON.parse(cleanedData);
        
        const { jStudent, jBooks, filteredJChapters } = parsedData;
        
        // Sort chapters by order
        const sortedChapters = filteredJChapters.jChapters.sort(
          (a, b) => a.order - b.order
        );
    
        console.log(filteredJChapters.jChapters);
        setStudentData(jStudent);
        setBookData(jBooks);
        setChapters(sortedChapters);
      } catch (error) {
        console.error("Error fetching summary:", error);
      }
    };
    fetchSummary();
  }, [studentId, bookId]);

  const renderChapters = () => {
    return chapters.map((chapter, index) => (
      <View key={index} style={styles.chapterContainer}>
        <Text style={styles.chapterOrder}>
          {chapter.order.toString().padStart(2, "0")}
        </Text>
        <View style={styles.chapterDetails}>
          <Text style={styles.chapterTitle}>{chapter.title}</Text>
          <Text style={styles.chapterChapter}>{chapter.chapter}</Text>
          <Text style={styles.chapterDate}>
            {chapter.isUploaded
              ? new Date(chapter.uploadedDate).toLocaleDateString()
              : "Not uploaded yet"}
          </Text>
        </View>
        <View style={styles.chapterStatus}>
          {chapter.isUploaded ? (
            <FontAwesome name="check-circle" size={24} color="#4CAF50" />
          ) : (
            <FontAwesome name="circle-o" size={24} color="#ccc" />
          )}
        </View>
      </View>
    ));
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
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("StudentProfile", { studentId, token: token })
            }
            style={styles.backButton}
          >
            <Image
              style={styles.backButtonText}
              source={require("../../assets/backButton.png")}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Summary</Text>
          <Image
            source={require("../../assets/notificationIcon.png")}
            style={styles.topLogo}
          />
        </View>
      </View>
      <View style={styles.parentContainer}>
        {studentData && (
          <View style={styles.studentInfoContainer}>
            <Image
              style={styles.profileImage}
              source={require("../../assets/sampleProfile.png")} // Add your placeholder image in assets
            />
            <View style={styles.profileDetails}>
              <Text style={styles.studentName}>{studentData.name}</Text>
              <Text style={styles.studentInfo}>
                {studentData.class} | Age: {studentData.age} years
              </Text>
            </View>
          </View>
        )}
        {bookData && (
          <View style={styles.bookInfoContainer}>
            <Image
              style={{ width: 50, height: 50 }}
              source={require("../../assets/booksCategory.png")}
            />
            <View style={styles.bookDetails}>
              <Text style={styles.bookDifficulty}>{bookData.difficulty}</Text>
              <Text style={styles.bookName}>{bookData.bookName}</Text>
            </View>
          </View>
        )}
        <ScrollView style={styles.chaptersScrollView}>
          <View style={styles.chaptersContainer}>{renderChapters()}</View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8f8f8",
    flexGrow: 0.2,
  },
  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 20,
    paddingBottom: 30,
    backgroundColor: "#f7f7f7",
  },
  
  parentContainer: {
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    backgroundColor: "#6A53A2",
  },
  backButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    width: 50,
    height: 50,
  },
  topLogo: {
    width: 60,
    height: 60,
    marginLeft: 10,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    flex: 1,
    textAlign: "center",
  },
  contentContainer: {
    flexDirection: "column",
    paddingBottom: 20,
  },
  bookInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    margin: 20,
    marginTop: 5,
  },
  bookDetails: {
    alignItems: "flex-start",
    flex: 1,
  },
  bookDifficulty: {
    fontSize: 14,
    color: "black",
    fontWeight: "bold",
  },
  bookName: {
    fontSize: 10,
    color: "black",
    flexShrink: 1,
    flexWrap: "wrap",
    flexBasis: "auto",
  },
  studentInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    margin: 20,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 40,
    marginBottom: 10,
  },
  profileDetails: {
    alignItems: "",
  },
  studentName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  studentInfo: {
    fontSize: 14,
    color: "#666",
    marginVertical: 2,
  },
  chaptersScrollView: {
    flexGrow: 1,
  },
  chaptersContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    flexGrow: 1,
  },
  chapterChapter: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
  chapterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  chapterOrder: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF5733",
    marginRight: 10,
  },
  chapterDetails: {
    flex: 1,
  },
  chapterTitle: {
    fontSize: 16,
    color: "#333",
  },
  chapterDate: {
    fontSize: 12,
    color: "#666",
  },
  chapterStatus: {
    alignItems: "center",
  },
  tickIcon: {
    width: 24,
    height: 24,
  },
});

export default SummaryScreen;
