import mongoose, { Document, Model, Types } from "mongoose";

interface IComment {
    text: string;
    author: Types.ObjectId;
    post: Types.ObjectId;
}

export interface ICommentDocument extends IComment, Document {
    createdAt: Date;
    updatedAt: Date;
}

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    author: {
        type: Types.ObjectId,
        ref: 'users',
    },
    post: {
        type: Types.ObjectId,
        ref: 'posts',
    }
}, { timestamps: true });

export const Comment: Model<ICommentDocument> = mongoose.model<ICommentDocument>("comments", commentSchema);