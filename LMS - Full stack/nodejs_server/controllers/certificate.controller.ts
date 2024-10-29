import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import { generateLast12MothsData } from "../utils/analytics.generator";
import userModel from "../models/user.model";
import CourseModel from "../models/course.model";
import OrderModel from "../models/order.Model";

import { QuizResultModel } from "../models/quizResult.models";
import { TaskResult } from "../models/taskResults.models";
import { ProgressModal } from "../models/progress.models";
import { QuizModel } from "../models/quiz.models";
const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");
import fontkit from '@pdf-lib/fontkit';
import fs from 'fs';
import path from 'path';

export const generateCertificate = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {

      const courseId = req.query.id;
      const courseName = req.query.courseName;
      const userName = req.query.userName;
      const userEmail = req.query.userEmail;
      console.log("Data : ", courseName, userName, userEmail);
      // Load the certificate template
      const templateBytes = fs.readFileSync(`${courseName}.pdf`);
      const pdfDoc = await PDFDocument.load(templateBytes);

      pdfDoc.registerFontkit(fontkit);

      // Embed a font
      const helveticaFont = await pdfDoc.embedFont(
        StandardFonts.TimesRomanItalic
      );

      const verdanaFontBytes = fs.readFileSync('verdana.ttf');
      const verdanaFont = await pdfDoc.embedFont(verdanaFontBytes);

      // Get the first page of the document
      const page = pdfDoc.getPage(0);

      const { width, height } = page.getSize();

      const pageWidth = page.getWidth();
      const pageHeight = page.getHeight();
      console.log("page width", pageWidth);
      // Define the width of the columns
      const col1Width = pageWidth * 0.4;
      const col2Width = pageWidth * 0.6;

      // Define the height of the columns (assuming full page height)
      const colHeight = pageHeight;

      // Define the text to be inserted and its position
      const courseText = `Course: ${courseName}`;
      const userText = `${userName}`;

      const text = userName;

      // Measure the text size
      const textSize = 24;
      const textWidth = helveticaFont.widthOfTextAtSize(text, textSize);
      const textHeight = helveticaFont.heightAtSize(textSize);

      // Calculate the x and y coordinates to center the text in the second column
      const textX = (pageWidth - textWidth) / 2;
      const textY = (colHeight - textHeight) / 2;

      // Draw the user name on the certificate
      page.drawText(userText, {
        x: textX,
        y: 515,
        size: 24,
        font: helveticaFont,
        color: rgb(139 / 255, 93 / 255, 22 / 255),
      });

      // Format the date
      const date = new Date();
      const formattedDate = new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(date);

      // Draw the formatted date on the certificate
      page.drawText("Date :" +formattedDate, {
        x:  360,
        y: 110, // Adjust the y-coordinate as needed
        size: 12,
        font:verdanaFont,
        color : rgb(27/255, 45/255, 88/255)
      });

      // Draw the first column (40% width)
      // page.drawRectangle({
      //   x: 0,
      //   y: 0,
      //   width: col1Width,
      //   height: colHeight,

      // });

      // // Draw the second column (60% width)
      // page.drawRectangle({
      //   x: col1Width,
      //   y: 0,
      //   width: col2Width,
      //   height: colHeight,

      // });

      // const imageBytes = fs.readFileSync("Picture1.png"); // Change to your image path
      // const image = await pdfDoc.embedPng(imageBytes); // Use embedJpg for JPEG images
      // const scaled = image.scale(0.3); // Scale the image if needed

      // Draw the image on the certificate
      // page.drawImage(image, {
      //   x: 110,
      //   y: 350,
      //   width: scaled.width,
      //   height: scaled.height,
      // });

      // Serialize the PDFDocument to bytes (a Uint8Array)
      const pdfBytes = await pdfDoc.save();
      // Create a transporter

      // const transporter: Transporter = nodemailer.createTransport({
      //   host: process.env.SMTP_HOST,
      //   port: parseInt(process.env.SMTP_PORT || "587"),
      //   service: process.env.SMTP_SERVICE,
      //   auth: {
      //     user: process.env.SMTP_MAIL,
      //     pass: process.env.SMTP_PASSWORD,
      //   },
      // });
      // Define the email options
      // const mailOptions: any = {
      //   from: process.env.SMTP_MAIL,
      //   to: userEmail,
      //   subject: "Course Completion Certificate",
      //   text: `Dear ${userName},\n\nCongratulations on completing the course ${courseName}! Please find your certificate attached.\n\nBest regards,\nYour Course Team`,
      //   attachments: [
      //     {
      //       filename: `certificate_${userName}.pdf`,
      //       content: pdfBytes,
      //       contentType: "application/pdf",
      //     },
      //   ],
      // };

      // Send the email

      // transporter.sendMail(mailOptions, (error: any, info: any) => {
      //   if (error) {
      //     return console.log("Error occurred:", error);
      //   }
      //   res.status(200).json({
      //     success:true
      //   })
      //   return console.log("Mail Sent...");
      // }),

      await res.setHeader("Content-Type", "application/pdf");
      await res.setHeader(
        "Content-Disposition",
        `attachment; filename=certificate_${userName}.pdf`
      );

      // Send the generated PDF bytes as a response
      res.send(Buffer.from(pdfBytes));
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching user results.",
        error: error.message,
      });
    }
  }
);

