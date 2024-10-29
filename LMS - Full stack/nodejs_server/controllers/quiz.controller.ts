import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import CouponCodeModel from "../models/coupon.models";
import userModel from "../models/user.model";
import CourseModel from "../models/course.model";
import { QuizModel } from "../models/quiz.models";
import { IQuizResult, QuizResultModel } from "../models/quizResult.models";
import { TaskResult } from "../models/taskResults.models";
import mongoose from "mongoose";

interface IQuizResultRequest {
  userId: string;
  courseId: string;
  quizId: string;
  answers: { questionId: string; selectedOption: string }[];
}


export const updateQuiz = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { quizId, courseId, title, description, questions } = req.body;

      const existingQuiz:any = await QuizModel.findById(quizId);
      if (!existingQuiz) {
        return res.status(404).json({ message: "quizId not found" });
      }

      const course = await CourseModel.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      existingQuiz.title = title || existingQuiz.title;
      existingQuiz.description = description || existingQuiz.description;
      existingQuiz.questions = questions || existingQuiz.questions;
      existingQuiz.course = courseId || existingQuiz.course;

      await existingQuiz.save();

      if (!course.quizzes.includes(existingQuiz._id)) {
        course.quizzes.push(existingQuiz._id);
        await course.save();
      }

      res.status(200).json({
        success: true,
      });
      
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const addQuiz = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, title, description, questions } = req.body;
      const ObjectId = mongoose.Types.ObjectId;

      const course = await CourseModel.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }


      const newQuiz: any = new QuizModel({
          title,
          description,
          questions,
          course: new ObjectId(courseId), // Ensure courseId is an ObjectId
      });

      await newQuiz.save();

      course.quizzes = course.quizzes || [];
      course.quizzes.push(newQuiz?._id);
      await course.save();

      res.status(200).json({
        success: true,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const getAllQuiz = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try{
      const quiz = await QuizModel.find().populate('course');
      res.status(200).json({
        success: true,
        quiz
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
)

export const getQuizByCourseId = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId } = req.body;

      const course = await CourseModel.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      const quizzes = await QuizModel.find({ course: courseId });

      if (!quizzes || quizzes.length === 0) {
        return res
          .status(404)
          .json({ message: "No quizzes found for this course" });
      }

      res.status(200).json({
        success: true,
        quizzes,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const saveQuizResult = CatchAsyncError(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, courseId, quizId, answers }: IQuizResultRequest = req.body;

    // Validate and find the quiz
    const quiz: any = await QuizModel.findById(quizId).populate("questions");
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    let score = 0;
    const totalQuestions = quiz.questions.length;

    const evaluatedAnswers = answers.map((answer) => {
      const question = quiz.questions.find((q: any) => q._id.toString() === answer.questionId );
      if (!question) {
        throw new Error("Invalid question ID");
      }
      const correctAnswer = question.options.filter((q: any) => q.isCorrect);
      
      const isCorrect = correctAnswer[0]._id.toString() === answer.selectedOption;
      if (isCorrect) score += 1;
      return { ...answer, isCorrect };
    });
    const passingScore = 80; // Define your passing score threshold

    const existingQuizResult:any = await QuizResultModel.findOne({
      user: userId,
      course: courseId,
      quiz: quizId,
    });

    let quizResult;
    if (existingQuizResult) {
      // Update the existing quiz result
      existingQuizResult.answers = evaluatedAnswers;
      existingQuizResult.score = score;
      existingQuizResult.totalQuestions = totalQuestions;
      await existingQuizResult.calculatePassOrFail(score, totalQuestions, passingScore);
      
      quizResult = await existingQuizResult.save();
    } else {
      // Create a new quiz result
      quizResult = new QuizResultModel({
        user: userId,
        course: courseId,
        quiz: quizId,
        answers: evaluatedAnswers,
        score,
        totalQuestions,
      });
     
      await quizResult.calculatePassOrFail(score, totalQuestions, passingScore);
      
      await quizResult.save();
    }

    res.status(200).json({
      success: true,
      message: "Quiz result saved",
      quizResult,
    });

  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
  }});

export const saveTask = CatchAsyncError(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, courseId, quizId, answers }: IQuizResultRequest = req.body;

    // Validate and find the quiz
    const quiz: any = await QuizModel.findById(quizId).populate("questions");
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    let score = 0;
    const totalQuestions = quiz.questions.length;

    const evaluatedAnswers = answers.map((answer) => {
      const question = quiz.questions.find((q: any) => q._id.toString() === answer.questionId );
      if (!question) {
        throw new Error("Invalid question ID");
      }
      const correctAnswer = question.options.filter((q: any) => q.isCorrect);
      
      const isCorrect = correctAnswer[0]._id.toString() === answer.selectedOption;
      if (isCorrect) score += 1;
      return { ...answer, isCorrect };
    });

    // Create a new QuizResult
    const quizResult: IQuizResult = new QuizResultModel({
      user: userId,
      course: courseId,
      quiz: quizId,
      answers: evaluatedAnswers,
      score,
      totalQuestions,
    });

    const passingScore = 80; // Define your passing score threshold

    await quizResult.calculatePassOrFail(score, totalQuestions, passingScore);

    await quizResult.save();

    res.status(200).json({
      success: true,
      message: "Quiz result saved",
      quizResult,
    });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
  }
});

export const getAllQuizResults = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const quizResults = await QuizResultModel.find()
    .populate({
      path: 'quiz',
      populate: {
        path: 'questions',
        model: 'Quiz',
        select: 'questionText options', // Select the relevant fields
      },
    }).then((results:any) => {
      return results.map((result:any) => {
        return {
          ...result.toObject(),
          answers: result.answers.map((answer:any) => {
            const question = result?.quiz?.questions?.find((q: any) => q._id.toString() === answer.questionId.toString());
            return {
              ...answer.toObject(),
              questionText: question ? question?.questionText : null,
              options: question ? question?.options : [],
            };
          }),
        };
      });
    });
  
    res.status(200).json({
      success: true,
      quizResults,
    });
  }
)