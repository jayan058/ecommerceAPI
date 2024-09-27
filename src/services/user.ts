import bcrypt from "bcrypt";
import * as userModels from "../models/User";
import { BCRYPT_SALT_ROUNDS } from "../constants";
import ConflictError from "../error/conflictError";
export async function createUser(
  name: string,
  email: string,
  password: string,
) {
  if ((await userModels.UserModel.findByEmail(email)).length !== 0) {
    throw new ConflictError("Email already taken");
  }
  try {
    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    let data = await userModels.UserModel.create(name, email, hashedPassword);
    return data;
  } catch (error) {
    throw error;
  }
}
