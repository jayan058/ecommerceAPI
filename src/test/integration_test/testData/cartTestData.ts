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
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIiLCJlbWFpbCI6ImpvaG5kb2VAZXhhbXBsZS5jb20iLCJwZXJtaXNzaW9ucyI6WyJhZGRfdG9fY2FydCIsInJlbW92ZV9mcm9tX2NhcnQiLCJ2aWV3X2NhcnQiLCJ2aWV3X3Byb2R1Y3RzIiwic2VhcmNoX3Byb2R1Y3RzIiwiY2hlY2tvdXQiXSwiaWF0IjoxNzI3OTUwMDU5LCJleHAiOjE3MjgwMzY0NTl9.LdCDqZUW7LG2u0IzoaCVLOoQjdeHGnl_Kun6oEoYKEE",
  },
};
