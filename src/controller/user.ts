import { Request, Response, NextFunction } from "express";
import * as userServices from "../services/user";
import { log } from "console";
export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userName, email, password } = req.body;
    const newUser = await userServices.createUser(userName, email, password);
    res.json({ newUser, message: "User created successfully." });
  } catch (error) {
    next(error);
  }
}
