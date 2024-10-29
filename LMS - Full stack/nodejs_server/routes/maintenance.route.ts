import express from 'express';
import { createCoupon, getAllCoupons } from '../controllers/coupon.controller';
import { isAuthenticated } from '../middleware/auth';
import { getMaintenanceStatus } from '../controllers/maintenance.controllter';

export const maintenanceRouter = express.Router();

maintenanceRouter.get("/get-maintenance-status", getMaintenanceStatus)