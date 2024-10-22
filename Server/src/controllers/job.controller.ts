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

export const getAllJobs = async (_: Request, res: Response) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Fetched jobs successfully",
            jobs: jobs,
            count: jobs.length,
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
