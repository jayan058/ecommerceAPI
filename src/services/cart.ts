import NotFoundError from "../error/notFoundError";
import * as cartModel from "../models/cart";
import * as productModel from "../models/Products";
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


export async function viewCart(userId: string) {
  try{
    const userCart = await cartModel.CartModel.findByUserId(userId);  
    if (userCart.length === 0) {
    throw new NotFoundError("The cart is empty.");
  }
    return userCart.map((item) => ({
      id: item.productId,
      name: item.productName,
      brand: item.productBrand,
      category: item.productCategory,
      quantity: item.quantity,
    }));

  }
  catch(error){
    throw(error)
  }
}


export async function updateCart(userId: string, productId: number, newQuantity: number) {
  try {
    const product = await productModel.ProductModel.findById(productId);
    if (!product) throw new NotFoundError(`Product with id: ${productId} not found`);

    const existingCartItem = await cartModel.CartModel.findByProductId(userId, productId);
    if (!existingCartItem) throw new NotFoundError(`Product not found in the cart`);

    const existingQuantity = existingCartItem.quantity;
    const quantityDifference = newQuantity - existingQuantity; // Calculate the change in quantity

    if (quantityDifference > 0) {
      // Need to add more items to the cart
      if (quantityDifference > product.inventoryCount) {
        throw new NotFoundError(`Not enough stock available. Max available: ${product.inventoryCount}`);
      }
    }

    const updatedInventoryCount = product.inventoryCount - quantityDifference;

    if (updatedInventoryCount < 0) {
      throw new BadRequestError(`Inventory count cannot be less than zero`);
    }

    // Update the cart quantity
    await cartModel.CartModel.updateCartQuantity(existingCartItem.id, newQuantity);

    // Update the inventory count in the product table
    await productModel.ProductModel.updateStock(productId, updatedInventoryCount);

    // If inventory reaches zero, update the status to "out of stock"
    if (updatedInventoryCount === 0) {
      await productModel.ProductModel.updateStatus(product.id, false);
    }

    // Return the updated cart after the operation
    const updatedCart = await viewCart(userId);
    return updatedCart;
  } catch (error) {
    throw error;
  }
}
