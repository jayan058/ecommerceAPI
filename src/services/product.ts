import * as productModel from "../models/Products"
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
    try{
    const newProduct = await productModel.ProductModel.create(productData);
    return newProduct; 
    }

    catch(error){
        throw new ValidationError("Error adding the product", " ");
    }
  }


  export async function updateProductPrice(productId: number, newPrice: number) {
    try{
    const productExists = await productModel.ProductModel.findById(productId); 
    if (!productExists) {
        throw new NotFoundError(`Product with ID ${productId} not found`);
    }

    const updatedProduct=await productModel.ProductModel.updatePrice(productId, newPrice);
    return {...productExists,price:newPrice}
}
catch(error){
    throw new ValidationError("Error updating the product price", " ");

}
}


export async function updateProductStock(productId: number, newStock: number) {
    try{
    const productExists = await productModel.ProductModel.findById(productId); 
    if (!productExists) {
        throw new NotFoundError(`Product with ID ${productId} not found`);
    }
   await productModel.ProductModel.updateStock(productId, newStock);
   if (newStock === 0) {
    await productModel.ProductModel.updateStatus(productId, false); // Mark as inactive
  } else {
    await productModel.ProductModel.updateStatus(productId, true); // Mark as active
  }
   const updatedProduct = await productModel.ProductModel.findById(productId);
      console.log(updatedProduct);
      
      return updatedProduct;
}
catch(error){
    throw new ValidationError("Error updating the product stock", " ");
}
}


export async function getFilteredProducts(filters: {
    category: string,
    brand:string,
    priceRange: string,
    name: string,
    page: number,
    limit: number,
}) {
    const products = await productModel.ProductModel.findWithFilters(filters);
    return products;
}


