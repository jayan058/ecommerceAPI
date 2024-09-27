import NotFoundError from "../error/notFoundError";
import * as cartModel from "../models/cart";
import * as productModel from "../models/Products";
import ValidationError from "../error/validationError";
import BadRequestError from "../error/badRequestError";
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
    console.log(product);

    if (product.inventoryCount <= 0) {
      throw new NotFoundError(`Product is currently out of stock`);
    }
    const existingCartItem = await cartModel.CartModel.findByProductId(
      userId,
      productId
    );
    if (quantity > product.inventoryCount) {
      throw new BadRequestError(`Your desired quantity exceeds our available stock`);
    }
    if (existingCartItem) {
      await cartModel.CartModel.updateCartQuantity(
        existingCartItem.id,
        existingCartItem.quantity + quantity
      );
    } else {
      await cartModel.CartModel.addToCart(userId, productId, quantity);
    }
    const updatedInventoryCount = product.inventoryCount - quantity;
    if (updatedInventoryCount < 0) {
      throw new BadRequestError(`Inventory count cant be less than zero`);
    }
    if (updatedInventoryCount ==0 ) {
        await productModel.ProductModel.updateStatus(product.id, false); 
      }
    

    await productModel.ProductModel.updateStock(
      productId,
      updatedInventoryCount
    );
    const updatedCart = await cartModel.CartModel.findByUserId(userId);
    return updatedCart.map((item) => ({
      id: item.productId,
      name: item.productName,
      brand: item.productBrand,
      category: item.productCategory,
      quantity: item.quantity,
    }));
  } catch (error) {
    throw error;
  }
}
