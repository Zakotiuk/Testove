import { Component } from './component';
import { findProductRow } from './product-row';
import { step } from './step';

export class ProductsPage extends Component {
  public title = this.page.locator('xpath=//*[@data-test="title"]');
  public productRows = this.page.locator('xpath=//*[@data-test="inventory-item"]');
  public productNames = this.productRows.locator('xpath=.//*[@data-test="inventory-item-name"]');
  public productPrices = this.productRows.locator('xpath=.//*[@data-test="inventory-item-price"]');
  public sortOrder = this.page.locator('xpath=//*[@data-test="product-sort-container"]');

  public product = (productName: string) => findProductRow(this.page, this.productRows, productName);

  public priceFor = (productName: string) => this.product(productName).locator('xpath=.//*[@data-test="inventory-item-price"]');
  public addToCartButton = (productName: string) => this.product(productName).locator('xpath=.//button[normalize-space(.)="Add to cart"]');

  @step()
  public async sortBy(label: string) {
    await this.sortOrder.selectOption({ label });
  }

  @step()
  public async addToCart(productName: string) {
    await this.addToCartButton(productName).click();
  }
}
