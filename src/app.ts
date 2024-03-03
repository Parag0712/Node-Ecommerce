import express from 'express';
import cors from 'cors';
import morgan from 'morgan'
import NodeCache from 'node-cache';

import userRoute from './routes/user.route.js';
import productRoute from './routes/product.route.js';
import orderRoute from './routes/order.route.js';

import { errorMiddleware } from './middlewares/error.middleware.js';

export const app = express();
export const nodeCache = new NodeCache();

app.get('/', (req, res) => {
    res.send("Hello Baccho");
})

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);

app.use("/uploads", express.static("uploads"));

app.use(errorMiddleware);