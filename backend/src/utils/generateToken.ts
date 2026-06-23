import jwt from 'jsonwebtoken';

export const generateToken = (userId: string): string => {

    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES || "7d";

    if(!secret){
        throw new Error("JWT_SECRET is not defined");
    }

    return jwt.sign(
        { id: userId },
        secret,
        { expiresIn: expiresIn } as jwt.SignOptions
    );
};