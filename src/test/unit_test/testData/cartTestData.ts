export const addToCartTestData = {
  validProduct: { id: 1, name: "Product 1", inventoryCount: 10 },
  validUserId: "user1",
  validQuantity: 2,
  invalidProductId: 999,
  excessiveQuantity: 15,
};

export const viewCartTestData = {
  validUserId: "user1",
  cartItems: [
    {
      productId: 1,
      productName: "Product 1",
      productBrand: "Brand A",
      productCategory: "Category A",
      quantity: 2,
      productPrice: 20,
    },
    {
      productId: 2,
      productName: "Product 2",
      productBrand: "Brand B",
      productCategory: "Category B",
      quantity: 1,
      productPrice: 30,
    },
  ],
};

export const updateCartTestData = {
  validUserId: "user1",
  productId: 1,
  newQuantity: 2,
  existingQuantity: 1,
  validProduct: { id: 1, inventoryCount: 10 },
  invalidProductId: 999,
  excessiveQuantity: 15,
};

export const removeFromCartTestData = {
  validUserId: "user1",
  validProductId: 1,
  invalidProductId: 999,
};
