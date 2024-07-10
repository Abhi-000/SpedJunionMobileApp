import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  Image,
  ScrollView,
} from "react-native";
import { getJStudents, getStudentFilters } from "../services/api";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome, MaterialIcons } from "react-native-vector-icons";
import { RadioButton } from "react-native-paper";
import { useLoading } from "../navigation/AppWrapper";
const StudentsSearchScreen = ({ route }) => {
  const { token } = route.params;
  const { setLoading } = useLoading();

  const insets = useSafeAreaInsets();
  const [students, setStudents] = useState([]);
  const [filters, setFilters] = useState({
    studentClass: "",
    ageRange: "",
  });
  const [selectedAge, setSelectedAge] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [availableFilters, setAvailableFilters] = useState({
    ageGroups: [],
    classGroups: [],
  });
  const [isModalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [viewAll, setViewAll] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    fetchFilters();
    fetchStudents(); // Fetch initial list of students without any filters
  }, [token]);

  useEffect(() => {
    fetchStudents(generateConditions());
  }, [selectedAge, selectedClass, filters]);

  const fetchStudents = async (conditions = []) => {
    try {
      setLoading(true);
      const response = await getJStudents(token, conditions);
      handleSearch(searchText);
      setStudents(response.juniorStudentResponse);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchFilters = async () => {
    try {
      setLoading(true);
      const response = await getStudentFilters(token);
      setAvailableFilters({
        ageGroups: response.ageGroup.map((group) => group.ageGroup),
        classGroups: response.classGroup.map((group) => group.classGroup),
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching filters:", error);
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

    if (selectedClass !== "") {
      conditions.push({
        Field: "Class",
        Operation: "=",
        Value: selectedClass,
      });
    }

    if (selectedAge !== "") {
      conditions.push({
        Field: "Age",
        Operation: "BETWEEN",
        Value: selectedAge,
      });
    }

    return conditions;
  };

  const handleFilterChange = (name, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const handleSearch = (text) => {
    setSearchText(text);
    if (text.length > 0) {
      const filteredResults = students.filter((student) =>
        student.firstName.toLowerCase().startsWith(text.toLowerCase())
      );
      setSearchResults(filteredResults.slice(0, 3));
    } else {
      setSearchResults([]);
      setViewAll(false);
    }
  };

  const renderStudent = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("StudentProfile", {
          studentId: item.id,
          token: token,
        })
      }
    >
      <View style={styles.studentCard}>
        <Image
          source={require("../../assets/sampleProfile.png")}
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
    </TouchableOpacity>
  );

  const removeFilter = (filterName) => {
    handleSearch(searchText);
    if (filterName === "ageRange") {
      setSelectedAge("");
    } else {
      setSelectedClass("");
    }
    setFilters((prevFilters) => ({ ...prevFilters, [filterName]: "" }));
  };

  const applyFilters = () => {
    const conditions = generateConditions();
    fetchStudents(conditions);
    setModalVisible(false);
    setFilters({ studentClass: selectedClass, ageRange: selectedAge });
  };

  const clearAllFilters = () => {
    handleSearch(searchText);
    setSelectedAge("");
    setSelectedClass("");
    setFilters({ studentClass: "", ageRange: "" });
    fetchStudents(); // Fetch all students without any filters
  };

  return (
    <View
      style={[
        styles.container,
        {
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Image
            source={require("../../assets/backButton.png")}
            style={styles.backButtonImage}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Students</Text>
      </View>
      <View style={styles.parentContainer}>
        <View style={styles.container}>
          <View style={styles.searchBar}>
            {/* <FontAwesome name="search" size={20} color="black" style={styles.searchIcon} /> */}
            <TextInput
              style={styles.searchInput}
              placeholder="Search Students..."
              value={searchText}
              onChangeText={handleSearch}
            />
            <TouchableOpacity
              style={styles.filterIcon}
              onPress={() => setModalVisible(true)}
            >
              <FontAwesome name="filter" size={20} color="black" />
            </TouchableOpacity>
          </View>
          <View style={styles.activeFiltersContainer}>
            {filters.ageRange && (
              <View style={styles.activeFilter}>
                <Text>Age: {filters.ageRange}</Text>
                <TouchableOpacity onPress={() => removeFilter("ageRange")}>
                  <MaterialIcons name="close" size={16} color="black" />
                </TouchableOpacity>
              </View>
            )}
            {filters.studentClass && (
              <View style={styles.activeFilter}>
                <Text>Class: {filters.studentClass}</Text>
                <TouchableOpacity onPress={() => removeFilter("studentClass")}>
                  <MaterialIcons name="close" size={16} color="black" />
                </TouchableOpacity>
              </View>
            )}
            {(filters.ageRange || filters.studentClass) && (
              <TouchableOpacity
                onPress={clearAllFilters}
                style={styles.clearAllFilters}
              >
                <Text>Clear All</Text>
                <MaterialIcons name="close" size={16} color="black" />
              </TouchableOpacity>
            )}
          </View>
          {searchText.length > 0 && !viewAll && searchResults.length > 0 && (
            <View style={styles.searchResults}>
              {searchResults.map((student) => (
                <TouchableOpacity
                  key={student.id}
                  style={styles.searchResultItem}
                  onPress={() =>
                    navigation.navigate("StudentProfile", {
                      studentId: student.id,
                      token: token,
                    })
                  }
                >
                  <Text style={styles.searchResultText}>
                    {student.firstName} {student.lastName}
                  </Text>
                  <Text style={styles.searchResultDetails}>
                    Class {student.class} Age {student.age} years
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.viewAllButton}
                onPress={() => {
                  setViewAll(true);
                  setSearchResults(
                    students.filter((student) =>
                      student.firstName
                        .toLowerCase()
                        .startsWith(searchText.toLowerCase())
                    )
                  );
                }}
              >
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
          )}
          <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Filter By</Text>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={styles.closeButton}
                  >
                    <MaterialIcons name="close" size={24} color="black" />
                  </TouchableOpacity>
                </View>
                <View style={styles.filterContainer}>
                  <Text style={styles.filterLabel}>Age:</Text>
                  <ScrollView>
                    <RadioButton.Group
                      onValueChange={(value) => setSelectedAge(value)}
                      value={selectedAge}
                    >
                      <View style={styles.radioButtonWrapper}>
                        {availableFilters.ageGroups.map((ageGroup) => (
                          <View
                            key={ageGroup}
                            style={styles.radioButtonContainer}
                          >
                            <RadioButton value={ageGroup} color="#3AFF00" />
                            <Text style={styles.radioButtonLabel}>
                              {ageGroup}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </RadioButton.Group>
                  </ScrollView>
                </View>
                <View style={styles.filterContainer}>
                  <Text style={styles.filterLabel}>Class:</Text>
                  <ScrollView>
                    <RadioButton.Group
                      onValueChange={(value) => setSelectedClass(value)}
                      value={selectedClass}
                    >
                      <View style={styles.radioButtonWrapper}>
                        {availableFilters.classGroups.map((classGroup) => (
                          <View
                            key={classGroup}
                            style={styles.radioButtonContainer}
                          >
                            <RadioButton value={classGroup} color="#3AFF00" />
                            <Text style={styles.radioButtonLabel}>
                              {classGroup}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </RadioButton.Group>
                  </ScrollView>
                </View>
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.applyButton}
                    onPress={applyFilters}
                  >
                    <Text>Apply</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          <View style={styles.studentsContainer}>
            <FlatList
              data={viewAll ? searchResults : students}
              renderItem={renderStudent}
              keyExtractor={(item) => item.id.toString()}
              style={styles.flatList}
              contentContainerStyle={{ paddingBottom: 20 }}
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
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
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,

    backgroundColor: "#f7f7f7",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    padding: 20,
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
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    padding: 5,
    width: "90%",
    alignSelf: "center",
    backgroundColor: "white",
    borderRadius: 25,
    borderColor: "#E4DFDF",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  filterIcon: {
    padding: 10,
  },
  searchResults: {
    backgroundColor: "white",
    position: "absolute",
    top: 80,
    left: 20,
    right: 20,
    zIndex: 1,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchResultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  searchResultText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  searchResultDetails: {
    fontSize: 14,
    color: "#666",
  },
  viewAllButton: {
    padding: 10,
    alignItems: "center",
  },
  viewAllText: {
    color: "#007bff",
    fontWeight: "bold",
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
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 5,
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  radioButtonWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  radioButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 8,
  },
  radioButtonLabel: {
    alignSelf: "center",
  },
  selectedFilter: {
    backgroundColor: "#e0e0e0",
  },
  activeFiltersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    margin: 10,
  },
  activeFilter: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    margin: 5,
    backgroundColor: "#e0e0e0",
    borderRadius: 15,
  },
  clearAllFilters: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    margin: 5,
    backgroundColor: "#ffcccb",
    borderRadius: 15,
  },
  applyButton: {
    alignItems: "center",
    padding: 10,
    backgroundColor: "#6A53A2",
    borderRadius: 20,
  },
});

export default StudentsSearchScreen;
