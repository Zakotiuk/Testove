import { Component } from './component';
import { step } from './step';

type LoginCredentials = {
  username: string;
  password: string;
};

export class LoginPage extends Component {
  public usernameInput = this.page.locator('xpath=//*[@data-test="username"]');
  public passwordInput = this.page.locator('xpath=//*[@data-test="password"]');
  public loginButton = this.page.locator('xpath=//*[@data-test="login-button"]');
  public errorMessage = this.page.locator('xpath=//*[@data-test="error"]');

  @step()
  public async open() {
    await this.page.goto('/');
  }

  @step()
  public async login({ username, password }: LoginCredentials) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.clickLoginButton();
  }

  @step()
  public async clickLoginButton() {
    await this.loginButton.click();
  }
}
