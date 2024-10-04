import { UserModel } from "../../../models/User";
import bcrypt from "bcrypt";

const BCRYPT_SALT_ROUNDS = 10;

export const createMockUser = async () => {
  const hashedPassword = await bcrypt.hash("password123", BCRYPT_SALT_ROUNDS);
  const user = await UserModel.create(
    "Test User",
    "test.user@example.com",
    hashedPassword,
  );
  return user;
};

export const deleteMockUser = async (userId) => {
  // Cleanup: Delete the mock user from the database
};

export const mockUserData = {
  valid: {
    email: "test.user@example.com",
    password: "password123",
  },
  invalid: {
    email: "non.existent@example.com",
    password: "wrongpassword",
  },
  wrongPassword: "wrongpassword",
};
