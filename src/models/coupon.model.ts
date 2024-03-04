import mongoose from "mongoose";

const schema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, "Coupon Code is required"],
        unique: true,
    },
    amount: {
        type: Number,
        required: [true, "Discount Amount is required"],
    },
})

export const Coupon = mongoose.model("Coupon", schema);