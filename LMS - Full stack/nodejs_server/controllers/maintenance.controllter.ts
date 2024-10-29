import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import MaintenanceModel from "../models/maintenance.model";

export const getMaintenanceStatus = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const MaintenanceStatus = await MaintenanceModel.find({}).select('status');
        res.status(200).json({
          success: true,
          MaintenanceStatus
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
      }
    }
  );