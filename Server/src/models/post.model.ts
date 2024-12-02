import mongoose, { Document, Model, Types } from "mongoose";

interface IPost {
    caption: string;
    image: string;
    author: Types.ObjectId;
    likes: Types.ObjectId[];
    comments: Types.ObjectId[];
}

export interface IPostDocument extends IPost, Document {
    createdAt: Date;
    updatedAt: Date;
}

const postSchema = new mongoose.Schema({
    caption: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: ''
    },
    author: {
        type: Types.ObjectId,
        ref: "users"
    },
    likes: [
        {
            type: Types.ObjectId,
            ref: "users"
        }
    ],
    comments: [
        {
            type: Types.ObjectId,
            ref: "comments"
        }
    ],
}, { timestamps: true });

export const Post: Model<IPostDocument> = mongoose.model<IPostDocument>("posts", postSchema);