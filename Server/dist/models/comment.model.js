import mongoose, { Types } from "mongoose";
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
export const Comment = mongoose.model("comments", commentSchema);
