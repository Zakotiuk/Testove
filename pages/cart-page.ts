import { Component } from './component';
import { findProductRow } from './product-row';
import { step } from './step';

export class CartPage extends Component {
  public title = this.page.locator('xpath=//*[@data-test="title"]');
  public productRows = this.page.locator('xpath=//*[@data-test="inventory-item"]');
  public checkoutButton = this.page.locator('xpath=//*[@data-test="checkout"]');

  public product = (productName: string) => findProductRow(this.page, this.productRows, productName);
  public quantityFor = (productName: string) => this.product(productName).locator('xpath=.//*[@data-test="item-quantity"]');
  public priceFor = (productName: string) => this.product(productName).locator('xpath=.//*[@data-test="inventory-item-price"]');
  public removeButton = (productName: string) => this.product(productName).locator('xpath=.//button[normalize-space(.)="Remove"]');

  @step()
  public async removeProduct(productName: string) {
    await this.removeButton(productName).click();
  }

  @step()
  public async startCheckout() {
    await this.checkoutButton.click();
  }
}
