export class LoginPage {
    constructor(page) {
        this.page = page
        this.usernameInput = page.locator('[data-test="username"]')
        this.passwordInput = page.locator('[data-test="password"]')
        this.loginButton = page.locator('[data-test="login-button"]')
        this.usernameInputRedCrossIcon = page.locator('//input[@data-test="username"]/following-sibling::*[@data-icon="circle-xmark"]')
        this.passwordInputRedCrossIcon = page.locator('//input[@data-test="password"]/following-sibling::*[@data-icon="circle-xmark"]')
        this.errorMessage = page.locator('//div[contains(@class, "error-message")]')
        this.closeErrorMessageButton = page.locator('[data-test="error-button"]')
    }

    async open() {
        await this.page.goto('/')
    }

    async login(username, password) {
        await this.setUsernameInput(username)
        await this.setPasswordInput(password)
        await this.clickLoginButton()
    }

    async setUsernameInput(username) {
        await this.usernameInput.fill(username)
    }

    async setPasswordInput(password) {
        await this.passwordInput.fill(password)
    }

    async clickLoginButton() {
        await this.loginButton.click()
    }

    async closeErrorMessage() {
        await this.closeErrorMessageButton.click()
    }

    async clearUsernameInput() {
        await this.usernameInput.clear()
    }
}
