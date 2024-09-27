import express from "express";
import * as cartController from "../controller/cart";
import { authenticate, authorize } from "../middleware/auth";
import * as cartSchema from "../schema/cart";
import { validateBody, validateParams } from "../middleware/validation";
const cartRoute = express.Router();
cartRoute.post(
  "/",
  validateBody(cartSchema.addToCartSchema),
  authenticate,
  authorize(["add_to_cart"]),
  cartController.addToCart,
);
cartRoute.get(
  "/",
  authenticate,
  authorize(["view_cart"]),
  cartController.viewCart,
);
cartRoute.put(
  "/:productId",
  validateBody(cartSchema.updateCartSchema),
  authenticate,
  authorize(["view_cart"]),
  cartController.updateCart,
);

cartRoute.delete(
  "/:productId",
  authenticate,
  authorize(["remove_from_cart"]),
  validateParams(cartSchema.deleteCartItemSchema),
  cartController.deleteFromCart,
);
export default cartRoute;
