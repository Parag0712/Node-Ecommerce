import { TryCatch } from "../utils/TryCatch.js";

export const getDashboardStats = TryCatch(async(req,res,next)=>{
    return res.status(200).json({
        success: true,
        message: "Order Deleted Successfully",
    });
})