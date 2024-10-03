import BaseModel from "./baseModel";

export class OrderModel extends BaseModel {
  static async addOrder(order) {
    await this.queryBuilder().insert(order).table("orders");
    return order;
  }

  static async getAllOrders(page: number, limit: number) {
    const offset = (page - 1) * limit;
    const orders = await this.queryBuilder()
      .select(
        "orders.id as orderId",
        "orders.user_id as userId",
        "orders.product_id as productId",
        "orders.quantity",
        "orders.total_amount",
        "orders.created_at",
        "products.name as productName",
        "products.price as productPrice",
        "users.username as userName",
      )
      .from("orders")
      .innerJoin("products", "orders.product_id", "products.id")
      .innerJoin("users", "orders.user_id", "users.id")
      .orderBy("orders.created_at", "desc")
      .limit(limit)
      .offset(offset);
    const [{ count }] = (await this.queryBuilder()
      .count("* as count")
      .from("orders")) as { count: number }[];

    return { orders, count };
  }
}
