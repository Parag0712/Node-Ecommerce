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


// User Route
import userRoute from './routes/user.route.js';
app.use("/api/v1/user", userRoute);