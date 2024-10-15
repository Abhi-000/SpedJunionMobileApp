import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { getAllBooks, getStudentListByStudentIds, getBookSummary } from "../services/api";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLoading } from "../navigation/AppWrapper";
import Loader from "../components/Loader";

const StudentsScreen = () => {
  const [bookData, setBookData] = useState(null);
  const [students, setStudents] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [activeTab, setActiveTab] = useState('students');

  const { loading, setLoading } = useLoading();

  const route = useRoute();
  const navigation = useNavigation();
  const { bookId, token } = route.params;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all books to get student IDs
        const booksResponse = await getAllBooks(token);
        console.log("Books response:", booksResponse.data);
        
        const bookUploadInfo = booksResponse.data.getAllBooksResponses.find(
          (item) => item.bookId === bookId
        );
  
        if (!bookUploadInfo || !bookUploadInfo.studentCounts.studentIds) {
          console.log("No students found for this book");
          setStudents([]);
          setBookData(bookUploadInfo);
          setLoading(false);
          return;
        }
  
        console.log("Book upload info:", bookUploadInfo);
        const studentIds = bookUploadInfo.studentCounts.studentIds;
        console.log("Student IDs:", studentIds);
  
        // Fetch the book summary without a specific student ID
        const bookSummaryResponse = await getBookSummary(null, bookId, token);
        console.log("Book summary response:", bookSummaryResponse.data);
        
        const parsedBookSummary = JSON.parse(bookSummaryResponse.data.data);
        setBookData(parsedBookSummary.sjBooks);
        setChapters(parsedBookSummary.sjChapterss);
  
        // Fetch student details using the new API
        const studentsResponse = await getStudentListByStudentIds(token, studentIds);
        console.log("Students response:", studentsResponse);
        
        if (studentsResponse.success) {
          const parsedStudentsData = JSON.parse(studentsResponse.data);
          setStudents(parsedStudentsData);
          console.log('parsedStudentsData: ',parsedStudentsData)
        } else {
          console.error("Error fetching student data:", studentsResponse.message);
        }
  
      } catch (error) {
        console.error("Error fetching data:", error);
        console.error("Full error object:", JSON.stringify(error, null, 2));
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [bookId, token]);  

  const renderStudentCard = (student) => {
    return (
      <TouchableOpacity
        key={`${student.FirstName}-${student.LastName}`}
        onPress={() =>
          navigation.navigate("StudentProfile", {
            studentId: student.Id, // You might need to adjust this if the API doesn't provide an id
            token: token,
          })
        }
      >
        <View style={styles.studentCard}>
          <Image
            style={styles.profileImage}
            source={require("../../assets/sampleProfile.png")}
          />
          <View style={styles.profileDetails}>
            <Text style={styles.studentName}>
              {`${student.FirstName} ${student.LastName}`}
            </Text>
            <Text style={styles.studentInfoText}>
              Class {student.Class} | Grade {student.Grade}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderChapterCard = (chapter) => {
    return (
      <View key={chapter.chapterId} style={styles.chapterContainer}>
        <Text style={styles.chapterOrder}>
          {chapter.order.toString().padStart(2, "0")}
        </Text>
        <View style={styles.chapterDetails}>
          <Text style={styles.chapterTitle}>{chapter.title}</Text>
          <Text style={styles.chapterChapter}>{chapter.chapter}</Text>
         
        </View>
        <View style={styles.chapterCountContainer}>
        <Text style={styles.chapterCount}>{chapter.studentCount || '0 / 0'}</Text>
      </View>
        {/* <View style={styles.chapterStatus}>
          {chapter.isUploaded ? (
            <FontAwesome name="check-circle" size={24} color="#4CAF50" />
          ) : (
            <FontAwesome name="circle-o" size={24} color="#ccc" />
          )}
        </View> */}
      </View>
    );
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
      <Loader loading={loading} />
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Image
            style={styles.backButtonText}
            source={require("../../assets/backButton.png")}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Summary</Text>
      </View>
      {bookData && (
        <View style={styles.bookInfoContainer}>
          <View style={styles.bookContainer}>
            <Image
              style={{ width: 50, height: 50 }}
              source={require("../../assets/booksCategory.png")}
            />
            <View style={styles.bookDetails}>
              <Text style={styles.bookDifficulty}>{bookData.difficulty}</Text>
              <Text style={styles.bookName}>{bookData.bookName}</Text>
            </View>
          </View>
          <View style={styles.tabContainer}>
            <TouchableOpacity onPress={() => setActiveTab('students')}>
              <Text style={activeTab === 'students' ? styles.tabTextActive : styles.tabTextInactive}>
                Students
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveTab('chapters')}>
              <Text style={activeTab === 'chapters' ? styles.tabTextActive : styles.tabTextInactive}>
                Chapters
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.scrollView}>
            {activeTab === 'students' ? (
              <View style={styles.studentsContainer}>
                {students.map((student) => renderStudentCard(student))}
                
              </View>
            ) : (
              <View style={styles.chaptersContainer}>
                {chapters.map((chapter) => renderChapterCard(chapter))}
              </View>
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    paddingBottom: 15,
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
  bookContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    margin: 20,
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
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#6A53A2",
    paddingVertical: 10,
  },
  tabTextInactive: {
    fontSize: 16,
    color: "white",
    paddingHorizontal: 20,
    paddingVertical: 5,
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
  },
  studentsContainer: {
    padding: 20,
  },
  chaptersContainer: {
    padding: 20,
  },


  studentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginBottom: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#E0E0E0",
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
  chapterCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginBottom: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  chaptersContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    flexGrow: 1,
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
  chapterChapter: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
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
  chapterCountContainer: {
    backgroundColor: "#6A53A2",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  chapterCount: {
    fontSize: 14,
    color: "white",
  },

});


export default StudentsScreen;
