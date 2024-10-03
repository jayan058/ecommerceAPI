import sinon from "sinon";
import * as userModels from "../../models/User";
import * as userService from "../../services/user";
import ConflictError from "../../error/conflictError";
import bcrypt from "bcrypt";

describe("User Service", () => {
  const name = "Test User";
  const email = "test@example.com";
  const password = "password123";

  afterEach(() => {
    sinon.restore();
  });

  describe("createUser", () => {
    it("should throw ConflictError if email is already taken", async () => {
      sinon.stub(userModels.UserModel, "findByEmail").resolves([{}]);

      try {
        await userService.createUser(name, email, password);
        throw new Error("Expected ConflictError was not thrown");
      } catch (error) {
        if (!(error instanceof ConflictError)) {
          throw new Error(
            `Expected ConflictError, but got ${error.constructor.name}`,
          );
        }
        if (error.message !== "Email already taken") {
          throw new Error(
            `Expected error message to be "Email already taken", but got "${error.message}"`,
          );
        }
      }
    });

    it("should create a user with a hashed password if email is not taken", async () => {
      sinon.stub(userModels.UserModel, "findByEmail").resolves([]);
      const hashedPassword = await bcrypt.hash(password, 10);
      const bcryptHashStub = sinon
        .stub(bcrypt, "hash")
        .resolves(hashedPassword);

      const createStub = sinon.stub(userModels.UserModel, "create").resolves({
        name,
        email,
        password: hashedPassword,
      });

      const result = await userService.createUser(name, email, password);

      if (
        result.name !== name ||
        result.email !== email ||
        result.password !== hashedPassword
      ) {
        throw new Error("User was not created correctly");
      }

      if (!bcryptHashStub.calledOnce) {
        throw new Error("Expected bcrypt.hash to be called once");
      }

      if (!createStub.calledOnce) {
        throw new Error(
          "Expected userModels.UserModel.create to be called once",
        );
      }
    });

    it("should throw an error if user creation fails", async () => {
      sinon.stub(userModels.UserModel, "findByEmail").resolves([]);
      sinon.stub(bcrypt, "hash").resolves("hashedPassword");
      const createStub = sinon
        .stub(userModels.UserModel, "create")
        .rejects(new Error("Database error"));

      try {
        await userService.createUser(name, email, password);
        throw new Error("Expected error was not thrown");
      } catch (error) {
        if (error.message !== "Database error") {
          throw new Error(
            `Expected error message to be "Database error", but got "${error.message}"`,
          );
        }
      }
    });
  });
});
