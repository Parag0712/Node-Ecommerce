
import { User } from "../models/user.model.js";
import { TryCatch } from "../utils/TryCatch.js";
import ErrorHandler from "../utils/ErrorHandler.js";

// Middleware to make sure only admin is allowed
export const verifyAdmin = TryCatch(async (req, res, next) => {
    const { id } = req.query;

    if (!id) return next(new ErrorHandler("user not login", 401));

    const user = await User.findById(id);
    if (!user) return next(new ErrorHandler("User Not Found", 401));
    if (user.role !== "admin")
        return next(new ErrorHandler("You do not have permission to access this page.", 403));
    next();
});