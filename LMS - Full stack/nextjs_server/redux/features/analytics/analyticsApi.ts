import { apiSlice } from "../api/apiSlice";
import axios from "axios";
import { useQuery } from "react-query";

// Redux Implemented  
export const analyticsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCoursesAnalytics: builder.query({
      query: () => ({
        url: "get-courses-analytics",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getUsersAnalytics: builder.query({
      query: () => ({
        url: "get-users-analytics",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getOrdersAnalytics: builder.query({
      query: () => ({
        url: "get-orders-analytics",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useGetCoursesAnalyticsQuery,
  useGetUsersAnalyticsQuery,
  useGetOrdersAnalyticsQuery,
} = analyticsApi;

// Use Query Implemented 
export const fetchUserEnrolledCourseCount = async () => {
  const { data } = await axios.get("user-enrolled-count");
  return data;
};

export const fetchUserCount = async () => {
  const { data } = await axios.get("user-count");
  return data;
};

export const fetchActiveUsers = async () => {
  const { data } = await axios.get("active-users");
  return data;
};

export const fetchMostPlayedCourse = async () => {
  const { data } = await axios.get("most-played-course");
  return data;
};

export const fetchUserCourseCompletion = async () => {
  const { data } = await axios.get("course-completion-details");
  return data;
};

