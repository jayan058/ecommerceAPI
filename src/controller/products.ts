import { Request, Response, NextFunction } from "express";
import * as productService from "../services/product";

export async function addProduct(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const productData = req.body;
    const newProduct = await productService.addProduct(productData);
    res.json({
      success: true,
      message: "Product added successfully",
      newProduct,
    });
  } catch (error) {
    next(error);
  }
}

export async function updatePrice(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const productId = Number(req.params.productId);
  const { newPrice } = req.body;

  try {
    const updatedProduct = await productService.updateProductPrice(
      productId,
      newPrice,
    );
    res.json({
      success: true,
      message: "Price updated successfully",
      updatedProduct,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateStock(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const productId = Number(req.params.productId);
  const { newStock } = req.body;

  try {
    const updatedProduct = await productService.updateProductStock(
      productId,
      newStock,
    );
    res.json({
      success: true,
      message: "Product stock updated successfully",
      updatedProduct,
    });
  } catch (error) {
    next(error);
  }
}

export async function getProducts(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const {
      category,
      brand,
      priceRange,
      name,
      page = 1,
      limit = 3,
    } = req.query;
    const filteredParams = {
      category: typeof category === "string" ? category : undefined,
      brand: typeof brand === "string" ? brand : undefined,
      priceRange: typeof priceRange === "string" ? priceRange : undefined,
      name: typeof name === "string" ? name : undefined,
      page: Number(page),
      limit: Number(limit),
    };
    const { products, totalCount } =
      await productService.getFilteredProducts(filteredParams);
    const totalPages = Math.ceil(totalCount / filteredParams.limit);
    return res.status(200).json({
      products,
      pagination: {
        totalCount,
        totalPages,
        currentPage: filteredParams.page,
        limit: filteredParams.limit,
      },
    });
  } catch (error) {
    next(error);
  }
}
