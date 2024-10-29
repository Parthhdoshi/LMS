import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { addQuiz, getAllQuiz, getAllQuizResults, getQuizByCourseId, saveQuizResult, updateQuiz } from "../controllers/quiz.controller";
const quizRouter = express.Router();

quizRouter.get("/get-all-quiz", isAuthenticated, getAllQuiz);
quizRouter.post("/create-quiz", isAuthenticated, addQuiz);
quizRouter.post("/update-quiz", isAuthenticated, updateQuiz);
quizRouter.get("/get-quiz/:id", isAuthenticated, getQuizByCourseId);

quizRouter.post('/quiz-result', isAuthenticated, saveQuizResult);

quizRouter.get('/get-quiz-result', isAuthenticated, getAllQuizResults);

export default quizRouter;
