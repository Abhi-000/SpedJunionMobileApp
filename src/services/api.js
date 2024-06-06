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
      Conditions: [],
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

export const getAllBooks = (token) => {
  return api.post(
    "/Book/GetAllBooks",
    {
      sortBy: "BM.Id",
      sortOrder: "DESC",
      pageSize: 25,
      pageCount: 1,
      conditions: [],
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
};

export const assignBook = (bookId, studentIds, token) => {
  console.log("Assign Book API Call:", { bookId, studentIds });
  return api.post(
    "/Book/AssignBook",
    {
      bookId: bookId,
      StudentIds: studentIds.join(","), // Ensure studentIds is a comma-separated string
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
};
