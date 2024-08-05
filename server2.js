

import express from "express";
import https from 'https'
import bodyParser from 'body-parser';
import storage from 'node-persist'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from "dotenv"
import connectMongoDB from './db/index.js';
import authorModel from "./models/usermodel.js";
import userRouter from './routes/userRoutes.js'
import articleRouter from './routes/articleRoutes.js'

const app = express()
dotenv.config();


app.use(cors());
app.use(express.static("public"))
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json())


app.use(articleRouter)
app.use(userRouter)


connectMongoDB()
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is listenning on port ${process.env.PORT}`)
    })
})
.catch((err) => {
    console.log(err)
})



storage.init();





