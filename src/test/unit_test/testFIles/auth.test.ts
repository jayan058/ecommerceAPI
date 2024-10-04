import sinon from "sinon";
import * as userModels from "../../../models/User";
import * as authService from "../../../services/auth";
import NotFoundError from "../../../error/notFoundError";
import UnauthorizedError from "../../../error/unauthorizedError";
import { Response } from "express";
import bcrypt from "bcrypt";

interface MockResponse extends Response {
  status: sinon.SinonStub;
  json: sinon.SinonStub;
}

describe("Auth Service", () => {
  let res: MockResponse;
  const email = "test@example.com";
  const password = "password123";
  const mockUser = {
    id: 1,
    userName: "Test User",
    email: email,
    password: "$2b$10$randomhashedpassword",
  };

  beforeEach(() => {
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    } as unknown as MockResponse;
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("login", () => {
    it("should throw NotFoundError if user does not exist", async () => {
      sinon.stub(userModels.UserModel, "findByEmail").resolves([]);

      try {
        await authService.login(email, password, res);
        throw new Error("Expected NotFoundError was not thrown");
      } catch (error) {
        if (!(error instanceof NotFoundError)) {
          throw new Error(
            `Expected NotFoundError, but got ${error.constructor.name}`,
          );
        }
        if (error.message !== "No Matching Email") {
          throw new Error(
            `Expected error message to be "No Matching Email", but got "${error.message}"`,
          );
        }
      }
    });

    it("should throw NotFoundError if email does not match any user", async () => {
      const wrongEmail = "wrong@example.com";
      sinon.stub(userModels.UserModel, "findByEmail").resolves([]);

      try {
        await authService.login(wrongEmail, password, res);
        throw new Error("Expected NotFoundError was not thrown");
      } catch (error) {
        if (!(error instanceof NotFoundError)) {
          throw new Error(
            `Expected NotFoundError, but got ${error.constructor.name}`,
          );
        }
        if (error.message !== "No Matching Email") {
          throw new Error(
            `Expected error message to be "No Matching Email", but got "${error.message}"`,
          );
        }
      }
    });

    it("should throw UnauthorizedError if password does not match", async () => {
      sinon.stub(userModels.UserModel, "findByEmail").resolves([mockUser]);
      sinon.stub(bcrypt, "compare").resolves(false);

      try {
        await authService.login(email, password, res);
        throw new Error("Expected UnauthorizedError was not thrown");
      } catch (error) {
        if (!(error instanceof UnauthorizedError)) {
          throw new Error(
            `Expected UnauthorizedError, but got ${error.constructor.name}`,
          );
        }
        if (error.message !== "Passwords Don't Match") {
          throw new Error(
            `Expected error message to be "Passwords Don't Match", but got "${error.message}"`,
          );
        }
      }
    });

    it("should return access and refresh tokens on successful login", async () => {
      sinon.stub(userModels.UserModel, "findByEmail").resolves([mockUser]);
      sinon.stub(bcrypt, "compare").resolves(true);
      sinon
        .stub(userModels.UserModel, "findUserPermission")
        .resolves([{ name: "USER" }]);

      await authService.login(email, password, res);

      if (!res.status.calledWith(200)) {
        throw new Error("Expected response status to be 200");
      }
      if (!res.json.calledOnce) {
        throw new Error("Expected response json to be called once");
      }

      const responseBody = res.json.getCall(0).args[0];
      if (!responseBody.accessToken) {
        throw new Error("Expected accessToken to be present in response");
      }
      if (!responseBody.refreshToken) {
        throw new Error("Expected refreshToken to be present in response");
      }
      if (!authService.refreshTokens.includes(responseBody.refreshToken)) {
        throw new Error(
          "Expected refreshToken to be stored in refreshTokens array",
        );
      }
    });
  });
});
