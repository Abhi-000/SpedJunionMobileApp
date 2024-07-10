// src/screens/StudentsScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { getAllBooks, getStudentDetailsByIds } from "../services/api";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";

const StudentsScreen = () => {
  const [bookData, setBookData] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadedDate, setUploadedDate] = useState(null);
  const [activeTab, setActiveTab] = useState("Students");

  const route = useRoute();
  const navigation = useNavigation();
  const { bookId, token, bookDetails } = route.params;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const booksResponse = await getAllBooks(token);
        console.log(booksResponse.data.getAllBooksResponses);
        
        const studentBookSummaryResponses =
          booksResponse.data.getAllBooksResponses;
        // Extract uploadedDate for the specific bookId
        const bookUploadInfo = studentBookSummaryResponses.find(
          (item) => item.bookId === bookId
        );
        setBookData(bookUploadInfo);
        setUploadedDate(bookUploadInfo?.uploadedDate);
        const studentIdsString = bookUploadInfo.studentCounts.studentIds;
        if(studentIdsString){
          const studentDetails = await getStudentDetailsByIds(
            token,
            studentIdsString
            
          );
          console.log(studentDetails);
          setStudents(studentDetails);
        }
        //}
      } catch (error) {
        console.log("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [bookId, token]);

  
  const renderStudentCard = (student) => {
    return (
      <TouchableOpacity
      onPress={() =>
        navigation.navigate("StudentProfile", {
          studentId: student.id,
          token: token,
        })
      }
    >
      <View key={student.id} style={styles.studentCard}>
        <Image style={styles.profileImage} source={require("../../assets/sampleProfile.png")} />
        <View style={styles.profileDetails}>
          <Text style={styles.studentName}>{student.firstName} {student.lastName}</Text>
          <Text style={styles.studentInfoText}>Class {student.class} | Age {student.age} years</Text>
        </View>
      </View>
      </TouchableOpacity>
    );
  };

  // if (loading) {
  //   return (
  //     <View style={styles.loadingContainer}>
  //       <ActivityIndicator size="large" color="#0000ff" />
  //     </View>
  //   );
  // }

  // if (error) {
  //   return (
  //     <View style={styles.errorContainer}>
  //       <Text style={styles.errorText}>{error}</Text>
  //       <TouchableOpacity onPress={fetchBookAndStudents} style={styles.retryButton}>
  //         <Text style={styles.retryButtonText}>Retry</Text>
  //       </TouchableOpacity>
  //     </View>
  //   );
  // }

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
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Image
              style={styles.backButtonText}
              source={require("../../assets/backButton.png")}
            />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Summary</Text>
      </View>
      {bookData && (
        <View style={styles.bookInfoContainer}>
          <View style = {styles.bookContainer}>
          <Image
              style={{ width: 50, height: 50 }}
              source={require("../../assets/booksCategory.png")}
            />
            <View style = {styles.bookDetails}>
          <Text style={styles.bookDifficulty}>{bookData.difficulty}</Text>
          <Text style={styles.bookName}>{bookData.name}</Text>
          </View>
          </View>
        
      
      <View style={styles.tabContainer}>
        <Text style={styles.tabTextInactive}>Chapters</Text>
        <Text style={styles.tabTextActive}>Students</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        {students.map((student) => renderStudentCard(student))}
      </ScrollView>
      </View>)}
    </View>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    paddingBottom:15,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingBottom: 10,
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
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    padding: 20,
  },
  bookInfoContainer: {
    flex: 7,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    backgroundColor: "#6A53A2",
  },
  bookContainer:
  {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    margin: 20,
  },
  bookDetails: {
    alignItems: 'flex-start',
  },
  bookDifficulty: {
    fontSize: 14,
    color: 'black',
    fontWeight: 'bold',
  },
  bookName: {
    fontSize: 10,
    color: 'black',
  },
  bookStage: {
    fontSize: 8,
    color: "white",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#6A53A2",
    paddingVertical: 10,
  },
  tabTextInactive: {
    fontSize: 16,
    color: "white",
    marginHorizontal: 20,
  },
  tabTextActive: {
    fontSize: 16,
    color: "#6A53A2",
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 20,
  },
  scrollView: {
    flex: 1,
    backgroundColor: "white",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    padding: 20,
    
  },
  studentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 5,
    elevation: 2,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  profileDetails: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  studentInfoText: {
    fontSize: 14,
    color: "#666",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
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

export default StudentsScreen;


