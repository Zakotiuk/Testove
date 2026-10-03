import { expect } from '@playwright/test';
import { e2eTestsFixture } from '../fixtures/e2e-tests-fixture';

e2eTestsFixture.describe('Login Page Tests', () => {
  e2eTestsFixture('Successful login', async ({ page, loginPage, productPage }) => {
    await loginPage.open()
    await expect(loginPage.usernameInput).toHaveValue('')
    await expect(loginPage.passwordInput).toHaveValue('')

    await loginPage.setUsernameInput(process.env.E2E_USERNAME)
    await expect(loginPage.usernameInput).toHaveValue(process.env.E2E_USERNAME)
    await loginPage.setPasswordInput(process.env.E2E_PASSWORD)
    await expect(loginPage.passwordInput).toHaveValue(process.env.E2E_PASSWORD)
    await loginPage.clickLoginButton()

    await expect(page).toHaveURL(/inventory\.html/)
    await expect(productPage.title).toHaveText('Products')
    await expect(productPage.title).toBeVisible()
    await expect(productPage.inventoryItems.first()).toBeVisible()
  });

  e2eTestsFixture('Required fields validation', async ({ page, loginPage }) => {
    await loginPage.open()
    await expect(loginPage.usernameInput).toHaveValue('')
    await expect(loginPage.passwordInput).toHaveValue('')
    await loginPage.clickLoginButton()

    await expect(page).toHaveURL('https://www.saucedemo.com/')
    await expect(loginPage.usernameInput).toContainClass('error')
    await expect(loginPage.usernameInputRedCrossIcon).toBeVisible()
    await expect(loginPage.passwordInput).toContainClass('error')
    await expect(loginPage.passwordInputRedCrossIcon).toBeVisible()
    await expect(loginPage.errorMessage).toHaveText('Epic sadface: Username is required')
    await expect(loginPage.errorMessage).toBeVisible()
    await expect(loginPage.usernameInput).toHaveValue('')
    await expect(loginPage.passwordInput).toHaveValue('')

    await loginPage.closeErrorMessage()
    await expect(loginPage.errorMessage).toHaveText('')
    await expect(loginPage.usernameInput).not.toContainClass('error')
    await expect(loginPage.usernameInputRedCrossIcon).toBeHidden()
    await expect(loginPage.passwordInput).not.toContainClass('error')
    await expect(loginPage.passwordInputRedCrossIcon).toBeHidden()

    await loginPage.setUsernameInput(process.env.E2E_LOCKED_OUT_USERNAME)
    await expect(loginPage.usernameInput).toHaveValue(process.env.E2E_LOCKED_OUT_USERNAME)
    await expect(loginPage.passwordInput).toHaveValue('')
    await loginPage.clickLoginButton()

    await expect(page).toHaveURL('https://www.saucedemo.com/')
    await expect(loginPage.usernameInput).toContainClass('error')
    await expect(loginPage.usernameInputRedCrossIcon).toBeVisible()
    await expect(loginPage.passwordInput).toContainClass('error')
    await expect(loginPage.passwordInputRedCrossIcon).toBeVisible()
    await expect(loginPage.errorMessage).toHaveText('Epic sadface: Password is required')
    await expect(loginPage.errorMessage).toBeVisible()
    await expect(loginPage.usernameInput).toHaveValue(process.env.E2E_LOCKED_OUT_USERNAME)
    await expect(loginPage.passwordInput).toHaveValue('')

    await loginPage.closeErrorMessage()
    await loginPage.clearUsernameInput()
    await expect(loginPage.usernameInput).toHaveValue('')
    await expect(loginPage.usernameInput).toBeVisible()
    await loginPage.setPasswordInput(process.env.E2E_PASSWORD)
    await loginPage.clickLoginButton()

    await expect(page).toHaveURL('https://www.saucedemo.com/')
    await expect(loginPage.usernameInput).toContainClass('error')
    await expect(loginPage.usernameInputRedCrossIcon).toBeVisible()
    await expect(loginPage.passwordInput).toContainClass('error')
    await expect(loginPage.passwordInputRedCrossIcon).toBeVisible()
    await expect(loginPage.errorMessage).toHaveText('Epic sadface: Username is required')
    await expect(loginPage.errorMessage).toBeVisible()
    await expect(loginPage.usernameInput).toHaveValue('')
    await expect(loginPage.passwordInput).toHaveValue(process.env.E2E_PASSWORD)
  });

  e2eTestsFixture('Incorrect password', async ({ page, loginPage }) => {
    await loginPage.open()

    await loginPage.setUsernameInput(process.env.E2E_USERNAME)
    await loginPage.setPasswordInput('random_password')
    await expect(loginPage.usernameInput).toHaveValue(process.env.E2E_USERNAME)
    await expect(loginPage.passwordInput).toHaveValue('random_password')
    await loginPage.clickLoginButton()

    await expect(page).toHaveURL('https://www.saucedemo.com/')
    await expect(loginPage.usernameInput).toContainClass('error')
    await expect(loginPage.usernameInputRedCrossIcon).toBeVisible()
    await expect(loginPage.passwordInput).toContainClass('error')
    await expect(loginPage.passwordInputRedCrossIcon).toBeVisible()
    await expect(loginPage.errorMessage).toHaveText('Epic sadface: Username and password do not match any user in this service')
    await expect(loginPage.errorMessage).toBeVisible()
    await expect(loginPage.usernameInput).toHaveValue(process.env.E2E_USERNAME)
    await expect(loginPage.passwordInput).toHaveValue('random_password')
  });

  e2eTestsFixture('Locked out user', async ({ page, loginPage }) => {
    await loginPage.open()

    await loginPage.setUsernameInput(process.env.E2E_LOCKED_OUT_USERNAME)
    await loginPage.setPasswordInput(process.env.E2E_PASSWORD)
    await expect(loginPage.usernameInput).toHaveValue(process.env.E2E_LOCKED_OUT_USERNAME)
    await expect(loginPage.passwordInput).toHaveValue(process.env.E2E_PASSWORD)
    await loginPage.clickLoginButton()

    await expect(page).toHaveURL('https://www.saucedemo.com/')
    await expect(loginPage.usernameInput).toContainClass('error')
    await expect(loginPage.usernameInputRedCrossIcon).toBeVisible()
    await expect(loginPage.passwordInput).toContainClass('error')
    await expect(loginPage.passwordInputRedCrossIcon).toBeVisible()
    await expect(loginPage.errorMessage).toHaveText('Epic sadface: Sorry, this user has been locked out.')
    await expect(loginPage.errorMessage).toBeVisible()
    await expect(loginPage.usernameInput).toHaveValue(process.env.E2E_LOCKED_OUT_USERNAME)
    await expect(loginPage.passwordInput).toHaveValue(process.env.E2E_PASSWORD)
  });
  
  e2eTestsFixture('Successful login after an incorrect password', async ({ page, loginPage, productPage }) => {
    await loginPage.open()
    await loginPage.login(process.env.E2E_USERNAME, 'random_password')

    await expect(page).toHaveURL('https://www.saucedemo.com/')
    await expect(loginPage.errorMessage).toHaveText('Epic sadface: Username and password do not match any user in this service')
    await expect(loginPage.errorMessage).toBeVisible()
    await expect(loginPage.usernameInput).toHaveValue(process.env.E2E_USERNAME)

    await loginPage.setPasswordInput(process.env.E2E_PASSWORD)
    await loginPage.clickLoginButton()

    await expect(page).toHaveURL(/inventory\.html$/)
    await expect(productPage.title).toHaveText('Products')
    await expect(productPage.title).toBeVisible()
    await expect(productPage.inventoryItems.first()).toBeVisible()
    await expect(loginPage.errorMessage).toBeHidden()
  });
});
