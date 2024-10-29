import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { addQuiz, getQuizByCourseId, saveQuizResult } from "../controllers/quiz.controller";
import { addTaskToCourse, getAllTasks, uploadTaskFile, getAllTaskResults, updateTaskResultStatus  } from "../controllers/task.controller";
const taskRouter = express.Router();

taskRouter.get("/get-all-tasks", isAuthenticated, getAllTasks);

taskRouter.post("/add-task", isAuthenticated, addTaskToCourse);
taskRouter.put('/update-task', isAuthenticated, addTaskToCourse);

taskRouter.post("/upload-task-file", isAuthenticated, uploadTaskFile )
taskRouter.get("/get-all-task-result", isAuthenticated, getAllTaskResults  )
taskRouter.put("/update-task-result-status", isAuthenticated, updateTaskResultStatus  )

export default taskRouter;