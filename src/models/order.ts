import BaseModel from "./baseModel";

export class OrderModel extends BaseModel {
  static async addOrder(order) {
    await this.queryBuilder().insert(order).table("orders");
    return order;
  }
}
