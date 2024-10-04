import request from "supertest";
import { testCartData } from "../testData/cartTestData";
import express from "express";
import router from "../../../router";
import errorHandler from "../../../middleware/errorHandler";
const app = express();
app.use(express.json());
app.use(router);

describe("Cart Routes Integration Test", () => {
  describe("POST /cart", () => {
    it("should add a new item to the cart", async () => {
      const response = await request(app)
        .post("/cart")
        .set("Authorization", `Bearer ${testCartData.authHeader.bearerToken}`)
        .send(testCartData.validItem);

      if (response.status !== 200) {
        console.log(
          `Test failed: Expected status 200 but received ${response.status}`,
        );
      }

      if (response.body.message !== testCartData.expectedMessages.addSuccess) {
        console.log(
          `Test failed: Expected "${testCartData.expectedMessages.addSuccess}" but received "${response.body.message}"`,
        );
      } else {
        console.log("Test passed: Item added to cart successfully.");
      }
    });

    it("should not add a product with insufficient stock", async () => {
      const response = await request(app)
        .post("/cart")
        .set("Authorization", `Bearer ${testCartData.authHeader.bearerToken}`)
        .send(testCartData.insufficientStock);

      if (response.status !== 400) {
        console.log(
          `Test failed: Expected status 400 but received ${response.status}`,
        );
      }

      if (
        response.body.message !==
        testCartData.expectedMessages.insufficientStock
      ) {
        console.log(
          `Test failed: Expected "${testCartData.expectedMessages.insufficientStock}" but received "${response.body.message}"`,
        );
      } else {
        console.log("Test passed: Insufficient stock error handled correctly.");
      }
    });

    it("should return an error when productId is missing", async () => {
      const response = await request(app)
        .post("/cart")
        .set("Authorization", `Bearer ${testCartData.authHeader.bearerToken}`)
        .send(testCartData.missingProductId);

      if (response.status !== 400) {
        console.log(
          `Test failed: Expected status 400 but received ${response.status}`,
        );
      }

      if (
        response.body.message !== testCartData.expectedMessages.missingProductId
      ) {
        console.log(
          `Test failed: Expected "${testCartData.expectedMessages.missingProductId}" but received "${response.body.message}"`,
        );
      } else {
        console.log("Test passed: Missing product ID error handled correctly.");
      }
    });

    it("should return an error when quantity is not a number", async () => {
      const response = await request(app)
        .post("/cart")
        .set("Authorization", `Bearer ${testCartData.authHeader.bearerToken}`)
        .send(testCartData.invalidQuantity);

      if (response.status !== 400) {
        console.log(
          `Test failed: Expected status 400 but received ${response.status}`,
        );
      }

      if (
        response.body.message !== testCartData.expectedMessages.invalidQuantity
      ) {
        console.log(
          `Test failed: Expected "${testCartData.expectedMessages.invalidQuantity}" but received "${response.body.message}"`,
        );
      } else {
        console.log("Test passed: Invalid quantity error handled correctly.");
      }
    });
  });

  describe("PUT /cart/:productId", () => {
    it("should update the quantity of an existing item in the cart", async () => {
      const response = await request(app)
        .put("/cart/1")
        .set("Authorization", `Bearer ${testCartData.authHeader.bearerToken}`)
        .send(testCartData.updateQuantity);

      if (response.status !== 200) {
        console.log(
          `Test failed: Expected status 200 but received ${response.status}`,
        );
      }

      if (
        response.body.message !==
        testCartData.expectedMessages.cartUpdateSuccess
      ) {
        console.log(
          `Test failed: Expected "${testCartData.expectedMessages.cartUpdateSuccess}" but received "${response.body.message}"`,
        );
      } else {
        console.log("Test passed: Item quantity updated successfully.");
      }
    });

    it("should return 404 if the item is not in the cart", async () => {
      const response = await request(app)
        .put("/cart/999")
        .set("Authorization", `Bearer ${testCartData.authHeader.bearerToken}`)
        .send(testCartData.updateQuantityNonExistent);

      if (response.status !== 404) {
        console.log(
          `Test failed: Expected status 404 but received ${response.status}`,
        );
      }

      if (
        response.body.message !== testCartData.expectedMessages.productNotFound
      ) {
        console.log(
          `Test failed: Expected "${testCartData.expectedMessages.productNotFound}" but received "${response.body.message}"`,
        );
      } else {
        console.log("Test passed: Non-existing item error handled correctly.");
      }
    });
  });
});
app.use(errorHandler);
