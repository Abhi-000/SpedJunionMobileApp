import axios from "axios";

const API_BASE_URL = "https://testing.spedathome.com:7233/api"; //development
///const API_BASE_URL_1 = "https://testing.spedathome.com:7253/api"; //testing

const api = axios.create({
  baseURL: API_BASE_URL,
});

// const api1 = axios.create({
//   baseURL: API_BASE_URL_1,
// });

export const login = async (username, password) => {
  return await api.post("/Users/login", {
    Username: username,
    Password: password,
  });
};

export const getJStudents = async (token, conditions = []) => {
  const response = await api.post(
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
  console.log("here", response.data);
  return response.data;
};

export const getJuniorProfile = async (studentId, token) => {
  console.log("isnside", studentId);
  console.log("isnside", token);
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
  try {
    const response = await api.get(`/Book/GetJuniorProfile/${studentId}`, {
      headers,
    });
    console.log("Books response:", response.data);
    return response.data;
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
  console.log("here:", bookId);
  console.log("here", token);
  return api.post(
    "/Book/GetBookSummary",
    {
      studentId: 2861,
      bookId: 3,
      filters: {
        sortBy: "bookId",
        sortOrder: "DESC",
        pageSize: 25,
        pageCount: 1,
        conditions: [],
      },
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
  console.log("token:", token);
  console.log("studentId:", studentId);
  console.log("qrValue:", qrValue);
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  api.interceptors.request.use((request) => {
    console.log("Starting Request", JSON.stringify(request, null, 2));
    return request;
  });

  try {
    const response = await fetch(
      `https://testing.spedathome.com:7233/api/Book/GetSessionWiseAssessmentDetailsPost`,
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          qrValue: qrValue,
          studentId: studentId,
        }),
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Session Wise Assessment Details response:", data);
    return data;
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
  console.log("upload:", token);
  console.log("upload:", formData);
  return api.post("/Book/UploadAssignment", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};
export const getStudentFilters = async (token) => {
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await api.get("/Book/GetStudentFilters", { headers });
    return response.data;
  } catch (error) {
    console.error("Error fetching student filters:", error);
    throw error;
  }
};

export default {
  api,
  login,
  getJStudents,
  getJuniorProfile,
  getAllBooks,
  assignBook,
  getBookSummary,
  getStudentDetailsByIds,
  getSessionWiseAssessmentDetails,
  uploadAssignments,
  getStudentFilters,
};
