import mongoose, { Document, Model } from "mongoose";
import bcrypt from 'bcryptjs';

interface IUser {
    fullname: string;
    email: string;
    password: string;
    city: string;
    country: string;
    lastLogin?: Date;
}

export interface IUserDocument extends IUser, Document {
    createdAt: Date;
    updatedAt: Date;
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
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    lastLogin: {
        type: Date,
        default: Date.now
    }
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
export const User: Model<IUserDocument> = mongoose.model<IUserDocument>('user', userSchema);