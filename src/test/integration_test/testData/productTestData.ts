export const productData = {
  validProduct: {
    name: "Sample Product",
    brand: "Sample Brand",
    category: "Sample Category",
    price: 69.99,
    inventory_count: 12,
    description: "This is a sample product description.",
  },
  missingFields: {
    price: 99.99,
  },
  invalidPrice: {
    name: "Sample Product",
    brand: "Sample Brand",
    category: "Sample Category",
    price: -69.99,
    inventory_count: 12,
    description: "This is a sample product description.",
  },
};

export const authHeader = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJlbWFpbCI6ImpheWFAamF5YS5jb20iLCJwZXJtaXNzaW9ucyI6WyJhZGRfcHJvZHVjdHMiLCJzZXRfcHJpY2VzIiwibWFuYWdlX2ludmVudG9yeSIsInZpZXdfYWxsX29yZGVycyIsIm1hbmFnZV91c2VycyJdLCJpYXQiOjE3MjgwMzEyOTMsImV4cCI6MTcyODExNzY5M30.-CmvtqSEJl9ZkbeX1lsDnsQ-uHWWE9K-iDpKUNRZnHY`;

export const responseMessages = {
  productAdded: "Product added successfully",
  missingFieldsError: "Product name is required.",
  invalidPriceError: "Price must be greater than 0.",
  priceUpdateSuccess: "Price updated successfully",
  stockUpdateSuccess: "Product stock updated successfully",
  notFoundError: (id: number) => `Product with ID ${id} not found`,
};
