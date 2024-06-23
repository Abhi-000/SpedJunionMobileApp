// src/screens/AssignedBooksScreen.js
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
import { useNavigation, useRoute } from "@react-navigation/native";

const BooksScreen = ({ token: propToken }) => {
  const [books, setBooks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Intermediate");
  const navigation = useNavigation();
  const route = useRoute();

  const fetchBooks = async (currentToken) => {
    try {
      const response = await getAllBooks(currentToken);
      console.log("Fetched books data:", response.data);
      setBooks(response.data.getAllBooksResponses);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    const currentToken = propToken || route.params?.token;
    fetchBooks(currentToken);
  }, [propToken]);

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
      <View style={styles.levelBox}>
        <Text style={styles.levelText}>{item.difficulty}</Text>
      </View>
      <Image
        source={require("../../assets/bookSample.png")} // Assuming the image URL is provided in the item
        style={styles.bookImage}
      />
      <View style={styles.cardContent}>
        <Text style={styles.bookTitle}>{item.name}</Text>
        <Text style={styles.bookDetails}>
          Total Students: {item.totalStudents}
        </Text>
        <TouchableOpacity
          style={styles.studentsButton}
          onPress={() =>
            navigation.navigate("Students", {
              bookId: item.bookId,
              token: propToken || route.params?.token,
              bookDetails: item,
            })
          }
        >
          <Text style={styles.buttonText}>Students</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const categories = ["All", "Beginner", "Intermediate", "Advanced"];

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
        <Text style={styles.headerTitle}>Assigned Books</Text>
      </View>
      <View style={styles.header}>
        <FlatList
          data={categories}
          horizontal
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelectedCategory(item)}
              style={[
                styles.categoryButton,
                selectedCategory === item && styles.selectedCategoryButton,
              ]}
            >
              <Text
                style={
                  selectedCategory === item
                    ? styles.selectedCategoryText
                    : styles.categoryText
                }
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        />
      </View>
      <FlatList
        data={filterBooks()}
        renderItem={renderBook}
        keyExtractor={(item) => item.bookId.toString()}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={<View style={styles.listHeader} />}
      />
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
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
  header: {
    flexDirection: "row",
    backgroundColor: "#7B5CFA",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  categoryList: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryButton: {
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  selectedCategoryButton: {
    backgroundColor: "#fff",
  },
  categoryText: {
    color: "#fff",
    fontSize: 16,
  },
  selectedCategoryText: {
    color: "#6a1b9a",
    fontSize: 16,
    fontWeight: "bold",
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  listHeader: {
    height: 20, // Adjust the height to add appropriate space
  },
  card: {
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
    paddingTop: 40, // Add padding to create space for the level box
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
  bookImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 10,
    marginTop: 10,
  },
  cardContent: {
    flex: 1,
    justifyContent: "center",
    paddingLeft: 10,
    paddingTop: 10,
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
  studentsButton: {
    backgroundColor: "#E1E1E1",
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: "stretch",
    marginHorizontal: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: "#00FF8B",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default BooksScreen;
