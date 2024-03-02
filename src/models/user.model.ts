import { timeStamp } from "console";
import mongoose from "mongoose";
import validator from 'validator'
interface IUser extends Document{
    _id:string;
    name:string;
    email:string;
    photoUrl:string;
    role:"admin" | "user";
    gender:"male" | "female";
    dob:Date;
    createdAt:Date;
    updatedAt:Date;
    // virtual attributes
    age:number;
}

// User Schema
const schema = new mongoose.Schema({
    _id: {
        type: String,
        unique: true,
        trim: true,
        required: [true, "Id is required"]
    },
    name: {
        type: String,
        trim: true,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        unique: [true, "Email Already exists"],
        required: [true, "Email is required"],
        validate: validator.default.isEmail
    },
    photoUrl: {
        type: String,
        required: [true, "Photo is required"]
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        required: [true, "Gender is required"]
    },
    dob: {
        type: Date,
        required: [true, "Date of Birth is required"]
    }
}, { timestamps: true })


schema.virtual("age").get(function () {
    const today = new Date();
    const dob = this.dob;
    let age = today.getFullYear() - dob.getFullYear();

    if (today.getMonth() < dob.getMonth() || today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate()) { age-- };

    return age
})

export const User = mongoose.model<IUser>("User", schema);

