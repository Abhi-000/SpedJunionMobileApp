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
  ImageBackground,
} from "react-native";
import { getJStudents, getJuniorProfile } from "../services/api";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

const Home = ({ token }) => {
  const insets = useSafeAreaInsets();
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
  const navigation = useNavigation();

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
    console.log(conditions);
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
      <View style={styles.studentInfo}>
        <Text style={styles.studentName}>
          {`${item.firstName} ${item.lastName}`}
        </Text>
        <Text style={styles.studentClass}>
          Class {item.class} | Age {item.age} years
        </Text>
      </View>
    </View>
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
      <View style={styles.mainContainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Ibne Riead</Text>
          <Text style={styles.headerText}>Tec no: 04</Text>
        </View>
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
              <Text style={styles.filterIconText}>⚙️</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.searchButton}
              onPress={handleSearch}
            >
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
                  onChangeText={(text) =>
                    handleFilterChange("studentClass", text)
                  }
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
                  <Button
                    title="Apply Filters"
                    onPress={() => {
                      setModalVisible(false);
                      fetchStudents();
                    }}
                  />
                  <Button
                    title="Cancel"
                    onPress={() => setModalVisible(false)}
                  />
                </View>
              </View>
            </View>
          </Modal>
          <View style={styles.studentsContainer}>
            <Text style={{ fontWeight: "bold", fontSize: 20 }}>Categories</Text>
            <View style={styles.categories}>
              <Image
                source={require("../../assets/studentsCategory.png")} // Add your image here
                style={styles.category}
              />
              <Image
                source={require("../../assets/booksCategory.png")} // Add your image here
                style={styles.category}
              />
              <TouchableOpacity
                onPress={() => navigation.navigate("Scan", { token })}
              >
                <Image
                  source={require("../../assets/scanCategory.png")} // Add your image here
                  style={styles.category}
                />
              </TouchableOpacity>
              <Image
                source={require("../../assets/calendarCategory.png")} // Add your image here
                style={styles.category}
              />
            </View>
            <FlatList
              data={students}
              renderItem={renderStudent}
              keyExtractor={(item) => item.id.toString()}
              style={styles.flatList}
              contentContainerStyle={{ paddingBottom: 20 }}
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />} // Optional: Adds space between items
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "#7B5CFA",
    paddingTop: 10,
  },
  header: {
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    width: "100%",
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 25,
    padding: 10,
    fontSize: 16,
    marginRight: 10,
  },
  filterIcon: {
    padding: 10,
    marginRight: 10,
  },
  filterIconText: {
    fontSize: 24,
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
  categories: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 5,
  },
  category: {
    borderRadius: 100,
    width: 70,
    height: 70,
    fontWeight: "bold",
    marginRight: 20,
  },
  studentsContainer: {
    flex: 1,
    width: "100%",
    padding: 8,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: "#FFFFFF",
  },
  flatList: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  student: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 20,
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
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  studentClass: {
    fontSize: 16,
    color: "#666",
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
  filterInput: {
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
});

export default Home;
