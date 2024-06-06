// src/components/Home.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { getJStudents, getJuniorProfile } from "../services/api";

const Home = ({ token }) => {
  const [students, setStudents] = useState([]);
  const [profile, setProfile] = useState({});

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        console.log("Fetching students with token:", token);
        const response = await getJStudents(token);
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

    fetchStudents();
    // Fetch profile for the first student as an example
    if (students.length > 0) {
      fetchProfile(students[0].id);
    }
  }, [token]);

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
      <View style={styles.header}>
        {/* <Image style={styles.profilePic} source={require('../../assets/home.png')} /> */}
        <View style={styles.headerText}>
          <Text style={styles.name}>{profile.name || "Ibne Riead"}</Text>
          <Text style={styles.techNo}>{profile.techNo || "Tec no: 04"}</Text>
        </View>
        <TouchableOpacity style={styles.bellIcon}>
          <Text>🔔</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Students..."
        />
      </View>
      <Text style={styles.sectionTitle}>Categories</Text>
      <View style={styles.categories}>
        <TouchableOpacity style={styles.category}>
          <Text>Students</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.category}>
          <Text>Books</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.category}>
          <Text>Uploads</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.category}>
          <Text>Sessions</Text>
        </TouchableOpacity>
      </View>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  techNo: {
    fontSize: 14,
    color: "#666",
  },
  bellIcon: {
    padding: 10,
  },
  searchBar: {
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  categories: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  category: {
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#e0e0e0",
  },
  studentList: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  student: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    alignItems: "center",
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
});

export default Home;
