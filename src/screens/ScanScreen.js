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
      <View style={styles.header}>
        {/* <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>{"<"}</Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Home",token)}
          style={styles.backButton}
        >
          <Image
            style={styles.backButtonImage}
            source={require("../../assets/backButton.png")}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Upload</Text>
        <TouchableOpacity style={styles.historyButton}>
          <Text style={styles.historyButtonText}>History</Text>
        </TouchableOpacity>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    fontSize: 18,
    color: "#000",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  historyButton: {
    padding: 10,
    backgroundColor: "#00FF8B",
    borderRadius: 5,
  },
  historyButtonText: {
    fontSize: 16,
    color: "#fff",
  },
  searchContainer: {
    backgroundColor: "#6A53A2",
    padding: 15,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 25,
    padding: 10,
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
    backgroundColor: "#fff",
    padding: 15,
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
