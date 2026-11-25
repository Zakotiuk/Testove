import { Component } from './component';
import { step } from './step';

export class CartLink extends Component {
  public link = this.page.locator('xpath=//*[@data-test="shopping-cart-link"]');
  public badge = this.link.locator('xpath=.//*[@data-test="shopping-cart-badge"]');

  @step()
  public async clickCartLink() {
    await this.link.click();
  }
}
