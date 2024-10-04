export const userData = {
  validUser: {
    userName: "John Doe",
    email: "ecommercetestuser@amazon.com",
    password: "password123",
  },
  duplicateUser: {
    userName: "John Smith",
    email: "ecommercetestuser@amazon.com",
    password: "password456",
  },
  missingFields: {
    email: "missing.name@example.com",
    password: "password123",
  },
  invalidEmail: {
    userName: "Invalid Email",
    email: "invalid-email",
    password: "password123",
  },
};

export const responseMessages = {
  userCreated: "User created successfully.",
  duplicateEmailError: "Email already taken",
  missingNameError: "Username is required.",
  invalidEmailError: "Please provide a valid email address.",
};
