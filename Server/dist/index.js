import express from "express";
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import connectDB from './config/db.js';
import userRoutes from "./routes/user.route.js";
import jobRoutes from "./routes/job.route.js";
import postRoutes from "./routes/post.route.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json());
app.use(cookieParser());
const corsOptions = {
    origin: ["http://localhost:3000", "http://localhost:5173", "https://job-portal-alpha-weld.vercel.app/"],
    credentials: true
};
app.use(cors(corsOptions));
app.get('/', (req, res) => {
    res.status(200).json({
        message: "Welcome to the API"
    });
});
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/job", jobRoutes);
app.use("/api/v1/post", postRoutes);
app.listen(PORT, () => {
    connectDB();
    console.log(`Server listen at port ${PORT}`);
});