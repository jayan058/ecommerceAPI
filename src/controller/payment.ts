import * as paymentService from "../services/payment";
import * as cartService from "../services/cart";
import * as orderService from "../services/order";
import { NextFunction } from "express";
const axios = require("axios");

export async function checkout(req, res, next: NextFunction) {
  const userId = req.user.id;
  try {
    const cartItems = await cartService.viewCart(userId);
    const paymentUrl = await paymentService.createPayment(userId, cartItems);
    res.render("payment", {
      amount: paymentUrl.totalPrice,
      transaction_uuid: paymentUrl.transactionUUID,
      signature: paymentUrl.hashedValue,
      success_url: `http://localhost:3000/payment/verify/${userId}`,
    });
  } catch (error) {
    next(error);
  }
}

interface DecodedData {
  transaction_code: string;
  status: string;
  total_amount: string;
  transaction_uuid: string;
  product_code: string;
  signed_field_names: string;
  signature: string;
}

export async function paymentVerify(req, res, next: NextFunction) {
  const { data } = req.query;
  const userId = req.params.userId;
  try {
    const decodedDataString = atob(data as string);
    const decodedData: DecodedData = JSON.parse(decodedDataString);
    const formattedAmount = decodedData.total_amount
      .toString()
      .replace(/,/g, "");
    let reqOptions = {
      url: `https://uat.esewa.com.np/api/epay/transaction/status/?product_code=${decodedData.product_code}&total_amount=${formattedAmount}&transaction_uuid=${decodedData.transaction_uuid}`,
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    let response = await axios.request(reqOptions);
    console.log(response);
    if (
      response.data.status == "COMPLETE" ||
      response.data.transaction_uuid == decodedData.transaction_uuid ||
      Number(response.data.total_amount) == Number(decodedData.total_amount)
    ) {
      const paymentResponse = {
        total_amount: response.data.total_amount,
        status: response.data.status,
      };
      orderService.createOrder(userId);
      res.json({ message: "Congrats!!! Payment Successful", paymentResponse });
    }
  } catch (error) {
    next(error);
  }
}
