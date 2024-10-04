// cartService.test.data.js

const testData = {
    addToCart: {
      validProduct: {
        id: 1,
        name: "Product 1",
        inventoryCount: 10,
      },
      userId: "user1",
      quantity: 2,
      invalidProductId: 999,
      excessQuantity: 15,
      existingCartItem: {
        userId: "user1",
        productId: 1,
        quantity: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    },
    viewCart: {
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
      emptyCartUserId: "user1",
    },
    updateCart: {
      userId: "user1",
      productId: 1,
      newQuantity: 2,
      existingQuantity: 1,
      product: {
        id: 1,
        inventoryCount: 10,
      },
      nonexistentCartItem: {
        userId: "user1",
        productId: 999,
      },
      excessStock: {
        newQuantity: 15,
      },
    },
    removeFromCart: {
      userId: "user1",
      productId: 1,
      nonexistentProductId: 999,
    },
  };
  
  export default testData;
  