export const backpack = { name: 'Sauce Labs Backpack', price: 29.99 };
export const bikeLight = { name: 'Sauce Labs Bike Light', price: 9.99 };

export const catalog = [
  backpack,
  bikeLight,
  { name: 'Sauce Labs Bolt T-Shirt', price: 15.99 },
  { name: 'Sauce Labs Fleece Jacket', price: 49.99 },
  { name: 'Sauce Labs Onesie', price: 7.99 },
  { name: 'Test.allTheThings() T-Shirt (Red)', price: 15.99 },
];

export function formatPrice(amount: number) {
  return `$${amount.toFixed(2)}`;
}
