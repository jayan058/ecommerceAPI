import request from "supertest";
import express from "express";
import router from "../../../router";
import errorHandler from "../../../middleware/errorHandler";
import { userData, responseMessages } from "../testData/userTestData";

const app = express();
app.use(express.json());
app.use(router);

const logResult = (expected, actual, successMessage, failureMessage) => {
  if (expected !== actual) {
    console.log(failureMessage);
  } else {
    console.log(successMessage);
  }
};

describe("User Routes Integration Test", () => {
  describe("POST /users", () => {
    it("should create a new user", async () => {
      const response = await request(app)
        .post("/user")
        .send(userData.validUser); // Using validUser payload

      logResult(
        200,
        response.status,
        "Test passed: User created successfully.",
        `Test failed: Expected status 201 but received ${response.status}`
      );
      logResult(
        responseMessages.userCreated,
        response.body.message,
        "Test passed: User created message received.",
        `Test failed: Expected '${responseMessages.userCreated}' but received ${response.body.message}`
      );
    });

    it("should return an error when email is already taken", async () => {
      const response = await request(app)
        .post("/user")
        .send(userData.duplicateUser); // Using duplicateUser payload

      logResult(
        409,
        response.status,
        "Test passed: Duplicate email conflict handled correctly.",
        `Test failed: Expected status 409 but received ${response.status}`
      );
      logResult(
        responseMessages.duplicateEmailError,
        response.body.message,
        "Test passed: Duplicate email error message received.",
        `Test failed: Expected '${responseMessages.duplicateEmailError}' but received ${response.body.message}`
      );
    });

    it("should return an error if required fields are missing", async () => {
      const response = await request(app)
        .post("/user")
        .send(userData.missingFields); // Using missingFields payload

      logResult(
        400,
        response.status,
        "Test passed: Missing required fields error handled correctly.",
        `Test failed: Expected status 400 but received ${response.status}`
      );
      logResult(
        responseMessages.missingNameError,
        response.body.message,
        "Test passed: Missing name error message received.",
        `Test failed: Expected '${responseMessages.missingNameError}' but received ${response.body.message}`
      );
    });

    it("should return an error if the email format is invalid", async () => {
      const response = await request(app)
        .post("/user")
        .send(userData.invalidEmail); // Using invalidEmail payload

      logResult(
        400,
        response.status,
        "Test passed: Invalid email format error handled correctly.",
        `Test failed: Expected status 400 but received ${response.status}`
      );
      logResult(
        responseMessages.invalidEmailError,
        response.body.message,
        "Test passed: Invalid email error message received.",
        `Test failed: Expected '${responseMessages.invalidEmailError}' but received ${response.body.message}`
      );
    });
  });
});

app.use(errorHandler);
