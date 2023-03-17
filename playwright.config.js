// @ts-check
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },
  reporter: 'html',
  use: {
    baseURL: 'https://api.trello.com',
    browserName: 'chromium',
    headless: true,
    actionTimeout: 0,
    screenshot: 'only-on-failure',
    trace: 'off',
  },

});

