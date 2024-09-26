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
    await this.queryBuilder()
      .table("products")
      .where("id", productId)
      .update({
        price: newPrice,
      });
    
    return { id: productId, newPrice };
  }

  static async updateStock(productId: number, newStock: number) {
    await this.queryBuilder()
      .table("products")
      .where("id", productId)
      .update({
        inventory_count: newStock,
      });
  }
  static async updateStatus(productId: number, isActive: boolean) {
    await this.queryBuilder()
      .table("products")
      .where("id", productId)
      .update({
        is_active: isActive,
        updated_at: this.queryBuilder().fn.now(),
      });
  }
  
  static async findWithFilters(filters: {
    category?: string,
    brand:string,
    priceRange?: string,
    name?: string,
    description?: string,
    page: number,
    limit: number,
}) {
    const query = this.queryBuilder().select('*').from('products');  
    if (filters.category) {
        query.where('category', filters.category);
    }
    if (filters.brand) {
        query.where('brand', filters.brand);
    }
    if (filters.priceRange) {
        const [minPrice, maxPrice] = filters.priceRange.split(',');
        query.whereBetween('price', [Number(minPrice), Number(maxPrice)]);
    }
    if (filters.name) {
        query.where('name', 'ilike', `%${filters.name}%`); 
    }
    const offset = (filters.page - 1) * filters.limit;
    query.limit(filters.limit).offset(offset);
    query.orderBy('id', 'asc');
    const products = await query;  
    return products;
}
}
