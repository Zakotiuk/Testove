import { expect } from "@playwright/test";
import { e2eTestsFixture } from "../fixtures/e2e-tests-fixture";

e2eTestsFixture.describe('Inventory List Page Tests', () => {
    e2eTestsFixture('Sort inventory items: price (high to low)', async ({ page, loginPage, productPage }) => {
        await loginPage.open()
        await loginPage.login(process.env.E2E_USERNAME, process.env.E2E_PASSWORD)

        await expect(page).toHaveURL(/inventory\.html/)
        await expect(productPage.title).toHaveText('Products')
        await expect(productPage.title).toBeVisible()
        await expect(productPage.inventoryItems).toHaveCount(6)
        await productPage.checkInventoryItemsAreVisible()

        const initialItemNames = await productPage.inventoryItemNames.allTextContents()
        const initialItemDescriptions = await productPage.inventoryItemDescriptions.allTextContents()
        const initialPriceTexts = await productPage.inventoryItemPrices.allTextContents()
        const expectedItems = initialItemNames
            .map((name, index) => ({ name, description: initialItemDescriptions[index], price: initialPriceTexts[index] }))
            .sort((firstItem, secondItem) => (
                Number(secondItem.price.replace('$', '')) - Number(firstItem.price.replace('$', ''))
            ))
        const expectedItemNames = expectedItems.map(item => item.name)
        const expectedItemDescriptions = expectedItems.map(item => item.description)
        const expectedPriceTexts = expectedItems.map(item => item.price)

        await expect(productPage.sortDropdownActiveOption).toHaveText('Name (A to Z)')
        await expect(productPage.sortDropdownActiveOption).toBeVisible()
        await expect(productPage.sortDropdownOptions).toHaveText(['Name (A to Z)', 'Name (Z to A)', 'Price (low to high)', 'Price (high to low)'])
        await productPage.selectSortOptionByText('Price (high to low)')
        await expect(productPage.sortDropdownActiveOption).toHaveText('Price (high to low)')
        await expect(productPage.sortDropdownActiveOption).toBeVisible()

        await expect(productPage.inventoryItemNames).toHaveText(expectedItemNames)
        await expect(productPage.inventoryItemDescriptions).toHaveText(expectedItemDescriptions)
        await expect(productPage.inventoryItemPrices).toHaveText(expectedPriceTexts)
    })
    
    e2eTestsFixture('Sort inventory items: name (Z to A)', async ({ page, loginPage, productPage }) => {
        await loginPage.open()
        await loginPage.login(process.env.E2E_USERNAME, process.env.E2E_PASSWORD)

        await expect(page).toHaveURL(/inventory\.html/)
        await expect(productPage.title).toHaveText('Products')
        await expect(productPage.title).toBeVisible()
        await expect(productPage.inventoryItems).toHaveCount(6)
        await productPage.checkInventoryItemsAreVisible()

        const initialItemNames = await productPage.inventoryItemNames.allTextContents()
        const initialItemDescriptions = await productPage.inventoryItemDescriptions.allTextContents()
        const initialPriceTexts = await productPage.inventoryItemPrices.allTextContents()
        const expectedItems = initialItemNames
            .map((name, index) => ({ name, description: initialItemDescriptions[index], price: initialPriceTexts[index] }))
            .sort((firstItem, secondItem) => (
                secondItem.name.localeCompare(firstItem.name)
            ))
        const expectedItemNames = expectedItems.map(item => item.name)
        const expectedItemDescriptions = expectedItems.map(item => item.description)
        const expectedPriceTexts = expectedItems.map(item => item.price)

        await expect(productPage.sortDropdownActiveOption).toHaveText('Name (A to Z)')
        await expect(productPage.sortDropdownActiveOption).toBeVisible()
        await expect(productPage.sortDropdownOptions).toHaveText(['Name (A to Z)', 'Name (Z to A)', 'Price (low to high)', 'Price (high to low)'])
        await productPage.selectSortOptionByText('Name (Z to A)')
        await expect(productPage.sortDropdownActiveOption).toHaveText('Name (Z to A)')
        await expect(productPage.sortDropdownActiveOption).toBeVisible()

        await expect(productPage.inventoryItemNames).toHaveText(expectedItemNames)
        await expect(productPage.inventoryItemDescriptions).toHaveText(expectedItemDescriptions)
        await expect(productPage.inventoryItemPrices).toHaveText(expectedPriceTexts)
    })

    e2eTestsFixture('Remove product from cart through the inventory page', async ({ page, loginPage, productPage, cartPage }) => {
        const removedProductName = 'Sauce Labs Backpack'
        const remainingProductName = 'Sauce Labs Bike Light'

        await loginPage.open()
        await loginPage.login(process.env.E2E_USERNAME, process.env.E2E_PASSWORD)
        await expect(page).toHaveURL(/inventory\.html$/)
        await expect(productPage.inventoryItemByInventoryName(removedProductName)).toBeVisible()
        await expect(productPage.inventoryItemByInventoryName(remainingProductName)).toBeVisible()
        await expect(productPage.cartProductCountIcon).toBeHidden()

        const remainingProductDescription = await productPage.inventoryItemDescriptionByInventoryName(remainingProductName).textContent()
        const remainingProductPriceText = await productPage.inventoryItemPriceByInventoryName(remainingProductName).textContent()

        await productPage.clickAddToCartButtonByInventoryName(removedProductName)
        await productPage.clickAddToCartButtonByInventoryName(remainingProductName)
        await expect(productPage.cartProductCountIcon).toHaveText('2')
        await expect(productPage.removeButtonByInventoryName(removedProductName)).toBeVisible()
        await expect(productPage.removeButtonByInventoryName(remainingProductName)).toBeVisible()

        await productPage.clickRemoveButtonByInventoryName(removedProductName)
        await expect(productPage.addToCartButtonByInventoryName(removedProductName)).toHaveText('Add to cart')
        await expect(productPage.addToCartButtonByInventoryName(removedProductName)).toBeVisible()
        await expect(productPage.removeButtonByInventoryName(removedProductName)).toBeHidden()
        await expect(productPage.removeButtonByInventoryName(remainingProductName)).toBeVisible()
        await expect(productPage.cartProductCountIcon).toHaveText('1')

        await productPage.clickCartButton()
        await expect(page).toHaveURL(/cart\.html$/)
        await expect(cartPage.cartItems).toHaveCount(1)
        await expect(cartPage.cartItemByInventoryName(removedProductName)).toHaveCount(0)
        await expect(cartPage.cartItemByInventoryName(remainingProductName)).toBeVisible()
        await expect(cartPage.inventoryItemDescriptionByInventoryName(remainingProductName)).toHaveText(remainingProductDescription)
        await expect(cartPage.inventoryItemDescriptionByInventoryName(remainingProductName)).toBeVisible()
        await expect(cartPage.inventoryItemPriceByInventoryName(remainingProductName)).toHaveText(remainingProductPriceText)
        await expect(cartPage.inventoryItemPriceByInventoryName(remainingProductName)).toBeVisible()
        await expect(cartPage.cartProductCountIcon).toHaveText('1')
    })
})
