import express from "express";
import type { Request, Response, Router } from "express";
import { prismaClient } from "@repo/db/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const signInRouter: Router = express.Router();

async function signInRouterFunction(req: Request, res: Response) {
  const email = req.body.email;
  const password = req.body.password;

  const foundUser = await prismaClient.user.findUnique({
    where: { email },
  });

  if (foundUser) {
    try {
      const passwordMatch = await bcrypt.compare(password, foundUser.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid Password" });
      }
      const token = jwt.sign(
        { id: foundUser.id, email: foundUser.email },
        process.env.JWT_KEY as string
      );
      return res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
        })
        .status(200)
        .json({ message: "Signed in successfully" });
    } catch (e) {
      console.error("Sign-in error:", e);
      return res.status(500).json({ message: "Error during sign-in" });
    }
  }

  return res.status(400).json({ message: "Kindly Sign Up first" });
}

signInRouter.post("/", signInRouterFunction);

export default signInRouter;