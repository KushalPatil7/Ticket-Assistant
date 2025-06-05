import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
const app=express()
app.use(cors());
app.use(express.json());
const PORT=process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
    .then(() => { 
        console.log('Connected to MongoDB');
        app.listen(PORT,()=>{
            console.log(`Server is running on port ${PORT}`);
        })
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });
