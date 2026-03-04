class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.submitButton = page.locator('#submit');
    this.successHeading = page.locator('h1.post-title');
    this.errorMessage = page.locator('#error');
  }

  async navigateToLogin(baseUrl) {
    await this.page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  }

  async enterUsername(username) {
    await this.usernameInput.fill(username);
  }

  async enterPassword(password) {
    await this.passwordInput.fill(password);
  }

  async clickSubmit() {
    await this.submitButton.click();
  }

  async getSuccessHeadingText() {
    await this.successHeading.waitFor({ state: 'visible' });
    return this.successHeading.textContent();
  }

  async getErrorTextIfVisible() {
    if (await this.errorMessage.isVisible()) {
      return this.errorMessage.textContent();
    }
    return '';
  }
}

module.exports = LoginPage;
