import { app } from "./app.js";
import { config } from "dotenv";
import connectDB from "./db/db.js";
import { error } from "console";

config({
    path: "./.env"
})

connectDB().then(() => {
    app.on("error", (error) => {
        console.log("ERROR :", error);
    });
    app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    });
}).catch((error) => {
    console.log("MONGO db connection failed !!! ", error);
})