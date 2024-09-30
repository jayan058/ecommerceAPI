export function calculateTotalPrice(cartItems) {
  let totalPrice = 0;
  cartItems.forEach((item) => {
    const price = parseFloat(item.price);
    const quantity = item.quantity;
    totalPrice += price * quantity;
  });
  return totalPrice;
}
