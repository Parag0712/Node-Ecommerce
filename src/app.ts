import express from 'express';
import cors from 'cors';
import morgan from 'morgan'
export const app = express();


app.get('/', (req, res) => {
    res.send("Hello Baccho");
})

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(errorMiddleware);

// User Route
import userRoute from './routes/user.route.js';
import ApiError, { errorMiddleware } from './middlewares/error.middleware.js';
app.use("/api/v1/user", userRoute);