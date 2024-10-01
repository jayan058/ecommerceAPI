import { Router } from "express";
import * as orderController from "../controller/order";
import { authenticate, authorize } from "../middleware/auth";
import { validateQuery } from "../middleware/validation";
import * as orderSchema from "../schema/order"
const orderRouter = Router();
orderRouter.get("/",authenticate,authorize(['view_all_orders']), validateQuery(orderSchema.getOrderSchema),orderController.getAllOrders );
export default orderRouter