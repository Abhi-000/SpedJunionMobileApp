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
import { getJStudents, getStudentFilters } from "../services/api";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

const Home = ({ token }) => {
  const insets = useSafeAreaInsets();
  const [students, setStudents] = useState([]);
  const [filters, setFilters] = useState({
    studentClass: "",
    ageRange: "",
  });
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
    fetchStudents();
    fetchFilters();
  }, [token]);

  const fetchStudents = async (conditions = []) => {
    try {
      const response = await getJStudents(token, conditions);
      setStudents(response.juniorStudentResponse);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchFilters = async () => {
    try {
      const response = await getStudentFilters(token);
      setAvailableFilters({
        ageGroups: response.ageGroup.map((group) => group.ageGroup),
        classGroups: response.classGroup.map((group) => group.classGroup),
      });
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

    if (filters.studentClass) {
      conditions.push({
        Field: "Class",
        Operation: "=",
        Value: filters.studentClass,
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
    setFilters((prevFilters) => ({ ...prevFilters, [filterName]: "" }));
    setTimeout(fetchStudents, 0, generateConditions());
  };

  const applyFilters = () => {
    setModalVisible(false);
    fetchStudents(generateConditions());
  };

  const clearAllFilters = () => {
    setFilters({ studentClass: "", ageRange: "" });
    setTimeout(() => fetchStudents([]), 0);
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
      <View style={styles.parentContainer}>
        <View style={styles.headersParent}>
          <Image
            source={require("../../assets/sampleProfile.png")}
            style={{ width: 60, height: 60 }}
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
          >
            <View style={styles.modalContainer}>
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
                <Text style={styles.filterLabel}>Age:</Text>
                {availableFilters.ageGroups.map((ageGroup) => (
                  <TouchableOpacity
                    key={ageGroup}
                    style={[
                      styles.filterOption,
                      filters.ageRange === ageGroup && styles.selectedFilter,
                    ]}
                    onPress={() => handleFilterChange("ageRange", ageGroup)}
                  >
                    <Text>{ageGroup}</Text>
                  </TouchableOpacity>
                ))}
                <Text style={styles.filterLabel}>Class:</Text>
                {availableFilters.classGroups.map((classGroup) => (
                  <TouchableOpacity
                    key={classGroup}
                    style={[
                      styles.filterOption,
                      filters.studentClass === classGroup &&
                        styles.selectedFilter,
                    ]}
                    onPress={() =>
                      handleFilterChange("studentClass", classGroup)
                    }
                  >
                    <Text>{classGroup}</Text>
                  </TouchableOpacity>
                ))}
                <Button title="Apply" onPress={applyFilters} />
              </View>
            </View>
          </Modal>
          <View style={styles.studentsContainer}>
            <Text style={{ fontWeight: "bold", fontSize: 20 }}>Categories</Text>
            <View style={styles.categories}>
              <Image
                source={require("../../assets/studentsCategory.png")}
                style={styles.category}
              />
              <TouchableOpacity
                onPress={() => navigation.navigate("Books", { token })}
              >
                <Image
                  source={require("../../assets/booksCategory.png")}
                  style={styles.category}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("Scan", { token })}
              >
                <Image
                  source={require("../../assets/scanCategory.png")}
                  style={styles.category}
                />
              </TouchableOpacity>
              <Image
                source={require("../../assets/calendarCategory.png")}
                style={styles.category}
              />
            </View>
            <Text style={{ fontWeight: "bold", fontSize: 20 }}>Students</Text>
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
    padding: 10,
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
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 5,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
  },
  filterOption: {
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
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
});

export default Home;
