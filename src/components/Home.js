// src/components/Home.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  Button,
  Image,
} from "react-native";
import { getJStudents, getJuniorProfile } from "../services/api";

const Home = ({ token }) => {
  const [students, setStudents] = useState([]);
  const [profile, setProfile] = useState({});
  const [filters, setFilters] = useState({
    firstName: "",
    studentClass: "",
    division: "",
    ageRange: "",
  });
  const [isModalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchStudents();
  }, [token]);

  const fetchStudents = async () => {
    try {
      console.log("Fetching students with token:", token);
      const response = await getJStudents(token, generateConditions());
      console.log("Students response:", response.data);
      setStudents(response.data.juniorStudentResponse); // Adjust based on actual response structure
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchProfile = async (studentId) => {
    try {
      console.log("Fetching profile with token:", token);
      const response = await getJuniorProfile(studentId, token); // Replace 'studentId' with actual ID if needed
      console.log("Profile response:", response.data);
      setProfile(response.data); // Adjust based on actual response structure
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const generateConditions = () => {
    const conditions = [];

    if (searchText) {
      conditions.push({
        Field: "FirstName",
        Operation: "LIKE",
        Value: searchText,
      });
    }

    if (filters.studentClass) {
      conditions.push({
        Field: "Class",
        Operation: "=",
        Value: filters.studentClass,
      });
    }

    if (filters.division) {
      conditions.push({
        Field: "Division",
        Operation: "=",
        Value: filters.division,
      });
    }

    if (filters.ageRange) {
      const [minAge, maxAge] = filters.ageRange.split(" - ");
      conditions.push({
        Field: "Age",
        Operation: "BETWEEN",
        Value: `${minAge} AND ${maxAge}`,
      });
    }

    return conditions;
  };

  const handleFilterChange = (name, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const handleSearch = () => {
    fetchStudents();
  };

  const renderStudent = ({ item }) => (
    <View style={styles.student}>
      <Image
        source={{
          uri: `https://testing.spedathome.com:7253/api/${item.studentProfilePic}`,
        }}
        style={styles.profilePic}
      />
      <Text>{`${item.firstName} ${item.lastName}`}</Text>
      <Text>{`Class ${item.class} Age ${item.age} years`}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
        />
        <TouchableOpacity
          style={styles.filterIcon}
          onPress={() => setModalVisible(true)}
        >
          <Text>⚙️</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter Options</Text>
            <TextInput
              style={styles.filterInput}
              placeholderTextColor="#aaa"
              placeholder="Class"
              value={filters.studentClass}
              onChangeText={(text) => handleFilterChange("studentClass", text)}
            />
            <TextInput
              style={styles.filterInput}
              placeholderTextColor="#aaa"
              placeholder="Division"
              value={filters.division}
              onChangeText={(text) => handleFilterChange("division", text)}
            />
            <TextInput
              style={styles.filterInput}
              placeholderTextColor="#aaa"
              placeholder="Age Range (e.g., 3 - 10)"
              value={filters.ageRange}
              onChangeText={(text) => handleFilterChange("ageRange", text)}
            />
            <View style={styles.buttonContainer}>
              <Button title="Apply Filters" onPress={() => {
                setModalVisible(false);
                fetchStudents();
              }} />
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
      <Text style={styles.sectionTitle}>Students</Text>
      <FlatList
        data={students}
        renderItem={renderStudent}
        keyExtractor={(item) => item.id.toString()} // Adjust based on actual ID field
        style={styles.studentList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginRight: 10,
  },
  filterIcon: {
    padding: 10,
  },
  searchButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  studentList: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  student: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default Home;
