import { Router } from "express";
import { addCoupon, allCoupons, applyDiscount, createPaymentIntent, deleteCoupon } from "../controllers/payment.controllers.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const router = Router()


// route - /api/v1/payment/create
router.post("/create", createPaymentIntent);

//For addCoupon- /api/v1/payment/coupon/new?id
router.route("/coupon/addCoupon").post(verifyAdmin,addCoupon);

//For applyDiscount - /api/v1/payment/coupon/applyDiscount/?id
router.route("/coupon/applyDiscount").get(applyDiscount);

//For getAllCoupons - /api/v1/payment/coupon/getAllCoupons?id
router.route("/coupon/getAllCoupons").get(verifyAdmin,allCoupons);

//For deleteCoupon - /api/v1/payment/coupon/deleteCoupons?id
router.route("/coupon/deleteCoupon/:couponId").get(verifyAdmin,deleteCoupon);
export default router;