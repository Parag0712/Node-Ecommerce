import { NewProductRequestBody } from "../types/types.js";
import { TryCatch } from "../utils/TryCatch.js";
import { NextFunction, Request } from 'express';
import ErrorHandler from "../utils/utility-class.js";
import { Product } from "../models/product.model.js";
import { rm } from "fs";

// addProduct
export const addProduct = TryCatch(async (req: Request<{}, {}, NewProductRequestBody>, res, next:NextFunction) => {
    const {name,price,category,stock}:NewProductRequestBody = req.body;
    const photo = req.file;
    if (!photo) return next(new ErrorHandler("Photo is Required", 400));
    
    if(!photo || !name || !price || !stock || !category){
        rm(photo.path,()=>{
            console.log("deleted");
        })
    }

    if (!name) return next(new ErrorHandler("Product Name is Required", 400));
    if (!price) return next(new ErrorHandler("Price is Required", 400));
    if (!stock) return next(new ErrorHandler("Stock is Required", 400));
    if (!category) return next(new ErrorHandler("Category Required", 400));

    
    const product =await Product.create({
        name,
        price,
        category:category.toLowerCase(),
        stock,
        photo:photo?.path
    })

    if(!product){
        rm(photo.path,()=>{
            console.log("deleted");
        })
    }

    return res.status(201).json({
        success: true,
        product:product,
        message: "Product Added Successfully"
    })
})

// latestProduct
export const latestProduct = TryCatch(async(req,res,next)=>{

    const sort:any = req.query.sort || 'createdAt';
    const order:any = req.query.order || 'desc';
    const limit: number = req.query.limit ? parseInt(req.query.limit as string, 10) : 5; 

    // 1 mean asc -1 desc
    const product = await Product.find({}).sort({[sort]:order}).limit(limit);

    return res.status(200).json({
        success: true,
        product:product,
        message: "latestProduct Fetched Successfully"
    })
})

// getAllCategories
export const getAllCategories = TryCatch(async(req,res,next)=>{

    const categories = await Product.distinct("category");

    return res.status(200).json({
        success: true,
        categories:categories,
        message: "Product Categories Fetched Successfully"
    })
})

// getAllProduct
export const getAllProduct = TryCatch(async(req,res,next)=>{

    const product = await Product.find();

    return res.status(200).json({
        success: true,
        product:product,
        message: "Products Fetched Successfully"
    })
})