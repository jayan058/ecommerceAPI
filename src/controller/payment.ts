// controllers/checkoutController.js
import * as paymentService from "../services/payment";
import * as cartService from "../services/cart"
import https from 'https';
import * as crypto from "crypto"
import { DecodedData } from "../interfaces/decodedData";
import { EsewaResponse } from "../interfaces/esewaResponse";
  export  async function checkout(req, res) {
    const userId = req.user.id; 
    try {
      const cartItems = await cartService.viewCart(userId);
      const paymentUrl = await paymentService.createPayment(userId, cartItems);
      
      res.render('payment', {
        amount: paymentUrl.totalPrice,
        transaction_uuid: paymentUrl.transactionUUID,
        signature:paymentUrl.hashedValue,
        success_url:"http://localhost:3000/payment/verify"
    });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  export async function  paymentVerify(req, res) {
    const { data } = req.query;
   console.log(data);
   
   let decodedData = atob(data);
   decodedData = await JSON.parse(decodedData);
   console.log(decodedData);
   
    try {
     
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }



  