import mongoose from "mongoose";
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
    workExperience: {
        type: String,
        required: true
    },
    salary: {
        type: String,
        required: true
    },
    requirements: {
        type: Array,
        required: true
    },
    responsibilities: {
        type: Array,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
}, { timestamps: true });
export const Job = mongoose.model('jobs', jobSchema);
