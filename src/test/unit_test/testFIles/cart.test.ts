import sinon from "sinon";
import * as cartModel from "../../../models/cart";
import * as productModel from "../../../models/Products";
import * as cartService from "../../../services/cart";
import NotFoundError from "../../../error/notFoundError";
import BadRequestError from "../../../error/badRequestError";

describe("Cart Service Unit Tests", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("addToCart", () => {
    it("should add product to cart if product exists and inventory is sufficient", async () => {
      const productId = 1;
      const userId = "user1";
      const quantity = 2;
      const product = { id: productId, name: "Product 1", inventoryCount: 10 };

      productModel.ProductModel.findById = async () => {
        return product;
      };

      cartModel.CartModel.findByProductId = async () => {
        return null;
      };

      cartModel.CartModel.addToCart = async () => {
        return {
          user_id: userId,
          product_id: productId,
          quantity: quantity,
          created_at: new Date().toISOString(),
          created_by: userId,
          updated_at: new Date().toISOString(),
          updated_by: userId,
        };
      };

      productModel.ProductModel.updateStock = async () => {};

      productModel.ProductModel.updateStatus = async () => {};

      cartModel.CartModel.findByUserId = async (userId) => {
        return [
          {
            user_id: userId,
            product_id: productId,
            quantity: quantity,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            productName: "Product 1",
            productBrand: "Brand A",
            productCategory: "Category X",
            productPrice: 100,
          },
        ];
      };
      await cartService.addToCart(userId, productId, quantity);
    });

    it("should throw NotFoundError if product does not exist", async () => {
      const productId = 999;
      const userId = "user1";
      const quantity = 2;
      sinon.stub(productModel.ProductModel, "findById").resolves(null);
      try {
        await cartService.addToCart(userId, productId, quantity);
        throw new Error("Expected NotFoundError was not thrown");
      } catch (error) {
        if (!(error instanceof NotFoundError)) {
          throw new Error(
            `Expected NotFoundError, but got ${error.constructor.name}`,
          );
        }
      }
    });

    it("should throw BadRequestError if desired quantity exceeds stock", async () => {
      const productId = 1;
      const userId = "user1";
      const quantity = 15;
      const product = { id: productId, name: "Product 1", inventoryCount: 10 };
      sinon.stub(productModel.ProductModel, "findById").resolves(product);
      try {
        await cartService.addToCart(userId, productId, quantity);
        throw new Error("Expected BadRequestError was not thrown");
      } catch (error) {
        if (!(error instanceof BadRequestError)) {
          throw new Error(
            `Expected BadRequestError, but got ${error.constructor.name}`,
          );
        }
      }
    });

    it("should throw BadRequestError if inventory count becomes negative", async () => {
      const productId = 1;
      const userId = "user1";
      const quantity = 15;
      const product = { id: productId, inventoryCount: 10 };
      sinon.stub(productModel.ProductModel, "findById").resolves(product);
      sinon.stub(cartModel.CartModel, "findByProductId").resolves(null);
      sinon.stub(cartModel.CartModel, "addToCart").resolves();
      try {
        await cartService.addToCart(userId, productId, quantity);
        throw new Error("Expected BadRequestError was not thrown");
      } catch (error) {
        if (!(error instanceof BadRequestError)) {
          throw new Error(
            `Expected BadRequestError, but got ${error.constructor.name}`,
          );
        }
      }
    });
  });

  describe("viewCart", () => {
    it("should return cart items for a valid user", async () => {
      const userId = "user1";
      const cartItems = [
        {
          productId: 1,
          productName: "Product 1",
          productBrand: "Brand A",
          productCategory: "Category A",
          quantity: 2,
          productPrice: 20,
        },
        {
          productId: 2,
          productName: "Product 2",
          productBrand: "Brand B",
          productCategory: "Category B",
          quantity: 1,
          productPrice: 30,
        },
      ];
      sinon.stub(cartModel.CartModel, "findByUserId").resolves(cartItems);
      const result = await cartService.viewCart(userId);
      if (result.length !== cartItems.length)
        throw new Error("The number of cart items returned is incorrect");
      if (result[0].id !== cartItems[0].productId)
        throw new Error("First cart item's ID is incorrect");
    });

    it("should throw NotFoundError if cart is empty", async () => {
      const userId = "user1";
      sinon.stub(cartModel.CartModel, "findByUserId").resolves([]);
      try {
        await cartService.viewCart(userId);
        throw new Error("Expected NotFoundError was not thrown");
      } catch (error) {
        if (!(error instanceof NotFoundError)) {
          throw new Error(
            `Expected NotFoundError, but got ${error.constructor.name}`,
          );
        }
      }
    });
  });

  describe("updateCart", () => {
    it("should update the quantity of an existing cart item", async () => {
      const userId = "2";
      const productId = 1;
      const newQuantity = 2;
      const existingQuantity = 1;
      const product = { id: productId, inventoryCount: 10 };
      const existingCartItem = { id: 1, productId, quantity: existingQuantity };
      sinon.stub(productModel.ProductModel, "findById").resolves(product);
      sinon
        .stub(cartModel.CartModel, "findByProductId")
        .resolves(existingCartItem);
      const updateQuantityStub = sinon
        .stub(cartModel.CartModel, "updateCartQuantity")
        .resolves();
      const updateStockStub = sinon
        .stub(productModel.ProductModel, "updateStock")
        .resolves();
      await cartService.updateCart(userId, productId, newQuantity);
      if (!updateQuantityStub.calledOnce)
        throw new Error("updateCartQuantity was not called");
      if (
        updateQuantityStub.firstCall.args[0] !== existingCartItem.id ||
        updateQuantityStub.firstCall.args[1] !== newQuantity
      ) {
        throw new Error(
          "updateCartQuantity was not called with the correct arguments",
        );
      }
      if (updateStockStub.callCount !== 1)
        throw new Error(
          "updateStock was not called with the correct arguments",
        );
    });

    it("should throw NotFoundError if cart item does not exist", async () => {
      const userId = "user1";
      it("should update the quantity of an existing cart item", async () => {
        const userId = "1";
        const productId = 1;
        const newQuantity = 2;
        const existingQuantity = 1;
        const product = { id: productId, inventoryCount: 10 };
        const existingCartItem = {
          id: 1,
          productId,
          quantity: existingQuantity,
        };
        sinon.stub(productModel.ProductModel, "findById").resolves(product);
        sinon
          .stub(cartModel.CartModel, "findByProductId")
          .resolves(existingCartItem);
        const updateQuantityStub = sinon
          .stub(cartModel.CartModel, "updateCartQuantity")
          .resolves();
        const updateStockStub = sinon
          .stub(productModel.ProductModel, "updateStock")
          .resolves();
        await cartService.updateCart(userId, productId, newQuantity);
        if (!updateQuantityStub.calledOnce)
          throw new Error("updateCartQuantity was not called");
        if (
          updateQuantityStub.firstCall.args[0] !== existingCartItem.id ||
          updateQuantityStub.firstCall.args[1] !== newQuantity
        ) {
          throw new Error(
            "updateCartQuantity was not called with the correct arguments",
          );
        }
        if (updateStockStub.callCount !== 1)
          throw new Error(
            "updateStock was not called with the correct arguments",
          );
      });
      const productId = 999;
      const newQuantity = 2;
      sinon
        .stub(productModel.ProductModel, "findById")
        .resolves({ id: productId, inventoryCount: 10 });
      sinon.stub(cartModel.CartModel, "findByProductId").resolves(null);
      try {
        await cartService.updateCart(userId, productId, newQuantity);
        throw new Error("Expected NotFoundError was not thrown");
      } catch (error) {
        if (!(error instanceof NotFoundError)) {
          throw new Error(
            `Expected NotFoundError, but got ${error.constructor.name}`,
          );
        }
      }
    });

    it("should throw BadRequestError if the updated quantity exceeds available stock", async () => {
      const userId = "user1";
      const productId = 1;
      const newQuantity = 15;
      const existingQuantity = 1;
      const product = { id: productId, inventoryCount: 10 };
      const existingCartItem = { id: 1, productId, quantity: existingQuantity };
      sinon.stub(productModel.ProductModel, "findById").resolves(product);
      sinon
        .stub(cartModel.CartModel, "findByProductId")
        .resolves(existingCartItem);
      try {
        await cartService.updateCart(userId, productId, newQuantity);
        throw new Error("Expected BadRequestError was not thrown");
      } catch (error) {
        if (!(error instanceof BadRequestError)) {
          throw new Error(
            `Expected BadRequestError, but got ${error.constructor.name}`,
          );
        }
      }
    });
  });

  describe("removeFromCart", () => {
    it("should remove an existing cart item", async () => {
      const userId = "user1";
      const productId = 1;
      const existingCartItem = { id: 1, productId };
      sinon
        .stub(cartModel.CartModel, "findByProductId")
        .resolves(existingCartItem);
      const removeItemStub = sinon
        .stub(cartModel.CartModel, "deleteCartItem")
        .resolves();
      const updateStockStub = sinon
        .stub(productModel.ProductModel, "updateStock")
        .resolves();
      await cartService.deleteCartItem(userId, productId);
      if (!removeItemStub.calledOnce)
        throw new Error("removeFromCart was not called");
      if (updateStockStub.callCount !== 1)
        throw new Error("updateStock was not called");
    });

    it("should throw NotFoundError if cart item does not exist", async () => {
      const userId = "user1";
      const productId = 999;
      sinon.stub(cartModel.CartModel, "findByProductId").resolves(null);
      try {
        await cartService.deleteCartItem(userId, productId);
        throw new NotFoundError("Expected NotFound was not thrown");
      } catch (error) {
        if (!(error instanceof NotFoundError)) {
          throw new Error(
            `Expected NotFoundError, but got ${error.constructor.name}`,
          );
        }
      }
    });
  });
});
