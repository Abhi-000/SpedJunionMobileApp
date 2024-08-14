import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image} from 'react-native';

const PrivacyPolicy = () => {
  const navigation = useNavigation();
  return (
    <ScrollView style={styles.container}>
        <View style={styles.topContainer}>
        <TouchableOpacity
          onPress={() => {navigation.goBack()}}
          style={styles.backButton}
        >
          <Image
            style={styles.backButtonText}
            source={require('../../assets/backButton.png')}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        {/* <Image
          source={require("../../assets/notificationIcon.png")}
          style={styles.topLogo}
        /> */}
      </View>
      {/* <Text style={styles.title}>Privacy Policy</Text>
       */}
      <Text style={styles.paragraph}>
        Vrudhi Educational And Technological Services Private Limited (hereinafter to be referred as "Company" or "we" or "our" or "us"), a company duly incorporated under the provisions of the Companies Act, 1956, operates various internet and mobile application based platforms, namely, https://spedathome.com , https://spedatschool.com , https://vrudhiedtech.com , etc. and all the microsites thereof and applications associated thereto (collectively the "Platforms").
      </Text>

      <Text style={styles.paragraph}>
        By accessing the Platforms, or by seeking to avail of certain Products and Services (as defined in the Terms and Conditions), or by otherwise providing or accessing any information through the Platforms, you are required to agree to our Terms and Conditions ("Terms") and acknowledge that your information will be stored, used and accessed in accordance with this Privacy Policy. For the purposes of this privacy policy, unless defined hereunder, all capitalized terms shall have the meaning ascribed to them under the Terms of the Use.
      </Text>

      <Text style={styles.paragraph}>
        This Privacy Policy ("Privacy Policy") is published in compliance with inter alia:
      </Text>

      <Text style={styles.listItem}>1. Section 43A of the Information Technology Act, 2000 ("IT Act");</Text>
      <Text style={styles.listItem}>2. Regulation 4 of the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Information) Rules, 2011 ("SPDI Rules"); and</Text>
      <Text style={styles.listItem}>3. Regulation 3(1) of the Information Technology (Intermediaries Guidelines) Rules, 2011 ("Intermediaries Guidelines").</Text>

      <Text style={styles.paragraph}>
        Our Privacy Policy explains: (a) what information we receive from you; (b) how we collect and use that information; (c) how you can provide information selectively, access and update the information; and (d) how we process, share and protect your information.
      </Text>

      <Text style={styles.paragraph}>
        This Privacy policy is applicable to all Users accessing or using our Platforms.
      </Text>

      <Text style={styles.heading}>I. GENERAL</Text>
      <Text style={styles.paragraph}>
        BY ACCESSING OR USING OUR PLATFORMS OR BY OTHERWISE GIVING US YOUR INFORMATION, YOU CONFIRM THAT YOU HAVE THE CAPACITY TO ENTER INTO A LEGALLY BINDING CONTRACT UNDER INDIAN LAW, IN PARTICULAR, THE INDIAN CONTRACT ACT, 1872, AND HAVE READ, UNDERSTOOD AND AGREED TO THE PRACTICES AND POLICIES OUTLINED IN THIS PRIVACY POLICY AND AGREE TO BE BOUND BY THE PRIVACY POLICY.
      </Text>

      <Text style={styles.heading}>II. INFORMATION COLLECTED AND MEANS OF COLLECTION</Text>
      <Text style={styles.paragraph}>
        We collect the following information about you:
      </Text>

      <Text style={styles.heading}>III. USE OF INFORMATION</Text>
      <Text style={styles.paragraph}>
        We use your information for the following purposes:
      </Text>

      <Text style={styles.heading}>IV. DISCLOSURE OF INFORMATION</Text>
      <Text style={styles.paragraph}>
        We may disclose your Personal Information and SPDI, as the case may be, to third parties in the manner and for the purposes specified below.
      </Text>

      <Text style={styles.heading}>V. THIRD-PARTY LINKS</Text>
      <Text style={styles.paragraph}>
        The Platforms may include hyperlinks to various external websites, and may also include advertisements, and hyperlinks to applications, content, or resources ("Third Party Links").
      </Text>

      <Text style={styles.heading}>VI. CHANGES TO YOUR INFORMATION</Text>
      <Text style={styles.paragraph}>
        You may review, correct, update, change or delete your Personal Information relating to Registration Information and Order Information on the Platforms by writing to us at the contact details specified below.
      </Text>

      <Text style={styles.heading}>VII. SECURITY AND RETENTION OF INFORMATION</Text>
      <Text style={styles.paragraph}>
        Security of your information
      </Text>

      <Text style={styles.heading}>VIII. Cookies and other Tracking Technologies</Text>
      <Text style={styles.paragraph}>
        We utilize "cookies" and other tracking technologies, having session or local variables.
      </Text>

      <Text style={styles.heading}>IX. CHANGES TO THE POLICY</Text>
      <Text style={styles.paragraph}>
        We reserve the right to update, change or modify this Privacy Policy at any time.
      </Text>

      <Text style={styles.heading}>X. Miscellaneous</Text>
      <Text style={styles.paragraph}>
        1. Disclaimer: We cannot ensure that all of your Personal Information and SPDI will never be disclosed in ways not otherwise described in this Privacy Policy.
      </Text>

      <Text style={styles.heading}>XI. CONTACT OUR GRIEVANCE OFFICER</Text>
      <Text style={styles.paragraph}>
        In accordance with the IT Act and the SPDI Rules, the name and contact details of the Grievance Officer are provided below:
      </Text>

      <Text style={styles.paragraph}>
        Name: [Sourav Muzumdar]
      </Text>

      <Text style={styles.paragraph}>
        Vrudhi Educational And Technological Services Private Limited,
      </Text>

      <Text style={styles.paragraph}>
        [6, Margaret House, Shaikh Mistry Dargah Road, Wadala (East), Mumbai: 400037]
      </Text>

      <Text style={styles.paragraph}>
        Email: [support@spedatschool.com]
      </Text>

      <Text style={styles.paragraph}>
        Any feedback or comments about this Privacy Policy will be welcome, and can be sent to [support@spedatschool.com]. We will employ all commercially reasonable efforts to address the same.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    
    backgroundColor: '#fff',
    //marginBottom:20,
  },
  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop:20,
    justifyContent: "center",
    
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
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    width: 50,
    height: 50,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center', // Center the text within the Text component
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: {
    justifyContent:'center',
    fontSize: 16,
    marginBottom: 20,
  },
  listItem: {
    fontSize: 16,
    marginLeft: 16,
    marginBottom: 4,
  },
});

export default PrivacyPolicy;