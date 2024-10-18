import mongoose, { Document, Model } from "mongoose";

interface IJob {
    companyName: string,
    websiteLink: string,
    jobTitle: string,
    jobLocationCountry: string,
    jobLocationCity: string,
    salaryRange: string,
    experience: string,
    qualification: string,
    applicationDeadline: string,
    jobDescription: string,
    jobCategory: string,
    jobType: string,
}

export interface IJobDocument extends IJob, Document {
    createdAt: Date;
    updatedAt: Date;
}

const jobSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    websiteLink: {
        type: String,
        required: true
    },
    jobTitle: {
        type: String,
        required: true
    },
    jobLocationCountry: {
        type: String,
        required: true
    },
    jobLocationCity: {
        type: String,
        required: true
    },
    salaryRange: {
        type: String,
        required: true
    },
    experience: {
        type: String,
        required: true
    },
    qualification: {
        type: String,
        required: true
    },
    applicationDeadline: {
        type: String,
        required: true
    },
    jobDescription: {
        type: String,
        required: true
    },
    jobCategory: {
        type: String,
        required: true
    },
    jobType: {
        type: String,
        required: true
    },
}, { timestamps: true });

export const Job: Model<IJobDocument> = mongoose.model<IJobDocument>('jobs', jobSchema);