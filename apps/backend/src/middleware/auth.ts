import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../controller/user.controller.js";
import prisma from "../lib.js";

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const authHeader = req.headers.authorization as string | undefined;
		const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
		const token = bearerToken ?? (req as any).cookies?.access_token;

		if (!token) {
			 res.status(401).json({ message: "Unauthorized" });
			 return
		}

		const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

		const user = await prisma.user.findUnique({
			where: { id: decoded.id },
			select: { id: true, email: true },
		});

		if (!user) {
			 res.status(401).json({ message: "User not found" });
			 return
		}

		(req as any).user = user;
		 next();
	} catch (error) {
		 res.status(401).json({ message: "Invalid or expired token" });
		 return
	}
};