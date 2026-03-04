require('dotenv').config();

const frameworkConstants = {
  BASE_URL: process.env.BASE_URL || 'https://practicetestautomation.com/practice-test-login/',
  USERNAME: process.env.USERNAME || 'student',
  PASSWORD: process.env.PASSWORD || 'Password123',

  HEADLESS: process.env.HEADLESS !== 'false',
  VIEWPORT_WIDTH: Number(process.env.VIEWPORT_WIDTH || 1366),
  VIEWPORT_HEIGHT: Number(process.env.VIEWPORT_HEIGHT || 768),
  RETRIES: Number(process.env.RETRIES || 1),
  WORKERS: process.env.WORKERS ? Number(process.env.WORKERS) : undefined,

  RETENTION_DAYS: Number(process.env.RETENTION_DAYS || 60),

  GITHUB_REPORT_REPO: process.env.GITHUB_REPORT_REPO || '',
  GITHUB_USERNAME: process.env.GITHUB_USERNAME || '',
  GITHUB_TOKEN: process.env.GITHUB_TOKEN || '',
  GITHUB_PAGES_BRANCH: process.env.GITHUB_PAGES_BRANCH || 'gh-pages',
  LOCAL_GH_REPORT_DIR: process.env.LOCAL_GH_REPORT_DIR || 'gh-allure-reports',

  EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
  EMAIL_PORT: Number(process.env.EMAIL_PORT || 587),
  EMAIL_USER: process.env.EMAIL_USER || '',
  EMAIL_APP_PASSWORD: process.env.EMAIL_APP_PASSWORD || '',
  EMAIL_TO: process.env.EMAIL_TO || '',

  // SLACK_WEBHOOK: process.env.SLACK_WEBHOOK || '',
  // ROCKET_CHAT_WEBHOOK: process.env.ROCKET_CHAT_WEBHOOK || '',

  SUCCESS_URL: process.env.SUCCESS_URL || 'https://practicetestautomation.com/logged-in-successfully/',
  SUCCESS_HEADING: process.env.SUCCESS_HEADING || 'Logged In Successfully'
};

module.exports = frameworkConstants;
