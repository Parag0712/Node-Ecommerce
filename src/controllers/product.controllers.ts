import { BaseQuery, NewProductRequestBody, SearchRequestQuery } from "../types/types.js";
import { TryCatch } from "../utils/TryCatch.js";
import { NextFunction, Request } from 'express';
import ErrorHandler from "../utils/utility-class.js";
import { Product } from "../models/product.model.js";
import { rm } from "fs";
import { nodeCache } from "../app.js";
import { invalidateCache } from "../utils/CacheClear.js";


// import { faker } from "@faker-js/faker";

// addProduct
export const addProduct = TryCatch(async (req: Request<{}, {}, NewProductRequestBody>, res, next: NextFunction) => {
    const { name, price, category, stock }: NewProductRequestBody = req.body;
    const photo = req.file;
    if (!photo) return next(new ErrorHandler("Photo is Required", 400));

    if (!photo || !name || !price || !stock || !category) {
        rm(photo.path, () => {
            console.log("deleted");
        })
    }

    if (!name) return next(new ErrorHandler("Product Name is Required", 400));
    if (!price) return next(new ErrorHandler("Price is Required", 400));
    if (!stock) return next(new ErrorHandler("Stock is Required", 400));
    if (!category) return next(new ErrorHandler("Category Required", 400));


    const product = await Product.create({
        name,
        price,
        category: category.toLowerCase(),
        stock,
        photo: photo?.path
    })

    if (!product) {
        rm(photo.path, () => {
            console.log("deleted");
        })
    }
    invalidateCache({product:true})

    return res.status(201).json({
        success: true,
        product: product,
        message: "Product Added Successfully"
    })
})

// latestProduct Revalidate on New,Update,Delete,Product & new Order
export const latestProduct = TryCatch(async (req, res, next) => {

    let products = [];
    // Node Cache
    if (nodeCache.has("latest-products")) {
        products = JSON.parse(nodeCache.get("latest-products") as string)
    } else {
        // 1 mean asc -1 desc
        products = await Product.find({}).sort({ createdAt: -1 }).limit(10);
        nodeCache.set("latest-products", JSON.stringify(products));
    }

    return res.status(200).json({
        success: true,
        product: products,
        message: "latest Products Fetched Successfully"
    })
})

// getAllCategories Revalidate on New,Update,Delete,Product & new Order
export const getAllCategories = TryCatch(async (req, res, next) => {

    let categories;

    if (nodeCache.has("all-categories")) {
        categories = JSON.parse(nodeCache.get("all-categories") as string);
    } else {
        categories = await Product.distinct("category");
        nodeCache.set("all-categories", JSON.stringify(categories));
    }

    return res.status(200).json({
        success: true,
        categories: categories,
        message: "Product Categories Fetched Successfully"
    })
})

// getSingleProduct Revalidate on New,Update,Delete,Product & new Order
export const getSingleProduct = TryCatch(async (req, res, next) => {
    const id = req.params.productId;

    let product;

    if (nodeCache.has(`product-${id}`)) {
        product = JSON.parse(nodeCache.get(`product-${id}`) as string);
    } else {
        product = await Product.findById(id);
        if (!product) return next(new ErrorHandler("Product Not Found", 404));
        nodeCache.set(`product-${id}`, JSON.stringify(product));
    }
    return res.status(200).json({
        success: true,
        product: product,
        message: "Product Fetched Successfully"
    })
})

// getAllProduct Revalidate on New,Update,Delete,Product & new Order
export const getAllProducts = TryCatch(async (req, res, next) => {

    let products;

    if (nodeCache.has("all-products")) {
        products = JSON.parse(nodeCache.get("all-products") as string)
    } else {
        products = await Product.find();
        nodeCache.set("all-products", JSON.stringify(products))
    }

    return res.status(200).json({
        success: true,
        product: products,
        message: "Products Fetched Successfully"
    })
})

// updateProduct
export const updateProduct = TryCatch(async (req, res, next) => {
    const id = req.params.productId;

    const { name, price, category, stock } = req.body;
    const photo = req.file;

    const product = await Product.findById(id);

    if (!product) return next(new ErrorHandler("Product Not Found", 404));

    if (photo) {
        rm(product.photo, () => {
            console.log("deleted");
        });
        product.photo = photo.path;
    }

    if (name) product.name = name;
    if (price) product.price = price;
    if (stock) product.stock = stock;
    if (category) product.category = category;

    await product.save();

    invalidateCache({product:true,productId:String(product._id)});
    
    return res.status(201).json({
        success: true,
        product: product,
        message: "Product Update Successfully"
    })
})

// getSingleProduct
export const deleteProduct = TryCatch(async (req, res, next) => {
    const id = req.params.productId;
    const product = await Product.findById(id);
    if (!product) return next(new ErrorHandler("Product Not Found", 404));

    rm(product.photo!, () => {
        console.log("Product Photo Deleted");
    })

    await product.deleteOne();

    invalidateCache({product:true,productId:String(product._id)});

    return res.status(200).json({
        success: true,
        message: "Product Deleted Successfully",
    });
})

// searchProduct
export const searchProduct = TryCatch(async (req: Request<{}, {}, {}, SearchRequestQuery>, res, next) => {

    const { category, price, search, sort } = req.query;

    const page = Number(req.query.page) || 1

    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8
    const skip = (page - 1) * limit;
    const baseQuery: BaseQuery = {};

    if (search) {
        baseQuery.name = {
            $regex: search,
            $options: "i",
        }
    }
    if (price) {
        baseQuery.price = {
            $lte: Number(price)
        }
    }
    if (category) { baseQuery.category = category }

    const productPromise = Product.find(baseQuery)
        .sort(sort ? { price: sort === "asc" ? 1 : -1 } : undefined)
        .limit(limit)
        .skip(skip)

    const filterProductPromise = Product.find(baseQuery);
    const [products, filterOnlyProduct] = await Promise.all([
        productPromise,
        filterProductPromise
    ])

    //How many page 
    const totalPage = Math.ceil(filterOnlyProduct.length / limit);

    return res.status(200).json({
        success: true,
        product: products,
        totalPage,
        message: "Products Fetched Successfully"
    })
})


// const generateRandomProducts = async (count: number = 100) => {
//     const products = [];

//     for (let i = 0; i < count; i++) {
//         const product = {
//             name: faker.commerce.productName(),
//             photo: "uploads\\5ba9bd91-b89c-40c2-bb8a-66703408f986.png",
//             price: faker.commerce.price({ min: 1500, max: 80000, dec: 0 }),
//             stock: faker.commerce.price({ min: 0, max: 100, dec: 0 }),
//             category: faker.commerce.department(),
//             createdAt: new Date(faker.date.past()),
//             updatedAt: new Date(faker.date.recent()),
//             __v: 0,
//         };

//         products.push(product);
//     }

//     await Product.create(products);

//     console.log({ succecss: true });
// };
// generateRandomProducts(100)


// const deleteRandomsProducts = async (count: number = 10) => {
//   const products = await Product.find({}).skip(2);

//   for (let i = 0; i < products.length; i++) {
//     const product = products[i];
//     await product.deleteOne();
//   }

//   console.log({ succecss: true });
// };
// deleteRandomsProducts(50)