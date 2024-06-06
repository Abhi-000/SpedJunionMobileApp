// src/services/api.js
import axios from "axios";

const API_BASE_URL = "https://testing.spedathome.com:7253/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const login = (username, password) => {
  return api.post("/Users/login", { Username: username, Password: password });
};

export const getJStudents = (token) => {
  return api.post(
    "/Book/getJStudents",
    {
      SortBy: "Id",
      SortOrder: "ASC",
      PageSize: 100,
      PageCount: 1,
      Conditions: [
        {
          Field: "FirstName",
          Operation: "LIKE",
          Value: "Su",
        },
        {
          Field: "Class",
          Operation: "=",
          Value: "5",
        },
        {
          Field: "Division",
          Operation: "=",
          Value: "A",
        },
        {
          Field: "Age",
          Operation: "BETWEEN",
          Value: "3 - 10",
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
};

export const getJuniorProfile = (studentId, token) => {
  return api.get(`/Book/GetJuniorProfile/${studentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};
