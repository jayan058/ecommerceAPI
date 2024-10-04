import sinon from "sinon";
import * as cartModel from "../../../models/cart";
import * as productModel from "../../../models/Products";
import * as cartService from "../../../services/cart";
import NotFoundError from "../../../error/notFoundError";
import BadRequestError from "../../../error/badRequestError";
import {
  addToCartTestData,
  viewCartTestData,
  updateCartTestData,
  removeFromCartTestData,
} from "../testData/cartTestData";

describe("Cart Service Unit Tests", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("addToCart", () => {
    it("should add product to cart if product exists and inventory is sufficient", async () => {
      const { validProduct, validUserId, validQuantity } = addToCartTestData;

      productModel.ProductModel.findById = async () => {
        return validProduct;
      };

      cartModel.CartModel.findByProductId = async () => {
        return null;
      };

      cartModel.CartModel.addToCart = async () => {
        return {
          user_id: validUserId,
          product_id: validProduct.id,
          quantity: validQuantity,
          created_at: new Date().toISOString(),
          created_by: validUserId,
          updated_at: new Date().toISOString(),
          updated_by: validUserId,
        };
      };

      productModel.ProductModel.updateStock = async () => {};
      productModel.ProductModel.updateStatus = async () => {};

      cartModel.CartModel.findByUserId = async (userId) => {
        return [
          {
            user_id: userId,
            product_id: validProduct.id,
            quantity: validQuantity,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            productName: "Product 1",
            productBrand: "Brand A",
            productCategory: "Category X",
            productPrice: 100,
          },
        ];
      };
      await cartService.addToCart(validUserId, validProduct.id, validQuantity);
    });

    it("should throw NotFoundError if product does not exist", async () => {
      const { invalidProductId, validUserId, validQuantity } =
        addToCartTestData;
      sinon.stub(productModel.ProductModel, "findById").resolves(null);
      try {
        await cartService.addToCart(
          validUserId,
          invalidProductId,
          validQuantity,
        );
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
      const { validProduct, excessiveQuantity, validUserId } =
        addToCartTestData;
      sinon.stub(productModel.ProductModel, "findById").resolves(validProduct);
      try {
        await cartService.addToCart(
          validUserId,
          validProduct.id,
          excessiveQuantity,
        );
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
      const { validUserId, excessiveQuantity, validProduct } =
        addToCartTestData;
      sinon.stub(productModel.ProductModel, "findById").resolves(validProduct);
      sinon.stub(cartModel.CartModel, "findByProductId").resolves(null);
      sinon.stub(cartModel.CartModel, "addToCart").resolves();
      try {
        await cartService.addToCart(
          validUserId,
          validProduct.id,
          excessiveQuantity,
        );
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
      const { validUserId, cartItems } = viewCartTestData;
      sinon.stub(cartModel.CartModel, "findByUserId").resolves(cartItems);
      const result = await cartService.viewCart(validUserId);
      if (result.length !== cartItems.length)
        throw new Error("The number of cart items returned is incorrect");
      if (result[0].id !== cartItems[0].productId)
        throw new Error("First cart item's ID is incorrect");
    });

    it("should throw NotFoundError if cart is empty", async () => {
      const { validUserId } = viewCartTestData;
      sinon.stub(cartModel.CartModel, "findByUserId").resolves([]);
      try {
        await cartService.viewCart(validUserId);
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
      const {
        validUserId,
        productId,
        newQuantity,
        existingQuantity,
        validProduct,
      } = updateCartTestData;
      const existingCartItem = { id: 1, productId, quantity: existingQuantity };
      sinon.stub(productModel.ProductModel, "findById").resolves(validProduct);
      sinon
        .stub(cartModel.CartModel, "findByProductId")
        .resolves(existingCartItem);
      const updateQuantityStub = sinon
        .stub(cartModel.CartModel, "updateCartQuantity")
        .resolves();
      const updateStockStub = sinon
        .stub(productModel.ProductModel, "updateStock")
        .resolves();
      await cartService.updateCart(validUserId, productId, newQuantity);
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
      const { validUserId, invalidProductId, newQuantity } = updateCartTestData;
      sinon
        .stub(productModel.ProductModel, "findById")
        .resolves({ id: invalidProductId, inventoryCount: 10 });
      sinon.stub(cartModel.CartModel, "findByProductId").resolves(null);
      try {
        await cartService.updateCart(
          validUserId,
          invalidProductId,
          newQuantity,
        );
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
      const {
        validUserId,
        productId,
        excessiveQuantity,
        existingQuantity,
        validProduct,
      } = updateCartTestData;
      const existingCartItem = { id: 1, productId, quantity: existingQuantity };
      sinon.stub(productModel.ProductModel, "findById").resolves(validProduct);
      sinon
        .stub(cartModel.CartModel, "findByProductId")
        .resolves(existingCartItem);
      try {
        await cartService.updateCart(validUserId, productId, excessiveQuantity);
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

  describe("deleteCartItem", () => {
    it("should remove an existing cart item", async () => {
      const { validUserId, validProductId } = removeFromCartTestData;
      const existingCartItem = { id: 1, productId: validProductId };
      sinon
        .stub(cartModel.CartModel, "findByProductId")
        .resolves(existingCartItem);
      const removeItemStub = sinon
        .stub(cartModel.CartModel, "deleteCartItem")
        .resolves();
      const updateStockStub = sinon
        .stub(productModel.ProductModel, "updateStock")
        .resolves();
      await cartService.deleteCartItem(validUserId, validProductId);
      if (!removeItemStub.calledOnce)
        throw new Error("deleteCartItem was not called");
      if (updateStockStub.callCount !== 1)
        throw new Error("updateStock was not called");
    });

    it("should throw NotFoundError if product does not exist in cart", async () => {
      const { validUserId, invalidProductId } = removeFromCartTestData;
      sinon
        .stub(cartModel.CartModel, "deleteCartItem")
        .throws(new NotFoundError("Product not found in cart"));
      try {
        await cartService.deleteCartItem(validUserId, invalidProductId);
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
});
