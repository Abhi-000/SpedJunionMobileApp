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

// Updated function to get student details by individual IDs
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

export default { api, api1 };
