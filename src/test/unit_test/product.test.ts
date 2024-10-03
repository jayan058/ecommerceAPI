import * as productModel from "../../models/Products";
import * as productService from "../../services/product";
import ValidationError from "../../error/validationError";
import NotFoundError from "../../error/notFoundError";
import { strict as assert } from "assert";

describe("Product Service", () => {
  describe("addProduct", () => {
    it("should add a new product", async () => {
      const productData = {
        name: "Test Product",
        brand: "Test Brand",
        category: "Test Category",
        price: 100,
        inventory_count: 10,
        description: "Sample Description",
        created_at: "vfovj",
      };
      productModel.ProductModel.create = async () => {
        return { id: 1, ...productData };
      };
      const result = await productService.addProduct(productData);
      assert.deepStrictEqual(result, { id: 1, ...productData });
    });

    it("should throw ValidationError if product creation fails", async () => {
      const productData = {
        name: "Test Product",
        brand: "Test Brand",
        category: "Test Category",
        price: 100,
        inventory_count: 10,
      };
      productModel.ProductModel.create = async () => {
        throw new Error("Creation failed");
      };

      try {
        await productService.addProduct(productData);
        assert.fail("Expected ValidationError was not thrown");
      } catch (error) {
        assert(error instanceof ValidationError);
        assert.strictEqual(error.message, "Error adding the product");
      }
    });
  });

  describe("updateProductPrice", () => {
    it("should update the price of an existing product", async () => {
      const productId = 1;
      const newPrice = 150;
      const existingProduct = { id: productId, price: 100 };
      productModel.ProductModel.findById = async (id) => {
        return id === productId ? existingProduct : null;
      };
      productModel.ProductModel.updatePrice = async () => {
        return { id: productId, newPrice: newPrice };
      };
      const result = await productService.updateProductPrice(
        productId,
        newPrice,
      );
      assert.deepStrictEqual(result, { id: productId, price: newPrice });
    });

    it("should throw NotFoundError if the product does not exist", async () => {
      const productId = 1;
      const newPrice = 150;
      productModel.ProductModel.findById = async (id) => {
        return null;
      };

      try {
        await productService.updateProductPrice(productId, newPrice);
        assert.fail("Expected NotFoundError was not thrown");
      } catch (error) {
        assert(error instanceof NotFoundError);
        assert.strictEqual(
          error.message,
          `Product with ID ${productId} not found`,
        );
      }
    });
  });

  describe("updateProductStock", () => {
    it("should update the stock of an existing product", async () => {
      const productId = 1;
      const newStock = 20;
      const existingProduct = {
        id: productId,
        inventoryCount: 10,
        isActive: false,
      };
      productModel.ProductModel.findById = async (id) => {
        return id === productId ? existingProduct : null;
      };
      productModel.ProductModel.updateStock = async (id, stock) => {
        existingProduct.inventoryCount = stock;
      };
      productModel.ProductModel.updateStatus = async (id, status) => {
        existingProduct.isActive = status;
      };
      const updatedProduct = await productService.updateProductStock(
        productId,
        newStock,
      );
      assert.deepStrictEqual(updatedProduct.inventoryCount, newStock);
      assert.strictEqual(updatedProduct.isActive, true);
    });

    it("should throw NotFoundError if the product does not exist", async () => {
      const productId = 1;
      const newStock = 20;
      productModel.ProductModel.findById = async (id) => {
        return null;
      };

      try {
        await productService.updateProductStock(productId, newStock);
        assert.fail("Expected NotFoundError was not thrown");
      } catch (error) {
        assert(error instanceof NotFoundError);
        assert.strictEqual(
          error.message,
          `Product with ID ${productId} not found`,
        );
      }
    });
  });

  describe("getFilteredProducts", () => {
    it("should return filtered products and total count", async () => {
      const filters = {
        category: "Test Category",
        brand: "Test Brand",
        priceRange: "100-200",
        name: "Test",
        page: 1,
        limit: 10,
      };

      const products = [
        { id: 1, name: "Test Product" },
        { id: 2, name: "Another Product" },
      ];
      const totalCount = products.length;

      productModel.ProductModel.findWithFilters = async () => {
        return products;
      };
      productModel.ProductModel.countFilteredProducts = async () => {
        return totalCount;
      };

      const result = await productService.getFilteredProducts(filters);
      assert.deepStrictEqual(result, { products, totalCount });
    });
  });
});
