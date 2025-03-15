import mongoose, { Types } from "mongoose";
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
export const Post = mongoose.model("posts", postSchema);
