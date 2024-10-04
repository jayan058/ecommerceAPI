export const productTestData = {
  validProductData: {
    name: "Test Product",
    brand: "Test Brand",
    category: "Test Category",
    price: 100,
    inventory_count: 10,
    description: "Sample Description",
    created_at: "vfovj",
  },
  invalidProductData: {
    name: "Test Product",
    brand: "Test Brand",
    category: "Test Category",
    price: 100,
    inventory_count: 10,
  },
  productId: 1,
  newPrice: 150,
  newStock: 20,
  filters: {
    category: "Test Category",
    brand: "Test Brand",
    priceRange: "100-200",
    name: "Test",
    page: 1,
    limit: 10,
  },
  products: [
    { id: 1, name: "Test Product" },
    { id: 2, name: "Another Product" },
  ],
};
