import { Request, Response, NextFunction } from 'express';
import { TryCatch } from '../utils/TryCatch.js';
import { NewUserRequestBody } from '../types/types.js';
import { User } from '../models/user.model.js';
import ErrorHandler from '../utils/utility-class.js';


export const createUser = TryCatch(async (
    req: Request<{}, {}, NewUserRequestBody>,
    res: Response,
    next: NextFunction
) => {
    const { _id, dob, email, gender, name, photoUrl } = req.body;

    let user = await User.findById(_id);
    console.log(user);
    
    // Check User Exist 
    if (user) {
        return res.status(201).json({
            success: true,
            user:user,
            message: `Welcome back, ${user.name}! You're now logged in successfully. 🎉`
        })
    }
    if (!_id || _id.trim() === "") {
        return next(new ErrorHandler("User ID is required", 400));
    }
    if (!name || name.trim() === "") {
        return next(new ErrorHandler("Name is required", 400));
    }
    if (!email || email.trim() === "") {
        return next(new ErrorHandler("Email is required", 400));
    }
    if (!photoUrl || photoUrl.trim() === "") {
        return next(new ErrorHandler("Photo URL is required", 400));
    }
    if (!gender || gender.trim() === "") {
        return next(new ErrorHandler("Gender is required", 400));
    }
    if (!dob) {
        return next(new ErrorHandler("Date of birth is required", 400));
    }

    user = await User.create({
        _id,
        name,
        email,
        gender,
        photoUrl,
        dob: new Date(dob)
    });

    


    return res.status(201).json({
        success: true,
        user:user,
        message: `Welcome back, ${user.name}! You're now logged in successfully. 🎉`
    })

})