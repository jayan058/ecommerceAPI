import BaseModel from "./baseModel";

export class CartModel extends BaseModel {
  static async addToCart(userId: string, productId: number, quantity: number) {
    const cartItem = {
      user_id: userId,
      product_id: productId,
      quantity: quantity,
      created_at: new Date().toISOString(),
      created_by: userId,
      updated_at: new Date().toISOString(),
      updated_by: userId,
    };
    await this.queryBuilder().insert(cartItem).table("cart");
    return cartItem;
  }

  static async findByProductId(userId: string, productId: number) {
    return await this.queryBuilder()
      .select("*")
      .from("cart")
      .where({ user_id: userId, product_id: productId })
      .first(); // Return the first matching item
  }

  static async updateCartQuantity(cartItemId: number, newQuantity: number) {
    return await this.queryBuilder()
      .table("cart")
      .where("id", cartItemId)
      .update({ quantity: newQuantity });
  }

  static async findByUserId(userId: string) {
    return await this.queryBuilder()
      .select(
        "cart.*",
        "products.name as productName",
        "products.brand as productBrand",
        "products.category as productCategory",
      )
      .from("cart")
      .innerJoin("products", "cart.product_id", "products.id")
      .where("cart.user_id", userId)
      .orderBy("cart.quantity", "desc");
  }

  static async deleteCartItem(cartItemId: number) {
    return await this.queryBuilder()
      .from("cart")
      .where("id", cartItemId)
      .delete();
  }
}
