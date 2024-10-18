import { Response, CookieOptions } from "express";
import { IUserDocument } from "../models/user.model";
import jwt from 'jsonwebtoken';

export const generateToken = (res: Response, user: IUserDocument) => {
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '1d' });

    const cookieOptions: CookieOptions = {
        httpOnly: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 24 * 60 * 60 * 1000,
    };

    res.cookie("token", token, cookieOptions)
    return token;
}