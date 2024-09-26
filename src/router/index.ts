import express from "express";
const router = express();

import userRoute from "./user";
import authRoute from "./auth";
import productsRoute from "./products";
import cartRoute from "./cart";
router.use("/user", userRoute);
router.use("/login", authRoute);
router.use("/product", productsRoute);
router.use("/cart", cartRoute);


export default router;