import express from 'express';
import cors from 'cors';
import morgan from 'morgan'

import userRoute from './routes/user.route.js';

import { errorMiddleware } from './middlewares/error.middleware.js';

export const app = express();


app.get('/', (req, res) => {
    res.send("Hello Baccho");
})

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.use("/api/v1/users", userRoute);
app.use(errorMiddleware);
