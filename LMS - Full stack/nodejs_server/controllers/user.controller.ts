import bcrypt from "bcryptjs";
import nodemailer, { Transporter } from "nodemailer";
require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import userModel, { IUser } from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";
import {
  accessTokenOptions,
  refreshTokenOptions,
  sendToken,
} from "../utils/jwt";
import { redis } from "../utils/redis";
import {
  getAllUsersService,
  getUserById,
  updateUserRoleService,
} from "../services/user.service";
import cloudinary from "cloudinary";
import CourseModel from "../models/course.model";
import crypto from "crypto";
import { ProgressModal } from "../models/progress.models";
import { AnyLengthString } from "aws-sdk/clients/comprehendmedical";
import { QuizResultModel } from "../models/quizResult.models";
import { createHash, randomBytes } from "crypto";
import { apiLogger } from "./apiLogger";

// register user
interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
  phone: number;
  institute: string;
  avatar?: string;
}

export const registrationUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password, phone, institute } = req.body;
      apiLogger(req,res,next)
      const isEmailExist = await userModel.findOne({ email });
      if (isEmailExist) {
        return next(new ErrorHandler("Email already exist", 400));
      }

      const user: IRegistrationBody = {
        name,
        email: email?.toLowerCase(),
        password,
        phone,
        institute,
      };

      const activationToken = createActivationToken(user);

      const activationCode = activationToken.activationCode;

      const data = { user: { name: user.name }, activationCode };
      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/activation-mail.ejs"),
        data
      );

      try {
        await sendMail({
          email: user.email,
          subject: "Activate your account",
          template: "activation-mail.ejs",
          data,
        });

        res.status(201).json({
          success: true,
          message: `Please check your email: ${user.email} to activate your account!`,
          activationToken: activationToken.token,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

interface IActivationToken {
  token: string;
  activationCode: string;
}

export const createActivationToken = (user: any): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

  const token = jwt.sign(
    {
      user,
      activationCode,
    },
    process.env.ACTIVATION_SECRET as Secret,
    {
      expiresIn: "5m",
    }
  );

  return { token, activationCode };
};

// activate user
interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}

export const activateUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_token, activation_code } =
        req.body as IActivationRequest;

      const newUser: { user: IUser; activationCode: string } = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET as string
      ) as { user: IUser; activationCode: string };

      if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler("Invalid activation code", 400));
      }

      const { name, email, password, phone, institute } = newUser.user;

      const existUser = await userModel.findOne({ email });

      if (existUser) {
        return next(new ErrorHandler("Email already exist", 400));
      }

      // const courses: any = await CourseModel.find().select("_id courseData");
      // const listOfCourseId = courses.map((course: any) => {
      //   return { _id: course._id.toString() };
      // });

      const user = await userModel.create({
        name,
        email,
        password,
        phone,
        institute,
        // courses: listOfCourseId,
      });

      // courses.map(async (course: any, index: any) => {
      //   let progress = new ProgressModal({
      //     user: user?._id?.toString(),
      //     course: course._id,
      //     completedSections: 0,
      //     totalSections: course.courseData.length,
      //     progressPercentage: 0,
      //     locked: index === 0 ? false : true,
      //   });

      //   await progress.save();
      // });

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Enroll Course For Specific Tag
export const enrollSpecificTag = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { tag } = req.query;

      const courses: any = await CourseModel.find({ tags: tag })
      // .select(
      //   "_id courseData"
      // );

      const user: any = await userModel.findById(req.user?._id);

      courses.map((course: any) => {
        user?.courses.push({ _id: course._id.toString() });
        return { _id: course._id.toString() };
      });
      user.enrolledTags.push(tag);
      await user?.save();

      courses.map(async (course: any, index: any) => {
        let progress = new ProgressModal({
          user: user?._id?.toString(),
          course: course._id,
          completedSections: 0,
          totalSections: course.courseData.length,
          progressPercentage: 0,
          locked: index === 0 ? false : true,
        });

        await progress.save();
      });

      res.status(201).json({
        success: true,
        // courses,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Login user
interface ILoginRequest {
  email: string;
  password: string;
}

export const loginUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as ILoginRequest;

      if (!email || !password) {
        return next(new ErrorHandler("Please enter email and password", 400));
      }

      const user = await userModel
        .findOne({ email: email?.toLowerCase() })
        .select("+password");

      if (!user) {
        return next(new ErrorHandler("Invalid email or password", 400));
      }

      const isPasswordMatch = await user.comparePassword(password);
      if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid email or password", 400));
      }
      sendToken(user, 200, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// logout user
export const logoutUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.cookie("access_token", "1", {
        maxAge: 1,
        sameSite: "none",
        secure: true,
      });
      // res.setHeader("Set-Cookie", "access_token=0; Max-Age=1");
      // res.setHeader("Set-Cookie", "refresh_token=0; Max-Age=1");
      res.cookie("refresh_token", "1", {
        maxAge: 1,
        sameSite: "none",
        secure: true,
      });

      const userId = req.user?._id || "";
      // redis.del(userId);
      res.status(200).json({
        success: true,
        message: "Logged out successfully",
        userId,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// update access token
export const updateAccessToken = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refresh_token = req.cookies.refresh_token as string;
      const decoded = jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN as string
      ) as JwtPayload;

      const message = "Could not refresh token";
      if (!decoded) {
        return next(new ErrorHandler(message, 400));
      }
      const session = "";
      // await redis.get(decoded.id as string);

      if (!session) {
        return next(
          new ErrorHandler("Please login for access this resources!", 400)
        );
      }

      const user = JSON.parse(session);

      const accessToken = jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN as string,
        {
          expiresIn: "5m",
        }
      );

      const refreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN as string,
        {
          expiresIn: "3d",
        }
      );

      req.user = user;

      res.cookie("access_token", accessToken, accessTokenOptions);
      res.cookie("refresh_token", refreshToken, refreshTokenOptions);

      // await redis.set(user._id, JSON.stringify(user), "EX", 604800); // 7days

      return next();
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// get user info
export const getUserInfo = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id;
      getUserById(userId, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

interface ISocialAuthBody {
  email: string;
  name: string;
  avatar: string;
}

// social auth
export const socialAuth = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, name, avatar } = req.body as ISocialAuthBody;
      const user = await userModel.findOne({ email });
      if (!user) {
        const newUser = await userModel.create({ email, name, avatar });
        sendToken(newUser, 200, res);
      } else {
        sendToken(user, 200, res);
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// update user info
interface IUpdateUserInfo {
  name?: string;
  email?: string;
  phone?: string;
  institute?: string;
}

export const updateUserInfo = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, phone, institute } = req.body as IUpdateUserInfo;

      const userId = req.user?._id;
      const user: any = await userModel.findById(userId);

      if (name && user) {
        user.name = name;
        user.email = email?.toLowerCase();
        user.phone = phone;
        user.institute = institute;
      }

      await user?.save();

      // await redis.set(userId, JSON.stringify(user));

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// update user password
interface IUpdatePassword {
  oldPassword: string;
  newPassword: string;
}

export const updatePassword = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { oldPassword, newPassword } = req.body as IUpdatePassword;

      if (!oldPassword || !newPassword) {
        return next(new ErrorHandler("Please enter old and new password", 400));
      }

      const user = await userModel.findById(req.user?._id).select("+password");

      if (user?.password === undefined) {
        return next(new ErrorHandler("Invalid user", 400));
      }

      const isPasswordMatch = await user?.comparePassword(oldPassword);

      if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid old password", 400));
      }

      user.password = newPassword;

      await user.save();

      // await redis.set(req.user?._id, JSON.stringify(user));

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

