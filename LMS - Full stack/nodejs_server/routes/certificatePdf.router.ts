import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { checkUserCourseCompletion, generateCertificate, getTaskAndQuizResult } from "../controllers/certificate.controller";
const certificateRouter = express.Router();


certificateRouter.get("/get-certificate",generateCertificate);
certificateRouter.get("/checkUserCourseCompletion",checkUserCourseCompletion);
certificateRouter.get("/get-users-result",getTaskAndQuizResult);

certificateRouter.get("/get-certificate/:id", isAuthenticated,authorizeRoles("admin"));

export default certificateRouter;