const { test } = require('@playwright/test');
const LoginActions = require('../actions/LoginActions');

test.describe('Practice Test Automation Login', () => {
  test('should login successfully with valid credentials', async ({ page }) => {
    const loginActions = new LoginActions(page);
    await loginActions.loginAndValidateSuccess();
  });
});
