import { expect } from '@playwright/test';
import { credentials, test } from '../fixtures/e2e-tests-fixture';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test('standard user signs in and reaches the catalog', { tag: '@main' }, async ({ page, loginPage, productsPage }) => {
    await loginPage.login(credentials);

    await expect(page).toHaveURL('/inventory.html');
    await expect(productsPage.title).toHaveText('Products');
  });

  test('submitting an empty login form requires a username', { tag: '@edge' }, async ({ page, loginPage }) => {
    await loginPage.clickLoginButton();

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText('Epic sadface: Username is required');
    await expect(page).toHaveURL('/');
  });

  test('an incorrect password is rejected', { tag: '@edge' }, async ({ page, loginPage }) => {
    await loginPage.login({ ...credentials, password: 'incorrect-password' });

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(
      'Epic sadface: Username and password do not match any user in this service',
    );
    await expect(page).toHaveURL('/');
  });
});
