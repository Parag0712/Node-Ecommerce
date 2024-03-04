import { Product } from "../models/product.model.js";

export const calculatedPercentage = (thisMonth: number, lastMonth: number) => {
    if (lastMonth === 0) return thisMonth * 100;
    const percentage = (thisMonth / lastMonth) * 100;
    return Number(percentage.toFixed(0))
}

export const getInventories = async ({ categories, productsCount }: {
    categories: string[];
    productsCount: number;
}) => {
    console.log(categories);

    const categoryCountPromise = categories.map((category) => {
        return Product.countDocuments({ category })
    });

    const categoriesCount = await Promise.all(categoryCountPromise)

    const categoryCounts: Record<string, number>[] = [];

    categories.forEach((category, i) => {
        categoryCounts.push({ [category]: Math.round(categoriesCount[i] / productsCount * 100) })
    })
    return categoryCounts;
}



export const getChartData = ({
    length,
    docArr,
    today,
    property,
}: {
    length: number;
    docArr: any;
    today: Date;
    property?: "discount" | "total";
}) => {
    const data: number[] = new Array(length).fill(0);

    docArr.forEach((i:any) => {
        // Extract relevant properties from Document object
        const { createdAt } = i;
        const creationDate = new Date(createdAt); // Ensure createdAt is a Date object
        const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;

        if (monthDiff < length) {
            if (property) {
                data[length - monthDiff - 1] += i[property] ?? 0; // Use optional chaining and nullish coalescing
            } else {
                data[length - monthDiff - 1] += 1;
            }
        }
    });

    return data;
};