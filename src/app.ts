import express from 'express';
import cors from 'cors';
import morgan from 'morgan'
import NodeCache from 'node-cache';

import userRoute from './routes/user.route.js';
import productRoute from './routes/product.route.js';
import orderRoute from './routes/order.route.js';
import paymentRoute from './routes/payment.route.js';
import dashboardRoute from './routes/dashboard.routes.js';

import { errorMiddleware } from './middlewares/error.middleware.js';
import Stripe from 'stripe';
import { config } from 'dotenv';

config({
    path: "./.env"
})

const stripeKey = process.env.STRIPE_API_KEY|| "";
export const app = express();
export const stripe = new Stripe(stripeKey);
export const nodeCache = new NodeCache();

app.get('/', (req, res) => {
    res.send("API Working");
})

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/dashboard", dashboardRoute);

app.use("/uploads", express.static("uploads"));

app.use(errorMiddleware);