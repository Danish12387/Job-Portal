import jwt from 'jsonwebtoken';
export const generateToken = (res, user) => {
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    const cookieOptions = {
        httpOnly: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 24 * 60 * 60 * 1000,
    };
    res.cookie("token", token, cookieOptions);
    return token;
};
