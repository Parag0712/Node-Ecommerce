import { nodeCache } from "../app.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";
import { calculatedPercentage } from "../utils/Features.js";
import { TryCatch } from "../utils/TryCatch.js";


function getItemsByDateRange(collection: any, startDate: any, endDate: any) {
    return collection.find({
        createdAt: {
            $gte: startDate,
            $lte: endDate
        }
    }).exec();
}


// getDashboardStats
export const getDashboardStats = TryCatch(async (req, res, next) => {
    let key = "admin-stats";
    let stats = {};

    if (nodeCache.has("admin-stats")) {
        stats = JSON.parse(nodeCache.get(key) as string)
    } else {
        const today = new Date();
        const sixMonthAgo = new Date();
        sixMonthAgo.setMonth(sixMonthAgo.getMonth() - 6);

        // current Month Starting and ending Dates
        const thisMonth = {
            startDate: new Date(today.getFullYear(), today.getMonth(), 1),
            endDate: today
        }

        //last Month Starting and ending Dates
        // endDate: This is calculated by taking the current year (today.getFullYear()) and the current month (today.getMonth()), but with the day set to 0. Setting the day to 0 of the current month actually gives you the last day of the previous month, which effectively gives you the end date of the last month.
        const lastMonth = {
            startDate: new Date(today.getFullYear(), today.getMonth() - 1, 1),
            endDate: new Date(today.getFullYear(), today.getMonth(), 0)
        }

        // get Current Month Products
        const thisMonthProductsPromise = getItemsByDateRange(Product, thisMonth.startDate, thisMonth.endDate);
        // get Last Month Products

        const lastMonthProductsPromise = getItemsByDateRange(Product, lastMonth.startDate, lastMonth.endDate);

        // get Current Month Users
        const thisMonthUsersPromise = getItemsByDateRange(User, thisMonth.startDate, thisMonth.endDate);
        // get Last Month Users
        const lastMonthUsersPromise = getItemsByDateRange(User, lastMonth.startDate, lastMonth.endDate);

        // get Current Month Order
        const thisMonthOrdersPromise = getItemsByDateRange(Order, thisMonth.startDate, thisMonth.endDate);
        // get Last Month Orders
        const lastMonthOrdersPromise = getItemsByDateRange(Order, lastMonth.startDate, lastMonth.endDate);

        const lastSixMonthOrdersPromise = getItemsByDateRange(Order, sixMonthAgo, today)


        const latestTransactionPromise = Order.find({}).select(["orderItems", "total", "discount", "status"]).limit(4)
        // Promise
        const [
            thisMonthProducts,
            thisMonthUsers,
            thisMonthOrders,
            lastMonthOrders,
            lastMonthProducts,
            lastMonthUsers,
            productCount,
            userCount,
            allOrders,
            lastSixMonthOrders,
            productCategory,
            femaleUser,
            latestTransaction
        ] = await Promise.all([
            thisMonthProductsPromise,
            thisMonthUsersPromise,
            thisMonthOrdersPromise,
            lastMonthOrdersPromise,
            lastMonthProductsPromise,
            lastMonthUsersPromise,
            Product.countDocuments(),
            User.countDocuments(),
            Order.find({}).select("total"),
            lastSixMonthOrdersPromise,
            Product.distinct("category"),
            User.countDocuments({ gender: "female" }),
            latestTransactionPromise
        ])


        const thisMonthRevenue = thisMonthOrders.reduce((total: any, order: any) => total + (order.total || 0), 0);
        const lastMonthRevenue = lastMonthOrders.reduce((total: any, order: any) => total + (order.total || 0), 0);


        // getPercentage Object
        const percentageChange = {
            revenue: calculatedPercentage(thisMonthRevenue, lastMonthRevenue),
            user: calculatedPercentage(thisMonthUsers.length, lastMonthUsers.length),
            product: calculatedPercentage(thisMonthProducts.length, lastMonthProducts.length),
            order: calculatedPercentage(thisMonthOrders.length, lastMonthOrders.length),
        }

        // Total Revenue Calculate
        const revenue = allOrders.reduce((total: any, orders: any) => {
            return total + (orders.total || 0)
        }, 0)

        // SIX MONTH ORDER REVENUE
        const orderMonthCounts = new Array(6).fill(0);
        const orderMonthyRevenue = new Array(6).fill(0);

        // getLastSixMonthRevenue
        lastSixMonthOrders.forEach((order: any) => {
            const creationDate = order.createdAt;
            const monthDiff = today.getMonth() - creationDate.getMonth();

            if (monthDiff < 6) {
                orderMonthCounts[6 - monthDiff - 1] += 1;
                orderMonthyRevenue[6 - monthDiff - 1] += order.total;
            }
        })

        // INVENTORY  (CATEGORY COUNT)
        const categoryCountPromise = productCategory.map((category) => {
            return Product.countDocuments({ category })
        });

        const categoriesCount = await Promise.all(categoryCountPromise)

        const categoryCounts: Record<string, number>[] = [];

        productCategory.forEach((category, i) => {
            categoryCounts.push({ [category]: Math.round(categoriesCount[i] / productCount * 100) })
        })

        // MALE FEMALE COUNT
        const userRatio = {
            male: userCount - femaleUser,
            female: femaleUser
        }

        //modifyTransaction
        const modifyTransaction = latestTransaction.map((i) => (
            {
                _id: i._id,
                discount: i.discount,
                amount: i.total,
                quantity: i.orderItems.length,
                status: i.status,
            }
        ))

        // Stats
        stats = {
            percentageChange,
            categoryCounts,
            userRatio,
            latestTransaction: modifyTransaction,
            count: {
                revenue: revenue,
                user: userCount,
                product: productCount,
                order: allOrders.length
            },
            chart: {
                order: orderMonthCounts,
                revenue: orderMonthyRevenue
            }
        }

        nodeCache.set("admin-stats", JSON.stringify(stats));
    }

    return res.status(200).json({
        success: true,
        stats,
        message: "State Fetched Successfully",
    });
})

// getPie
export const getPie = TryCatch(async (req, res, next) => {
    return res.status(200).json({
        success: true,
        message: "Pie Fetched Successfully",
    });
})

// getBar
export const getBar = TryCatch(async (req, res, next) => {
    return res.status(200).json({
        success: true,
        message: "Bar Fetched Successfully",
    });
})

// getLine
export const getLine = TryCatch(async (req, res, next) => {
    return res.status(200).json({
        success: true,
        message: "Line Fetched Successfully",
    });
})