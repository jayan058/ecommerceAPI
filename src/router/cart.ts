import express from "express";
import * as cartController from "../controller/cart";
import { authenticate, authorize } from "../middleware/auth";

const cartRoute = express.Router();
cartRoute.post(
  "/",
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
  authenticate,
  authorize(["view_cart"]),
  cartController.updateCart,
);

cartRoute.delete(
  "/:productId",
  authenticate,
  authorize(["remove_from_cart"]),
  cartController.deleteFromCart,
);
export default cartRoute;
