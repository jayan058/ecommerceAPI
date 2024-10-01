import * as paymentService from "../services/payment";
import * as cartService from "../services/cart";
import { NextFunction } from "express";
import config from "../config";

export async function checkout(req, res, next: NextFunction) {
  const userId = req.user.id;
  try {
    const cartItems = await cartService.viewCart(userId);
    const paymentUrl = await paymentService.createPayment(userId, cartItems);
    res.render("payment", {
      amount: paymentUrl.totalPrice,
      transaction_uuid: paymentUrl.transactionUUID,
      signature: paymentUrl.hashedValue,
      success_url: `${config.esewsa.success_url}${userId}`,
      failure_url: `${config.esewsa.failure_url}`,
    });
  } catch (error) {
    next(error);
  }
}

export async function paymentSuccess(req, res, next: NextFunction) {
  const { data } = req.query;
  const userId = req.params.userId;
  try {
    const result = await paymentService.handlePaymentVerification(
      userId,
      data as string,
    );
    if (result.success) {
      res.json({
        message: "Congrats!!! Payment Successful",
        paymentResponse: result.paymentResponse,
      });
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch (error) {
    next(error);
  }
}
