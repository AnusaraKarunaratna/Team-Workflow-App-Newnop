import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export const protect = (req: Request, res: Response, next: NextFunction) => {
    try {
        const auth = req.headers.authorization;

        if (!auth || !auth.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token" });
        }

        const token = auth.split(" ")[1];

        // Ensure token exists to resolve 'string | undefined' TS error
        if (!token) {
            return res.status(401).json({ message: "Malformed authorization header" });
        }

        const secret = process.env.JWT_SECRET;

        if (typeof secret !== "string") {
            return res.status(500).json({ message: "JWT secret not configured" });
        }

        // token is now safely narrowed to 'string'
        const decoded = jwt.verify(token, secret) as JwtPayload;

        req.user = {
            id: decoded.id as string
        };

        next();

    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
};