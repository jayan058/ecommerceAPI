import { calculateTotalPrice } from "../utils/totalPriceCalculator";
import { hash } from "../utils/signatureUtil";
import { v4 as uuidv4 } from "uuid";
import NotFoundError from "../error/notFoundError";
import ValidationError from "../error/validationError";

export async function createPayment(userId, cartItem) {
  try {
    const transactionUUID = uuidv4();
    if (!cartItem) {
      throw new NotFoundError("Cart is empty");
    }
    const totalPrice = calculateTotalPrice(cartItem);
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
