import express from "express";
import * as productController from "../controller/products";
import { validateBody, validateParams } from "../middleware/validation";
import * as userSchema from "../schema/user";
import { authorize,authenticate } from "../middleware/auth";


const productsRoute = express();

productsRoute.post(
    "/",
    authenticate,
    authorize(["add_products"]),
   productController.addProduct
  );
  productsRoute.put("/:productId/update-price", authenticate, authorize(["set_prices"]), productController.updatePrice);

  productsRoute.put("/:productId/update-stock", authenticate, authorize(['manage_inventory']), productController.updateStock);

  productsRoute.get('/', authenticate,authorize(['view_products']) ,productController.getProducts);




  export default productsRoute;