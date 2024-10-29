import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import { generateLast12MothsData } from "../utils/analytics.generator";
import userModel from "../models/user.model";
import CourseModel from "../models/course.model";
import OrderModel from "../models/order.Model";
import { ProgressModal } from "../models/progress.models";
import { QuizResultModel } from "../models/quizResult.models";

// get users analytics --- only for admin
export const getUsersAnalytics = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await generateLast12MothsData(userModel);

      res.status(200).json({
        success: true,
        users,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get courses analytics --- only for admin
export const getCoursesAnalytics = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courses = await generateLast12MothsData(CourseModel);

      res.status(200).json({
        success: true,
        courses,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get order analytics --- only for admin
export const getOrderAnalytics = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await generateLast12MothsData(OrderModel);

      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const getUserEnrollmentStats = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Filter to exclude admin and salespersons
      const userFilter = { role: { $nin: ['admin', 'salesperson'] } };

      // Step 1: Get the total number of users excluding admins and salespersons
      const totalUsers = await userModel.countDocuments(userFilter);

      // Step 2: Get a list of users with enrolled courses (distinct users in progress)
      const usersWithEnrolledCoursesList = await ProgressModal.distinct('user', userFilter);
      const usersWithEnrolledCourses = usersWithEnrolledCoursesList.length;

      // Step 3: Get a list of distinct tags from the courses
      const distinctTags = await CourseModel.distinct('tags');

      // Step 4: Count the number of students enrolled in each tag
      const tagEnrollmentCounts = await CourseModel.aggregate([
        { $unwind: '$tags' },
        { $group: { _id: '$tags', count: { $sum: 1 } } },
        { $sort: { _id: 1 } } // Optional: Sort tags alphabetically
      ]);

      // Step 5: Create a dynamic object to count students for each tag
      const tagWiseEnrollment:any = {};
      for (const tag of distinctTags) {
        const count = await userModel.countDocuments({ enrolledTags: tag, ...userFilter });
        tagWiseEnrollment[tag] = count;
      }

      // Step 6: Return the response with all required data
      res.status(200).json({
        success: true,
        totalUsers,
        usersWithEnrolledCourses,
        distinctTags,
        tagEnrollmentCounts,
        tagWiseEnrollment
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);



export const getNumberOfUsers = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCount = await userModel.countDocuments();
      res.status(200).json({
        success: true,
        userCount,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const getActiveUsers = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
      const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

      const activeToday = await userModel.countDocuments({
        lastActive: { $gte: oneDayAgo },
      });
      const activeInLastWeek = await userModel.countDocuments({
        lastActive: { $gte: oneWeekAgo },
      });
      const activeInLastTwoWeeks = await userModel.countDocuments({
        lastActive: { $gte: twoWeeksAgo },
      });
      const activeInLastMonth = await userModel.countDocuments({
        lastActive: { $gte: oneMonthAgo },
      });
      const activeInLastThreeMonths = await userModel.countDocuments({
        lastActive: { $gte: threeMonthsAgo },
      });
      const activeInLastSixMonths = await userModel.countDocuments({
        lastActive: { $gte: sixMonthsAgo },
      });
      const activeInLastYear = await userModel.countDocuments({
        lastActive: { $gte: oneYearAgo },
      });

      res.status(200).json({
        success: true,
        activeToday,
        activeInLastWeek,
        activeInLastTwoWeeks,
        activeInLastMonth,
        activeInLastThreeMonths,
        activeInLastSixMonths,
        activeInLastYear,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);


export const getMostPlayedCourses = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const mostPlayedCourses = await CourseModel.aggregate([
        { $unwind: "$coursePlays" }, // Assuming there's a 'coursePlays' field
        { $group: { _id: "$_id", playCount: { $sum: 1 } } },
        { $sort: { playCount: -1 } },
        { $limit: 5 }, // Limit to top 5 most played courses
      ]);

      res.status(200).json({
        success: true,
        mostPlayedCourses,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// export const getUserCourseCompletionDetails = CatchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const userCompletionDetails = await userModel.aggregate([
//         { $unwind: "$courses" },
//         {
//           $lookup: {
//             from: "courses",
//             localField: "courses.courseId",
//             foreignField: "_id",
//             as: "courseDetails",
//           },
//         },
//         { $project: { name: 1, "courses": 1, "courseDetails.name": 1 } },
//       ]);

//       res.status(200).json({
//         success: true,
//         userCompletionDetails,
//       });
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   }
// );


export const getUserCourseCompletionDetails = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {

    const result = await ProgressModal.aggregate([
      // Convert course (string) to ObjectId and lookup course details from CourseModel
      {
        $addFields: {
          courseObjectId: { $toObjectId: "$course" },  // Convert course field to ObjectId
        },
      },
      {
        $lookup: {
          from: "courses",  // Collection name for CourseModel
          localField: "courseObjectId",
          foreignField: "_id",
          as: "courseDetails",
        },
      },
      {
        $unwind: "$courseDetails",
      },
      // Convert user (string) to ObjectId and lookup user details from UserModel
      {
        $addFields: {
          userObjectId: { $toObjectId: "$user" },  // Convert user field to ObjectId
        },
      },
      {
        $lookup: {
          from: "users",  // Collection name for UserModel
          localField: "userObjectId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      // Separate completed and incomplete users based on progressPercentage
      {
        $group: {
          _id: "$courseDetails.tags", // Group by course tag
          completedUsers: {
            $push: {
              $cond: [
                { $eq: ["$progressPercentage", 100] },  // Condition for completed users
                {
                  userId: "$userDetails._id",
                  name: "$userDetails.name",
                  email: "$userDetails.email",
                  courseName : "$courseDetails.name",
                  progress: "$progressPercentage",
                },
                null,
              ],
            },
          },
          incompleteUsers: {
            $push: {
              $cond: [
                { $lt: ["$progressPercentage", 100] },  // Condition for incomplete users
                {
                  userId: "$userDetails._id",
                  name: "$userDetails.name",
                  email: "$userDetails.email",
                  courseName : "$courseDetails.name",
                  progress: "$progressPercentage",
                },
                null,
              ],
            },
          },
        },
      },
      // Remove null values from the result
      {
        $project: {
          completedUsers: { $filter: { input: "$completedUsers", as: "user", cond: { $ne: ["$$user", null] } } },
          incompleteUsers: { $filter: { input: "$incompleteUsers", as: "user", cond: { $ne: ["$$user", null] } } },
        },
      },
    ]);
    
    console.log(result);
    
  res.status(200).json({
    success: true,
    result
          });
  }
);

export const getUserCourseAndQuizCompletionDetails = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {

    const result = await QuizResultModel.aggregate([
      // Match only passed quizzes
      {
        $match: {
          isPassed: true,  // Filter only those users who passed the quiz
        },
      },
      // Lookup user details based on userId in the quiz result
      {
        $lookup: {
          from: 'users',  // Collection name for UserModel
          localField: 'user',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      {
        $unwind: '$userDetails',  // Extract user details from array
      },
      // Lookup quiz details based on quizId
      {
        $lookup: {
          from: 'quizzes',  // Collection name for QuizModel
          localField: 'quiz',
          foreignField: '_id',
          as: 'quizDetails',
        },
      },
      {
        $unwind: '$quizDetails',  // Extract quiz details from array
      },
      // Lookup course details based on courseId
      {
        $lookup: {
          from: 'courses',  // Collection name for CourseModel
          localField: 'course',
          foreignField: '_id',
          as: 'courseDetails',
        },
      },
      {
        $unwind: '$courseDetails',  // Extract course details from array
      },
      // Project the desired fields
      {
        $project: {
          _id: 0,  // Exclude the _id field from the result
          userId: '$userDetails._id',
          userName: '$userDetails.name',
          userEmail: '$userDetails.email',
          courseName: '$courseDetails.name',
          quizTitle: '$quizDetails.title',
          score: '$score',
          totalQuestions: '$totalQuestions',
          completionDate: '$completionDate',
        },
      },
      // Sort by completionDate in descending order (most recent first)
      {
        $sort: {
          completionDate: -1,
        },
      },
    ]);
    
    res.status(200).json({
      success: true,
      result
    });
  }
);


