import sinon from "sinon";
import * as cartModel from "../../../models/cart";
import * as orderModel from "../../../models/order";
import * as orderService from "../../../services/order";
import NotFoundError from "../../../error/notFoundError";
import {
  userId,
  mockCartItems,
  mockOrders,
  emptyOrders,
} from "../testData/orderTestData";

describe("Order Service", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("createOrder", () => {
    it("should create orders and clear the cart", async () => {
      sinon.stub(cartModel.CartModel, "findByUserId").resolves(mockCartItems);
      sinon.stub(orderModel.OrderModel, "addOrder").resolves();
      sinon.stub(cartModel.CartModel, "deleteAllByUserId").resolves();

      await orderService.createOrder(userId);

      const findByUserIdStub = cartModel.CartModel
        .findByUserId as sinon.SinonStub;
      const addOrderStub = orderModel.OrderModel.addOrder as sinon.SinonStub;
      const deleteAllByUserIdStub = cartModel.CartModel
        .deleteAllByUserId as sinon.SinonStub;

      if (!findByUserIdStub.calledOnce) {
        throw new Error("findByUserId was not called once");
      }
      if (!addOrderStub.calledOnce) {
        throw new Error("addOrder was not called once");
      }
      if (!deleteAllByUserIdStub.calledOnce) {
        throw new Error("deleteAllByUserId was not called once");
      }
    });

    it("should throw error if addOrder fails", async () => {
      sinon.stub(cartModel.CartModel, "findByUserId").resolves(mockCartItems);
      sinon
        .stub(orderModel.OrderModel, "addOrder")
        .rejects(new Error("Database error"));
      sinon.stub(cartModel.CartModel, "deleteAllByUserId").resolves();

      try {
        await orderService.createOrder(userId);
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

  describe("getAllOrders", () => {
    it("should return all orders if available", async () => {
      sinon.stub(orderModel.OrderModel, "getAllOrders").resolves(mockOrders);

      const result = await orderService.getAllOrders(1, 10);

      if (result.orders.length !== mockOrders.orders.length) {
        throw new Error(
          `Expected ${mockOrders.orders.length} orders, but got ${result.orders.length}`,
        );
      }

      const getAllOrdersStub = orderModel.OrderModel
        .getAllOrders as sinon.SinonStub;
      if (!getAllOrdersStub.calledOnce) {
        throw new Error("getAllOrders was not called once");
      }
    });

    it("should throw NotFoundError if no orders exist", async () => {
      sinon.stub(orderModel.OrderModel, "getAllOrders").resolves(emptyOrders);

      try {
        await orderService.getAllOrders(1, 10);
        throw new Error("Expected NotFoundError was not thrown");
      } catch (error) {
        if (!(error instanceof NotFoundError)) {
          throw new Error(
            `Expected NotFoundError, but got ${error.constructor.name}`,
          );
        }
        if (error.message !== "No orders to show") {
          throw new Error(
            `Expected error message to be "No orders to show", but got "${error.message}"`,
          );
        }
      }
    });

    it("should handle errors thrown from getAllOrders", async () => {
      sinon
        .stub(orderModel.OrderModel, "getAllOrders")
        .rejects(new Error("Database error"));

      try {
        await orderService.getAllOrders(1, 10);
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
