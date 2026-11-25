import { expect } from '@playwright/test';
import { test } from '../fixtures/e2e-tests-fixture';
import { catalog, formatPrice } from './data/catalog';

test.describe('Catalog', () => {
  test('shows the expected products and prices in default A–Z order', { tag: '@main' }, async ({ signedInProducts: products }) => {
    await expect(products.sortOrder).toHaveValue('az');
    await expect(products.productNames).toHaveText(catalog.map(({ name }) => name));
    await expect(products.productPrices).toHaveText(catalog.map(({ price }) => formatPrice(price)));
    for (const { name } of catalog) {
      await expect(products.product(name)).toBeVisible();
    }
  });

  test('sorts products from Z to A and keeps their prices', { tag: '@main' }, async ({ signedInProducts: products }) => {
    const descendingProducts = [...catalog].reverse();

    await products.sortBy('Name (Z to A)');

    await expect(products.productNames).toHaveText(descendingProducts.map(({ name }) => name));
    await expect(products.productPrices).toHaveText(descendingProducts.map(({ price }) => formatPrice(price)));
  });

  test('sorts prices from highest to lowest', { tag: '@main' }, async ({ signedInProducts: products }) => {
    await products.sortBy('Price (high to low)');

    const descendingPrices = catalog
      .map(({ price }) => price)
      .sort((first, second) => second - first)
      .map(formatPrice);

    await expect(products.productPrices).toHaveText(descendingPrices);
    for (const { name, price } of catalog) {
      await expect(products.priceFor(name)).toHaveText(formatPrice(price));
    }
  });
});
