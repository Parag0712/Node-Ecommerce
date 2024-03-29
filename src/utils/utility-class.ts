import { InvalidateCacheProps, OrderItemType } from "../types/types.js";
import { nodeCache } from "../app.js";
import { Product } from "../models/product.model.js";

// for clear Cache
export const invalidateCache = ({
    product,
    admin,
    order,
    productId,
    userId,
    orderId,
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

    // order
    if (order) {
        const ordersKeys: string[] = [
            "all-orders",
            `my-orders-${userId}`,
            `order-${orderId}`,
        ];
        nodeCache.del(ordersKeys);
    }
    if(admin){
        nodeCache.del([
            "admin-stats",
            "admin-pie-charts",
            "admin-bar-charts",
            "admin-line-charts",
    ]);
    }
    
}

// for reduce stock when place order
export const reduceStock = async (orderItems: OrderItemType[]) => {
    for (let i = 0; i < orderItems.length; i++) {
        const order = orderItems[i];
        const product = await Product.findById(order.productId);
        console.log(product);
        if (!product) throw new Error("Product Not Found");
        product.stock -= order.quantity,
            await product.save();
    }
}   