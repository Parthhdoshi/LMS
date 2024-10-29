import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import CouponCodeModel from "../models/coupon.models";
import userModel from "../models/user.model";
import CourseModel from "../models/course.model";
import { QuizModel } from "../models/quiz.models";
import { ProgressModal } from "../models/progress.models";
import { QuizResultModel } from "../models/quizResult.models";
import mongoose from "mongoose";
import { UserQuizAssignmentSchema } from "../models/task.models";



// const nextCourse = await CouponCodeModel.findOne({ _id: { $gt: courseId } }).sort({ _id: 1 });
// console.log(nextCourse)

export const updateCourseProgress = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, courseId, completedSections, totalSections, tags } = req.body;
  
      const progressPercentage = (completedSections / totalSections) * 100;
  
      let progress = await ProgressModal.findOne({ user: userId, course: courseId });
  
      if (!progress) {
        progress = new ProgressModal({
          user: userId,
          course: courseId,
          completedSections,
          totalSections,
          progressPercentage,
        });
      } else {
        progress.completedSections = completedSections;
        progress.totalSections = totalSections;
        progress.progressPercentage = progressPercentage;
      }

      await progress.save();

      // This will contain all the course and then it will filter by tag
      const rawTotalProgress = await ProgressModal.find({ user: userId }).sort('course').populate({
        path: 'course',
        match: { tags: tags },  // Filter courses with the tag 'bridge'
        select: 'name'
      });

      const totalProgress = rawTotalProgress.filter((progress: any) => progress.course !== null);

      let nextCourse;

      for (let i = 0; i < totalProgress.length; i++) {
        if (totalProgress[i].progressPercentage === 100) {
          const nextCourseJson = await CourseModel.findOne({ _id: totalProgress[i + 1]?.course });
          console.log(nextCourseJson)
          if (nextCourseJson) {
            nextCourse = nextCourseJson
            totalProgress[i + 1].locked = false
            await totalProgress[i + 1].save()
          }
        }
      }


      res.status(200).json({
        success:true, 
        progress,
        nextCourse,
        totalProgress,
      });
    } catch (error) {
      res.status(400).json({ success:false,
        error:error,
        message: 'Something went wrong on server!' });
    }
  }
);

export const getProgressForCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, courseId } = req.query;
  
      const progress = await ProgressModal.findOne({ user: userId, course: courseId });
  
      if (!progress) {
        return res.status(200).json({ message: 'No progress found for this user and course' });
      }
  
      res.status(200).json({
        success:true, 
        progress
      });

    } catch (error) {
      res.status(400).json({ message: 'Something went wrong on server!' });
    }
  }
);

// Helper function to assign or get the user's assigned quiz
const getOrAssignQuiz = async (userId: mongoose.Types.ObjectId, courseId: mongoose.Types.ObjectId) => {
  let userQuizAssignment = await UserQuizAssignmentSchema.findOne({ userId, courseId });

  if (!userQuizAssignment) {
    // Fetch all quizzes for the course
    const quizzes:any = await QuizModel.find({ course: courseId.toString() });
    console.log("quizzes", quizzes , quizzes.length, courseId.toString())
    if (!quizzes || quizzes.length === 0) {
      throw new Error('No quizzes available for this course.');
    }

    // Assign a random quiz to the user
    const randomQuiz = quizzes[Math.floor(Math.random() * quizzes.length)];

    // Save the assignment in the UserQuizAssignment collection
    userQuizAssignment = new UserQuizAssignmentSchema({
      userId,
      courseId,
      assignedQuizId: randomQuiz._id,
    });

    await userQuizAssignment.save();
  }

  // Return the assigned quiz
  const assignedQuiz = await QuizModel.findById(userQuizAssignment.assignedQuizId);
  return assignedQuiz;
};

export const getUserProgressForPurchasedCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { tag, courseId } = req.query;
      const userId = req.user?._id
  
      // Get progress for the user
      const progress = await ProgressModal.find({ user: userId }).sort('course').populate({
        path: 'course',
        match: !!tag ? { tags: tag } : {},  // Filter courses with specific tag if provided
      });

      // if course id is valid Get or assign a quiz to the user for the course
      let assignedQuiz;
      if(courseId){
        assignedQuiz = await getOrAssignQuiz(new mongoose.Types.ObjectId(userId), new mongoose.Types.ObjectId(courseId?.toString()));
      }
      
      // Get quiz results for the user
      let quizResults;
      if(courseId){
        quizResults = await QuizResultModel.findOne({ user: userId, course: courseId?.toString() });
      }
      if (!progress) {
        return res.status(200).json({ message: 'No progress found for this user and course' });
      }

      res.status(200).json({
        success: true,
        progress,
        quizResults,
        assignedQuiz,  // Include the assigned quiz in the response
      });

    } catch (error) {
      console.error(error);
      res.status(400).json({ message: 'Something went wrong on server!' });
    }
  }
);
export const getUnlockedCourses = async (req: Request, res: Response) => {
  const { userId } = req.query;

  try {
    const progressRecords:any = await ProgressModal.find({ user: userId });
    
    const unlockedCourses = [];
    for (let record of progressRecords) {

      const isUnlocked = await record.isCourseUnlocked(userId, record.courseOrder);
      if (isUnlocked) {
        const course = await CourseModel.findById(record.course);
        unlockedCourses.push(course);
      }
    }


    const progress = await ProgressModal.find({ user: userId }).sort('course');

    for (let i = 0; i < progress.length; i++) {
      if (progress[i].progressPercentage < 100) {
        console.log(progress[i].progressPercentage)
        // Unlock next course if the current one is completed
        // console.log("Progress Course", progress[i + 1]?.course)
        const nextCourse = await CourseModel.findOne({ _id: progress[i + 1]?.course });
        if (nextCourse) {
          // Add next course to user's unlocked courses
          console.log("nextCourse", nextCourse.name)
          // await userModel.updateOne(
          //   { _id: userId },
          //   { $push: { courses: { courseId: nextCourse._id } } }
          // );
        }
        break;
      }
    }
  



    res.json({ unlockedCourses });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching unlocked courses.' });
  }
};