import { Request, Response } from "express";
import { Job } from "../models/job.model";

export const createJob = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const job = await Job.create(data);
        return res.status(201).json({
            success: true,
            message: "Job created successfully",
            job
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getAllJobs = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;

        const limit = 6;

        const skip = (page - 1) * limit;

        const jobs = await Job.find()
            .sort({ createdAt: -1 })
            // .skip(skip)
            // .limit(limit);

        const totalJobs = await Job.countDocuments();

        return res.status(200).json({
            success: true,
            message: "Fetched jobs successfully",
            jobs: jobs,
            currentPage: page,
            totalPages: Math.ceil(totalJobs / limit),
            totalJobs: totalJobs,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};


export const getSingleJob = async (req: Request, res: Response) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId);

        return res.status(200).json({
            success: true,
            message: "Job fetched successfully",
            job: job,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
