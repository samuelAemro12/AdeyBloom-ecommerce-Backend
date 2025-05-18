import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;


app.listen(PORT,(req,res)=>{
    console.log(`Server is running on port ${PORT}`);   
});