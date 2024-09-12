import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getUserDetails } from '../services/api';

const MyProfileScreen = () => {
  const route = useRoute();
  console.log(route.params);
  const { token, referenceId, roleId } = route.params;
  const [user, setUser] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    gender: '',
    schoolName : ''
  });
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userDetails = await getUserDetails(token, referenceId, roleId);
        setUser({
          name: userDetails.name,
          email: userDetails.email,
          phoneNumber: userDetails.mobile,
          gender: userDetails.gender,
          schoolName: userDetails.schoolName,
        });
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, [referenceId, roleId]);

  return (
    <ScrollView
      contentContainerStyle={[
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
          onPress={() => navigation.navigate('Profile', { token })}
          style={styles.backButton}
        >
          <Image
            style={styles.backButtonText}
            source={require('../../assets/backButton.png')}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        {/* <Image
          source={require("../../assets/notificationIcon.png")}
          style={styles.topLogo}
        /> */}
      </View>
      <View style={styles.profileContainer}>
        <Image
          style={styles.profileImage}
          source={require('../../assets/sampleProfile.png')}
        />
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
        <Text style={styles.userSchoolName}>{user.schoolName}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Full Name</Text>
        <Text style={styles.infoText}>{user.name}</Text>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.infoText}>{user.email}</Text>
        <Text style={styles.label}>Phone Number</Text>
        <Text style={styles.infoText}>{user.phoneNumber}</Text>
        <Text style={styles.label}>Gender</Text>
        <Text style={styles.infoText}>{user.gender}</Text>
        <Text style={styles.label}>School Name</Text>
        <Text style={styles.infoText}>{user.schoolName}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8f8f8',
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Center content horizontally
    paddingVertical: 10,
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop:30,
    backgroundColor: '#f7f7f7',
    position: 'relative', // Ensure the container is a positioned element for absolute children
  },
  backButton: {
    position: 'absolute', // Position the back button absolutely
    left: 20, // Align it to the left
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    width: 50,
    height: 50,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center', // Center the text within the Text component
  },
  topLogo: {
    width: 60,
    height: 60,
    position: 'absolute', // Position the logo absolutely
    right: 20, // Align it to the right
  },
  profileContainer: {
    alignItems: 'center',
    backgroundColor: '#6A53A2',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingVertical: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  userName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userEmail: {
    color: '#fff',
    fontSize: 16,
  },
  userSchoolName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'light',
  },
  infoContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  infoText: {
    borderWidth: 1,
    borderRadius: 15,
    padding: 20,
    fontSize: 16,
    borderColor: '#ccc',
    borderBottomWidth: 1,
    marginBottom: 15,
    paddingVertical: 17,
    color: '#333',
  },
});


export default MyProfileScreen;
