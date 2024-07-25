import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground,Linking  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getUserDetails } from '../services/api';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from "react-native-vector-icons/Ionicons";
import LogoutModal from '../components/LogoutModal';
import YourSvgImage from '../../assets/1.svg';

import { useLoading } from '../navigation/AppWrapper';
const ProfileScreen = ({ route, token: propToken, referenceId: propReferenceId, roleId: propRoleId  }) => {
  //const { token, referenceId, roleId } = route.params;
  const [user, setUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { setLoading } = useLoading();
  const token = route.params?.token || propToken;
  const referenceId = route.params?.referenceId || propReferenceId;
  const roleId = route.params?.roleId || propRoleId;

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
      <View style = {{backgroundColor: "#6A53A2",}}>
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
        {/* <Image
          source={require("../../assets/TopLogo.png")}
          style={styles.topLogo}
        /> */}
         <YourSvgImage
         style={styles.topLogo}
          width={80} height={80} />
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
          <TouchableOpacity 
           onPress={async() =>
            await Linking.openURL('https://spedathome.com/privacy-policy/')
          }
          style={styles.menuItem}>
            <Ionicons name="document-text-outline" size={20} color="#6A53A2" />
            <Text style={styles.menuText}>Privacy Policy</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
           onPress={async() =>
            await Linking.openURL('https://spedathome.com/terms-of-use/')
          }
          style={styles.menuItem}>
            <Ionicons name="clipboard-outline" size={20} color="#6A53A2" />
            <Text style={styles.menuText}>Terms of use</Text>
          </TouchableOpacity>
          <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.menuItem}>
            <Ionicons name="log-out-outline" size={20} color="#6A53A2" />
            <Text style={styles.menuText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
    justifyContent: 'center', // Center content horizontally
    paddingVertical: 10,
    paddingHorizontal: 20,
    paddingBottom: 30,
    backgroundColor: '#f7f7f7',
    position: 'relative', // Ensure the container is a positioned element for absolute children
  },
  topLogo: {
    width: 60,
    height: 60,
    position: 'absolute', // Position the logo absolutely
    right: 10, // Align it to the right
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
    textAlign: 'center', // Center the text within the Text component
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
