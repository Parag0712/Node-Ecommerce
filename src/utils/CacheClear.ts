import { NextFunction, Request, Response } from "express";
import { ControllerType, InvalidateCacheProps } from "../types/types.js";
import { nodeCache } from "../app.js";

export const TryCatch = (requestHandler: ControllerType) => {
    return (req: Request, res: Response, next: NextFunction) => {
        return Promise.resolve(requestHandler(req, res, next)).catch(next)
    }
}

export const invalidateCache = ({
    product,
    admin,
    order,
    productId,
}: InvalidateCacheProps) => {
    // If Product 
    if (product) {
        const productKeys: string[] = [
            "latest-products",
            "all-categories",
            "all-products",
        ]
        if (typeof productId === "string") productKeys.push(`product-${productId}`);
        if (typeof productId === "object") {
            productId.forEach((i) => productKeys.push(`product-${i}`));
        }
        nodeCache.del(productKeys);
    }
}