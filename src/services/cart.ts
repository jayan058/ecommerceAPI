import NotFoundError from "../error/notFoundError";
import * as cartModel from "../models/cart";
import * as productModel from "../models/Products";

export async function addToCart(
  userId: string,
  productId: number,
  quantity: number
) {
  try {
    const product = await productModel.ProductModel.findById(productId);
    if (!product) {
      throw new NotFoundError(`Product with id:${productId} not found`);
    }
    if (product.inventory_count <= 0) {
      throw new NotFoundError(`Product is currently out of stock`);
    }
    const existingCartItem = await cartModel.CartModel.findByProductId(
      userId,
      productId
    );

    if (existingCartItem) {
      await cartModel.CartModel.updateCartQuantity(
        existingCartItem.id,
        existingCartItem.quantity + quantity
      );
      return "Product quantity updated in cart successfully.";
    } else {
      await cartModel.CartModel.addToCart(userId, productId, quantity);
      return "Product added to cart successfully.";
    }
  } catch (error) {
    console.log(error);
  }
}
