import { Request, Response, NextFunction } from 'express';
import { TryCatch } from '../utils/TryCatch.js';
import { NewUserRequestBody } from '../types/types.js';
import { User } from '../models/user.model.js';
import ErrorHandler from '../utils/utility-class.js';

// validateField
function validateField(fieldName: string, value: any, next: NextFunction) {
    if (!value || value.trim() === "") {
        return next(new ErrorHandler(`${fieldName} is required`, 400));
    }
}

// CreateUser
export const createUser = TryCatch(async (
    req: Request<{}, {}, NewUserRequestBody>,
    res: Response,
    next: NextFunction
) => {
    const { _id, dob, email, gender, name, photoUrl } = req.body;

    let user = await User.findById(_id);
    validateField("User ID", _id, next);

    // Check User Exist 
    if (user) {
        return res.status(201).json({
            success: true,
            user: user,
            message: `Welcome back, ${user.name}! You're now logged in successfully. 🎉`
        })
    }

    validateField("Name", name, next);
    validateField("Email", email, next);
    validateField("Photo URL", photoUrl, next);
    validateField("Gender", gender, next);
    validateField("Date of birth", dob, next);

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
        user: user,
        message: `Welcome back, ${user.name}! You're now logged in successfully. 🎉`
    })

})

// getAllUsers
export const getAllUsers = TryCatch(async (req, res, next) => {
    const users = await User.find({});
    return res.status(200).json({
        success: true,
        user: users,
    });
});

// getUser
export const getUser = TryCatch(async (req, res, next) => {
    const id = req.params.id;
    const user = await User.findById(id);

    if (!user) return next(new ErrorHandler("Invalid Id", 400));

    return res.status(200).json({
        success: true,
        user,
    });
});



