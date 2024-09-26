import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import * as cartService from "../services/cart"
export async function addToCart(req: AuthenticatedRequest, res: Response,next:NextFunction) {
    const userId = req.user.id; 
    console.log(userId);
    
    const { productId, quantity } = req.body;
    try {
        const newCart = await cartService.addToCart(userId, productId, quantity);
        res.json(newCart)
    } catch (error) {
      next(error)
    }
  }