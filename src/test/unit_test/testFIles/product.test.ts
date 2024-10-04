import * as productModel from "../../../models/Products";
import * as productService from "../../../services/product";
import ValidationError from "../../../error/validationError";
import NotFoundError from "../../../error/notFoundError";
import { strict as assert } from "assert";
import { productTestData } from "../testData/productTestData";

describe("Product Service", () => {
  describe("addProduct", () => {
    it("should add a new product", async () => {
      productModel.ProductModel.create = async () => {
        return { id: 1, ...productTestData.validProductData };
      };
      const result = await productService.addProduct(
        productTestData.validProductData,
      );
      assert.deepStrictEqual(result, {
        id: 1,
        ...productTestData.validProductData,
      });
    });

    it("should throw ValidationError if product creation fails", async () => {
      productModel.ProductModel.create = async () => {
        throw new Error("Creation failed");
      };

      try {
        await productService.addProduct(productTestData.invalidProductData);
        assert.fail("Expected ValidationError was not thrown");
      } catch (error) {
        assert(error instanceof ValidationError);
        assert.strictEqual(error.message, "Error adding the product");
      }
    });
  });

  describe("updateProductPrice", () => {
    it("should update the price of an existing product", async () => {
      const existingProduct = { id: productTestData.productId, price: 100 };
      productModel.ProductModel.findById = async (id) => {
        return id === productTestData.productId ? existingProduct : null;
      };
      productModel.ProductModel.updatePrice = async () => {
        return {
          id: productTestData.productId,
          newPrice: productTestData.newPrice,
        };
      };
      const result = await productService.updateProductPrice(
        productTestData.productId,
        productTestData.newPrice,
      );
      assert.deepStrictEqual(result, {
        id: productTestData.productId,
        price: productTestData.newPrice,
      });
    });

    it("should throw NotFoundError if the product does not exist", async () => {
      productModel.ProductModel.findById = async (id) => {
        return null;
      };

      try {
        await productService.updateProductPrice(
          productTestData.productId,
          productTestData.newPrice,
        );
        assert.fail("Expected NotFoundError was not thrown");
      } catch (error) {
        assert(error instanceof NotFoundError);
        assert.strictEqual(
          error.message,
          `Product with ID ${productTestData.productId} not found`,
        );
      }
    });
  });

  describe("updateProductStock", () => {
    it("should update the stock of an existing product", async () => {
      const existingProduct = {
        id: productTestData.productId,
        inventoryCount: 10,
        isActive: false,
      };
      productModel.ProductModel.findById = async (id) => {
        return id === productTestData.productId ? existingProduct : null;
      };
      productModel.ProductModel.updateStock = async (id, stock) => {
        existingProduct.inventoryCount = stock;
      };
      productModel.ProductModel.updateStatus = async (id, status) => {
        existingProduct.isActive = status;
      };
      const updatedProduct = await productService.updateProductStock(
        productTestData.productId,
        productTestData.newStock,
      );
      assert.deepStrictEqual(
        updatedProduct.inventoryCount,
        productTestData.newStock,
      );
      assert.strictEqual(updatedProduct.isActive, true);
    });

    it("should throw NotFoundError if the product does not exist", async () => {
      productModel.ProductModel.findById = async (id) => {
        return null;
      };

      try {
        await productService.updateProductStock(
          productTestData.productId,
          productTestData.newStock,
        );
        assert.fail("Expected NotFoundError was not thrown");
      } catch (error) {
        assert(error instanceof NotFoundError);
        assert.strictEqual(
          error.message,
          `Product with ID ${productTestData.productId} not found`,
        );
      }
    });
  });

  describe("getFilteredProducts", () => {
    it("should return filtered products and total count", async () => {
      const totalCount = productTestData.products.length;

      productModel.ProductModel.findWithFilters = async () => {
        return productTestData.products;
      };
      productModel.ProductModel.countFilteredProducts = async () => {
        return totalCount;
      };

      const result = await productService.getFilteredProducts(
        productTestData.filters,
      );
      assert.deepStrictEqual(result, {
        products: productTestData.products,
        totalCount,
      });
    });
  });
});
