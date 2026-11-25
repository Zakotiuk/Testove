import { expect } from '@playwright/test';
import { test } from '../fixtures/e2e-tests-fixture';
import { backpack, bikeLight, formatPrice } from './data/catalog';

test.describe('Cart', () => {
  test('adds two distinct products with the correct quantities and prices', { tag: '@main' }, async ({
    page, signedInProducts: products, cartPage: cart, cartLink,
  }) => {
    const selectedProducts = [backpack, bikeLight];

    for (const { name } of selectedProducts) {
      await products.clickAddToCartButton(name);
    }

    await expect(cartLink.badge).toHaveText(String(selectedProducts.length));
    await cartLink.clickCartLink();

    await expect(page).toHaveURL('/cart.html');
    await expect(cart.title).toHaveText('Your Cart');
    await expect(cart.productRows).toHaveCount(selectedProducts.length);
    for (const { name, price } of selectedProducts) {
      await expect(cart.quantityFor(name)).toHaveText('1');
      await expect(cart.priceFor(name)).toHaveText(formatPrice(price));
    }
  });

  test('removes the selected product and keeps the other in the cart', { tag: '@main' }, async ({
    signedInProducts: products, cartPage: cart, cartLink,
  }) => {
    await products.clickAddToCartButton(backpack.name);
    await products.clickAddToCartButton(bikeLight.name);
    await cartLink.clickCartLink();

    await cart.clickRemoveButton(backpack.name);

    await expect(cart.productRows).toHaveCount(1);
    await expect(cart.product(bikeLight.name)).toBeVisible();
    await expect(cartLink.badge).toHaveText('1');
  });

  test('removing the last product empties the cart and clears its badge', { tag: '@edge' }, async ({
    signedInProducts: products, cartPage: cart, cartLink,
  }) => {
    await products.clickAddToCartButton(backpack.name);
    await cartLink.clickCartLink();
    await expect(cartLink.badge).toHaveText('1');

    await cart.clickRemoveButton(backpack.name);

    await expect(cart.productRows).toHaveCount(0);
    await expect(cartLink.badge).toBeHidden();
  });
});
