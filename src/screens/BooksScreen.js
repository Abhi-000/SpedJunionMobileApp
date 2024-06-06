// src/screens/BooksScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { getAllBooks } from "../services/api";
import { useNavigation } from "@react-navigation/native";

const BooksScreen = ({ token }) => {
  const [books, setBooks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigation = useNavigation();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await getAllBooks(token);
        setBooks(response.data.getAllBooksResponses);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, [token]);

  const filterBooks = () => {
    if (selectedCategory === "All") {
      return books;
    }
    return books.filter(
      (book) => book.difficulty === selectedCategory.toUpperCase()
    );
  };

  const renderBook = ({ item }) => (
    <View style={styles.card}>
      {/* <Image source={require('../../assets/GetBooks.png')} style={styles.bookImage} /> */}
      <View style={styles.cardContent}>
        <Text style={styles.bookTitle}>{item.name}</Text>
        <Text style={styles.bookDetails}>
          For children from ages 3 to 8 years.
        </Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.assignButton}
            onPress={() =>
              navigation.navigate("AssignBook", { bookId: item.bookId, token })
            }
          >
            <Text style={styles.buttonText}>Assign</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.summaryButton}>
            <Text style={styles.buttonText}>Summary</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => setSelectedCategory("All")}
          style={styles.categoryButton}
        >
          <Text
            style={
              selectedCategory === "All"
                ? styles.selectedCategoryText
                : styles.categoryText
            }
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelectedCategory("Beginner")}
          style={styles.categoryButton}
        >
          <Text
            style={
              selectedCategory === "Beginner"
                ? styles.selectedCategoryText
                : styles.categoryText
            }
          >
            Beginner
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelectedCategory("Intermediate")}
          style={styles.categoryButton}
        >
          <Text
            style={
              selectedCategory === "Intermediate"
                ? styles.selectedCategoryText
                : styles.categoryText
            }
          >
            Intermediate
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelectedCategory("Advanced")}
          style={styles.categoryButton}
        >
          <Text
            style={
              selectedCategory === "Advanced"
                ? styles.selectedCategoryText
                : styles.categoryText
            }
          >
            Advanced
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filterBooks()}
        renderItem={renderBook}
        keyExtractor={(item) => item.bookId.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  categoryButton: {
    padding: 10,
  },
  categoryText: {
    color: "#000",
    fontSize: 16,
  },
  selectedCategoryText: {
    color: "#6a1b9a",
    fontSize: 16,
    fontWeight: "bold",
  },
  card: {
    flexDirection: "row",
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    backgroundColor: "#f9f9f9",
  },
  bookImage: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  cardContent: {
    flex: 1,
    justifyContent: "center",
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  bookDetails: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  assignButton: {
    backgroundColor: "#4caf50",
    padding: 5,
    borderRadius: 3,
  },
  summaryButton: {
    backgroundColor: "#2196f3",
    padding: 5,
    borderRadius: 3,
  },
  buttonText: {
    color: "#fff",
  },
});

export default BooksScreen;
