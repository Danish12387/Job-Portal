import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import sharp from "sharp";
export const createPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const image = req.file;
        const authorId = req.id;
        let cloudResponse;
        if (!image && !caption)
            return res.status(400).json({
                success: false,
                message: "Post cannot be empty"
            });
        if (image) {
            const optimizedImageBuffer = await sharp(image?.buffer)
                .resize({ width: 800, height: 800, fit: 'inside' })
                .toFormat('jpeg', { quality: 80 })
                .toBuffer();
            const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
            // const fileUri = getDataUri(image);
            if (fileUri) {
                cloudResponse = await cloudinary.uploader.upload(fileUri);
            }
        }
        let post = await Post.create({
            caption,
            image: cloudResponse?.secure_url,
            author: new mongoose.Types.ObjectId(authorId)
        });
        await User.findByIdAndUpdate(authorId, {
            $push: { posts: post._id }
        });
        return res.status(201).json({
            success: true,
            message: "Post created",
            post
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
export const getAllPost = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 6;
        const skip = (page - 1) * limit;
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate({ path: 'author', select: 'fullname profilePicture headline' });
        const totalPosts = await Post.countDocuments(posts);
        return res.status(200).json({
            success: true,
            posts,
            currentPage: page,
            totalPages: Math.ceil(totalPosts / limit),
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
export const likePostHandler = async (req, res) => {
    try {
        const userId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post)
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        if (post.likes.some(like => like.toString() === userId.toString())) {
            await post.updateOne({ $pull: { likes: userId } });
        }
        else {
            await post.updateOne({ $addToSet: { likes: userId } });
        }
        await post.save();
        return res.status(200).json({
            success: true,
            message: "Post liked",
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
