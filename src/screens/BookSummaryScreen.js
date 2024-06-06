// src/screens/BookSummaryScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { getBookSummary } from "../services/api";
import { useNavigation, useRoute } from "@react-navigation/native";

const BookSummaryScreen = () => {
  const [summary, setSummary] = useState(null);
  const route = useRoute();
  const navigation = useNavigation();
  const { bookId, token } = route.params;

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await getBookSummary(bookId, token);
        setSummary(response.data.studentBookSummaryResponses);
      } catch (error) {
        console.error("Error fetching summary:", error);
      }
    };

    fetchSummary();
  }, [bookId, token]);

  const renderSummaryItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.detailText}>Chapter ID: {item.chapterId}</Text>
      <Text style={styles.detailText}>
        Upload Date: {new Date(item.uploadedDate).toDateString()}
      </Text>
      <Text style={styles.detailText}>Updated By: {item.updatedBy}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {summary ? (
        <>
          <View style={styles.header}>
            <Text style={styles.title}>Book Summary</Text>
            <TouchableOpacity
              style={styles.studentsButton}
              onPress={() => navigation.navigate("Students", { bookId, token })}
            >
              <Text style={styles.buttonText}>Students</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={summary}
            keyExtractor={(item) => item.chapterId.toString()}
            renderItem={renderSummaryItem}
          />
        </>
      ) : (
        <Text style={styles.loadingText}>Loading summary...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  studentsButton: {
    backgroundColor: "#00bfa5",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
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
  loadingText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
});

export default BookSummaryScreen;
