import mongoose, { mongo } from "mongoose";
import { NewOrderRequestBody, OrderItemType, ShippingInfoType } from "../types/types.js";

// shippingSubSchema
const shippingSubSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    pincode: {
        type: Number,
        required: true
    },
})

// orderSubSchema
const orderSubSchema = new mongoose.Schema({
    name:String,
    photo:String,
    price:Number,
    quantity:Number,
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product"
    }
});


const schema = new mongoose.Schema({
    shippingInfo: shippingSubSchema,
    user: {
        // Generally we mongoose.Schema.Types.ObjectId
        // but here we give custom id that's why we uses String
        type: String,
        ref: "User",
        required: true
    },
    subtotal: {
        type: Number,
        required: true,
    },
    tax: {
        type: Number,
        required: true,
    },
    shippingCharges: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    status:{
        type:String,
        enum:["Processing","Shipped","Delivered"],
        default:"Processing",
    },
    orderItems:[orderSubSchema]
}, { timestamps: true })

export const Order = mongoose.model("Order", schema);
