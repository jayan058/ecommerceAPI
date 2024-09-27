import express from "express";
import * as productController from "../controller/products";
import { validateBody } from "../middleware/validation";
import * as productSchema from "../schema/product";
import { authorize, authenticate } from "../middleware/auth";

const productsRoute = express();

productsRoute.post(
  "/",
  validateBody(productSchema.createProductSchema),
  authenticate,
  authorize(["add_products"]),
  productController.addProduct,
);
productsRoute.put(
  "/:productId/update-price",
  validateBody(productSchema.updatePriceSchema),
  authenticate,
  authorize(["set_prices"]),
  productController.updatePrice,
);

productsRoute.put(
  "/:productId/update-stock",
  validateBody(productSchema.updateStockSchema),
  authenticate,
  authorize(["manage_inventory"]),
  productController.updateStock,
);

productsRoute.get(
  "/",
  authenticate,
  authorize(["view_products"]),
  productController.getProducts,
);

export default productsRoute;