export const getTaskAndQuizResult = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-ignore
      const page = parseInt(req?.query?.page) || 1; // Default to page 1
      // @ts-ignore
      const limit = parseInt(req.query.limit) || 10; // Default to 10 users per page

      const startIndex = (page - 1) * limit;

      // Fetch the total number of users
      const totalUsers = await userModel.countDocuments().exec();

      const users = await userModel.find().skip(startIndex).limit(limit).exec();

      // const userResults = await Promise.all(
      //   users.map(async (user) => {
      //     // Fetch quiz results for the current user
      //     const quizResults = await QuizResultModel.find({ user: user._id })
      //       .populate('quiz')
      //       .populate('course')
      //       .exec();

      //     // Fetch task results for the current user
      //     const taskResults = await TaskResult.find({ userId : user._id })

      //     // Return the user data along with quiz and task results
      //     return {
      //       user,
      //       quizResults,
      //       taskResults,
      //     };
      //   })
      // );

      const quizResults = await QuizResultModel.find()
        .populate("user")
        .sort({ createdAt: -1 })
        .populate("quiz")
        .populate("course")
        .exec();

      // Calculate total pages
      const totalPages = Math.ceil(totalUsers / limit);

      // Send the combined result with pagination data
      res.status(200).json({
        success: true,
        currentPage: page,
        totalPages,
        totalUsers,
        quizResults,
        // userResults,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching user results.",
        error: error.message,
      });
    }
  }
);

export const checkUserCourseCompletion = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.query.userId;
    const tag = req.query.tag;

    try {
      // Step 1: Fetch all courses by tag
      const courses = await CourseModel.find({ tags: tag });
      if (!courses || courses.length === 0) {
        return res
          .status(400)
          .json({ message: "No courses found for the given tag." });
      }
      // Step 2: Check progress for each course
      const userProgress = await ProgressModal.find({
        user: userId,
        course: { $in: courses.map((course) => course._id) },
        progressPercentage: 100,
        locked: false,
      });

      if (userProgress.length !== courses.length) {
        return res
          .status(400)
          .json({ message: "User has not completed all courses." });
      }

      // Step 3: Check if the user passed all quizzes for the courses that have quizzes
      const coursesWithQuizzes = [];
      for (const course of courses) {
        const quizExists = await QuizModel.exists({ course: course._id });
        if (quizExists) {
          coursesWithQuizzes.push(course._id);
        }
      }

      if (coursesWithQuizzes.length > 0) {
        const quizResults = await QuizResultModel.find({
          user: userId,
          course: { $in: coursesWithQuizzes },
          isPassed: true,
        });

        if (quizResults.length !== coursesWithQuizzes.length) {
          return res
            .status(400)
            .json({ message: "User has not passed all quizzes." });
        }
      }

      // Step 4: If all checks pass, allow certificate generation
      return res.status(200).json({
        message:
          "User has completed all courses and quizzes. Certificate generation allowed.",
        canGenerateCertificate: true,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching user results.",
        error: error.message,
      });
    }
  }
);
