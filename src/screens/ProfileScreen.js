import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getUserDetails } from '../services/api';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from "react-native-vector-icons/Ionicons";
import LogoutModal from '../components/LogoutModal';
import { useLoading } from '../navigation/AppWrapper';
const ProfileScreen = ({ token, referenceId, roleId }) => {
  const [user, setUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { setLoading } = useLoading();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        //setLoading(true);
        const userDetails = await getUserDetails(token, referenceId, roleId);
        console.log(userDetails);
        setUser(userDetails);
        //setLoading(false);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, [referenceId, roleId]);


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
       <LogoutModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
      <View style={styles.topContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Home', { token })}
          style={styles.backButton}
        >
          <Image
            style={styles.backButtonText}
            source={require('../../assets/backButton.png')}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      
      <View style={styles.parentContainer}>
      <ImageBackground
        style = {styles.backgroundImage}
        source={require("../../assets/wavyPattern.png")}
        >
        {(user && <View style={styles.profileContainer}>
          <Image
            style={styles.profileImage}
            source={require('../../assets/sampleProfile.png')}
          />
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>)}
        </ImageBackground>
        <View style={styles.menu}>
          <TouchableOpacity 
          onPress={() =>
            navigation.navigate("MyProfile", {
              token: token,
              referenceId:referenceId,
              roleId:roleId
            })
          }
          style={styles.menuItem}>
            <Ionicons name="person-outline" size={20} color="#6A53A2" />
            <Text style={styles.menuText}>My Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity 
          onPress={() =>
            navigation.navigate("ForgotPassword", {
              token: token,
            })
          }
          style={styles.menuItem}>
            <Ionicons name="lock-closed-outline" size={20} color="#6A53A2" />
            <Text style={styles.menuText}>Change Password</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="document-text-outline" size={20} color="#6A53A2" />
            <Text style={styles.menuText}>Privacy Policy</Text>
          </TouchableOpacity> */}
          <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.menuItem}>
            <Ionicons name="log-out-outline" size={20} color="#6A53A2" />
            <Text style={styles.menuText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  backgroundImage:
  {
    flexGrow:1,
    width:"100%",
    resizeMode:'cover'
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    paddingBottom: 30,
    backgroundColor: '#f7f7f7',
  },
  backButton: {
    position: 'absolute',
    left: 20,
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
  },
  parentContainer: {
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    backgroundColor: '#6A53A2',
    alignItems: 'center',
  },
  profileContainer: {
    paddingTop:20,
    alignItems: 'center',
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
  menu: {
    marginTop:20,
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuText: {
    fontSize: 16,
    marginLeft: 10,
  },
});

export default ProfileScreen;
