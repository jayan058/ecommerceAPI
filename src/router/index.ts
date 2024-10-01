import express from "express";
const router = express();

import userRoute from "./user";
import authRoute from "./auth";
import productsRoute from "./products";
import cartRoute from "./cart";
import paymentRouter from "./payment";
router.use("/user", userRoute);
router.use("/login", authRoute);
router.use("/product", productsRoute);
router.use("/cart", cartRoute);
router.use("/payment", paymentRouter);

export default router;
