// src/screens/ProfileScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HalfCircleProgress  from '../components/HalfCircleProgress';

const StudentProfileScreen = () => {
    const [studentData, setStudentData] = useState();
    const [bookDetails, setBookDetails] = useState([]);
    const navigation = useNavigation();
    const route = useRoute();
    const insets = useSafeAreaInsets();
  
    // Mock API response
    useEffect(() => {
      const fetchData = async () => {
        const apiResponse = {
          "spedStudent": {
            "name": "Prashant Phadatare",
            "birthDate": "2010-07-22T00:00:00",
            "class": "Class II",
            "age": 6
          },
          "spedStudentBookDetails": [
            {
              "bookId": 3,
              "assignDate": "2024-11-10",
              "uploadedAssignmentCount": 10,
              "bookData": {
                "bookId": 3,
                "bookName": "Comprehensive learning for functional literacy & numeracy skills",
                "difficulty": "INTERMEDIATE",
                "totalChapter": 20
              }
            },
            {
              "bookId": 2,
              "assignDate": "2024-01-10",
              "uploadedAssignmentCount": 8,
              "bookData": {
                "bookId": 2,
                "bookName": "Comprehensive learning for functional literacy & numeracy skills",
                "difficulty": "INTERMEDIATE",
                "totalChapter": 20
              }
            }
          ]
        };
  
        setStudentData(apiResponse.spedStudent);
        setBookDetails(apiResponse.spedStudentBookDetails);
      };
      fetchData();
    }, []);
  

  const renderBookDetails = () => {
    return bookDetails.map((detail, index) => (
      <View key={index} style={styles.bookCard}>
        <View style={styles.bookInfo}>
          <Text style={styles.bookDifficulty}>{detail.bookData.difficulty}</Text>
          <Text style={styles.bookName}>{detail.bookData.bookName}</Text>
          <Text style={styles.bookAssignDate}>Assign Date: {new Date(detail.assignDate).toLocaleDateString()}</Text>
        </View>
        <View style={styles.progress}>
        <HalfCircleProgress
            total={detail.bookData.totalChapter}
            completed={detail.uploadedAssignmentCount}
          />
          <Text style={styles.summaryText}>Summary</Text>
        </View>
      </View>
    ));
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
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Books", { token: token })}
            style={styles.backButton}
          >
            <Image
              style={styles.backButtonText}
              source={require("../../assets/backButton.png")}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Student Profile</Text>
        </View>
      </View>
      {studentData && (<View style={styles.parentContainer}>
        <View style={styles.profileContainer}>
          <View style={styles.profileHeader}>
            <Image
              style={styles.profileImage}
              source={require('../../assets/sampleProfile.png')} // Add your placeholder image in assets
            />
            <View style={styles.profileDetails}>
              <Text style={styles.studentName}>{studentData.name}</Text>
              <Text style={styles.studentInfo}>DOB: {new Date(studentData.birthDate).toLocaleDateString()}</Text>
              <Text style={styles.studentInfo}>{studentData.class} | Age: {studentData.age} years</Text>
            </View>
          </View>
        </View>
        <View style={styles.assignedBooksContainer}>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Upload Assignment</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Assign Books</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionTitle}>Assigned Books & Assignments</Text>
          <ScrollView style={styles.bookListContainer}>
            {renderBookDetails()}
          </ScrollView>
          <View style={styles.additionalSections}>
            <TouchableOpacity style={styles.additionalSection}>
              <Text style={styles.sectionTitle}>Student behavior</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.additionalSection}>
              <Text style={styles.sectionTitle}>Academic recommendation</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: '#f8f8f8',
    },
    topContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 10,
      paddingHorizontal: 20,
      paddingBottom: 30,
      backgroundColor: "#f7f7f7",
    },
    parentContainer: {
      
      borderTopRightRadius:20,
      borderTopLeftRadius:20,
      backgroundColor: "#6A53A2",
      
    },
    headerContainer: {
      backgroundColor: '#6A53A2',
      paddingVertical: 10,
      paddingHorizontal: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButton: {
      position: "absolute",
      left: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    backButtonText: {
      width: 50,
      height: 50,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: "black",
      padding:20,
    },
    profileContainer: {
      backgroundColor: '#ffffff',
      borderRadius: 10,
      margin: 20,
      padding:5,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 1 },
      shadowRadius: 5,
      elevation: 2,
    },
    profileHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    profileImage: {
      width: 80,
      height: 80,
      borderRadius: 40,
      marginRight: 20,
    },
    profileDetails: {
      flex: 1,
    },
    studentName: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#333',
    },
    studentInfo: {
      fontSize: 14,
      color: '#666',
      marginVertical: 2,
    },
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    button: {
      backgroundColor: 'white',
      borderColor:'green',
      borderWidth:1,
      paddingVertical: 15,
      marginBottom:20,
      paddingHorizontal: 20,
      borderRadius:30,
      marginHorizontal: 5,
      alignItems: 'center',
    },
    buttonText: {
      color: 'green',
      justifyContent:"center",
      fontSize: 16,
    },
    assignedBooksContainer: {
      backgroundColor:'white',
      borderTopLeftRadius:20,
      borderTopRightRadius:20,
      padding:20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#333',
    },
    bookCard: {
      backgroundColor: '#fff',
      padding: 15,
      borderRadius: 10,
      marginBottom: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderColor: '#e0e0e0',
      borderWidth: 1,
    },
    bookInfo: {
      flex: 1,
    },
    bookDifficulty: {
      fontSize: 14,
      color: '#FF5733',
      fontWeight: 'bold',
    },
    bookName: {
      fontSize: 16,
      color: '#333',
      marginVertical: 5,
    },
    bookAssignDate: {
      fontSize: 14,
      color: '#666',
    },
    progress: {
      alignItems: 'center',
      gap:10,
      justifyContent: 'center',
    },
    progressText: {
      fontSize: 14,
      color: '#6A53A2',
    },
    summaryText: {
      fontSize: 14,
      color: '#6A53A2',
      fontWeight: 'bold',
      marginTop: 5,
    },
    additionalSections: {
      margin: 10,
    },
    additionalSection: {
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 10,
      marginBottom: 5,
      borderColor: '#e0e0e0',
      borderWidth: 1,
    },
  });

export default StudentProfileScreen;
