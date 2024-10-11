import { Response } from "express";
import { IUserDocument } from "../models/user.model";
import jwt from 'jsonwebtoken';

export const generateToken = (res: Response, user: IUserDocument) => {
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!);
    res.cookie("token", token, { httpOnly: true, sameSite: 'strict' })
    return token;
}