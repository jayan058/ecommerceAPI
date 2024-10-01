import { Router } from "express";
import * as paymentController from "../controller/payment";
import { authenticate, authorize } from "../middleware/auth";
const paymentRouter = Router();
paymentRouter.post(
  "/checkout",
  authenticate,
  authorize(["checkout"]),
  paymentController.checkout,
);
paymentRouter.get("/success/:userId", paymentController.paymentSuccess);
export default paymentRouter;
