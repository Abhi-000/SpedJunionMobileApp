import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { getAllBooks, assignBook, getRecommendedBooks  } from "../services/api";
import DuplicateAssignment from "../components/DuplicateAssignment";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLoading } from "../navigation/AppWrapper";
import Loader from "../components/Loader"; // Adjust the path based on your file structure

const BooksScreen = ({ token, studentId }) => {
  const [books, setBooks] = useState([]);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { loading, setLoading } = useLoading(); // Adjusted to include loading state
  //const studentId = route.params?.studentId;
  const [modalVisible, setModalVisible] = useState(false);
  console.log( studentId);
  console.log("helo",studentId );
  const handleAssignBook = async (bookId) => {
    console.log("helo",bookId,studentId);
    if (studentId) {
      try {
        setLoading(true);
        const response = await assignBook(bookId, [studentId], token || route.params?.token);
        console.log(response.data);
        setLoading(false);

        if(response.data.message == "Book assigned successfully.")
        {
        navigation.navigate("Success", {
          title: "Successfully Assigned",
          message: "Successfully Assigned To Students",
          buttonText: "Continue",
          nextScreen: "Books",
          nextScreenParams: { token: token || route.params?.token, studentId },
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
      const book = books.find(b => b.bookId === bookId);
      const alreadyAssignedStudents = book && book.studentCounts && book.studentCounts.studentIds
        ? book.studentCounts.studentIds.split(",").map(id => parseInt(id))
        : [];
      console.log(alreadyAssignedStudents);
      console.log("no student Id",route.params?.token, token);
      navigation.navigate("AssignBook", {
        bookId: bookId,
        token: token || route.params?.token,
        alreadyAssignedStudents: alreadyAssignedStudents
      });
    }
  };

  const fetchBooks = async (currentToken) => {
    try {
      console.log("fetching", studentId, currentToken);
      setLoading(true);
      const booksResponse = await getAllBooks(currentToken);
      setBooks(booksResponse.data.getAllBooksResponses);
  
      if (studentId) {
        console.log("helo inside recommneded");
        const recommendedResponse = await getRecommendedBooks(studentId, currentToken);
        console.log("recommended:",recommendedResponse.data)
        setRecommendedBooks(recommendedResponse.data);
        
      } else {
        setRecommendedBooks([]);
      }
  
      setLoading(false);
    } catch (error) {
      console.error("Error fetching books:", error);
      setLoading(false);
    }
  };
  
  


  useFocusEffect(
    React.useCallback(() => {
      const currentToken = token || route.params?.token;
      fetchBooks(currentToken);
    }, [token])
  );

  const filterBooks = () => {
    let result = [...recommendedBooks];
    const recommendedBookIds = new Set(result.map(book => book.bookId));
    let remainingBooks = books.filter(book => !recommendedBookIds.has(book.bookId));

    if (selectedCategory !== "All") {
      remainingBooks = remainingBooks.filter(
        (book) => book.difficulty === selectedCategory
      );
    }

    result = [...result, ...remainingBooks];
    return result;
  };
  
  
  const renderBook = ({ item }) => {
    const isRecommended = recommendedBooks.some(book => book.bookId === item.bookId);

    return (
      <View style={[styles.card, isRecommended && styles.recommendedCard]}>
        {isRecommended && (
          <View style={styles.recommendedBadge}>
            <Text style={styles.recommendedText}>Recommended</Text>
          </View>
        )}
        <Image
          source={require("../../assets/bookSample.png")}
          style={styles.bookImage}
        />
        <View style={styles.cardContent}>
          <Text style={styles.bookTitle}>{item.name}</Text>
          <Text style={styles.bookDetails}>
            For children from ages {item.ageGroup} years.
          </Text>
          <Text style={styles.difficultyText}>
            Difficulty: {item.difficulty.charAt(0) + item.difficulty.slice(1).toLowerCase()}
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.assignButton}
              onPress={() => handleAssignBook(item.bookId)}
            >
              <Text style={styles.buttonText}>Assign</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };
  
  const categories = ["All", "Beginner", "Intermediate", "Advanced", "Cognitive", "Improvement"];

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
      {/* <Loader loading={loading} /> */}
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
                token: token || route.params?.token,
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
    marginBottom:30
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
  recommendedCard: {
    borderColor: '#FFD700',
    borderWidth: 2,
  },
  recommendedBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    zIndex:200,
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  recommendedText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  difficultyText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
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
    marginTop:20,
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
