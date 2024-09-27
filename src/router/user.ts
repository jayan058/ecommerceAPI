import express from "express";
import * as userController from "../controller/user";
import { validateBody } from "../middleware/validation";
import * as userSchema from "../schema/user";

const userRoute = express();

userRoute.post(
  "/",
  validateBody(userSchema.createUserSchema),
  userController.createUser,
);

export default userRoute;
