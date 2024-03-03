import { NextFunction, Request, Response } from "express";

export type ControllerType = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;

export type InvalidateCacheProps = {
    product?: boolean;
    order?: boolean;
    admin?: boolean;
    productId?:string | string[];
    userId?:string;
    orderId?:string;
};

// User Data
export interface NewUserRequestBody {
    _id: string;
    name: string;
    email: string;
    photo: string;
    gender: string;
    dob: Date;
}

// Product Data
export interface NewProductRequestBody {
    name: string;
    category: string;
    price: number;
    stock: number;
}

// SearchRequestQuery
export interface SearchRequestQuery {
    search?: string;
    price?: string;
    category?: string;
    sort?: string;
    page?: string;
}

// BaseQuery
export interface BaseQuery {
    name?: {
        $regex: string;
        $options: string;
    };
    price?: { $lte: number };
    category?: string;
}

// OrderItemType
export type OrderItemType={
    name:string,
    photo:string,
    price:number,
    quantity:number,
    productId:string
}

//ShippingInfoType 
export type ShippingInfoType={
    address:string,
    city:string,
    state:string,
    country:string,
    pincode:number
}

// NewOrderRequestBody
export type NewOrderRequestBody={
    shippingInfo:ShippingInfoType,
    user:string,
    subtotal:number,
    tax:number,
    shippingCharges:number,
    discount:number,
    total:number,
    orderItems:OrderItemType[];
}