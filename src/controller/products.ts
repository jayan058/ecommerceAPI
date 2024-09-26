import { Request, Response, NextFunction } from "express";
import * as productService from "../services/product"
import { string } from "joi";

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


export async function updateStock(req: Request, res: Response,next:NextFunction) {
    const productId = Number(req.params.productId); 
    const { newStock } = req.body;

    try {
        const updatedProduct=await productService.updateProductStock(productId, newStock);
        res.json(updatedProduct)
      
    } catch (error) {
       next(error)
    }
}


export  async function getProducts(req: Request, res: Response,next:NextFunction) {
    try {
        const { category,brand, priceRange, name, description, page = 1, limit = 3 } = req.query;

        const filteredParams = {
            category: typeof category === 'string' ? category : undefined,
            brand: typeof brand === 'string' ? brand : undefined,
            priceRange: typeof priceRange === 'string' ? priceRange : undefined,
            name: typeof name === 'string' ? name : undefined,
            page: Number(page),
            limit: Number(limit),
        };
        const products = await productService.getFilteredProducts(filteredParams);

        return res.status(200).json(products);
    } catch (error) {
        next(error)
    }
}

