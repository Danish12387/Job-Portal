import { Request, Response } from "express";
import { User } from "../models/user.model";
import { generateToken } from "../utils/generateToken";
import getDataUri from "../utils/datauri";
import cloudinary from "../utils/cloudinary";

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
        return res.clearCookie("token", { path: '/' }).status(200).json({
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

export const getUserDetails = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).select("-password").populate({ path: 'jobs' });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                user: user
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

export const editProfile = async (req: Request, res: Response) => {
    try {
        const { fullname, headline, country, city, websiteLink, linkText, } = req.body;
        const userId = req.id;
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                user: user
            })
        }

        if (headline) user.headline = headline;
        if (websiteLink) user.websiteLink = websiteLink;
        if (linkText) user.linkText = linkText;
        user.fullname = fullname;
        user.country = country;
        user.city = city;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const editProfileAbout = async (req: Request, res: Response) => {
    try {
        const { about } = req.body;
        const userId = req.id;
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                user: user
            })
        }

        if (about) user.about = about;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "About updated successfully",
            user
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const editHobbies = async (req: Request, res: Response) => {
    try {
        const { hobbies } = req.body;
        console.log(hobbies);
        const userId = req.id;
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                user: user
            })
        }

        if (hobbies) user.hobbies = hobbies;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Hobbies added successfully",
            user
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const editAdditionalDetails = async (req: Request, res: Response) => {
    try {
        const { languages, pronouns, nickname, workHistory, education } = req.body;
        const userId = req.id;
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                user: user
            })
        }

        if (languages) {
            user.languages = languages
        } else {
            user.languages = [];
        }

        if (workHistory) {
            user.workHistory = workHistory
        } else {
            user.workHistory = [];
        }

        if (pronouns) {
            user.pronouns = pronouns
        } else {
            user.pronouns = '';
        }

        if (nickname) {
            user.nickname = nickname
        } else {
            user.nickname = '';
        }

        if (nickname) {
            user.nickname = nickname
        } else {
            user.nickname = '';
        }

        if (education) {
            user.education = education
        } else {
            user.education = '';
        }

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const editProfilePic = async (req: Request, res: Response) => {
    try {
        const userId = req.id;
        const profilePicture = req.file;
        let cloudResponse;

        if (profilePicture) {
            const fileUri = getDataUri(profilePicture);
            if (fileUri) {
                cloudResponse = await cloudinary.uploader.upload(fileUri);
            }
        }
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({
                message: 'User not found.',
                success: false
            });
        };

        if (cloudResponse && user) {
            user.profilePicture = cloudResponse.secure_url;
        } else {
            user.profilePicture = '';
        }

        await user.save();
        return res.status(200).json({
            success: true,
            message: "Profile picture updated successfully",
            user
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}