const express = require('express');
require("dotenv").config();
const db = require('./config/mongodb');
//creating a server
const app = express();
const authRoutes = require("./routes/auth");
const todoRoutes = require("./routes/todo");
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use("/api/v1/auth" , authRoutes);//https://todo-backend-mza6.onrender.com
app.use("/api/v1/todo",todoRoutes);

app.get("/health" , (req,res)=>{
    res.json({
        service : "Todo task listing server",
        status : "Active",
        time : new Date(),
    })
})

const PORT = process.env.PORT || 5000;
app.listen(PORT , ()=>{
    console.log(`Server is up and running at PORT ${PORT}`);
})