import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { getAllBooks, assignBook } from "../services/api";
import DuplicateAssignment from "../components/DuplicateAssignment";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLoading } from "../navigation/AppWrapper";
import Loader from "../components/Loader"; // Adjust the path based on your file structure

const BooksScreen = ({ token: propToken }) => {
  const [books, setBooks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { loading, setLoading } = useLoading(); // Adjusted to include loading state
  const studentId = route.params?.studentId;
  const [modalVisible, setModalVisible] = useState(false);

  const handleAssignBook = async (bookId) => {
    console.log(bookId,studentId);
    if (studentId) {
      try {
        setLoading(true);
        const response = await assignBook(bookId, [studentId], propToken || route.params?.token);
        console.log(response.data);
        setLoading(false);

        if(response.data.message == "Success")
        {
        navigation.navigate("Success", {
          title: "Successfully Assigned",
          message: "Successfully Assigned To Students",
          buttonText: "Continue",
          nextScreen: "Books",
          nextScreenParams: { token: propToken || route.params?.token, studentId },
      });
    }
    else{
      setModalVisible(true);
      
    }
        //navigation.goBack();
      } catch (error) {
        setLoading(false);
        console.error("Error assigning book:", error);
        Alert.alert("Error", "Failed to assign book. Please try again.");
      }
    } else {
      navigation.navigate("AssignBook", {
        bookId: bookId,
        token: propToken || route.params?.token,
        alreadyAssignedStudents: item.studentCounts.studentIds
          .split(",")
          .map((id) => parseInt(id)),
      });
    }
  };

  const fetchBooks = async (currentToken) => {
    try {
      setLoading(true);
      const response = await getAllBooks(currentToken);
      setBooks(response.data.getAllBooksResponses); // Update this line
      setLoading(false);
    } catch (error) {
      console.error("Error fetching books:", error);
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const currentToken = propToken || route.params?.token;
      fetchBooks(currentToken);
    }, [propToken])
  );

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
      <Image
        source={require("../../assets/bookSample.png")}
        style={styles.bookImage}
      />
      <View style={styles.cardContent}>
        <Text style={styles.bookTitle}>{item.name}</Text>
        <Text style={styles.bookDetails}>
          For children from ages 3 to 8 years.
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.assignButton}
            onPress={() => handleAssignBook(item.bookId)}
          >
            <Text style={styles.buttonText}>
             Assign
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );


  const categories = ["All", "Beginner", "Intermediate", "Advanced"];

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
      <DuplicateAssignment
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
      <Loader loading={loading} />
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Home")}
            style={styles.backButton}
          >
            <Image
              style={styles.backButtonImage}
              source={require("../../assets/backButton.png")}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Books</Text>
          <TouchableOpacity
            style={styles.assignedButton}
            onPress={() =>
              navigation.navigate("AssignedBooks", {
                token: propToken || route.params?.token,
              })
            }
          >
            <Text style={styles.assignedButtonText}>Assigned</Text>
          </TouchableOpacity>
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
          keyExtractor={(item) => item.bookId.toString()} // Update this line
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={<View style={styles.listHeader} />}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 20,
    paddingBottom: 30,
    backgroundColor: "#f7f7f7",
  },
  backButton: {
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
  assignedButton: {
    backgroundColor: "#00bfa5",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  assignedButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  header: {
    flexDirection: "row",
    backgroundColor: "#6A53A2",
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
  },
  bookImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  assignButton: {
    backgroundColor: "#E7F1ED",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  summaryButton: {
    backgroundColor: "#E1E1E1",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginLeft: 10,
  },
  buttonText: {
    color: "#63C3A8",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default BooksScreen;
