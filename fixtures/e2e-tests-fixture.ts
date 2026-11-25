import { expect, test as baseTest } from '@playwright/test';
import { CartLink } from '../pages/cart-link';
import { CartPage } from '../pages/cart-page';
import { CheckoutPage } from '../pages/checkout-page';
import { LoginPage } from '../pages/login-page';
import { ProductsPage } from '../pages/products-page';

const { E2E_USERNAME: username, E2E_PASSWORD: password } = process.env;

if (!username || !password) {
  throw new Error('Set E2E_USERNAME and E2E_PASSWORD via .env or .env.example.');
}

export const credentials = { username, password };

export const test = baseTest.extend<{
  loginPage: LoginPage;
  productsPage: ProductsPage;
  cartPage: CartPage;
  cartLink: CartLink;
  checkoutPage: CheckoutPage;
  signedInProducts: ProductsPage;
}>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  cartLink: async ({ page }, use) => {
    await use(new CartLink(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  signedInProducts: async ({ page, loginPage, productsPage }, use) => {
    await loginPage.open();
    await loginPage.login(credentials);
    await expect(page).toHaveURL('/inventory.html');
    await use(productsPage);
  },
});
