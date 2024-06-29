import axios from "axios";

const API_BASE_URL = "https://testing.spedathome.com:7233/api";
const API_BASE_URL_1 = "https://testing.spedathome.com:7253/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

const api1 = axios.create({
  baseURL: API_BASE_URL_1,
});

export const login = (username, password) => {
  return api.post("/Users/login", { Username: username, Password: password });
};

export const getJStudents = (token, conditions = []) => {
  return api.post(
    "/Book/getJStudents",
    {
      SortBy: "Id",
      SortOrder: "ASC",
      PageSize: 100,
      PageCount: 1,
      Conditions: conditions,
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

export const getAllBooks = async (token) => {
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  api.interceptors.request.use((request) => {
    console.log("Starting Request", JSON.stringify(request, null, 2));
    return request;
  });

  try {
    const response = await api.get("/Book/SpedJuniorTestAPI", { headers });
    console.log("Books response:", response.data);
    return response;
  } catch (error) {
    console.error("Error fetching books:", error);
    if (error.response) {
      console.error("Error response status:", error.response.status);
      console.error("Error response data:", error.response.data);
      console.error("Error response headers:", error.response.headers);
      console.error("Error response config:", error.response.config);
    } else {
      console.error("Error message:", error.message);
    }
    throw error;
  }
};

export const assignBook = (bookId, studentIds, token) => {
  return api.post(
    "/Book/AssignBook",
    {
      bookId: bookId,
      StudentIds: studentIds.join(","),
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
};

export const getBookSummary = (bookId, token) => {
  return api1.post(
    "/Book/GetBookSummary",
    {
      SortBy: "BookId",
      SortOrder: "ASC",
      PageSize: 100,
      PageCount: 1,
      Conditions: [
        {
          Field: "BookId",
          Operation: "=",
          Value: bookId.toString(),
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

export const getStudentDetailsByIds = async (token, studentIds) => {
  const uniqueIds = [...new Set(studentIds)];
  const studentDetails = [];

  for (let id of uniqueIds) {
    try {
      const response = await api.post(
        "/Book/getJStudents",
        {
          SortBy: "Id",
          SortOrder: "ASC",
          PageSize: 1,
          PageCount: 1,
          Conditions: [
            {
              Field: "id",
              Operation: "=",
              Value: id.toString(),
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

      if (response.data && response.data.juniorStudentResponse.length > 0) {
        studentDetails.push(response.data.juniorStudentResponse[0]);
      }
    } catch (error) {
      console.error(`Error fetching details for student ID ${id}:`, error);
    }
  }

  return studentDetails;
};

export const getSessionWiseAssessmentDetails = async (
  qrValue,
  studentId,
  token
) => {
  const headers = {
    // Accept: "*/*",
    // "Accept-Encoding": "gzip, deflate, br",
    // Connection: "keep-alive",
    // "User-Agent": "PostmanRuntime/7.39.0",
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  api.interceptors.request.use((request) => {
    console.log("Starting Request", JSON.stringify(request, null, 2));
    return request;
  });

  try {
    const response = await api.get(
      `/Book/GetSessionWiseAssessmentDetails/${qrValue}/${studentId}`,
      { headers }
    );
    console.log("Session Wise Assessment Details response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching session wise assessment details:", error);
    if (error.response) {
      console.error("Error response status:", error.response.status);
      console.error("Error response data:", error.response.data);
      console.error("Error response headers:", error.response.headers);
      console.error("Error response config:", error.response.config);
    } else {
      console.error("Error message:", error.message);
    }
    throw error;
  }
};

export const uploadAssignments = (token, formData) => {
  return api1.post("/Book/UploadAssignment", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export default {
  api,
  api1,
  login,
  getJStudents,
  getJuniorProfile,
  getAllBooks,
  assignBook,
  getBookSummary,
  getStudentDetailsByIds,
  getSessionWiseAssessmentDetails,
  uploadAssignments,
};
