import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import * as cartService from "../services/cart";
export async function addToCart(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  const userId = req.user.id;

  const { productId, quantity } = req.body;
  try {
    const newCart = await cartService.addToCart(userId, productId, quantity);
    res.json(newCart);
  } catch (error) {
    next(error);
  }
}

export async function viewCart(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user.id;
    const cart = await cartService.viewCart(userId);
    res.json(cart);
  } catch (error) {
    next(error);
  }
}
export async function updateCart(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user.id;
    const productId = parseInt(req.params.productId, 10);
    const { quantity } = req.body;
    const updatedCart = await cartService.updateCart(
      userId,
      productId,
      quantity,
    );
    res.json(updatedCart);
  } catch (error) {
    next(error);
  }
}
export async function deleteFromCart(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user.id;
    const productId = parseInt(req.params.productId, 10);
    await cartService.deleteCartItem(userId, productId);
    res.json({
      success: true,
      message: "Product removed from cart successfully.",
    });
  } catch (error) {
    next(error);
  }
}
