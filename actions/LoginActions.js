const { expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const constants = require('../constants/frameworkConstants');

class LoginActions {
  constructor(page) {
    this.loginPage = new LoginPage(page);
    this.page = page;
  }

  async loginAndValidateSuccess() {
    await this.loginPage.navigateToLogin(constants.BASE_URL);
    await this.loginPage.enterUsername(constants.USERNAME);
    await this.loginPage.enterPassword(constants.PASSWORD);
    await this.loginPage.clickSubmit();

    try {
      await expect(this.page).toHaveURL(constants.SUCCESS_URL, { timeout: 15000 });
      const headingText = await this.loginPage.getSuccessHeadingText();
      expect(headingText.trim()).toBe(constants.SUCCESS_HEADING);
    } catch (error) {
      const errorText = await this.loginPage.getErrorTextIfVisible();
      throw new Error(
        `Login validation failed. Captured #error text: "${(errorText || 'No error message displayed').trim()}". Root error: ${error.message}`
      );
    }
  }
}

module.exports = LoginActions;
