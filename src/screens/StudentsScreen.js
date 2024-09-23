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
import { getAllBooks, getStudentDetailsByIds, getBookSummary } from "../services/api";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLoading } from "../navigation/AppWrapper";
import Loader from "../components/Loader"; // Adjust the path based on your file structure

const StudentsScreen = () => {
  const [bookData, setBookData] = useState(null);
  const [students, setStudents] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [activeTab, setActiveTab] = useState('students');

  const { loading, setLoading } = useLoading(); // Adjusted to include loading state

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
        const studentIds = bookUploadInfo.studentCounts.studentIds.split(',');
        console.log("Student IDs:", studentIds);
  
        // First, fetch the book summary without a specific student ID
        const bookSummaryResponse = await getBookSummary(null, bookId, token);
        console.log("Book summary response:", bookSummaryResponse.data);
        
        const parsedBookSummary = JSON.parse(bookSummaryResponse.data.data);
        setBookData(parsedBookSummary.sjBooks);
        setChapters(parsedBookSummary.sjChapterss);
  
        // Then, fetch student details one by one
        const studentDetailsPromises = studentIds.map(async (studentId) => {
          try {
            console.log("Fetching details for student ID:", studentId);
            const summaryResponse = await getBookSummary(studentId.toString(), bookId, token);
            console.log("Summary response for student:", summaryResponse.data);
            
            const parsedSummaryData = JSON.parse(summaryResponse.data.data);
            return parsedSummaryData.jStudent;
          } catch (error) {
            console.error(`Error fetching data for student ${studentId}:`, error);
            // Log the full error object
            console.error("Full error object:", JSON.stringify(error, null, 2));
            return null;
          }
        });
  
        const studentDetails = await Promise.all(studentDetailsPromises);
  
        // Filter out any null or undefined values
        const validStudentDetails = studentDetails.filter(student => student != null);
  
        console.log("Valid student details:", validStudentDetails);
        setStudents(validStudentDetails);
  
      } catch (error) {
        console.error("Error fetching data:", error);
        // Log the full error object
        console.error("Full error object:", JSON.stringify(error, null, 2));
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [bookId, token]);  

  // useEffect(() => {
  //   const fetchStudents = async () => {
  //     setLoading(true);
  //     try {
  //       const booksResponse = await getAllBooks(token);
  //       console.log(booksResponse.data.getAllBooksResponses);

  //       const studentBookSummaryResponses =
  //         booksResponse.data.getAllBooksResponses;
  //       const bookUploadInfo = studentBookSummaryResponses.find(
  //         (item) => item.bookId === bookId
  //       );
  //       setBookData(bookUploadInfo);

  //       const studentIdsString = bookUploadInfo.studentCounts.studentIds;
  //       if (studentIdsString) {
  //         const studentDetails = await getStudentDetailsByIds(
  //           token,
  //           studentIdsString
  //         );
  //         console.log(studentDetails);
  //         setStudents(studentDetails);
  //       }
  //     } catch (error) {
  //       console.log("Error fetching students:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchStudents();
  // }, [bookId, token]);

  const renderStudentCard = (student) => {
    return (
      <TouchableOpacity
        key={student.id}
        onPress={() =>
          navigation.navigate("StudentProfile", {
            studentId: student.id,
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
              {student.name}
            </Text>
            <Text style={styles.studentInfoText}>
              Class {student.class} | Age {student.age} years
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
      <View style={styles.container}>
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
          {activeTab === 'students' ? 
            students.map((student) => renderStudentCard(student)) :
            chapters.map((chapter) => renderChapterCard(chapter))
          }
        </ScrollView>
          </View>
        )}
      </View>
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
