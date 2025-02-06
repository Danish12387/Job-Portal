import { User } from "../../models/user.model.js";
import { generateToken } from "../../utils/generateToken.js";
import getDataUri from "../../utils/datauri.js";
import cloudinary from "../../utils/cloudinary.js";
import connectDB from "../../config/db.js";
export default async function handler(req, res) {
    const { action } = req.query;
    await connectDB();
    if(req.method === "GET") {
        return res.status(405).json({ error: "This is get method" });
    }
    if (req.method === "POST") {
        if (action === "signup") {
            try {
                const { email } = req.body;
                let user = await User.findOne({ email });
                if (user) {
                    return res.status(400).json({
                        success: false,
                        message: "Email already exists"
                    });
                }
                user = await User.create(req.body);
                generateToken(res, user);
                const userWithouPassword = await User.findOne({ email }).select("-password");
                res.status(201).json({
                    success: true,
                    message: "Account Registered",
                    user: userWithouPassword
                });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: "Internal Server Error" });
            }
        }
        if (action === "login") {
            try {
                const { email, password } = req.body;
                const user = await User.findOne({ email });
                if (!user) {
                    return res.status(400).json({
                        success: false,
                        message: "Incorrect email or password"
                    });
                }
                const isPasswordMatch = user.comparePassword(password);
                if (!isPasswordMatch) {
                    return res.status(400).json({
                        success: false,
                        message: "Incorrect email or password"
                    });
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
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: "Internal Server Error" });
            }
        }
    }
    return res.status(405).json({ error: "Method not allowed" });
}
export const signup = async (req, res) => {
    try {
        const { email } = req.body;
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }
        user = await User.create(req.body);
        generateToken(res, user);
        const userWithouPassword = await User.findOne({ email }).select("-password");
        res.status(201).json({
            success: true,
            message: "Account Registered",
            user: userWithouPassword
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Incorrect email or password"
            });
        }
        const isPasswordMatch = user.comparePassword(password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Incorrect email or password"
            });
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
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
export const logout = (_, res) => {
    try {
        return res.clearCookie("token", { path: '/' }).status(200).json({
            success: true,
            message: "Logged out",
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
export const checkAuth = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        return res.status(200).json({
            success: true,
            user
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
export const getUserDetails = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).select("-password").populate({ path: 'jobs', options: { sort: { createdAt: -1 }, limit: 3 } }).populate({ path: 'posts', options: { sort: { createdAt: -1 }, limit: 3 }, populate: { path: 'author', select: 'fullname profilePicture' } });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                user: user
            });
        }
        return res.status(200).json({
            success: true,
            user
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
export const editProfile = async (req, res) => {
    try {
        const { fullname, headline, country, city, websiteLink, linkText, } = req.body;
        const userId = req.id;
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                user: user
            });
        }
        if (headline)
            user.headline = headline;
        if (websiteLink)
            user.websiteLink = websiteLink;
        if (linkText)
            user.linkText = linkText;
        user.fullname = fullname;
        user.country = country;
        user.city = city;
        await user.save();
        return res.status(200).json({
            success: true,
            message: "Profile updated",
            user
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
export const editProfileAbout = async (req, res) => {
    try {
        const { about } = req.body;
        const userId = req.id;
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                user: user
            });
        }
        if (about)
            user.about = about;
        await user.save();
        return res.status(200).json({
            success: true,
            message: "About updated",
            user
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
export const editHobbies = async (req, res) => {
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
            });
        }
        if (hobbies)
            user.hobbies = hobbies;
        await user.save();
        return res.status(200).json({
            success: true,
            message: "Hobbies added",
            user
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
export const editAdditionalDetails = async (req, res) => {
    try {
        const { languages, pronouns, nickname, workHistory, education } = req.body;
        const userId = req.id;
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                user: user
            });
        }
        if (languages) {
            user.languages = languages;
        }
        else {
            user.languages = [];
        }
        if (workHistory) {
            user.workHistory = workHistory;
        }
        else {
            user.workHistory = [];
        }
        if (pronouns) {
            user.pronouns = pronouns;
        }
        else {
            user.pronouns = '';
        }
        if (nickname) {
            user.nickname = nickname;
        }
        else {
            user.nickname = '';
        }
        if (nickname) {
            user.nickname = nickname;
        }
        else {
            user.nickname = '';
        }
        if (education) {
            user.education = education;
        }
        else {
            user.education = '';
        }
        await user.save();
        return res.status(200).json({
            success: true,
            message: "Profile updated",
            user
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
export const editProfilePic = async (req, res) => {
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
        }
        ;
        if (cloudResponse && user) {
            user.profilePicture = cloudResponse.secure_url;
        }
        else {
            user.profilePicture = '';
        }
        await user.save();
        return res.status(200).json({
            success: true,
            message: "Profile picture updated",
            user
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
export const deleteProfilePic = async (req, res) => {
    try {
        const userId = req.id;
        const { publicId } = req.body;
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({
                message: 'User not found.',
                success: false
            });
        }
        ;
        if (!publicId) {
            return res.status(400).json({ success: false, message: 'Public ID is required' });
        }
        const cloudResponse = await cloudinary.uploader.destroy(publicId);
        if (cloudResponse && user) {
            user.profilePicture = '';
        }
        else {
            throw new Error('cloudinary error');
        }
        await user.save();
        return res.status(200).json({
            success: true,
            message: "Profile picture deleted",
            user
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
export const editProfileBanner = async (req, res) => {
    try {
        const userId = req.id;
        const profileBanner = req.file;
        let cloudResponse;
        if (profileBanner) {
            const fileUri = getDataUri(profileBanner);
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
        }
        ;
        if (cloudResponse && user) {
            user.profileBanner = cloudResponse.secure_url;
        }
        else {
            user.profileBanner = '';
        }
        await user.save();
        return res.status(200).json({
            success: true,
            message: "Profile banner updated",
            user
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
export const deleteProfileBanner = async (req, res) => {
    try {
        const userId = req.id;
        const { publicId } = req.body;
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({
                message: 'User not found.',
                success: false
            });
        }
        ;
        if (!publicId) {
            return res.status(400).json({ success: false, message: 'Public ID is required' });
        }
        const cloudResponse = await cloudinary.uploader.destroy(publicId);
        if (cloudResponse && user) {
            user.profileBanner = '';
        }
        else {
            throw new Error('cloudinary error');
        }
        await user.save();
        return res.status(200).json({
            success: true,
            message: "Profile banner deleted",
            user
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
export const getUserJobs = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User doesn't exists",
            });
        }
        const userJobs = await User.findById(userId).select('jobs').populate({ path: 'jobs', options: { sort: { createdAt: -1 } } });
        return res.status(200).json({
            success: true,
            message: "User jobs fetched",
            userJobs: userJobs,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
export const getSuggestedUsers = async (req, res) => {
    try {
        const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password");
        if (!suggestedUsers) {
            return res.status(400).json({
                message: 'Currently do not have any users',
            });
        }
        ;
        return res.status(200).json({
            success: true,
            message: "Users fetched",
            suggestedUsers,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
