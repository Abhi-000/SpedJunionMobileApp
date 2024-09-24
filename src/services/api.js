import axios from "axios";

const API_BASE_URL = "https://uat.spedathome.com:7253/api"; //development
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

  const body = {
    sortBy: "BM.Id",
    sortOrder: "DESC",
    pageSize: 25,
    pageCount: 1,
    conditions: [],
  };

  try {
    const response = await api.post("/Book/GetAllSpedJuniorBooks", body, {
      headers,
    });
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

export const  assignBook = (bookId, studentIds, token) => {
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

export const getBookSummary = (studentId, bookId, token) => {
  console.log("Calling getBookSummary with:");
  console.log("Student ID:", studentId);
  console.log("Book ID:", bookId);
  console.log("Token:", token);

  const requestBody = {
    bookId: bookId,
    filters: {
      sortBy: "bookId",
      sortOrder: "DESC",
      pageSize: 25,
      pageCount: 1,
      conditions: [],
    },
    summaryRequest: true // Add this line to satisfy the API requirement
  };

  // Only add studentId to the request body if it's provided and not null/undefined
  if (studentId != null) {
    // Convert studentId to a number and remove any leading/trailing whitespace
    requestBody.studentId = Number(studentId.toString().trim());
  }

  console.log("Request Body:", JSON.stringify(requestBody, null, 2));

  return api.post(
    "/Book/GetBookSummary",
    requestBody,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  ).then(response => {
    console.log("Successful response:", response.status, response.data);
    return response;
  }).catch(error => {
    console.error("API call failed:");
    console.error("Status:", error.response ? error.response.status : "Unknown");
    console.error("Response data:", error.response ? error.response.data : "No response data");
    console.error("Error message:", error.message);
    throw error;
  });
};

export const getStudentListByStudentIds = async (token, studentIds) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/Book/GetStudentListByStudentIds`,
      { StudentIds: studentIds },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error in getStudentListByStudentIds:', error);
    throw error;
  }
};

export const getRecommendedBooks = (studentId, token) => {
  return api.get(
    `/Book/GetJSessionStudentBook/${studentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
};
export const getStudentDetailsByIds = async (token, studentIds) => {
  const studentIdsArray = studentIds.split(",").map(id => id.trim());
  const uniqueIds = [...new Set(studentIdsArray)];
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
              Field: "studentId",
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
      `https://uat.spedathome.com:7253/api/Book/GetSessionWiseAssessmentDetailsPost`,
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
export const getUserDetails = async (token, referenceId, roleId) => {
  console.log("data recvd:", token, referenceId, roleId);
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
  try {
    const response = await api.get(
      `/Staff/getUserDetails/${referenceId}/${roleId}`,
      { headers }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error;
  }
};

export const forgotPassword = async (token, username) => {
  const headers = {
    "Content-Type": "application/json",
  };
  try {
    const response = await api.get(
      `/Users/ForgotPassword?username=${username}`,
      { headers }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
};

export const getQuestions = (type, module, category,token) => {
  return api.post(
    "/Assessment/getQuestions",
    {
      "type": type,
      "module": module,
      "category": category
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
};

export const submitObservations = (behaviour,eyeContact, compliance, independence,notes, studentId,token) => {
  console.log(behaviour,eyeContact, compliance, independence,notes, studentId,token);
  return api.post(
    "/Therapy/SaveObservations",
    {
      "compliance" :compliance,
    "cooperation": "Partially Cooperative",
    "behaviour": behaviour,
    "eyeContact": eyeContact,
    "duringSession": "60",
    "levelOfIndependence": independence,
    "notes": notes,
    "id": 55,
    "studentId": studentId,
    "term": 1
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
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
  getUserDetails,
  forgotPassword,
  getQuestions,
  getRecommendedBooks
};
