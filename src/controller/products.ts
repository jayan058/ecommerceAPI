import { Request, Response, NextFunction } from "express";
import * as productService from "../services/product"

export async function addProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
    try {
        const productData = req.body; 
        const newProduct = await productService.addProduct(productData);
        res.json(newProduct)
      } catch (error) {
        next(error)
      }
}


export async function updatePrice(req: Request, res: Response,next:NextFunction) {
    const productId = Number(req.params.productId); 
    const { newPrice } = req.body;

    try {
        const updatedProduct=await productService.updateProductPrice(productId, newPrice);
        res.json(updatedProduct)
      
    } catch (error) {
       next(error)
    }
}
