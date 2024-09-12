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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HalfCircleProgress from "../components/HalfCircleProgress";
import { getJuniorProfile } from "../services/api";
import { useLoading } from "../navigation/AppWrapper";
import { parse, format } from "date-fns";

const StudentProfileScreen = () => {
  const [studentData, setStudentData] = useState(null);
  const [bookDetails, setBookDetails] = useState([]);
  const { setLoading } = useLoading();
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { studentId, token } = route.params;
  const hasAssignedBooks = bookDetails.length > 0;


  useEffect(() => {
    fetchStudents();
  }, [route.params?.studentId, route.params?.token]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await getJuniorProfile(
        route.params?.studentId,
        route.params?.token
      );
      console.log("profile screen:", response);
      setStudentData(response.spedStudent);
      // const booksSample = [{"assignDate": "09/08/2024", "bookData": {"bookId": 1, "bookName": "COMPREHENSIVE LEARNING FOR FUNCTIONAL LITERACY & NUMERACY SKILLS", "difficulty": "BEGINNER", "totalChapter": 3}, "bookId": 1, "uploadedAssignmentCount": 0}, 
      //   {"assignDate": "09/08/2024", "bookData": {"bookId": 2, "bookName": "COMPREHENSIVE LEARNING FOR FUNCTIONAL LITERACY & NUMERACY SKILLS", "difficulty": "INTERMEDIATE", "totalChapter": 2}, "bookId": 2, "uploadedAssignmentCount": 0},
      //   {"assignDate": "09/08/2024", "bookData": {"bookId": 1, "bookName": "COMPREHENSIVE LEARNING FOR FUNCTIONAL LITERACY & NUMERACY SKILLS", "difficulty": "BEGINNER", "totalChapter": 3}, "bookId": 1, "uploadedAssignmentCount": 0},
      //   {"assignDate": "09/08/2024", "bookData": {"bookId": 1, "bookName": "COMPREHENSIVE LEARNING FOR FUNCTIONAL LITERACY & NUMERACY SKILLS", "difficulty": "BEGINNER", "totalChapter": 3}, "bookId": 1, "uploadedAssignmentCount": 0},
      //   {"assignDate": "09/08/2024", "bookData": {"bookId": 1, "bookName": "COMPREHENSIVE LEARNING FOR FUNCTIONAL LITERACY & NUMERACY SKILLS", "difficulty": "BEGINNER", "totalChapter": 3}, "bookId": 1, "uploadedAssignmentCount": 0},
      //   {"assignDate": "09/08/2024", "bookData": {"bookId": 1, "bookName": "COMPREHENSIVE LEARNING FOR FUNCTIONAL LITERACY & NUMERACY SKILLS", "difficulty": "BEGINNER", "totalChapter": 3}, "bookId": 1, "uploadedAssignmentCount": 0}]
      console.log(response.spedStudentBookDetails);
      setBookDetails(response.spedStudentBookDetails);
      //setBookDetails(booksSample);
      setLoading(false);
    } catch (error) {
      setError("Error fetching student data. Please try again.");
      setLoading(false);
    }
  };

  const parseDate = (dateString) => {
    try {
      return format(parse(dateString, "dd/MM/yyyy", new Date()), "dd MMM yyyy");
    } catch (error) {
      console.error("Error parsing date:", error);
      return dateString;
    }
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      Beginner: "#6A53A2",
      Intermediate: "#FF5733",
      Advanced: "#28A745",
    };
    return colors[difficulty] || "#000";
  };

  const renderBookDetails = () => {
    return bookDetails.map((detail, index) => {
      // Skip rendering if bookData is null
      if (!detail.bookData) {
        return null;
      }
  
      return (
        <TouchableOpacity
          key={index}
          style={styles.bookCard}
          onPress={() =>
            navigation.navigate("Summary", {
              token: route.params?.token,
              studentId: route.params?.studentId,
              bookId: detail.bookId,
            })
          }
        >
          <View style={styles.bookInfo}>
            <View
              style={[
                styles.bookDifficultyContainer,
                {
                  backgroundColor: getDifficultyColor(detail.bookData.difficulty),
                },
              ]}
            >
              <Text style={styles.bookDifficulty}>
                {detail.bookData.difficulty}
              </Text>
            </View>
            <Text style={styles.bookName}>{detail.bookData.bookName}</Text>
            <Text style={styles.bookAssignDate}>
              Assign Date: {parseDate(detail.assignDate)}
            </Text>
          </View>
          <View style={styles.progress}>
            <HalfCircleProgress
              total={detail.bookData.totalChapter}
              completed={detail.uploadedAssignmentCount}
              color={getDifficultyColor(detail.bookData.difficulty)}
              thickness={20}
              showText={true}
            />
            <Text
              style={[
                styles.summaryText,
                { color: getDifficultyColor(detail.bookData.difficulty) }
              ]}
            >
              Summary
            </Text>
          </View>
        </TouchableOpacity>
      );
    }).filter(Boolean); // Remove null entries
  };
  if (error) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchStudents} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
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
              navigation.navigate("Home", { token: route.params?.token })
            }
            style={styles.backButton}
          >
            <Image
              style={styles.backButtonText}
              source={require("../../assets/backButton.png")}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Student Profile</Text>
        </View>
      </View>
      {studentData && (
        <View style={styles.parentContainer}>
          <View style={styles.profileContainer}>
            <View style={styles.profileHeader}>
              <Image
                style={styles.profileImage}
                source={require("../../assets/sampleProfile.png")}
              />
              <View style={styles.profileDetails}>
                <Text style={styles.studentName}>{studentData.name}</Text>
                <Text style={styles.studentInfo}>
                  DOB: {parseDate(studentData.birthDate)}
                </Text>
                <Text style={styles.studentInfo}>
                  {studentData.class} | Age: {studentData.age} years
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.assignedBooksContainer}>
            <ScrollView style={styles.bookListContainer}>
              <View style={styles.buttonsContainer}>
              {hasAssignedBooks && (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("QRCodeInput", {
          token: token,
          studentId: studentId,
        })
      }
      style={styles.button}
    >
      <Text style={styles.buttonText}>Upload Assignment</Text>
    </TouchableOpacity>
  )}
                <TouchableOpacity
    onPress={() => navigation.navigate("Books", { token, studentId })}
    style={[styles.button, !hasAssignedBooks && styles.fullWidthButton]}
  >
    <Text style={styles.buttonText}>Assign Books</Text>
  </TouchableOpacity>
              </View>
              { bookDetails.length>0 &&  (<Text style={styles.sectionTitle}>
                Assigned Books & Assignments
              </Text>)}
              {renderBookDetails()}
             
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#f7f7f7",
  },
  parentContainer: {
    flex: 7,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    backgroundColor: "#6A53A2",
  },
  headerContainer: {
    backgroundColor: "#6A53A2",
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
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
  fullWidthButton: {
    flex: 1,
  },
  profileContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    margin: 20,
    padding: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 5,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  profileDetails: {
    flex: 1,
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
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    backgroundColor: "white",
    borderColor: "green",
    borderWidth: 1,
    paddingVertical: 15,
    marginBottom: 20,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginHorizontal: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "green",
    justifyContent: "center",
    fontSize: 16,
  },
  assignedBooksContainer: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  bookListContainer: {
    flex: 1,
  },
  bookCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: "#e0e0e0",
    borderWidth: 1,
  },
  bookInfo: {
    flex: 1,
    marginRight: 20,
  },
  bookDifficultyContainer: {
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: "flex-start", // Aligns the background tightly around the text
    marginBottom: 5,
  },
  bookDifficulty: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  bookName: {
    fontSize: 16,
    color: "#333",
    marginVertical: 3,
  },
  bookAssignDate: {
    fontSize: 14,
    color: "#666",
  },
  progress: {
    alignItems: "center",
    gap: 10,
    justifyContent: "center",
  },
  progressText: {
    fontSize: 14,
  },
  summaryText: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 5,
  },
  additionalSections: {
    margin: 10,
  },
  additionalSection: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 5,
    borderColor: "#e0e0e0",
    borderWidth: 1,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  retryButton: {
    padding: 10,
    backgroundColor: "#6A53A2",
    borderRadius: 5,
  },
  retryButtonText: {
    color: "white",
  },
});

export default StudentProfileScreen;