interface IUpdateProfilePicture {
  avatar: string;
}

// update profile picture
export const updateProfilePicture = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { avatar } = req.body as IUpdateProfilePicture;

      const userId = req.user?._id;

      const user = await userModel.findById(userId).select("+password");

      if (avatar && user) {
        // if user have one avatar then call this if
        if (user?.avatar?.public_id) {
          // first delete the old image
          await cloudinary.v2.uploader.destroy(user?.avatar?.public_id);

          const myCloud = await cloudinary.v2.uploader.upload(avatar, {
            folder: "avatars",
            width: 150,
          });
          user.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          };
        } else {
          const myCloud = await cloudinary.v2.uploader.upload(avatar, {
            folder: "avatars",
            width: 150,
          });
          user.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          };
        }
      }

      await user?.save();

      // await redis.set(userId, JSON.stringify(user));

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// get all users --- only for admin
export const getAllUsers = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllUsersService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// update user role --- only for admin
export const updateUserRole = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, role } = req.body;
      const isUserExist = await userModel.findOne({ email });
      if (isUserExist) {
        const id = isUserExist._id;
        updateUserRoleService(res, id, role);
      } else {
        res.status(400).json({
          success: false,
          message: "User not found",
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Delete user --- only for admin
export const deleteUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const user = await userModel.findById(id);

      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      await user.deleteOne({ id });

      // await redis.del(id);

      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const forgotPassword = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    // Find user by email
    const user: any = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate reset token
    const resetToken = user.getResetPasswordToken();
    // Save the user with the reset token and expiration
    await user.save({ validateBeforeSave: false });

    // Save the user with the reset token and expiration
    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const resetUrl = `${req.get("origin")}/reset-password/${resetToken}&${
      Date.now() + 10 * 60 * 1000
    }`;

    // Send reset email
    const message = `Reset your password using the following link: \n\n${resetUrl}`;

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

    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        service: process.env.SMTP_SERVICE,
        auth: {
          user: process.env.SMTP_MAIL,
          pass: process.env.SMTP_PASSWORD,
        },
      });

      const mailOptions: any = {
        from: process.env.SMTP_MAIL,
        to: user.email,
        subject: "Password Reset",
        text: message,
      };

      transporter.sendMail(mailOptions, (error: any, info: any) => {
        if (error) {
          return console.log("Error occurred:", error);
        }
        res.status(200).json({
          success: true,
        });
        return console.log("Mail Sent...");
      }),
        res.status(200).json({ message: "Reset email sent" });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      res.status(500).json({ error, message: "Email could not be sent" });
    }
  }
);

export const resetPassword = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.params;
    const { password } = req.body;

    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user: any = await userModel.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Token is invalid or has expired." });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful." });
  }
);
