// src/screens/StudentsScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { getBookSummary } from "../services/api";
import { useRoute } from "@react-navigation/native";

const StudentsScreen = () => {
  const [students, setStudents] = useState([]);
  const route = useRoute();
  const { bookId, token } = route.params;

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await getBookSummary(bookId, token);
        setStudents(response.data.studentBookSummaryResponses);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, [bookId, token]);

  const renderStudentItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.detailText}>Student ID: {item.studentId}</Text>
      <Text style={styles.detailText}>Chapter ID: {item.chapterId}</Text>
      <Text style={styles.detailText}>
        Upload Date: {new Date(item.uploadedDate).toDateString()}
      </Text>
      <Text style={styles.detailText}>Updated By: {item.updatedBy}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={students}
        keyExtractor={(item) => item.studentId.toString()}
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
  },
  card: {
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  detailText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default StudentsScreen;
