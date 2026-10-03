import { expect } from "@playwright/test";

export class ProductsPage {
    constructor(page) {
        this.page = page
        this.title = page.locator('[data-test="title"]')
        this.inventoryItems = page.locator('[data-test="inventory-item"]')
        this.inventoryItemNames = page.locator('[data-test="inventory-item-name"]')
        this.inventoryItemDescriptions = page.locator('[data-test="inventory-item-desc"]')
        this.inventoryItemPrices = page.locator('[data-test="inventory-item-price"]')
        this.inventoryItemByInventoryName = (inventoryName) => this.inventoryItems.filter({ has: page.getByText(inventoryName, { exact: true }) })
        this.addToCartButtonByInventoryName = (inventoryName) => page.locator(`//div[text() = '${inventoryName}']/ancestor::div[@data-test="inventory-item-description"]//button[contains(@data-test, "add-to-cart")]`)
        this.removeButtonByInventoryName = (inventoryName) => this.inventoryItemByInventoryName(inventoryName).getByRole('button', { name: 'Remove', exact: true })
        this.inventoryItemNameByIndex = (index) => page.locator(`(//div[@data-test="inventory-item-name"])[${index}]`)
        this.inventoryItemDescriptionByInventoryName = (inventoryName) => page.locator(`//div[text() = '${inventoryName}']/ancestor::div[@data-test="inventory-item-description"]//div[@data-test="inventory-item-desc"]`)
        this.inventoryItemPriceByInventoryName = (inventoryName) => page.locator(`//div[text() = '${inventoryName}']/ancestor::div[@data-test="inventory-item-description"]//div[@data-test="inventory-item-price"]`)
        this.cartProductCountIcon = page.locator('[data-test="shopping-cart-badge"]')
        this.cartButton = page.locator('[data-test="shopping-cart-link"]')

        this.sortDropdown = page.locator('[data-test="product-sort-container"]')
        this.sortDropdownActiveOption = page.locator('//*[@data-test="active-option"]')
        this.sortDropdownOptions = page.locator('//*[@data-test="product-sort-container"]//option')
    }

    async clickCartButton() {
        await this.cartButton.click()
    }

    async clickAddToCartButtonByInventoryName(inventoryName) {
        await this.addToCartButtonByInventoryName(inventoryName).click()
    }

    async clickRemoveButtonByInventoryName(inventoryName) {
        await this.removeButtonByInventoryName(inventoryName).click()
    }

    async checkInventoryItemsAreVisible() {
        await expect(this.inventoryItems.first()).toBeVisible()
        const itemCount = await this.inventoryItems.count()
        for (let i = 0; i < itemCount; i++) {
            await expect(this.inventoryItems.nth(i)).toBeVisible()
        }
    }

    async selectSortOptionByText(optionText) {
        await this.sortDropdown.selectOption({ label: optionText })
    }
}
