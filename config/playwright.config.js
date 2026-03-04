const { defineConfig, devices } = require('@playwright/test');
const constants = require('../constants/frameworkConstants');

module.exports = defineConfig({
  testDir: '../tests',
  fullyParallel: true,
  retries: constants.RETRIES,
  workers: constants.WORKERS,
  timeout: 60000,
  expect: {
    timeout: 10000
  },
  reporter: [
    ['list'],
    ['allure-playwright', { outputFolder: 'allure-results', detail: true, suiteTitle: true }]
  ],
  use: {
    baseURL: constants.BASE_URL,
    headless: constants.HEADLESS,
    viewport: {
      width: constants.VIEWPORT_WIDTH,
      height: constants.VIEWPORT_HEIGHT
    },
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure'
  },
  projects: [
    {
      name: 'Chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'Firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'WebKit',
      use: { ...devices['Desktop Safari'] }
    },
    {
      name: 'Android',
      use: { ...devices['Pixel 5'] }
    },
    {
      name: 'iOS',
      use: { ...devices['iPhone 12'] }
    }
  ],
  outputDir: '../test-results',
  globalTeardown: require.resolve('../reports/reportManager')
});
