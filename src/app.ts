import express from 'express';
const app = express();

const port = process.env.PORT || 8000;
app.get('/', (req, res) => {
    res.send("Hello Baccho");
})

app.on("error", (error) => {
    console.log("ERROR :", error);
});

app.listen(port, () => {
    console.log(`⚙️ Server is running at port : ${port}`);
});