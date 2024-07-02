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
      //const response = await getJStudents(token, generateConditions());
      const response = {
          "juniorStudentResponse": [
              {
                  "id": 2860,
                  "firstName": "Prisha",
                  "lastName": "Reddy",
                  "class": "Grade 3",
                  "division": "A",
                  "age": 14,
                  "schoolId": 153,
                  "studentProfilePic": ""
              },
              {
                  "id": 2861,
                  "firstName": "Riya",
                  "lastName": "Banerjee",
                  "class": "Grade 2",
                  "division": "A",
                  "age": 20,
                  "schoolId": 153,
                  "studentProfilePic": ""
              },
              {
                  "id": 2862,
                  "firstName": "Riya",
                  "lastName": "Reddy",
                  "class": "Grade 1",
                  "division": "A",
                  "age": 16,
                  "schoolId": 153,
                  "studentProfilePic": ""
              },
              {
                  "id": 2863,
                  "firstName": "Riya",
                  "lastName": "Saxena",
                  "class": "Grade 3",
                  "division": "A",
                  "age": 21,
                  "schoolId": 153,
                  "studentProfilePic": ""
              },
              {
                  "id": 2864,
                  "firstName": "Riya",
                  "lastName": "Sinha",
                  "class": "Grade 1",
                  "division": "A",
                  "age": 16,
                  "schoolId": 153,
                  "studentProfilePic": ""
              },
              {
                  "id": 2865,
                  "firstName": "Rudra",
                  "lastName": "Sharma",
                  "class": "Grade 4",
                  "division": "A",
                  "age": 15,
                  "schoolId": 153,
                  "studentProfilePic": ""
              },
              {
                  "id": 2866,
                  "firstName": "Sai",
                  "lastName": "Chaudhary",
                  "class": "Grade 2",
                  "division": "A",
                  "age": 21,
                  "schoolId": 153,
                  "studentProfilePic": ""
              },
              {
                  "id": 2867,
                  "firstName": "Shaurya",
                  "lastName": "Mehta",
                  "class": "Grade 2",
                  "division": "A",
                  "age": 14,
                  "schoolId": 153,
                  "studentProfilePic": ""
              },
              {
                  "id": 2868,
                  "firstName": "Shruti",
                  "lastName": "Joshi",
                  "class": "Grade 2",
                  "division": "A",
                  "age": 14,
                  "schoolId": 153,
                  "studentProfilePic": ""
              },
              {
                  "id": 2869,
                  "firstName": "Tara",
                  "lastName": "Nair",
                  "class": "Grade 5",
                  "division": "A",
                  "age": 14,
                  "schoolId": 153,
                  "studentProfilePic": ""
              },
              {
                  "id": 2870,
                  "firstName": "Tara",
                  "lastName": "Patel",
                  "class": "Grade 4",
                  "division": "A",
                  "age": 18,
                  "schoolId": 153,
                  "studentProfilePic": ""
              }
          ],
          "paginationDetails": {
              "pageSize": "100",
              "pageCount": "1",
              "totalRecords": "81"
          }
      }
      console.log("Students response:", response);
      setStudents(response.juniorStudentResponse); // Adjust based on actual response structure
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
    <TouchableOpacity 
      onPress={() =>
        navigation.navigate("StudentProfile", {
          studentId:item.id,
          token:token
        })
      }
      >
    <View style={styles.studentCard}>
      
      <Image
        // source={{
        //   uri: `https://testing.spedathome.com:7253/api/${item.studentProfilePic}`,
        // }}
        source={require("../../assets/sampleProfile.png")}
        style={styles.profilePic}
      />
      <View style={styles.studentInfo}>
        <Text style={styles.studentName}>
          {`${item.firstName} ${item.lastName}`}
        </Text>
        <Text style={styles.studentClass}>
          Class {item.id} | Age {item.age} years
        </Text>
      </View>
     
    </View>
    </TouchableOpacity>

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
      <View style={styles.parentContainer}>
        <View style={styles.headersParent}>
          <Image
            source={require("../../assets/sampleProfile.png")}
            style={{ width: 60, height: 60 }} // Add your image here
          />
          <View style={styles.header}>
            <Text style={styles.headerText}>Ibne Riead</Text>
            <Text style={styles.headerText}>Tec no: 04</Text>
          </View>
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
              <TouchableOpacity
                onPress={() => navigation.navigate("Books", { token })}
              >
                <Image
                  source={require("../../assets/booksCategory.png")} // Add your image here
                  style={styles.category}
                />
              </TouchableOpacity>
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
            <Text style={{ fontWeight: "bold", fontSize: 20 }}>Students</Text>
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
    backgroundColor: "#6A53A2",
    paddingTop: 10,
  },
  parentContainer: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "white",
    paddingTop: 10,
  },
  header: {
    flexDirection: "column",
    justifyContent: "space-between",

    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headersParent: {
    margin: 20,
    gap: 20,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
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
    padding: 20,
  },
  category: {
    borderRadius: 100,
    width: 70,
    height: 70,
    fontWeight: "bold",
    marginRight: 15,
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
  studentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 20,
    marginBottom: 10,
    borderRadius: 10, // Adjusted for cleaner look
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1, // Subtle shadow
    shadowRadius: 3.84,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  profilePic: {
    width: 50, // Adjusted size for profile picture
    height: 50,
    borderRadius: 25,
    marginRight: 15, // Adjusted spacing
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  studentClass: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
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
