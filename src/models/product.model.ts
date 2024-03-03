import mongoose from "mongoose";

const schema = new mongoose.Schema({
    name: {
        type: String,
        trim:true,
        required: [true, "Product Name is required"]
    },
    photo: {
        type: String,
        required: [true, "Product Name is required"]
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
    },
    stock: {
        type: Number,
        required: [true, "Stock is required"],
    },
    category: {
        type: String,
        trim:true,
        required: [true, "Stock is required"],
    },
}, { timestamps: true });

export const Product = mongoose.model("Product", schema);