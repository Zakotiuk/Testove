import { Component } from './component';
import { step } from './step';

type CustomerDetails = {
  firstName: string;
  lastName: string;
  postalCode: string;
};

export class CheckoutPage extends Component {
  public firstNameInput = this.page.locator('xpath=//*[@data-test="firstName"]');
  public lastNameInput = this.page.locator('xpath=//*[@data-test="lastName"]');
  public postalCodeInput = this.page.locator('xpath=//*[@data-test="postalCode"]');
  public continueButton = this.page.locator('xpath=//*[@data-test="continue"]');

  public orderItemNames = this.page.locator('xpath=//*[@data-test="inventory-item-name"]');
  public subtotal = this.page.locator('xpath=//*[@data-test="subtotal-label"]');
  public tax = this.page.locator('xpath=//*[@data-test="tax-label"]');
  public total = this.page.locator('xpath=//*[@data-test="total-label"]');
  public finishButton = this.page.locator('xpath=//*[@data-test="finish"]');

  public confirmation = this.page.locator('xpath=//*[@data-test="complete-header"]');

  @step()
  public async submitCustomerDetails({ firstName, lastName, postalCode }: CustomerDetails) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }

  @step()
  public async placeOrder() {
    await this.finishButton.click();
  }
}
