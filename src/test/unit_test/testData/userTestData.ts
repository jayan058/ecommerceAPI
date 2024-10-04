export const name = "Test User";
export const email = "test@example.com";
export const password = "password123";

export const mockUser = {
  name,
  email,
  password: "hashedPassword",
};

export const existingUser = [{}];

export const hashedPassword = async () => {
  return Promise.resolve("hashedPassword");
};
