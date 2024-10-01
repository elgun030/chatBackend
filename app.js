import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { app, server } from './socket.js';

// Routes
import AuthRouter from './routes/auth.routes.js';
import ChatRouter from './routes/chat.routes.js';
import UsersRouter from './routes/users.routes.js';
import { protectRoutes } from './middlewares/protectRoutes.js';

dotenv.config();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'https://chat-frontend-main.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use("/auth", AuthRouter);
app.use(protectRoutes);
app.use("/messages", ChatRouter);
app.use("/users", UsersRouter);

server.listen(process.env.PORT, () => {
    console.log("Server listening on port " + process.env.PORT)
});

mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log("Database connection established"))
    .catch(err => console.error("Database connection failed", err))