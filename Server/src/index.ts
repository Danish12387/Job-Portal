import express from "express";
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from "./config/db";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.route";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json());
app.use(cookieParser());
const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true
}
app.use(cors(corsOptions));

app.get('/', (req, res) => {
    res.status(200).json({
        message: "Welcome to the API"
    })
})

app.use("/api/v1/user", userRoutes)

app.listen(PORT, () => {
    connectDB();
    console.log(`Server listen at port ${PORT}`);
})