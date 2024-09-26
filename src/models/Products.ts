import BaseModel from "./baseModel";

export class ProductModel extends BaseModel {
  static async create(productData: {
    name: string;
    brand: string;
    category: string;
    price: number;
    inventory_count: number;
    description?: string;
  }) {
    const productToCreate = {
      name: productData.name,
      brand: productData.brand,
      category: productData.category,
      price: productData.price,
      inventory_count: productData.inventory_count,
      description: productData.description,
      created_at: new Date().toISOString(),
    };
    await this.queryBuilder().insert(productToCreate).table("products");
    return productToCreate;
  }


  static async findById(productId: number) {
    // Find a product by its ID
    const product = await this.queryBuilder()
      .select("*")
      .from("products")
      .where("id", productId)
      .first(); // Use .first() to get a single product

    return product;
  }

  static async updatePrice(productId: number, newPrice: number) {
    // Update the price of a product
    await this.queryBuilder()
      .table("products")
      .where("id", productId)
      .update({
        price: newPrice,
      });
    
    return { id: productId, newPrice };
  }

  static async updateInventory(productId: number, newCount: number) {
    // Update the inventory count of a product
    await this.queryBuilder()
      .table("products")
      .where("id", productId)
      .update({
        inventory_count: newCount,
        updated_at: new Date().toISOString(),
      });

    return { id: productId, newCount };
  }
}
