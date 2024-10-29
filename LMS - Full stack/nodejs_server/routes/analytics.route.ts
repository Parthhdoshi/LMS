import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import {
  getUserEnrollmentStats ,
  getNumberOfUsers,
  getActiveUsers,
  getMostPlayedCourses,
  getUserCourseCompletionDetails,
  getCoursesAnalytics,
  getOrderAnalytics,
  getUsersAnalytics,
  getUserCourseAndQuizCompletionDetails,
} from "../controllers/analytics.controller";
const analyticsRouter = express.Router();

analyticsRouter.get(
  "/get-users-analytics",
  isAuthenticated,
  authorizeRoles("admin"),
  getUsersAnalytics
);

analyticsRouter.get(
  "/get-orders-analytics",
  isAuthenticated,
  authorizeRoles("admin"),
  getOrderAnalytics
);

analyticsRouter.get(
  "/get-courses-analytics",
  isAuthenticated,
  authorizeRoles("admin"),
  getCoursesAnalytics
);

analyticsRouter.get(
  "/user-enrolled-count",
  isAuthenticated,
  authorizeRoles("admin"),
  getUserEnrollmentStats
);

analyticsRouter.get(
  "/user-count",
  isAuthenticated,
  authorizeRoles("admin"),
  getNumberOfUsers
);

analyticsRouter.get(
  "/active-users",
  isAuthenticated,
  authorizeRoles("admin"),
  getActiveUsers
);

analyticsRouter.get(
  "/most-played-courses",
  isAuthenticated,
  authorizeRoles("admin"),
  getMostPlayedCourses
);

analyticsRouter.get(
  "/course-completion-details",
  isAuthenticated,
  authorizeRoles("admin"),
  getUserCourseCompletionDetails
);

analyticsRouter.get(
  "/course-and-quiz-completion-details",
  isAuthenticated,
  authorizeRoles("admin"),
  getUserCourseAndQuizCompletionDetails
);


export default analyticsRouter;
