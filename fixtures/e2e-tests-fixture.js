import { test as baseTest } from '@playwright/test'
import { LoginPage } from '../pages/login-page'
import { ProductsPage } from '../pages/products-page'
import { CartPage } from '../pages/cart-page'

export const e2eTestsFixture = baseTest.extend({
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page)
        await use(loginPage)
    },
    productPage: async ({ page }, use) => {
        const productPage = new ProductsPage(page)
        await use(productPage)
    },
    cartPage: async ({ page }, use) => {
        const cartPage = new CartPage(page)
        await use(cartPage)
    },
})