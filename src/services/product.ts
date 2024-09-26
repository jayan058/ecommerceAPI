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
        throw new ValidationError("Error creating user", " ");
    }
  }


  export async function updateProductPrice(productId: number, newPrice: number) {
    const productExists = await productModel.ProductModel.findById(productId); 
    if (!productExists) {
        throw new NotFoundError(`Product with ID ${productId} not found`);
    }

    await productModel.ProductModel.updatePrice(productId, newPrice);
}


