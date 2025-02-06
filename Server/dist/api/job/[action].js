import { Job } from "../../models/job.model.js";
import mongoose from "mongoose";
import { User } from "../../models/user.model.js";
export const createJob = async (req, res) => {
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
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
export const updateJob = async (req, res) => {
    try {
        const data = req.body;
        const jobId = req.params.id;
        const job = await Job.findByIdAndUpdate(jobId, data);
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }
        return res.status(200).json({
            success: true,
            message: "Job updated successfully",
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
export const deleteJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findByIdAndDelete(jobId);
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }
        return res.status(200).json({
            success: true,
            message: "Job deleted successfully",
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
export const deleteAllJobs = async (req, res) => {
    try {
        const jobIds = req.body;
        if (!Array.isArray(jobIds) || jobIds.length === 0) {
            return res.status(400).json({ success: false, message: "Invalid or empty job IDs array" });
        }
        const results = await Promise.allSettled(jobIds.map((id) => Job.findByIdAndDelete(id).catch((error) => {
            console.error(`Failed to delete job with ID ${id}:`, error);
            throw error;
        })));
        const failedJobs = results
            .filter((result) => result.status === "rejected")
            .map((_, idx) => jobIds[idx]);
        const successCount = results.length - failedJobs.length;
        return res.status(200).json({
            success: failedJobs.length === 0,
            message: failedJobs.length === 0
                ? "All jobs deleted successfully"
                : `Deleted ${successCount} jobs, but ${failedJobs.length} deletions failed`,
            failedJobs,
        });
    }
    catch (error) {
        console.error("Error in deleteAllJobs:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
export const getAllJobs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const filters = JSON.parse(req.query.filters);
        const limit = 6;
        const skip = (page - 1) * limit;
        const query = {};
        const now = new Date();
        if (filters.location !== 'all') {
            if (filters.location === 'Remote') {
                query.jobType = 'Remote';
            }
            else {
                query.jobLocationCity = filters.location;
            }
        }
        if (filters.time === 'last-24-hours') {
            query.createdAt = { $gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) };
        }
        else if (filters.time === 'last-7-days') {
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
        const sort = filters.selectValue === 'date' ? { createdAt: -1 } : {};
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
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
export const getJobs = async (_, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 }).limit(6);
        return res.status(200).json({
            success: true,
            message: "Jobs fetched successfully",
            homeJobs: jobs
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
export const getSingleJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({ path: 'author', select: '-password' });
        return res.status(200).json({
            success: true,
            message: "Job fetched successfully",
            job: job,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
export const getSearchedJobs = async (req, res) => {
    try {
        const query = req.query.q;
        const searchFilter = {
            jobTitle: { $regex: query, $options: 'i' }
        };
        const jobs = await Job.find(searchFilter);
        return res.status(200).json({
            success: true,
            message: "Jobs fetched successfully",
            job: jobs || { jobTitle: 'No results found.' }
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
