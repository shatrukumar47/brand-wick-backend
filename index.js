const express = require("express");
const cors = require("cors");
const { connection } = require("./db");
const { userRoute } = require("./app/routes/userRoute");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());
app.use("/user", userRoute);

app.get("/", (req, res)=>{
    res.send("Welcome to Brand Wick Backend")
})

app.listen(PORT, async ()=>{
    try {
        await connection;
        console.log(`Server is live at Port ${PORT}`);
        console.log("Connected to DB")
    } catch (error) {
        console.log(error)
    }
})