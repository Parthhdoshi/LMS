import express from 'express';
import { checkCoupon, createCoupon, getAllCoupons } from '../controllers/coupon.controller';
import { isAuthenticated } from '../middleware/auth';

export const couponRouter = express.Router();

couponRouter.get("/get-all-coupon", isAuthenticated, getAllCoupons)
couponRouter.get("/check-coupon", isAuthenticated, checkCoupon)
couponRouter.post("/create-coupon",  isAuthenticated, createCoupon)
// couponRouter.post("/create-coupon",  isAuthenticated, createCoupon)