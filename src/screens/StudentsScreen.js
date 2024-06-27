// src/screens/StudentsScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from "react-native";
import { getBookSummary, getStudentDetailsByIds } from "../services/api";
import { useRoute } from "@react-navigation/native";

const StudentsScreen = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const route = useRoute();
  const { bookId, token } = route.params;

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        console.log("Fetching book summary with bookId:", bookId, "and token:", token);
        const summaryResponse = await getBookSummary(bookId, token);
        console.log("Book summary response:", summaryResponse.data);

        const studentIds = summaryResponse.data.studentBookSummaryResponses
          .map((item) => item.studentId)
          .filter((id) => id !== undefined && id !== null);
        console.log("Filtered student IDs:", studentIds);

        if (studentIds.length > 0) {
          console.log("Fetching student details for IDs:", studentIds);
          const studentDetails = await getStudentDetailsByIds(token, studentIds);
          console.log("Fetched student details:", studentDetails);
          setStudents(studentDetails);
        } else {
          console.log("No valid student IDs found.");
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
    <View style={styles.card}>
      <Text style={styles.studentName}>{item.firstName} {item.lastName}</Text>
      <Text style={styles.studentDetails}>Class: {item.class}</Text>
      <Text style={styles.studentDetails}>Age: {item.age} years</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={students}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderStudentItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  studentName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  studentDetails: {
    fontSize: 14,
    marginBottom: 5,
  },
});

export default StudentsScreen;
