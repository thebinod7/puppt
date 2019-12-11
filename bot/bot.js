const puppeteer = require('puppeteer-extra');

const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const script = require('./script.js');

const bot = {
  browser: null,
  page: null,

  initialize: async() => {

    bot.browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    bot.page = await bot.browser.newPage();

  },
  login: async(name, pass) => {

    await bot.page.goto("https://www.duolingo.com/log-in", {waitUntil: 'networkidle2'});

    await bot.page.type("input[data-test='email-input']", name, {delay: 50});
    await bot.page.keyboard.press('Tab');
    await bot.page.type("input[data-test='password-input']", pass, {delay: 50});
    await bot.page.waitFor(1000);

    await bot.page.click('[data-test="register-button"]');
    //await bot.page.keyboard.press('Enter');

    await bot.page.waitForNavigation({ waitUntil: 'networkidle2'});

    await console.log('logged in');

  },
  addxp: async(lang, wantedxp) => {

    await bot.page.goto("https://stories.duolingo.com/?"+wantedxp+"&"+lang, {waitUntil: 'networkidle2'});

    await bot.page.evaluate(script);

    await bot.page.waitForNavigation({ waitUntil: 'networkidle2'});

  },
  close: async() => {
    await bot.browser.close();
  }
}

module.exports = bot;
