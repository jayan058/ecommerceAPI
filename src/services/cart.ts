import NotFoundError from "../error/notFoundError";
import * as cartModel from "../models/cart";
import * as productModel from "../models/Products";
import BadRequestError from "../error/badRequestError";
import ValidationError from "../error/validationError";

async function checkProductAvailability(
  productId: number,
  requestedQuantity?: number,
) {
  const product = await productModel.ProductModel.findById(productId);
  if (!product) {
    throw new NotFoundError(`Product with id:${productId} not found`);
  }
  if (requestedQuantity && requestedQuantity > product.inventoryCount) {
    throw new BadRequestError(
      `Your desired quantity exceeds our available stock`,
    );
  }
  return product;
}

async function updateProductStatus(productId: number, inventoryCount: number) {
  if (inventoryCount === 0) {
    await productModel.ProductModel.updateStatus(productId, false);
  } else {
    await productModel.ProductModel.updateStatus(productId, true);
  }
}

export async function addToCart(
  userId: string,
  productId: number,
  quantity: number,
) {
  try {
    const product = await checkProductAvailability(productId, quantity);
    const existingCartItem = await cartModel.CartModel.findByProductId(
      userId,
      productId,
    );

    if (existingCartItem) {
      await cartModel.CartModel.updateCartQuantity(
        existingCartItem.id,
        existingCartItem.quantity + quantity,
      );
    } else {
      await cartModel.CartModel.addToCart(userId, productId, quantity);
    }

    const updatedInventoryCount = product.inventoryCount - quantity;
    if (updatedInventoryCount < 0) {
      throw new BadRequestError(`Inventory count can't be less than zero`);
    }

    await productModel.ProductModel.updateStock(
      productId,
      updatedInventoryCount,
    );
    await updateProductStatus(productId, updatedInventoryCount);

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
  try {
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
      price:item.productPrice
    }));
  } catch (error) {
    throw error;
  }
}

export async function updateCart(
  userId: string,
  productId: number,
  newQuantity: number,
) {
  try {
    const product = await checkProductAvailability(productId);
    const existingCartItem = await cartModel.CartModel.findByProductId(
      userId,
      productId,
    );

    if (!existingCartItem) {
      throw new NotFoundError(`Product not found in the cart`);
    }

    const existingQuantity = existingCartItem.quantity;
    const quantityDifference = newQuantity - existingQuantity;

    if (quantityDifference > 0) {
      if (quantityDifference > product.inventoryCount) {
        throw new BadRequestError(
          `Not enough stock available. Max available: ${product.inventoryCount}`,
        );
      }
    }

    const updatedInventoryCount = product.inventoryCount - quantityDifference;
    if (updatedInventoryCount < 0) {
      throw new BadRequestError(`Inventory count cannot be less than zero`);
    }

    await cartModel.CartModel.updateCartQuantity(
      existingCartItem.id,
      newQuantity,
    );
    await productModel.ProductModel.updateStock(
      productId,
      updatedInventoryCount,
    );
    await updateProductStatus(productId, updatedInventoryCount);

    const updatedCart = await viewCart(userId);
    return updatedCart;
  } catch (error) {
    throw error;
  }
}
export async function deleteCartItem(
  userId: string,
  productId: number,
): Promise<string> {
  try {
    const existingCartItem = await cartModel.CartModel.findByProductId(
      userId,
      productId,
    );

    if (!existingCartItem) {
      throw new NotFoundError(
        `Product with id ${productId} not found in the cart`,
      );
    }

    const product = await productModel.ProductModel.findById(productId);
    if (!product) {
      throw new NotFoundError(`Product with id ${productId} does not exist`);
    }

    await cartModel.CartModel.deleteCartItem(existingCartItem.id);
    const updatedInventoryCount =
      product.inventoryCount + existingCartItem.quantity;

    await productModel.ProductModel.updateStock(
      productId,
      updatedInventoryCount,
    );
    await updateProductStatus(productId, updatedInventoryCount);

    return `Product with id ${productId} removed from cart, and inventory updated successfully.`;
  } catch (error) {
    throw new ValidationError(
      `Error deleting product from cart: ${error.message}`,
      " ",
    );
  }
}
