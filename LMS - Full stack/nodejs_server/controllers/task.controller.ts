import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import CourseModel from "../models/course.model";
import ErrorHandler from "../utils/ErrorHandler";
import { TaskModel } from "../models/task.models";
import AWS from "aws-sdk";
import { app } from "../app";
import { TaskResult } from "../models/taskResults.models";

export const addTaskToCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, taskTitle } = req.body;
      const course = await CourseModel.findById(courseId);
      if (!course) {
        throw new Error("Course not found");
      }

      let task = await TaskModel.findOne({ course: courseId });

      if (task) {
        // Update the existing task
        task.title = taskTitle;
        await task.save();
      } else {
        // Create a new task
        task = new TaskModel({
          title: taskTitle,
          course: courseId,
        });

        await task.save();
      }

      course.task = taskTitle; // Update the task
      await course.save();

      res.status(200).json({
        success: true,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const getAllTasks = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const Tasks = await TaskModel.find().sort({ createdAt: -1 });
    res.status(201).json({
      success: true,
      Tasks,
    });
  }
);

export const uploadTaskFile = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, userId, fileName, fileType, fileBase64 } = req.body;
      
      const s3 = new AWS.S3();
      
      if (!fileBase64) {
        return res.status(400).json({ success: false, message: 'File is required' });
      }

      const buffer = await Buffer.from(fileBase64, "base64");

      let taskResult = await TaskResult.findOne({ courseId, userId });

      const params: any = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${Date.now()}_${fileName}`,
        Body: buffer,
        ContentEncoding: "base64",
        ContentType: fileType,
      };

      const s3Response = await s3.upload(params).promise();

      if (taskResult) {

        const deleteParams = {
            Bucket: process.env.S3_BUCKET_NAME as string,
            Key: taskResult.key,
          };
    
        await s3.deleteObject(deleteParams).promise();

        // Update the existing task result
        taskResult.location = s3Response.Location;
        taskResult.key = s3Response.Key;
        await taskResult.save();
      } else {
        // Create a new task result if it doesn't exist
        taskResult = new TaskResult({
          courseId,
          userId,
          location: s3Response.Location,
          key: s3Response.Key,
          pass: false,  // Default pass to false
        });
        await taskResult.save();
      }
  
      res.status(201).json({ success: true, taskResult });

    } catch (err:any) {
        console.error('Error uploading file:', err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
      }
  }
);

export const getAllTaskResults = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
    try {
      const taskResults = await TaskResult.find()
      .populate('courseId', 'name description task _id')
      .populate('userId', 'name email _id')
      .sort({ createdAt: -1 });
  
      res.status(200).json({ success: true, taskResults });
    } catch (err:any) {
      console.error('Error fetching task results:', err);
      res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
});

export const updateTaskResultStatus = CatchAsyncError( 
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { taskResultId, pass } = req.body;
        
            // Find the task result by ID
            const taskResult = await TaskResult.findById(taskResultId);
            if (!taskResult) {
              return res.status(404).json({ success: false, message: 'Task result not found' });
            }
        
            // Update the pass status
            taskResult.pass = pass;
            await taskResult.save();
        
            res.status(200).json({ success: true, taskResult });
          } catch (err:any) {
            console.error('Error updating task result status:', err);
            res.status(500).json({ success: false, message: 'Server error', error: err.message });
          }
});