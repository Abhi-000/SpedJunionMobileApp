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
  ScrollView,
  StatusBar
} from "react-native";
import {
  getJStudents,
  getStudentFilters,
  getUserDetails,
  getJuniorProfile,
} from "../services/api";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FontAwesome, MaterialIcons } from "react-native-vector-icons";
import { RadioButton } from "react-native-paper";
import { useLoading } from "../navigation/AppWrapper";
import YourSvgImage from '../../assets/bell.svg';


const Home = ({ token, referenceId, roleId, setHasStudents }) => {
  console.log("reference: ", referenceId, roleId);
  const { setLoading } = useLoading();

  const insets = useSafeAreaInsets();
  const [username, setUsername] = useState("");
  const [schoolName, setSchoolName] = useState("");
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
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [isFiltering, setIsFiltering] = useState(false);
  useEffect(() => {
    // const fetchStudents = async () => {
    //   try {
    //     const response = await getJStudents(token);
    //     setStudents(response.juniorStudentResponse);
    //     setHasStudents(response.juniorStudentResponse.length > 0);
    //   } catch (error) {
    //     console.error("Error fetching students:", error);
    //   }
    // };

    fetchStudents();
  }, [token, setHasStudents]);

  useEffect(() => {
    if (students.length > 0) {
      applyFiltersAndSearch();
    }
  }, [students, searchText, filters]);
  
  const applyFiltersAndSearch = () => {
    setIsFiltering(true);
    let result = students;

    // Apply age filter
    if (filters.ageRange) {
      const [minAge, maxAge] = filters.ageRange.split('-').map(Number);
      result = result.filter(student => student.age >= minAge && student.age <= maxAge);
    }

    // Apply class filter
    if (filters.studentClass) {
      result = result.filter(student => student.class === filters.studentClass);
    }

    // Apply search
    if (searchText) {
      result = result.filter(student =>
        student.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredStudents(result);
    setIsFiltering(filters.ageRange !== '' || filters.studentClass !== '' || searchText !== '');
  };

  
  useEffect(() => {
    fetchFilters();
    fetchStudents(); // Fetch initial list of students without any filters
  }, [token]);
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const userDetails = await getUserDetails(token, referenceId, roleId);
        console.log("user:",userDetails);
        setUsername(userDetails.name.split(' ')[0]);
        setSchoolName(userDetails.schoolName);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [referenceId, roleId]);
  const renderNoResultsMessage = () => (
    <View style={styles.noStudentsContainer}>
      <Text style={styles.noStudentsText}>No students found matching the current filters.</Text>
      <Text style={styles.noStudentsText}>Try adjusting your filters or search criteria.</Text>
    </View>
  );

  const renderNoStudentsMessage = () => (
    <View style={styles.noStudentsContainer}>
      <Text style={styles.noStudentsText}>No students to show</Text>
      <Text style={styles.noStudentsText}>Contact adminstrator for more details</Text>
    </View>
  );
  const renderCategory = (image, label, onPress) => (
    <View style={[styles.categoryItem, students.length === 0 && styles.disabledCategory]}>
      <TouchableOpacity
        onPress={students.length>0? onPress : null}
        disabled={students.length == 0}
      >
        <Image
          source={image}
          style={[styles.category, students.length == 0 && styles.grayedOutImage]}
        />
      </TouchableOpacity>
      <Text style={[styles.categoryLabel, students.length == 0 && styles.grayedOutText]}>{label}</Text>
    </View>
  );


  useEffect(() => {
    const fetchAndSetStudents = async () => {
      setLoading(true);
      await fetchStudents(generateConditions());
      setLoading(false);
    };

    fetchAndSetStudents();
  }, [selectedAge, selectedClass, filters]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await getJStudents(token);
      const studentsWithProfiles = await Promise.all(
        response.juniorStudentResponse.map(async (student) => {
          const profile = await getJuniorProfile(student.id, token);
          return {
            ...student,
            spedStudentBookDetails: profile.spedStudentBookDetails || [],
          };
        })
      );
      setStudents(studentsWithProfiles);
      setFilteredStudents(studentsWithProfiles);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching students:", error);
      setLoading(false);
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
  const S3_BUCKET_NAME = 'spedu-uploads';
  const S3_REGION = 'ap-south-1';
  
  const getS3ImageUrl = (key) => {
    //console.log(`https://${S3_BUCKET_NAME}.s3.${S3_REGION}.amazonaws.com/${key}`);
    return `https://${S3_BUCKET_NAME}.s3.${S3_REGION}.amazonaws.com/${key}`;
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
          source={item.studentProfilePic
            ? { uri: getS3ImageUrl(item.studentProfilePic) }
            : require("../../assets/sampleProfile.png")}
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
        {item.spedStudentBookDetails.length > 0 && (
          <TouchableOpacity
            style={styles.scanIcon}
            onPress={() =>
              navigation.navigate("QRCodeInput", {
                token: token,
                studentId: item.id,
              })
            }
          >
            <Image
              source={require("../../assets/scanCategory.png")}
              style={styles.scanImage}
            />
          </TouchableOpacity>
        )}
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
    setSearchText('');
    setSelectedAge('');
    setSelectedClass('');
    setFilters({ studentClass: '', ageRange: '' });
    setFilteredStudents(students);
    setIsFiltering(false);
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
      <View style={styles.parentContainer}>
        <View style={styles.headersParent}>
         
         
        <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen', { token, referenceId, roleId })}>
          <View style = {styles.header}>
         
          <Image
            source={require("../../assets/sampleProfile.png")}
            style={{ width: 60, height: 60 }}
          />
            <View>
  <Text style={styles.headerText}>Hi, {username},</Text>
  
  <Text style={styles.schoolText}>{schoolName}</Text>
  </View>
  </View>
</TouchableOpacity>
         
          {/* <Image
            source={require("../../assets/notificationIcon.png")}
            style={{ width: 60, height: 60 }}
          /> */}
          {/* <YourSvgImage right={5} top={20} width={30} height={30} /> */}
        </View>
        <View style={styles.container}>
          <View style={styles.searchBar}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search Students..."
              value={searchText}
              onChangeText={handleSearch}
            />
            {students.length>0 && (<TouchableOpacity
              style={styles.filterIcon}
              onPress={() => setModalVisible(true)}>
              <FontAwesome name="filter" size={20} color="black" />
            </TouchableOpacity>)}
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
                    <Text style ={{color:'white'}}>Apply</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          <View style={styles.studentsContainer}>
          {/* {students.length>0 ? (<Text style={{ fontWeight: "bold", fontSize: 20 }}>Categories</Text>):<Text style={{ fontWeight: "bold", fontSize: 20, opacity:.6 }}>Categories</Text>} */}
        {/* <View style={styles.categories}>
          {renderCategory(require("../../assets/studentsCategory.png"), "Students", () => navigation.navigate("StudentsSearch", { token }))}
          {renderCategory(require("../../assets/booksCategory.png"), "Books", () => navigation.navigate("Books", { token }))}
          {renderCategory(require("../../assets/scanCategory.png"), "Uploads", () => navigation.navigate("Scan", { token }))}
          {/* {renderCategory(require("../../assets/calendarCategory.png"), "Sessions", () => {})} }
        </View> */}
        {/* {students.length>0 ? (<Text style={{ fontWeight: "bold", fontSize: 20 }}>Students</Text>): <Text></Text>} */}
        {students.length > 0 ? (
          <Text style={{ fontWeight: "bold", fontSize: 20 }}>Students</Text>
        ) : null}
        {students.length > 0 ? (
          isFiltering && filteredStudents.length === 0 ? (
            renderNoResultsMessage()
          ) : (
            <FlatList
              data={students}
              renderItem={renderStudent}
              keyExtractor={(item) => item.id.toString()}
              style={styles.flatList}
              contentContainerStyle={{ paddingBottom: 20 }}
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            />
          )
        ) : (
          renderNoStudentsMessage()
        )}
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
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 10,
    marginBottom:30,
  },
  parentContainer: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "white",
    paddingTop: 10,
  },
  header: {
    flexDirection: "row",
    alignSelf:'center',
    gap:10,
    justifyContent: "center", // Center username vertically
    //marginLeft: 10, // Add margin to separate from image
  },
  headersParent: {
    margin: 20,
    //gap: 90,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerText: {
    marginTop:5,
    fontSize: 18,
    fontWeight: "bold",
  },
  noStudentsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  noStudentsText: {
    fontSize: 18,
    color: '#666',
    fontStyle: 'italic',
  },
  disabledCategory: {
    opacity: 0.5,
  },
  grayedOutImage: {
    opacity: 0.5, // This makes the entire image slightly transparent
  },

  grayedOutText: {
    color: '#888',
  },

  schoolText:
  {
    
    fontSize: 14,
    fontWeight: "light",
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
  scanIcon: {
    padding: 10,
  },
  scanImage: {
    width: 30,
    height: 30,
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
  categories: {
    flexDirection: "row",
    justifyContent: "space-around", // Distribute space evenly
    padding: 20,
  },
  categoryItem: {
    alignItems: "center", // Center align items within category item
  },
  category: {
    borderRadius: 100,
    width: 70,
    height: 70,
    fontWeight: "bold",
  },
  categoryLabel: {
    marginTop: 5,
    fontWeight: "bold",
    fontSize: 14,
    color: "#333",
    textAlign: "center", // Center align text
  },
});

export default Home;
