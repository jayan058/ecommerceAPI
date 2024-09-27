import express from "express";
import * as authController from "../controller/auth";
import { validateBody } from "../middleware/validation";
import * as userSchema from "../schema/user";

const authRoute = express();

authRoute.post(
  "/",
  validateBody(userSchema.loginUserSchema),
  authController.login,
);
export default authRoute;
