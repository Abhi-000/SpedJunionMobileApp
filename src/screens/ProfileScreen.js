import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getJuniorProfile } from "../services/api";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { studentId, token } = route.params;
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchStudentProfile();
  }, [studentId]);

  const fetchStudentProfile = async () => {
    try {
      const response = await getJuniorProfile(studentId, token);
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching student profile:", error);
    }
  };

  if (!profile) {
    return <Text>Loading...</Text>;
  }

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
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>Student Profile</Text>
      </View>
      <View style={styles.profileContainer}>
        <Image
          source={require("../../assets/sampleProfile.png")} // Replace with actual profile image source
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{profile.name}</Text>
        <Text style={styles.profileDetails}>
          DOB: {profile.dob} {"\n"}
          Class: {profile.class} Age: {profile.age} years
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.uploadButton}>
          <Text style={styles.buttonText}>Upload Assignment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.assignButton}>
          <Text style={styles.buttonText}>Assign Books</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.assignmentsContainer}>
        <Text style={styles.assignmentsTitle}>
          Assigned Books & Assignments
        </Text>
        {profile.assignments.map((assignment) => (
          <View key={assignment.id} style={styles.assignmentCard}>
            <View style={styles.assignmentHeader}>
              <Text style={styles.assignmentDifficulty}>
                {assignment.difficulty}
              </Text>
              <Text style={styles.assignmentScore}>
                {assignment.score} / 20
              </Text>
            </View>
            <Text style={styles.assignmentTitle}>{assignment.title}</Text>
            <Text style={styles.assignmentDate}>
              Assign Date: {assignment.date}
            </Text>
            <TouchableOpacity style={styles.summaryButton}>
              <Text style={styles.summaryButtonText}>Summary</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
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
  profileContainer: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#6A53A2",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginVertical: 10,
  },
  profileDetails: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    padding: 20,
  },
  uploadButton: {
    backgroundColor: "#00FF8B",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  assignButton: {
    backgroundColor: "#7B5CFA",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  assignmentsContainer: {
    flex: 1,
    padding: 20,
  },
  assignmentsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  assignmentCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  assignmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  assignmentDifficulty: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFD700",
  },
  assignmentScore: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#d81b60",
  },
  assignmentTitle: {
    fontSize: 16,
    marginVertical: 5,
  },
  assignmentDate: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  summaryButton: {
    backgroundColor: "#FFD700",
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignSelf: "flex-start",
  },
  summaryButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default ProfileScreen;
