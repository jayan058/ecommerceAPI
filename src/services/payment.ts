import { calculateTotalPrice } from "../utils/totalPriceCalculator";
import { hash } from "../utils/signatureUtil";
import { v4 as uuidv4 } from "uuid";
export async function createPayment(userId,cartItem){
    const transactionUUID = uuidv4(); 
    const totalPrice=calculateTotalPrice(cartItem)
    const message= `total_amount=${totalPrice},transaction_uuid=${transactionUUID},product_code=EPAYTEST`
    let hashedValue=hash(message)
    return {transactionUUID,totalPrice,hashedValue}

}