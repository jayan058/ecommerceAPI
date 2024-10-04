import request from "supertest";
import express from "express";
import router from "../../../router";
import errorHandler from "../../../middleware/errorHandler";
import { productData, authHeader, responseMessages } from "../testData/productTestData";  

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

describe("Products Routes Integration Test", () => {
  describe("POST /products", () => {
    it("should add a new product", async () => {
      const response = await request(app)
        .post("/product")
        .set("Authorization", authHeader)
        .send(productData.validProduct);  // Using data from the testData file

      logResult(
        200,
        response.status,
        "Test passed: Product added successfully",
        `Test failed: Expected status 200 but received ${response.status}`
      );
      logResult(
        responseMessages.productAdded,
        response.body.message,
        "Test passed: Product added message received.",
        `Test failed: Expected '${responseMessages.productAdded}' but received ${response.body.message}`
      );
    });

    it("should return an error when required fields are missing", async () => {
      const response = await request(app)
        .post("/product")
        .set("Authorization", authHeader)
        .send(productData.missingFields);  // Using missingFields payload

      logResult(
        400,
        response.status,
        "Test passed: Missing required fields error handled correctly.",
        `Test failed: Expected status 400 but received ${response.status}`
      );
      logResult(
        responseMessages.missingFieldsError,
        response.body.message,
        "Test passed: Missing name error handled correctly.",
        `Test failed: Expected '${responseMessages.missingFieldsError}' but received ${response.body.message}`
      );
    });

    it("should return an error when price is not a number", async () => {
      const response = await request(app)
        .post("/product")
        .set("Authorization", authHeader)
        .send(productData.invalidPrice);  // Using invalidPrice payload

      logResult(
        400,
        response.status,
        "Test passed: Invalid price error handled correctly.",
        `Test failed: Expected status 400 but received ${response.status}`
      );
      logResult(
        responseMessages.invalidPriceError,
        response.body.message,
        "Test passed: Invalid price error handled correctly.",
        `Test failed: Expected '${responseMessages.invalidPriceError}' but received ${response.body.message}`
      );
    });
  });

  describe("PUT /product/:productId/update-price", () => {
    it("should return 404 if the product is not found", async () => {
      const response = await request(app)
        .put("/product/999/update-price")
        .set("Authorization", authHeader)
        .send({ newPrice: 89.99 });

      logResult(
        404,
        response.status,
        "Test passed: Non-existing product error handled correctly.",
        `Test failed: Expected status 404 but received ${response.status}`
      );
      logResult(
        responseMessages.notFoundError(999),
        response.body.message,
        "Test passed: Non-existing product error message received.",
        `Test failed: Expected '${responseMessages.notFoundError(999)}' but received ${response.body.message}`
      );
    });
  });
});

app.use(errorHandler);
