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
  const route = useRoute();
  const navigation = useNavigation();
  const { bookId, token, bookDetails } = route.params;

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const summaryResponse = await getBookSummary(bookId, token);
        const studentIds = summaryResponse.data.studentBookSummaryResponses
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
      <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
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
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>{"<"}</Text>
      </TouchableOpacity>
      <View style={styles.header}>
        <Text style={styles.headerText}>Assign Books</Text>
      </View>
      <View style={styles.card}>
        <View style={styles.levelBox}>
          <Text style={styles.levelText}>{bookDetails.difficulty}</Text>
        </View>
        {/* <Text style={styles.bookLevel}>{bookDetails.difficulty}</Text> */}
        <Text style={styles.bookTitle}>{bookDetails.name}</Text>
        <Text style={styles.bookDetails}>
          Assign Date: {bookDetails.assignDate}
        </Text>
        <Text style={styles.bookDetails}>Students: {students.length}</Text>
      </View>

      <FlatList
        data={students}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderStudentItem}
        contentContainerStyle={styles.list}
      />
      <View style={styles.footer}>
        <TouchableOpacity>
          <Text style={styles.footerText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.footerText}>Books</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.footerText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  backButton: {
    padding: 10,
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
  // bookSummary: {
  //   backgroundColor: "#f8f8f8",
  //   padding: 15,
  //   borderRadius: 10,
  //   marginHorizontal: 20,
  //   marginBottom: 20,
  // },
  bookLevel: {
    color: "#f00",
    fontWeight: "bold",
    marginBottom: 5,
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
    position: "relative", // Add position relative to position the level box
    paddingTop: 60, // Add padding to create space for the level box
  },
  levelBox: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#d81b60", // Dark pink color
    borderRadius: 10, // Reduced rounded edges
    paddingVertical: 5,
    paddingHorizontal: 10,
    zIndex: 1, // Ensure it appears above other elements
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
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#f8f8f8",
    marginHorizontal: 20,
    marginBottom: 10,
    alignItems: "center",
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
