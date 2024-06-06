// src/screens/AssignBookScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { getJStudents, assignBook } from "../services/api";
import { useNavigation, useRoute } from "@react-navigation/native";
import CustomCheckBox from "../components/CustomCheckBox";

const AssignBookScreen = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const route = useRoute();
  const navigation = useNavigation();
  const { bookId, token } = route.params;

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await getJStudents(token);
        setStudents(response.data.juniorStudentResponse);
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
      await assignBook(bookId, selectedStudents, token);
      navigation.navigate("AssignSuccess");
    } catch (error) {
      console.error("Error assigning book:", error);
    }
  };

  const filteredStudents = students.filter((student) =>
    student.firstName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      <FlatList
        data={filteredStudents}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.studentItem}>
            <Text>{`${item.firstName} ${item.lastName}`}</Text>
            <Text>{`Class ${item.class} Age ${item.age} years`}</Text>
            <CustomCheckBox
              isChecked={selectedStudents.includes(item.id)}
              onPress={() => handleSelectStudent(item.id)}
            />
          </View>
        )}
      />
      <TouchableOpacity style={styles.assignButton} onPress={handleAssign}>
        <Text style={styles.buttonText}>Assign</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  searchInput: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  studentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  assignButton: {
    backgroundColor: "#00bfa5",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default AssignBookScreen;
