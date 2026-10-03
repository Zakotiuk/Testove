import { expect } from "@playwright/test";
import { e2eTestsFixture } from "../fixtures/e2e-tests-fixture";

e2eTestsFixture.describe('Cart Page Tests', () => {
    e2eTestsFixture('Add product to cart', async ({ page, loginPage, productPage, cartPage }) => {
        await loginPage.open()
        await loginPage.login(process.env.E2E_USERNAME, process.env.E2E_PASSWORD)

        await expect(page).toHaveURL(/inventory\.html/)
        await expect(productPage.title).toHaveText('Products')
        await expect(productPage.title).toBeVisible()
        await expect(productPage.inventoryItems).toHaveCount(6)
        await productPage.checkInventoryItemsAreVisible()

        const productNameFirst = await productPage.inventoryItemNameByIndex(1).textContent()
        const productDescriptionFirst = await productPage.inventoryItemDescriptionByInventoryName(productNameFirst).textContent()
        const productPriceFirst = await productPage.inventoryItemPriceByInventoryName(productNameFirst).textContent()

        const productNameSecond = await productPage.inventoryItemNameByIndex(2).textContent()
        const productDescriptionSecond = await productPage.inventoryItemDescriptionByInventoryName(productNameSecond).textContent()
        const productPriceSecond = await productPage.inventoryItemPriceByInventoryName(productNameSecond).textContent()

        await productPage.clickAddToCartButtonByInventoryName(productNameFirst)
        await expect(productPage.cartProductCountIcon).toHaveText('1')
        await expect(productPage.cartProductCountIcon).toBeVisible()

        await productPage.clickAddToCartButtonByInventoryName(productNameSecond)
        await expect(productPage.cartProductCountIcon).toHaveText('2')
        await expect(productPage.cartProductCountIcon).toBeVisible()

        await productPage.clickCartButton()
        await expect(page).toHaveURL(/cart\.html/)
        await expect(cartPage.title).toHaveText('Your Cart')
        await expect(cartPage.title).toBeVisible()
        await expect(cartPage.cartItems).toHaveCount(2)
        await cartPage.checkCartItemsAreVisible()
        await expect(productPage.cartProductCountIcon).toHaveText('2')
        await expect(productPage.cartProductCountIcon).toBeVisible()

        await expect(cartPage.inventoryItemNameByIndex(1)).toHaveText(productNameFirst)
        await expect(cartPage.inventoryItemNameByIndex(1)).toBeVisible()
        await expect(cartPage.inventoryItemDescriptionByInventoryName(productNameFirst)).toHaveText(productDescriptionFirst)
        await expect(cartPage.inventoryItemDescriptionByInventoryName(productNameFirst)).toBeVisible()
        await expect(cartPage.inventoryItemPriceByInventoryName(productNameFirst)).toHaveText(productPriceFirst)
        await expect(cartPage.inventoryItemPriceByInventoryName(productNameFirst)).toBeVisible()

        await expect(cartPage.inventoryItemNameByIndex(2)).toHaveText(productNameSecond)
        await expect(cartPage.inventoryItemNameByIndex(2)).toBeVisible()
        await expect(cartPage.inventoryItemDescriptionByInventoryName(productNameSecond)).toHaveText(productDescriptionSecond)
        await expect(cartPage.inventoryItemDescriptionByInventoryName(productNameSecond)).toBeVisible()
        await expect(cartPage.inventoryItemPriceByInventoryName(productNameSecond)).toHaveText(productPriceSecond)
        await expect(cartPage.inventoryItemPriceByInventoryName(productNameSecond)).toBeVisible()
    })

    e2eTestsFixture('Remove product from cart', async ({ page, loginPage, productPage, cartPage }) => {
        await loginPage.open()
        await loginPage.login(process.env.E2E_USERNAME, process.env.E2E_PASSWORD)

        await expect(page).toHaveURL(/inventory\.html/)
        await expect(productPage.inventoryItems).toHaveCount(6)
        await productPage.checkInventoryItemsAreVisible()
        const productNameFirst = await productPage.inventoryItemNameByIndex(1).textContent()
        const productNameSecond = await productPage.inventoryItemNameByIndex(2).textContent()
        const productDescriptionSecond = await productPage.inventoryItemDescriptionByInventoryName(productNameSecond).textContent()
        const productPriceSecond = await productPage.inventoryItemPriceByInventoryName(productNameSecond).textContent()

        await productPage.clickAddToCartButtonByInventoryName(productNameFirst)
        await productPage.clickAddToCartButtonByInventoryName(productNameSecond)
        await expect(productPage.cartProductCountIcon).toHaveText('2')

        await productPage.clickCartButton()
        await expect(page).toHaveURL(/cart\.html/)
        await expect(cartPage.cartItems).toHaveCount(2)

        await cartPage.clickRemoveButtonByInventoryName(productNameFirst)
        await expect(productPage.cartProductCountIcon).toHaveText('1')
        await expect(productPage.cartProductCountIcon).toBeVisible()
        await expect(cartPage.cartItems).toHaveCount(1)

        await expect(cartPage.inventoryItemNameByIndex(1)).toHaveText(productNameSecond)
        await expect(cartPage.inventoryItemNameByIndex(1)).toBeVisible()
        await expect(cartPage.inventoryItemDescriptionByInventoryName(productNameSecond)).toHaveText(productDescriptionSecond)
        await expect(cartPage.inventoryItemDescriptionByInventoryName(productNameSecond)).toBeVisible()
        await expect(cartPage.inventoryItemPriceByInventoryName(productNameSecond)).toHaveText(productPriceSecond)
        await expect(cartPage.inventoryItemPriceByInventoryName(productNameSecond)).toBeVisible()
    })

    e2eTestsFixture('Remove the last product from cart', async ({ page, loginPage, productPage, cartPage }) => {
        const productName = 'Sauce Labs Backpack'

        await loginPage.open()
        await loginPage.login(process.env.E2E_USERNAME, process.env.E2E_PASSWORD)
        await expect(page).toHaveURL(/inventory\.html$/)
        await expect(productPage.cartProductCountIcon).toBeHidden()

        await productPage.clickAddToCartButtonByInventoryName(productName)
        await productPage.clickCartButton()

        await expect(page).toHaveURL(/cart\.html$/)
        await expect(cartPage.cartItems).toHaveCount(1)
        await expect(cartPage.cartItemByInventoryName(productName)).toBeVisible()
        await expect(cartPage.cartProductCountIcon).toHaveText('1')
        await expect(cartPage.cartProductCountIcon).toBeVisible()

        await cartPage.clickRemoveButtonByInventoryName(productName)
        await expect(cartPage.cartItems).toHaveCount(0)
        await expect(cartPage.cartProductCountIcon).toBeHidden()
        await expect(page).toHaveURL(/cart\.html$/)
    })
})
