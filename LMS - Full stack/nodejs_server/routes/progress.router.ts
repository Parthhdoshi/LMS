import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { addQuiz, getQuizByCourseId } from "../controllers/quiz.controller";
import { getProgressForCourse, getUnlockedCourses, getUserProgressForPurchasedCourse, updateCourseProgress } from "../controllers/progress.controller";

const progressRouter = express.Router();

progressRouter.post("/update-progress", isAuthenticated, updateCourseProgress);
progressRouter.get("/course-progress", isAuthenticated, getProgressForCourse);
progressRouter.get("/User-progress", isAuthenticated, getUserProgressForPurchasedCourse);
progressRouter.get("/User-CourseUnlock-progress", isAuthenticated, getUnlockedCourses);

export default progressRouter;