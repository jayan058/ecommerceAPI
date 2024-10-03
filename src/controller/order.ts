import { NextFunction } from "express";
import * as orderService from "../services/order";
export async function getAllOrders(req, res, next: NextFunction) {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const { orders, count } = await orderService.getAllOrders(page, limit);
    const totalPages = Math.ceil(count / limit);
    res.status(200).json({
      success: true,
      orders,
      pagination: {
        totalItems: count,
        totalPages,
        currentPage: page,
        pageSize: limit,
      },
    });
  } catch (error) {
    next(error);
  }
}
