import BaseModel from "./baseModel";

export class OrderModel extends BaseModel {
  static async addOrder(order) {
    console.log(order);
    await this.queryBuilder().insert(order).table("orders");
    return order;
  }
}
