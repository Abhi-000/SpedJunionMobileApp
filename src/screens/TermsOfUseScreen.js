import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';

const TermsOfUse = () => {
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
        <Text style={styles.headerTitle}>Terms of Use</Text>
        {/* <Image
          source={require("../../assets/notificationIcon.png")}
          style={styles.topLogo}
        /> */}
      </View>
      {/* <Text style={styles.title}>Terms of Use</Text> */}
      
      <Text style={styles.heading}>I. Introduction</Text>
      <Text style={styles.paragraph}>
        These terms of use (the "Terms of Use"), read together with the privacy policy located at www.spedathome.com/privacypolicy ("Privacy Policy") constitute a legal and binding agreement ("Agreement") between You (hereinafter referred to as "You", or "Your" or "User(s)" and Vrudhi Educational & Technological Services Private Limited (the "Company"), having its registered office at 6, Margaret House, S M Dargah Road, Wadala East, Mumbai: 400037 and provides, inter alia, the terms that govern Your access and use of the Company's website, Services and products ("Website").
      </Text>

      <Text style={styles.heading}>II. Website Use</Text>
      <Text style={styles.paragraph}>
        The fundamental purpose of the Website is to provide an education platform to its Users for enrolling and getting acquainted with different educational courses in order to learn about different courses offered therein. The usage of the Website and the courses and other offerings are provided for just educational purposes and that such usage is not endorsed as a substitution to the curriculum based education provided by various educational institutions across India or other countries.
      </Text>

      <Text style={styles.heading}>III. Submission of information</Text>
      <Text style={styles.paragraph}>
        If You allow a third party, access to the Services through Your account, You shall ensure that the said third party is bound by and abides by the terms of this Agreement.
      </Text>

      <Text style={styles.heading}>IV. User Covenants</Text>
      <Text style={styles.paragraph}>
        You must be 18 (eighteen) years of age to use the Services or submit any information on the Website. If You are between below 18 (eighteen) years of age, You may only use the Services under the supervision of a parent or a legal guardian who agrees to be bound by these Terms.
      </Text>

      <Text style={styles.heading}>V. Third party information</Text>
      <Text style={styles.paragraph}>
        The Website may provide information regarding third party Website(s), affiliates or business partners and/or contain links to their Websites. Such information and links are provided solely for the purpose of Your reference.
      </Text>

      <Text style={styles.heading}>VI. Intellectual property rights</Text>
      <Text style={styles.paragraph}>
        All the intellectual property used on the Website by the Company, service providers or any third party as the case may be shall remain the property of the Company, service provider or any other third party (as applicable).
      </Text>

      <Text style={styles.heading}>VII. Liability</Text>
      <Text style={styles.paragraph}>
        The Company does not provide or make any representation, warranty or guarantee, express or implied about the Website or the Service.
      </Text>

      <Text style={styles.heading}>VIII. Use of SpEd@home equipment</Text>
      <Text style={styles.paragraph}>
        All equipment shared with you is the sole property of Vrudhi Educational and Technological Services Private Limited.
      </Text>

      <Text style={styles.heading}>IX. Indemnity</Text>
      <Text style={styles.paragraph}>
        You hereby agree to indemnify and hold harmless the Company, its affiliates, officers, directors, employees, consultants, licensors, agents, and representatives from any and all third party claims, losses, liability, damages, and/or costs (including reasonable attorney fees and costs) arising from
      </Text>

      <Text style={styles.heading}>X. User Submissions</Text>
      <Text style={styles.paragraph}>
        You understand that when using the Website, You may be exposed to content from a variety of sources, and that the Company is not responsible for the accuracy, usefulness, safety, or intellectual property rights of or relating to such content, and You agree and assume all liability for Your use.
      </Text>

      <Text style={styles.heading}>XI. Severability</Text>
      <Text style={styles.paragraph}>
        If any provision of this Agreement is determined to be invalid or unenforceable in whole or in part, such invalidity or unenforceability shall attach only to such provision or part of such provision and the remaining part of such provision and all other provisions of this Agreement shall continue to be in full force and effect.
      </Text>

      <Text style={styles.heading}>XII. Term and Termination</Text>
      <Text style={styles.paragraph}>
        This Agreement will remain in full force and effect while You use the Website in any form or capacity.
      </Text>

      <Text style={styles.heading}>XIII. Dispute Resolution and Governing Law</Text>
      <Text style={styles.paragraph}>
        This Agreement and any contractual obligation between the Company and You will be governed by the laws of India, subject to the exclusive jurisdiction of courts at Mumbai.
      </Text>

      <Text style={styles.heading}>XIV. Disclaimer</Text>
      <Text style={styles.paragraph}>
        The Website is provided to You on "As Is" basis. The Company hereby disclaims all representation(s) and/or warranty(ies), either express or implied, including without limitation, warranties of fitness for particular purpose, title, non-infringement.
      </Text>

      <Text style={styles.heading}>XV. Notices</Text>
      <Text style={styles.paragraph}>
        All notices and communications shall be in writing, in English and shall deemed given if delivered personally or by commercial messenger or courier service, or mailed by registered or certified mail (return receipt requested) or sent via email/ facsimile, with due acknowledgment of complete transmission to the following address: 6, Margaret House, S M Dargah Road, Wadala East, Mumbai: 400037.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    marginBottom:20,
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center', // Center the text within the Text component
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 8,
  },
});

export default TermsOfUse;