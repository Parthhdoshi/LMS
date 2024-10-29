import { useQuery } from "react-query";
import { 
  fetchUserEnrolledCourseCount, 
  fetchUserCount, 
  fetchActiveUsers, 
  fetchMostPlayedCourse, 
  fetchUserCourseCompletion 
} from "./analyticsApi";

export const useUserEnrolledCourseCount = () => {
  return useQuery("userEnrolledCourseCount", fetchUserEnrolledCourseCount);
};

export const useUserCount = () => {
  return useQuery("userCount", fetchUserCount);
};

export const useActiveUsers = () => {
  return useQuery("activeUsers", fetchActiveUsers);
};

export const useMostPlayedCourse = () => {
  return useQuery("mostPlayedCourse", fetchMostPlayedCourse);
};

export const useUserCourseCompletion = () => {
  return useQuery("userCourseCompletion", fetchUserCourseCompletion);
};
