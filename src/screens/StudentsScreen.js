// src/screens/StudentsScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { getBookSummary, getStudentDetailsByIds } from "../services/api";
import { useRoute, useNavigation } from "@react-navigation/native";

const StudentsScreen = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadedDate, setUploadedDate] = useState(null);
  const route = useRoute();
  const navigation = useNavigation();
  const { bookId, token, bookDetails } = route.params;

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const summaryResponse = await getBookSummary(bookId, token);
        const studentBookSummaryResponses =
          summaryResponse.data.studentBookSummaryResponses;

        // Extract uploadedDate for the specific bookId
        const bookUploadInfo = studentBookSummaryResponses.find(
          (item) => item.bookId === bookId
        );
        setUploadedDate(bookUploadInfo?.uploadedDate);

        const studentIds = studentBookSummaryResponses
          .map((item) => item.studentId)
          .filter((id) => id !== undefined && id !== null);
        if (studentIds.length > 0) {
          const studentDetails = await getStudentDetailsByIds(
            token,
            studentIds
          );
          setStudents(studentDetails);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [bookId, token]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (students.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No students found.</Text>
      </View>
    );
  }

  const renderStudentItem = ({ item }) => (
    <View style={styles.studentCard}>
      <Image
        source={require("../../assets/sampleProfile.png")}
        style={styles.avatar}
      />
      <View style={styles.studentInfo}>
        <Text style={styles.studentName}>
          {item.firstName} {item.lastName}
        </Text>
        <Text style={styles.studentDetails}>Class: {item.class}</Text>
        <Text style={styles.studentDetails}>Age: {item.age} years</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Image
            style={styles.backButtonImage}
            source={require("../../assets/backButton.png")}
          />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.headerText}>Assign Books</Text>
        </View>
      </View>
      <View style={styles.card}>
        <View style={styles.levelBox}>
          <Text style={styles.levelText}>{bookDetails.difficulty}</Text>
        </View>
        <Text style={styles.bookTitle}>{bookDetails.name}</Text>
        <Text style={styles.bookDetails}>
          Assign Date:{" "}
          {uploadedDate ? new Date(uploadedDate).toLocaleDateString() : "N/A"}
        </Text>
        <Text style={styles.bookDetails}>Students: {students.length}</Text>
      </View>

      <FlatList
        data={students}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderStudentItem}
        contentContainerStyle={styles.list}
      />
      {/* <View style={styles.footer}>
        <TouchableOpacity>
          <Text style={styles.footerText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.footerText}>Books</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.footerText}>Profile</Text>
        </TouchableOpacity>
      </View> */}
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
  backButton: {
    position: "absolute",
    left: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonImage: {
    width: 50,
    height: 50,
  },
  backButtonText: {
    fontSize: 18,
    color: "#000",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  card: {
    marginLeft: 20,
    marginRight: 20,
    padding: 10,
    marginBottom: 30,
    alignContent: "center",
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 5,
    position: "relative",
    paddingTop: 60,
  },
  levelBox: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#d81b60",
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    zIndex: 1,
  },
  levelText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  bookDetails: {
    fontSize: 16,
    marginBottom: 5,
  },
  studentCard: {
    flexDirection: "row",
    padding: 10,
    marginBottom: 5,
    marginHorizontal: 20,
    alignContent: "center",
    backgroundColor: "white",
    marginBottom: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 5,
    position: "relative", // Add position relative to position the level box
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  studentDetails: {
    fontSize: 14,
    color: "#666",
  },
  list: {
    paddingBottom: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  footerText: {
    fontSize: 16,
    color: "#000",
  },
});

export default StudentsScreen;
