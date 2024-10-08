export const testCartData = {
  validItem: { productId: 1, quantity: 2 },
  insufficientStock: { productId: 1, quantity: 20 },
  missingProductId: { quantity: 2 },
  invalidQuantity: { productId: 1, quantity: "two" },

  updateQuantity: { quantity: 5 },
  updateQuantityNonExistent: { quantity: 3 },

  expectedMessages: {
    addSuccess: "Added successfully to cart.",
    insufficientStock: "Your desired quantity exceeds our available stock",
    missingProductId: "Product ID is required.",
    invalidQuantity: "Quantity must be a valid number.",
    cartUpdateSuccess: "Cart updated successfully.",
    productNotFound: "Product with id:999 not found",
    removeSuccess: "Product removed from cart successfully.",
    itemNotInCart: "Product with id 999 not found in the cart",
  },

  authHeader: {
    bearerToken:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIiLCJlbWFpbCI6InRlc3R1c2VyQHRlc3QuY29tIiwicGVybWlzc2lvbnMiOlsiYWRkX3RvX2NhcnQiLCJyZW1vdmVfZnJvbV9jYXJ0Iiwidmlld19jYXJ0Iiwidmlld19wcm9kdWN0cyIsInNlYXJjaF9wcm9kdWN0cyIsImNoZWNrb3V0Il0sImlhdCI6MTcyODAzMTM3MCwiZXhwIjoxNzI4MTE3NzcwfQ.21qpkrkvC6vO29J1XieRWZratsiFVRwJnPm6hiwC6TU",
  },
};
