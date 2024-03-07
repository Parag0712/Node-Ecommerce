import { stripe } from "../app.js";
import { Coupon } from "../models/coupon.model.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { TryCatch } from "../utils/TryCatch.js";

export const createPaymentIntent = TryCatch(async (req, res, next) => {
    const { amount } = req.body;
    if (!amount) return next(new ErrorHandler("Please enter amount", 400));

    const paymentIntent = await stripe.paymentIntents.create({
        amount: Number(amount) * 100,
        currency: "inr",
        description: 'Software development services',
        shipping: {
            name: 'Jenny Rosen',
            address: {
                line1: '510 Townsend St',
                postal_code: '98140',
                city: 'San Francisco',
                state: 'CA',
                country: 'US',
            },
        },
        payment_method_types: ['card'],
    });
    return res.status(201).json({
        success: true,
        clientSecret: paymentIntent.client_secret,
    });
})

// For Add New Coupon
export const addCoupon = TryCatch(async (req, res, next) => {
    const { coupon, amount } = req.body;


    if (!coupon || !amount) {
        return next(new ErrorHandler("Please enter both coupon and amount", 400));
    }

    await Coupon.create({ code: coupon, amount })

    return res.status(201).json({
        success: true,
        message: `Coupon ${coupon} Created Successfully`,
    })
})

// get Discount Amount Coupon
export const applyDiscount = TryCatch(async (req, res, next) => {
    const { coupon } = req.query;
    if (!coupon) {
        return next(new ErrorHandler("Please enter coupon", 400));
    }
    const discount = await Coupon.findOne({ code: coupon })
    if (!discount) {
        return next(new ErrorHandler("Invalid Coupon", 400));
    }


    return res.status(201).json({
        success: true,
        discount: discount?.amount,
        message: `Congratulations you get ₹${discount?.amount} rupees *off`
    })
})

// get All coupon
export const allCoupons = TryCatch(async (req, res, next) => {
    const coupons = await Coupon.find({});

    return res.status(200).json({
        success: true,
        coupons,
        message: "All coupons fetched"
    });
});

export const deleteCoupon = TryCatch(async (req, res, next) => {
    const { couponId } = req.params;

    if (!couponId) return next(new ErrorHandler("couponId is required", 400));
    const coupon = await Coupon.findByIdAndDelete(couponId);

    if (!coupon) return next(new ErrorHandler("Invalid Coupon ID", 400));

    return res.status(200).json({
        success: true,
        message: `Coupon ${coupon.code} Deleted Successfully`,
    });
})