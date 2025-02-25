import mongoose, { Document, Model, Types } from "mongoose";
import bcrypt from 'bcryptjs';

interface IUser {
    fullname: string;
    email: string;
    password: string;
    city: string;
    country: string;
    userRole: string;
    lastLogin?: Date;
    jobs?: Types.ObjectId[],
    posts?: Types.ObjectId[],
    headline?: string,
    websiteLink?: string,
    linkText?: string,
    about?: string,
    hobbies?: string[],
    languages?: string[];
    pronouns?: string;
    nickname?: string;
    workHistory?: string[];
    education?: string;
    profilePicture?: string;
    profileBanner?: string;
}

export interface IUserDocument extends IUser, Document {
    createdAt: Date;
    updatedAt: Date;
    comparePassword(password: string): boolean;
}

const userSchema = new mongoose.Schema<IUserDocument>({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        default: ''
    },
    profileBanner: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    userRole: {
        type: String,
        required: true
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    jobs: [
        {
            type: Types.ObjectId,
            ref: 'jobs'
        }
    ],
    posts: [
        {
            type: Types.ObjectId,
            ref: 'posts'
        }
    ],
    headline: {
        type: String,
        default: ''
    },
    websiteLink: {
        type: String,
        default: ''
    },
    linkText: {
        type: String,
        default: ''
    },
    about: {
        type: String,
        default: ''
    },
    hobbies: {
        type: [String],
        default: []
    },
    languages: {
        type: [String],
        default: []
    },
    pronouns: {
        type: String,
        default: ''
    },
    nickname: {
        type: String,
        default: ''
    },
    workHistory: {
        type: [String],
        default: []
    },
    education: {
        type: String,
        default: ''
    },
}, { timestamps: true });

userSchema.pre('save', function (next) {
    const user = this;
    if (user.isModified('password')) {
        const salt = bcrypt.genSaltSync(10);
        const hashedPass = bcrypt.hashSync(user.password, salt);
        user.password = hashedPass;
    }
    next();
})

userSchema.methods.comparePassword = function (password: string) {
    const user = this;
    return bcrypt.compareSync(password, user.password);
}

export const User: Model<IUserDocument> = mongoose.model<IUserDocument>('users', userSchema);