export const userId = "1";

export const mockCartItems = [
  {
    productId: "101",
    quantity: 2,
    productPrice: "15.00",
  },
  {
    productId: "102",
    quantity: 1,
    productPrice: "20.00",
  },
];

export const mockOrders = {
  orders: [
    { id: 1, user_id: userId, total_amount: 30.0 },
    { id: 2, user_id: userId, total_amount: 20.0 },
  ],
  count: 2,
};

export const emptyOrders = {
  orders: [],
  count: 0,
};
