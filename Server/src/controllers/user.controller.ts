import { Request, Response } from "express";
import { User } from "../models/user.model";
import { generateToken } from "../utils/generateToken";

export const signup = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            })
        }
        user = await User.create(req.body);
        generateToken(res, user);

        const userWithouPassword = await User.findOne({ email }).select("-password");
        res.status(201).json({
            success: true,
            message: "User Registered Successfully",
            user: userWithouPassword
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Incorrect email or password"
            })
        }

        const isPasswordMatch = user.comparePassword(password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Incorrect email or password"
            })
        }
        generateToken(res, user);
        user.lastLogin = new Date();
        await user.save();

        const userWithouPassword = await User.findOne({ email }).select("-password");
        return res.status(200).json({
            success: true,
            message: `Welcome back ${user.fullname}`,
            user: userWithouPassword
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const logout = (_: Request, res: Response) => {
    try {
        return res.clearCookie("token").status(200).json({
            success: true,
            message: "Logged out successfully",
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const checkAuth = async (req: Request, res: Response) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        return res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}