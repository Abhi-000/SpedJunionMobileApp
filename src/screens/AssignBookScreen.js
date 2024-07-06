import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { getJStudents, assignBook } from "../services/api";
import { useNavigation, useRoute } from "@react-navigation/native";
import CustomCheckBox from "../components/CustomCheckBox";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AssignBookScreen = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const route = useRoute();
  const navigation = useNavigation();
  const { bookId, token } = route.params;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await getJStudents(token);
        setStudents(response.juniorStudentResponse);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, [token]);

  const handleSelectStudent = (studentId) => {
    setSelectedStudents((prevSelected) =>
      prevSelected.includes(studentId)
        ? prevSelected.filter((id) => id !== studentId)
        : [...prevSelected, studentId]
    );
  };

  const handleAssign = async () => {
    try {
      console.log("Assigning book with data:", {
        bookId,
        selectedStudents,
      });
      await assignBook(bookId, selectedStudents, token);
      navigation.navigate("Success", {
        title: "Successfully Assigned",
        message: "Successfully Assigned To Students",
        buttonText: "Continue",
        token: token,
      });
    } catch (error) {
      console.error("Error assigning book:", error);
    }
  };

  const filteredStudents = students.filter((student) =>
    student.firstName.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Books", { token: token })}
            style={styles.backButton}
          >
            <Image
              style={styles.backButtonText}
              source={require("../../assets/backButton.png")}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Students</Text>
        </View>
        <View style={styles.header}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
        <FlatList
          data={filteredStudents}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.listContainer}>
              <View style={styles.studentItem}>
                <View style={styles.studentInfo}>
                  <Image
                    source={require("../../assets/sampleProfile.png")} // Placeholder for the student's avatar
                    style={styles.avatar}
                  />

                  <Text
                    style={styles.studentName}
                  >{`${item.firstName} ${item.lastName}`}</Text>
                  <Text
                    style={styles.studentDetails}
                  >{`Class ${item.class} Age ${item.age} years`}</Text>
                </View>

                <CustomCheckBox
                  isChecked={selectedStudents.includes(item.id)}
                  onPress={() => handleSelectStudent(item.id)}
                />
              </View>
            </View>
          )}
        />
        <TouchableOpacity style={styles.assignButton} onPress={handleAssign}>
          <Text style={styles.buttonText}>Assign</Text>
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
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    paddingBottom: 20,
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
  },
  header: {
    backgroundColor: "#6A53A2",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  searchInput: {
    height: 45,
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
    elevation: 2,
  },
  studentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 1.41,
    elevation: 5,
  },
  studentInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  studentName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  studentDetails: {
    fontSize: 14,
    color: "#555",
  },
  assignButton: {
    backgroundColor: "#6A53A2",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AssignBookScreen;
