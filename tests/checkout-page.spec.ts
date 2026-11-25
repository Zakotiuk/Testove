import { expect } from '@playwright/test';
import { test } from '../fixtures/e2e-tests-fixture';
import { backpack, bikeLight, formatPrice } from './data/catalog';

test('places a two-item order with the expected total and shows confirmation', { tag: '@main' }, async ({
  page, signedInProducts: products, cartPage: cart, cartLink, checkoutPage: checkout,
}) => {
  const selectedProducts = [backpack, bikeLight];
  const expectedSubtotal = selectedProducts.reduce((subtotal, { price }) => subtotal + price, 0);
  const expectedTax = 3.20;

  for (const { name } of selectedProducts) {
    await products.clickAddToCartButton(name);
  }
  await cartLink.clickCartLink();
  await cart.clickCheckoutButton();

  await expect(page).toHaveURL('/checkout-step-one.html');
  await checkout.submitCustomerDetails({ firstName: 'Alex', lastName: 'Tester', postalCode: '01001' });

  await expect(page).toHaveURL('/checkout-step-two.html');
  await expect(checkout.orderItemNames).toHaveText(selectedProducts.map(({ name }) => name));
  await expect(checkout.subtotal).toHaveText(`Item total: ${formatPrice(expectedSubtotal)}`);
  await expect(checkout.tax).toHaveText(`Tax: ${formatPrice(expectedTax)}`);
  await expect(checkout.total).toHaveText(`Total: ${formatPrice(expectedSubtotal + expectedTax)}`);

  await checkout.clickFinishButton();

  await expect(page).toHaveURL('/checkout-complete.html');
  await expect(checkout.confirmation).toBeVisible();
  await expect(checkout.confirmation).toHaveText('Thank you for your order!');
  await expect(cartLink.badge).toBeHidden();
});
