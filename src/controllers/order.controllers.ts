import { Request } from "express";
import { NewOrderRequestBody } from "../types/types.js";
import { TryCatch } from "../utils/TryCatch.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { Order } from "../models/order.model.js";
import { invalidateCache, reduceStock } from "../utils/utility-class.js";
import { nodeCache } from "../app.js";

// addOrder Working
export const addOrder = TryCatch(async (req: Request<{}, {}, NewOrderRequestBody>, res, next) => {
    const {
        shippingInfo,
        orderItems,
        user,
        shippingCharges,
        subtotal,
        discount,
        tax,
        total
    } = req.body;


    if (!shippingInfo) return next(new ErrorHandler("ShippingInfo Name is Required", 400));
    if (!orderItems) return next(new ErrorHandler("OrderItem is Required", 400));
    if (!user) return next(new ErrorHandler("User is Required", 400));
    if (!subtotal) return next(new ErrorHandler("Subtotal Required", 400));
    if (!tax) return next(new ErrorHandler("Tax Required", 400));
    if (!total) return next(new ErrorHandler("Total Required", 400));

    const order = await Order.create({
        shippingInfo,
        orderItems,
        user,
        shippingCharges,
        subtotal,
        discount,
        tax,
        total
    });

    await reduceStock(orderItems);
    invalidateCache({ product: true, order: true, admin: true,userId:user ,productId: order.orderItems.map((i) => String(i.productId)) });

    return res.status(200).json({
        success: true,
        order: order,
        message: "Order Placed Successfully",
    });
})

// myOrder 
export const myOrders = TryCatch(async (req, res, next) => {
    const { id: user } = req.query;
    const key = `my-orders-${user}`;
    
    let orders = [];

    if (nodeCache.has(key)) {
        orders = JSON.parse(nodeCache.get(key) as string);
    } else {
        orders = await Order.find({ user });
        nodeCache.set(key, JSON.stringify(orders));
    }
    return res.status(200).json({
        success: true,
        order: orders,
        message: "Order Fetched Successfully",
    });
})

// allOrder
export const getAllOrders = TryCatch(async (req, res, next) => {
    const key = `all-orders`;
    let orders = [];
    if (nodeCache.has(key)) {
        orders = JSON.parse(nodeCache.get(key) as string)
    } else {
        orders = await Order.find().populate("user", "name");
        nodeCache.set(key, JSON.stringify(orders));
    }
    return res.status(200).json({
        success: true,
        orders,
        message: "All Order Fetched Successfully",
    });
})

// getSingleOrder
export const getSingleOrder = TryCatch(async (req, res, next) => {
    const { orderId } = req.params;

    const key = `order-${orderId}`
    let order;

    if (nodeCache.has(key)) {
        order = JSON.parse(nodeCache.get(key) as string)
    } else {
        order = await Order.findById(orderId).populate("user", "name");
        if (!order) return next(new ErrorHandler("Order Not Found", 404));
        nodeCache.set(key, JSON.stringify(order));
    }
    return res.status(200).json({
        success: true,
        order,
        message: "singleOrder Fetched Successfully",
    });
})

// processOrder
export const processOrder = TryCatch(async(req,res,next)=>{
    const {orderId} = req.params;
    const order = await Order.findById(orderId);
    
    if (!order) return next(new ErrorHandler("Order Not Found", 404));

    switch(order.status){
        case "Processing":
            order.status = "Shipped";
            break;
        case "Shipped":
            order.status = "Delivered";
            break;
        default:
            order.status = "Delivered";
            break;
            
    }

    await order.save();

    invalidateCache({
        product:false,
        order:true,
        admin:true,
        userId: order.user,
        orderId: String(order._id),
    })

    return res.status(200).json({
        success: true,
        order:order,
        message: "Order Processed Successfully",
    });
}) 

// deleteOrder
export const deleteOrder = TryCatch(async(req,res,next)=>{
    const {orderId} = req.params;

    const order = await Order.findById(orderId);
    if (!order) return next(new ErrorHandler("Order Not Found", 404));

    await order.deleteOne();

    invalidateCache({
        product:false,
        order:true,
        admin:true,
        userId: order.user,
        orderId: String(order._id),
    })

    return res.status(200).json({
        success: true,
        message: "Order Deleted Successfully",
    });
})