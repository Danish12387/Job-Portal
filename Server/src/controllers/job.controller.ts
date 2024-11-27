import { Request, Response } from "express";
import { Job } from "../models/job.model";
import mongoose from "mongoose";
import { User } from "../models/user.model";

export const createJob = async (req: Request, res: Response): Promise<any> => {
    try {
        const data = req.body;
        const authorId = req.id;
        const job = await Job.create({
            ...data,
            author: new mongoose.Types.ObjectId(authorId),
        });

        await User.findByIdAndUpdate(authorId, {
            $push: { jobs: job._id },
        });

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

export const updateJob = async (req: Request, res: Response): Promise<any> => {
    try {
        const data = req.body;
        const jobId = req.params.id;

        const job = await Job.findByIdAndUpdate(jobId, data, { new: true });

        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Job updated successfully",
            job
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getAllJobs = async (req: Request, res: Response): Promise<any> => {
    try {
        const page = parseInt(req.query.page as string) || 1;

        const filters = JSON.parse(req.query.filters as string);

        const limit = 6;

        const skip = (page - 1) * limit;

        const query: any = {};
        const now = new Date();

        if (filters.location !== 'all') {
            if (filters.location === 'Remote') {
                query.jobType = 'Remote';
            } else {
                query.jobLocationCity = filters.location;
            }
        }

        if (filters.time === 'last-24-hours') {
            query.createdAt = { $gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) };
        } else if (filters.time === 'last-7-days') {
            query.createdAt = { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) };
        }

        if (filters.salary && filters.salary !== 'all') {
            query.salary = filters.salary;
        }

        if (filters.workExperience && filters.workExperience !== 'any') {
            query.workExperience = filters.workExperience;
        }

        if (filters.selectedJobTypes && filters.selectedJobTypes.length > 0 && !filters.selectedJobTypes.includes('')) {
            query.jobType = { $in: filters.selectedJobTypes };
        }

        if (filters.searchInputs?.search) {
            query.jobTitle = new RegExp(filters.searchInputs.search, 'i');
        }

        if (filters.searchInputs?.location) {
            query.jobLocationCity = new RegExp(filters.searchInputs.location, 'i');
        }

        const sort: any = filters.selectValue === 'date' ? { createdAt: -1 } : {};

        const jobs = await Job.find(query)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .populate({ path: 'author', select: '-password' });

        const totalJobs = await Job.countDocuments(query);

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

export const getJobs = async (_: Request, res: Response): Promise<any> => {
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
}

export const getSingleJob = async (req: Request, res: Response): Promise<any> => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({ path: 'author', select: '-password' });

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

export const getSearchedJobs = async (req: Request, res: Response): Promise<any> => {
    try {
        const query = req.query.q as string;
        const searchFilter = {
            jobTitle: { $regex: query, $options: 'i' }
        };
        const jobs = await Job.find(searchFilter);
        return res.status(200).json({
            success: true,
            message: "Jobs fetched successfully",
            job: jobs || { jobTitle: 'No results found.' }
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}