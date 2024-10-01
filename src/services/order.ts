import * as cartModel from "../models/cart";
import * as orderModel from "../models/order";

export async function createOrder(userId) {
  const userCart = await cartModel.CartModel.findByUserId(userId);

  try {
    const orders = userCart.map((item) => {
      const quantity = item.quantity;
      const price = parseFloat(item.productPrice);
      const productId = parseInt(item.productId);
      const totalPrice = price * quantity;
      return {
        user_id: userId,
        product_id: productId,
        quantity,
        total_amount: totalPrice,
        created_at: new Date(),
        updated_at: new Date(),
      };
    });
    orderModel.OrderModel.addOrder(orders);
  } catch (error) {
    throw error;
  }
}
