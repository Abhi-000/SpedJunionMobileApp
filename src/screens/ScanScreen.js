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
import { getJStudents } from "../services/api";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ScanScreen = ({ token }) => {
  const insets = useSafeAreaInsets();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchText, setSearchText] = useState("");
  const route = useRoute();
  const navigation = useNavigation();
  const { token: routeToken } = route.params;
  const currentToken = token || routeToken;

  useEffect(() => {
    fetchStudents();
  }, [currentToken]);

  const fetchStudents = async () => {
    try {
      console.log("Fetching students with token:", currentToken);
      const response = await getJStudents(currentToken, []);
      console.log("Students response:", response);
      setStudents(response.juniorStudentResponse); // Adjust based on actual response structure
      setFilteredStudents(response.juniorStudentResponse);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
    if (text) {
      const filtered = students.filter(
        (student) =>
          student.firstName.toLowerCase().includes(text.toLowerCase()) ||
          student.lastName.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students);
    }
  };

  const renderStudent = ({ item }) => (
    <View style={styles.studentCard}>
      <Image
        source={
          require("../../assets/sampleProfile.png")
          //uri: `https://testing.spedathome.com:7253/api/${item.studentProfilePic}`,
        }
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
      <TouchableOpacity
        style={styles.scanIcon}
        onPress={() =>
          navigation.navigate("QRCodeInput", {
            token: currentToken,
            studentId: item.id, // Pass studentId to the next screen
          })
        }
      >
        <Image
          source={require("../../assets/scanCategory.png")} // Add your scan icon here
          style={styles.scanImage}
        />
      </TouchableOpacity>
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
      <View style={styles.topContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Image
            style={styles.backButtonText}
            source={require("../../assets/backButton.png")}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upload Assignment</Text>
        <Image
          source={require("../../assets/TopLogo.png")}
          style={styles.topLogo}
        />
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Students...."
          value={searchText}
          onChangeText={handleSearch}
        />
      </View>
      <FlatList
        data={filteredStudents}
        renderItem={renderStudent}
        keyExtractor={(item) => item.id.toString()}
        style={styles.flatList}
        contentContainerStyle={{ paddingBottom: 20 }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10, // Add vertical padding
    paddingHorizontal: 15,
    backgroundColor: "white",
    position: 'relative', // Add this to the top container
  },
  backButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    width: 50,
    height: 50,
  },
  topLogo: {
    width: 60,
    height: 60,
    marginLeft: 10,
    marginBottom: 10, // Add margin bottom to avoid collision
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10, // Add horizontal margin for better spacing
    
    left: 0,
    right: 0,
    textAlign: 'center', // Center the text
   
  },
  searchContainer: {
    backgroundColor: "#6A53A2",
    padding: 15,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 25,
    padding: 15,
    fontSize: 16,
    marginBottom: 10,
  },
  flatList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  studentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginBottom: 10,
    borderRadius: 20,
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
  scanIcon: {
    padding: 10,
  },
  scanImage: {
    width: 30,
    height: 30,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  footerText: {
    fontSize: 16,
    color: "#000",
  },
  backButtonImage: {
    width: 50,
    height: 50,
  },
});

export default ScanScreen;

