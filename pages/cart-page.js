import { expect } from "@playwright/test";

export class CartPage {
    constructor(page) {
        this.page = page
        this.title = page.locator('[data-test="secondary-header"]')
        this.cartItems = page.locator('[data-test="inventory-item"]')
        this.cartItemByInventoryName = (inventoryName) => this.cartItems.filter({ has: page.getByText(inventoryName, { exact: true }) })
        this.cartProductCountIcon = page.locator('[data-test="shopping-cart-badge"]')
        this.inventoryItemNameByIndex = (index) => page.locator(`(//div[@data-test="inventory-item-name"])[${index}]`)
        this.inventoryItemDescriptionByInventoryName = (inventoryName) => page.locator(`//div[text() = '${inventoryName}']/parent::a[contains(@data-test,"title")]/following-sibling::div[@data-test="inventory-item-desc"]`)
        this.inventoryItemPriceByInventoryName = (inventoryName) => page.locator(`//div[text() = '${inventoryName}']/ancestor::div[@class = 'cart_item_label']//div[@data-test="inventory-item-price"]`)
        this.removeButtonByInventoryName = (inventoryName) => page.locator(`//div[text() = '${inventoryName}']/ancestor::div[@class = 'cart_item_label']//button[contains(@data-test, "remove")]`)
    }

    async clickRemoveButtonByInventoryName(inventoryName) {
        await this.removeButtonByInventoryName(inventoryName).click()
    }

    async clickCheckoutButton() {
        await this.checkoutButton.click()
    }

    async checkCartItemsAreVisible() {
        await expect(this.cartItems.first()).toBeVisible()
        const itemCount = await this.cartItems.count()
        for (let i = 0; i < itemCount; i++) {
            await expect(this.cartItems.nth(i)).toBeVisible()
        }
    }
}
