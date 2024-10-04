import request from "supertest";
import express from "express";
import authRoute from "../../../router/auth";
import errorHandler from "../../../middleware/errorHandler";
import {
  createMockUser,
  deleteMockUser,
  mockUserData,
} from "../testData/authTestData";

const app = express();
app.use(express.json());
app.use("/auth", authRoute);
app.use(errorHandler);

const logResult = (expected, actual, successMessage, failureMessage) => {
  if (expected !== actual) {
    console.log(failureMessage);
  } else {
    console.log(successMessage);
  }
};

let refreshToken;
let user;

describe("Auth Routes Integration Test", () => {
  describe("POST /auth", () => {
    it("should log in successfully and return access and refresh tokens", async () => {
      user = await createMockUser();

      const response = await request(app)
        .post("/auth")
        .send(mockUserData.valid);

      logResult(
        200,
        response.status,
        "Test passed: User logged in successfully.",
        `Test failed: Expected status 200 but received ${response.status}`,
      );

      logResult(
        true,
        response.body.accessToken !== undefined,
        "Test passed: Access token received.",
        "Test failed: Expected access token but received none.",
      );

      logResult(
        true,
        response.body.refreshToken !== undefined,
        "Test passed: Refresh token received.",
        "Test failed: Expected refresh token but received none.",
      );
      refreshToken = response.body.refreshToken;
      await deleteMockUser(user.id);
    });

    it("should return error for incorrect password", async () => {
      user = await createMockUser();

      const response = await request(app).post("/auth").send({
        email: mockUserData.valid.email,
        password: mockUserData.wrongPassword,
      });

      logResult(
        401,
        response.status,
        "Test passed: Unauthorized error returned for wrong password.",
        `Test failed: Expected status 401 but received ${response.status}`,
      );

      logResult(
        "Passwords Don't Match",
        response.body.message,
        "Test passed: Correct error message received.",
        `Test failed: Expected 'Passwords Don't Match' but received ${response.body.message}`,
      );
      await deleteMockUser(user.id);
    });

    it("should return error for non-existent email", async () => {
      const response = await request(app)
        .post("/auth")
        .send(mockUserData.invalid);

      logResult(
        404,
        response.status,
        "Test passed: NotFound error returned for non-existent email.",
        `Test failed: Expected status 404 but received ${response.status}`,
      );

      logResult(
        "No Matching Email",
        response.body.message,
        "Test passed: Correct error message received.",
        `Test failed: Expected 'No Matching Email' but received ${response.body.message}`,
      );
    });
  });

  describe("POST /auth/token", () => {
    it("should return a new access token when valid refresh token is provided", async () => {
      user = await createMockUser();
      const loginResponse = await request(app)
        .post("/auth")
        .send(mockUserData.valid);
      refreshToken = loginResponse.body.refreshToken;

      const response = await request(app).post("/auth/token").send({
        token: refreshToken,
      });

      logResult(
        200,
        response.status,
        "Test passed: New access token issued successfully.",
        `Test failed: Expected status 200 but received ${response.status}`,
      );

      logResult(
        true,
        response.body.accessToken !== undefined,
        "Test passed: New access token received.",
        "Test failed: Expected new access token but received none.",
      );
      await deleteMockUser(user.id);
    });

    it("should return error for invalid refresh token", async () => {
      const response = await request(app).post("/auth/token").send({
        token: "invalid_refresh_token",
      });

      logResult(
        403,
        response.status,
        "Test passed: Forbidden error returned for invalid refresh token.",
        `Test failed: Expected status 403 but received ${response.status}`,
      );

      logResult(
        "Invalid refresh token",
        response.body.message,
        "Test passed: Correct error message received.",
        `Test failed: Expected 'Invalid refresh token' but received ${response.body.message}`,
      );
    });

    it("should return error when refresh token is missing", async () => {
      const response = await request(app).post("/auth/token").send({});

      logResult(
        403,
        response.status,
        "Test passed: Forbidden error returned for missing refresh token.",
        `Test failed: Expected status 403 but received ${response.status}`,
      );

      logResult(
        "Refresh token missing",
        response.body.message,
        "Test passed: Correct error message received.",
        `Test failed: Expected 'Refresh token missing' but received ${response.body.message}`,
      );
    });
  });
});
