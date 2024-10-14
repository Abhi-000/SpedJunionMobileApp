import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getUserDetails } from '../services/api';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from "react-native-vector-icons/Ionicons";
import LogoutModal from '../components/LogoutModal';
import YourSvgImage from '../../assets/bell.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLoading } from '../navigation/AppWrapper';

const ProfileScreen = ({ route, token: propToken, referenceId: propReferenceId, roleId: propRoleId }) => {
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
        const userDetails = await getUserDetails(token, referenceId, roleId);
        console.log(userDetails);
        setUser(userDetails);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, [referenceId, roleId]);
  const S3_BUCKET_NAME = 'spedu-uploads';
  const S3_REGION = 'ap-south-1';
  
  const getS3ImageUrl = (key) => {
    console.log(`https://${S3_BUCKET_NAME}.s3.${S3_REGION}.amazonaws.com/${key}`);
    return `https://${S3_BUCKET_NAME}.s3.${S3_REGION}.amazonaws.com/${key}`;
  };
  const handleLogout = async () => {
    try {
      console.log("Logging out...");
      await AsyncStorage.removeItem('userCredentials');  // Ensure key is correct
      const credsAfterRemoval = await AsyncStorage.getItem('userCredentials');
      console.log('Credentials after removal:', credsAfterRemoval); // Should log 'null'
      
      setModalVisible(false);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
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
      <View >
        <LogoutModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          onLogout={handleLogout}
        />

      <View style={styles.topContainer}>
      {/* <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.menuItem}>
            <Ionicons name="log-out-outline" size={20} color="#6A53A2" />
            <Text style={styles.menuText}>Log Out</Text>
          </TouchableOpacity> */}
        
        <Text style={styles.headerTitle}>Profile</Text>
        {/* <Image
          source={require("../../assets/notificationIcon.png")}
          style={styles.topLogo}
        /> */}
         {/* <YourSvgImage
         style={styles.topLogo}
          width={30} height={30} /> */}
      </View>
      
      <View style={styles.parentContainer}>
      <ImageBackground
        style = {styles.backgroundImage}
        source={require("../../assets/Group 36.png")}
        >
        {(user && <View style={styles.profileContainer}>
          <Image
            style={styles.profileImage}
            source={user.profileUrl
              ? { uri: getS3ImageUrl(user.profileUrl) } : require("../../assets/sampleProfile.png")}
          />
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <Text style={styles.userSchool}>{user.schoolName}</Text>
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
          //  onPress={async() =>
          //   await Linking.openURL('https://spedathome.com/privacy-policy/')
          // }
          onPress={() =>
              navigation.navigate("PrivacyPolicy")
            }

          style={styles.menuItem}>
            <Ionicons name="document-text-outline" size={20} color="#6A53A2" />
            <Text style={styles.menuText}>Privacy Policy</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
          //  onPress={async() =>
          //   await Linking.openURL('https://spedathome.com/terms-of-use/')
          // }
          onPress={() =>
            navigation.navigate("TermsOfUse")
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
    //flex:
    //flexGrow:1,
    marginTop:-25,
    height:"100px",
    width:"100%",
    //height:"40%",
    resizeMode:''
  },
  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    height:"10%",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "white",
    //marginTop:10,
    //position: 'relative',
    marginBottom:30,
  },
  topLogo: {
    width: 60,
    height: 60,
    top:35,
    position: 'absolute', // Position the logo absolutely
    right: 20, // Align it to the right
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
    marginTop:-30,
    paddingTop:30,
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
  userSchool:{
    color: '#fff',
    fontSize: 14,
  },
  menu: {
    paddingBottom:"100%",
    marginTop:10,
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
