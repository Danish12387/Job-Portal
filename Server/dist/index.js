import express from "express";
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from "./config/db.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.route.js";
import jobRoutes from "./routes/job.route.js";
import postRoutes from "./routes/post.route.js";
import { Job } from "./models/job.model.js";
import errorMiddleware from "./middlewares/error.middleware.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json());
app.use(cookieParser());
app.use(errorMiddleware);

const corsOptions = {
    origin: ["http://localhost:3000", "http://localhost:5173", "https://job-portal-alpha-weld.vercel.app/"],
    credentials: true
};
app.use(cors(corsOptions));
app.get('/', async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 }).limit(6);
        return res.status(200).json({
            success: true,
            message: "Jobs fetched successfully",
            homeJobs: jobs
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/job", jobRoutes);
app.use("/api/v1/post", postRoutes);
app.listen(PORT, () => {
    connectDB();
    console.log(`Server listen at port ${PORT}`);
});
export default app;
