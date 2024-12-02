import { Request, Response } from "express";
import getDataUri from "../utils/datauri";
import cloudinary from "../utils/cloudinary";
import { Post } from "../models/post.model";
import mongoose from "mongoose";
import { User } from "../models/user.model";

export const createPost = async (req: Request, res: Response): Promise<any> => {
    try {
        const { caption } = req.body;
        const image = req.file;
        const authorId = req.id;
        let cloudResponse;

        if (!image && !caption) return res.status(400).json({
            success: false,
            message: "Post cannot be empty"
        })

        // const optimizedImageBuffer = await sharp(image.buffer)
        //     .resize({ width: 800, height: 800, fit: 'inside' })
        //     .toFormat('jpeg', { quality: 80 })
        //     .toBuffer();

        // const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;

        if (image) {
            const fileUri = getDataUri(image);
            if (fileUri) {
                cloudResponse = await cloudinary.uploader.upload(fileUri);
            }
        }

        let post;

        if (cloudResponse) {
            post = await Post.create({
                caption,
                image: cloudResponse.secure_url,
                author: new mongoose.Types.ObjectId(authorId)
            });

            await User.findByIdAndUpdate(authorId, {
                $push: { posts: post._id }
            });
        }

        return res.status(201).json({
            success: true,
            message: "Post created successfully",
            post
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}