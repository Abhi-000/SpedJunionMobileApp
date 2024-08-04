import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { uploadAssignments, getQuestions, submitObservations } from "../services/api";
import DropDownPicker from "react-native-dropdown-picker";

const EndSessionScreen = ({ route }) => {
  const { token, studentId, bookDetails, chapterDetails, uploadedChapters, selectedFileName } = route.params;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [score, setScore] = useState("");
  const [dropdownValues, setDropdownValues] = useState({});
  const [questions, setQuestions] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);

  const screenHeight = Dimensions.get('window').height;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await getQuestions("observation", "10", "45", token);
        setQuestions(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchQuestions();
  }, [token]);

  const renderDropdowns = () => {
    if (questions.length === 0) {
      return <Text>Loading questions...</Text>;
    }

    return (
      <View style={styles.dropdownRow}>
        {questions.map((question, index) => {
          const options = question.options ? question.options.split(",") : [];
          const zIndexStyle = { zIndex: 5000 - index };
          const isNotes = question.question === "Notes";
          const containerStyle = isNotes ? styles.fullWidthContainer : [styles.dropdownContainer, zIndexStyle];
  
          return (
            <View key={question.question} style={containerStyle}>
              <Text style={styles.questionText}>{question.question}</Text>
              {isNotes ? (
                
                <TextInput
                  style={styles.textArea}
                  multiline={true}
                  numberOfLines={4}
                  placeholder="Enter your notes here..."
                  value={dropdownValues[question.question]?.value || ""}
                  onChangeText={(text) =>
                    setDropdownValues((prev) => ({
                      ...prev,
                      [question.question]: { value: text },
                    }))
                  }
                />
              ) : (
                <DropDownPicker
                  open={openDropdown === question.question}
                  value={dropdownValues[question.question]?.value || null}
                  items={options.map((option) => ({
                    label: option,
                    value: option,
                  }))}
                  setOpen={(open) => {
                    if (open) {
                      setOpenDropdown(question.question);
                    } else {
                      setOpenDropdown(null);
                    }
                  }}
                  setValue={(callback) =>
                    setDropdownValues((prev) => ({
                      ...prev,
                      [question.question]: {
                        ...prev[question.question],
                        value: callback(prev[question.question]?.value),
                      },
                    }))
                  }
                  placeholder="Select an option..."
                  style={styles.dropdown}
                  dropDownContainerStyle={[
                    styles.dropdownOptions,
                    { position: 'absolute', top: '100%', left: 0, right: 0 }
                  ]}
                  listMode="SCROLLVIEW"
                  scrollViewProps={{
                    nestedScrollEnabled: true,
                  }}
                  maxHeight={screenHeight * 0.3}
                />
              )}
            </View>
          );
        })}
      </View>
    );
  };
  

  const handleSubmit = async () => {
    const behaviour = dropdownValues["Behaviour"]?.value || "";
    const eyeContact = dropdownValues["Eye-Contact"]?.value || "";
    const compliance = dropdownValues["Level of Compliance"]?.value || "";
    const independence = dropdownValues["Level of Independence"]?.value || "";
    const notes = dropdownValues["Notes"]?.value || "";
    console.log(behaviour);
    try {
      const response = await submitObservations(
        behaviour,
        eyeContact,
        compliance,
        independence,
        notes,
        studentId,
        token
      );
  
      if (response.data.success) {
        navigation.navigate("Success", {
          title: "Observations Submitted",
          message: "Your observations have been submitted successfully",
          buttonText: "Continue",
          nextScreen: "Home",
        });
      } else {
        // Handle error response
        console.error("Submission failed:", response.data.message);
      }
    } catch (error) {
      console.error("Error submitting observations:", error);
    }
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image style={styles.backButtonText} source={require("../../assets/backButton.png")} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Assignments</Text>
      </View>
      <View style={styles.parentContainer}>
        <View style={styles.detailsContainer} contentContainerStyle={styles.detailsContent}>
          <View style={styles.bookDetailsCard}>
            <View style={styles.bookDetails}>
              <Image source={require("../../assets/booksCategory.png")} style={styles.bookIcon} />
              <View style={styles.bookInfo}>
                <Text style={styles.bookDifficulty}>{bookDetails.difficulty}</Text>
                <Text style={styles.bookTitle}>{bookDetails.bookName}</Text>
              </View>
            </View>
          </View>
          <View style={styles.chapterCard}>
            <View style={styles.chapterDetails}>
              <View style={styles.chapterTextContainer}>
                <Text style={styles.chapterTitle}>{selectedFileName || "No file selected"}</Text>
              </View>
            </View>
          </View>
        </View>
        <KeyboardAvoidingView
          style={styles.bottomContainer}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={90} // Adjust as needed
        >
          <TextInput
            style={styles.input}
            placeholder="Enter score here"
            value={score}
            onChangeText={setScore}
          />
          <ScrollView contentContainerStyle={styles.dropdownRow}>{renderDropdowns()}</ScrollView>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
  },
  bottomContainer: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 30,
    alignItems: "center",
    flex: 1,
  },
  parentContainer: {
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    backgroundColor: "#6A53A2",
    flex: 1,
  },
  header: {
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
  backButtonText: {
    width: 50,
    height: 50,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    padding: 20,
  },
  uploadIcon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  detailsContainer: {
    padding: 20,
  },
  detailsContent: {
    alignItems: "center",
  },
  bookDetailsCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    width: "100%",
  },
  bookDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  bookIcon: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 12,
    color: "#666",
  },
  bookDifficulty: {
    fontSize: 18,
    color: "#d81b60",
  },
  chapterCard: {
    width: "100%",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  currentChapterCard: {
    backgroundColor: "#FFFFE0",
    borderColor: "#FFD700",
    borderWidth: 1,
  },
  chapterDetails: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  chapterOrder: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#d81b60",
    marginRight: 10,
  },
  chapterTextContainer: {
    flex: 1,
  },
  chapterTitle: {
    fontSize: 18,
  },
  checkBox: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  yellowCheckBox: {
    backgroundColor: "#FFD700",
  },
  greenCheckBox: {
    backgroundColor: "#63C3A8",
  },
  grayCheckBox: {
    backgroundColor: "#fff",
  },
  checkMark: {
    color: "#fff",
  },
  input: {
    borderWidth: 1,
    width: "100%",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 15,
    marginVertical: 10,
  },
  textArea: {
    width: "100%",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth:.5,
    marginVertical: 10,
    height: 100,
    textAlignVertical: "top", // Ensure text starts from the top of the text area
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
    width: "100%",
  },
  submitButton: {
    backgroundColor: "#63C3A8",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  dropdownRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  dropdownContainer: {
    marginBottom: 10,
    width: "48%", // Adjust width to fit two dropdowns per row
    zIndex: 1,
  },
  fullWidthContainer: {
    marginBottom: 10,
    width: "100%", // Full width for the Notes section
    zIndex: 1,
  },
  questionText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 15,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    zIndex: 1,
  },
  dropdownOptions: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 15,
    backgroundColor: "gainsboro",
    zIndex: 1000,
  },
  // Adjust zIndex for dropdowns to stack correctly
  zIndexFix: {
    zIndex: 5000,
  },
});


export default EndSessionScreen;
