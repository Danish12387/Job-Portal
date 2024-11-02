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

        const filters = JSON.parse(req.query.filters as string);
        console.log(filters);

        const limit = 6;

        const skip = (page - 1) * limit;

        const query: any = {};
        const now = new Date();

        // if (filters.location === 'near-me') {
        //     query.jobLocationCity = 'near-me';
        // } else if (filters.location === 'remote') {
        //     query.jobType = 'Remote';
        // }

        if (filters.time === 'last-24-hours') {
            query.createdAt = { $gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) };
        } else if (filters.time === 'last-7-days') {
            query.createdAt = { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) };
        }

        if (filters.salary) {
            query.salary = filters.salary;
        }

        if (filters.workExperience) {
            query.workExperience = filters.workExperience;
        }

        if (filters.selectedJobTypes && filters.selectedJobTypes.length > 0) {
            query.jobType = { $in: filters.selectedJobTypes };
        }

        if (filters.searchInputs?.search) {
            query.jobTitle = new RegExp(filters.searchInputs.search, 'i');
        }
        if (filters.searchInputs?.location) {
            query.jobLocationCity = new RegExp(filters.searchInputs.location, 'i');
        }

        const sort = filters.selectValue === 'date' ? { createdAt: -1 } : {};

        const jobs = await Job.find(query)
            // .sort(sort)
            .skip(skip)
            .limit(filters.pageSize);

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
