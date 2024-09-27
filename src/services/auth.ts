import * as userModels from "../models/User";
import jwt from "jsonwebtoken";
import { verify } from "jsonwebtoken";
import { Response } from "express";
import NotFoundError from "../error/notFoundError";
import UnauthorizedError from "../error/unauthorizedError";
const { sign } = jwt;
const bcrypt = require("bcrypt");
import config from "../config";
import ForbiddenError from "../error/forbiddenError";
import { StatusCodes } from "http-status-codes";

let refreshTokens: string[] = [];
export async function login(email: string, password: string, res: Response) {
  const userExists = await userModels.UserModel.findByEmail(email);
  if (userExists.length == 0) {
    throw new NotFoundError("No Matching Email");
  }
  const match = await bcrypt.compare(password, userExists[0].password);
  if (!match) {
    throw new UnauthorizedError("Passwords Don't Match");
  }
  let permissionsOfUser = (
    await userModels.UserModel.findUserPermission(email)
  ).map((obj) => obj.name);

  let payload = {
    id: userExists[0].id,
    name: userExists[0].userName,
    email: userExists[0].email,
    permissions: permissionsOfUser,
  };
  const accessToken = sign(payload, config.jwt.jwt_secret!, {
    expiresIn: config.jwt.accessTokenExpiryMS,
  });
  const refreshToken = sign(payload, config.jwt.jwt_secret!, {
    expiresIn: config.jwt.refreshTokenExpiryMS,
  });
  refreshTokens.push(refreshToken);
  res.status(StatusCodes.OK).json({
    accessToken: accessToken,
    refreshToken: refreshToken,
  });
}
