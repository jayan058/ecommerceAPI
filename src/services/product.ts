import * as productModel from "../models/Products";
import ValidationError from "../error/validationError";
import NotFoundError from "../error/notFoundError";
export async function addProduct(productData: {
  name: string;
  brand: string;
  category: string;
  price: number;
  inventory_count: number;
  description?: string;
}) {
  try {
    const newProduct = await productModel.ProductModel.create(productData);
    return newProduct;
  } catch (error) {
    throw new ValidationError("Error adding the product", " ");
  }
}

export async function updateProductPrice(productId: number, newPrice: number) {
  try {
    const productExists = await productModel.ProductModel.findById(productId);
    if (!productExists) {
      throw new NotFoundError(`Product with ID ${productId} not found`);
    }
    await productModel.ProductModel.updatePrice(productId, newPrice);
    return { ...productExists, price: newPrice };
  } catch (error) {
    throw error;
  }
}

export async function updateProductStock(productId: number, newStock: number) {
  try {
    const productExists = await productModel.ProductModel.findById(productId);
    if (!productExists) {
      throw new NotFoundError(`Product with ID ${productId} not found`);
    }
    await productModel.ProductModel.updateStock(productId, newStock);
    if (newStock === 0) {
      await productModel.ProductModel.updateStatus(productId, false);
    } else {
      await productModel.ProductModel.updateStatus(productId, true);
    }
    const updatedProduct = await productModel.ProductModel.findById(productId);

    return updatedProduct;
  } catch (error) {
    throw error;
  }
}

export async function getFilteredProducts(filters: {
  category: string;
  brand: string;
  priceRange: string;
  name: string;
  page: number;
  limit: number;
}) {
  const products = await productModel.ProductModel.findWithFilters(filters);

  // Get total count of products matching the filters
  const totalCount =
    await productModel.ProductModel.countFilteredProducts(filters);

  return { products, totalCount };
}
