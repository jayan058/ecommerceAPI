import { calculateTotalPrice } from "../utils/totalPriceCalculator";
import { hash } from "../utils/signatureUtil";
import { v4 as uuidv4 } from "uuid";
import NotFoundError from "../error/notFoundError";
import { DecodedData } from "../interfaces/decodedData";
import config from "../config";
import * as orderService from "../services/order";
import axios from "axios";

export async function createPayment(userId, cartItem) {
  try {
    const transactionUUID = uuidv4();
    if (!cartItem) {
      throw new NotFoundError("Cart is empty");
    }
    let totalPrice = calculateTotalPrice(cartItem);
    totalPrice = Math.round(totalPrice * 100) / 100;
    const signedFieldNames = "total_amount,transaction_uuid,product_code";
    const message = `total_amount=${totalPrice},transaction_uuid=${transactionUUID},product_code=EPAYTEST`;
    const hashedValue = hash(message);
    return {
      transactionUUID,
      totalPrice,
      hashedValue,
      userId,
      signedFieldNames,
    };
  } catch (error) {
    throw error;
  }
}

export function decodePaymentData(encodedData: string): DecodedData {
  const decodedDataString = atob(encodedData);
  return JSON.parse(decodedDataString) as DecodedData;
}

export async function verifyPayment(decodedData: DecodedData) {
  const formattedAmount = decodedData.total_amount.toString().replace(/,/g, "");

  const reqOptions = {
    url: `${config.esewsa.verify_payment_url}?product_code=${decodedData.product_code}&total_amount=${formattedAmount}&transaction_uuid=${decodedData.transaction_uuid}`,
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await axios.request(reqOptions);
    return response.data;
  } catch (error) {
    throw new Error("Error verifying payment");
  }
}

export async function handlePaymentVerification(
  userId: string,
  encodedData: string,
) {
  const decodedData = decodePaymentData(encodedData);
  const paymentData = await verifyPayment(decodedData);
  if (
    paymentData.status === "COMPLETE" &&
    paymentData.transaction_uuid === decodedData.transaction_uuid &&
    Number(paymentData.total_amount) === Number(decodedData.total_amount)
  ) {
    await createOrder(userId);
    return {
      success: true,
      paymentResponse: {
        total_amount: paymentData.total_amount,
        status: paymentData.status,
      },
    };
  }
  return {
    success: false,
    message: "Payment verification failed",
  };
}

async function createOrder(userId: string) {
  await orderService.createOrder(userId);
}
