import { NextFunction, Request, Response } from "express";
import LogModel from "../models/log.models";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import userModel from "../models/user.model";

export const apiLogger = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { method, url, headers, user, body, query } = req;
      const userId = user ? user.id : "Anonymous"; // assuming you have user info in req.user
      const payload = method === "GET" ? query : body;
      const log = new LogModel({
        userId,
        action: url,
        timestamp: new Date(),
        method,
        payload: JSON.stringify(payload),
        statusCode: res.statusCode,
        userAgent: headers["user-agent"],
        ip: req.ip,
      });

      try {
        queueMicrotask(async () => {
          try {
            if (userId !== "Anonymous") {
              await userModel.findByIdAndUpdate(userId, {
                lastActive: Date.now(),
              });
            }
            await log.save(); // Save the log to MongoDB
          } catch (error) {
            console.error("Failed to update lastActive:", error);
          }
        });
      } catch (error) {
        console.error("Error logging API request:", error);
      }
      return; // Proceed to the next middleware or route handler
    } catch (err) {
      console.log(err);
    }
  }
);
