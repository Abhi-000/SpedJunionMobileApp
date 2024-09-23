import React, { useState, useEffect } from "react";
import { View } from "react-native";
import Home from "../components/Home";
import { getJStudents } from "../services/api";

const HomeScreen = ({ navigation, token, referenceId, roleId, setHasStudents }) => {
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await getJStudents(token);
        const studentsExist = response.juniorStudentResponse.length > 0;
        setHasStudents(studentsExist);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, [token, setHasStudents]);

  return (
    <View style={{ flex: 1 }}>
      <Home
        token={token}
        referenceId={referenceId}
        roleId={roleId}
        setHasStudents={setHasStudents}
      />
    </View>
  );
};

export default HomeScreen;
