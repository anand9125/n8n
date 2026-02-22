import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export default function authentication(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "Missing token. Please log in." });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_KEY as string);
    (req as any).user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Cookie expired. Kindly re-login." });
  }
}