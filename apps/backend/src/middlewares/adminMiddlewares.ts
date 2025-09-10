import jwt from "jsonwebtoken";
import { JWT_SEC } from "../types/type";

export const adminMiddlewares = async (req: any, res: any, next: any) => {
    const token = req.headers.authorization;
    if (!token) {
        res.status(401).json({
            message: "No token provided"
        });
        return;
    }
    try {
        const decoded = jwt.verify(token, JWT_SEC);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({
            message: "Invalid token"
        });
    }
};