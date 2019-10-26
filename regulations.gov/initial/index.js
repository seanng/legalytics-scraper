/* eslint no-await-in-loop: 0 */
/* eslint no-plusplus: 0 */
/* eslint no-underscore-dangle: 0 */

const puppeteer = require('puppeteer');
const util = require('util');
const path = require('path');
const scrape = require('./scrape');
const exec = util.promisify(require('child_process').exec);

(async () => {
  const { stdout } = await exec(`ls ${path.resolve(__dirname, 'downloads')} | wc -l`);
  const idx = stdout * 1;

  async function init() {
    const browser = await puppeteer.launch({
      args: [
        '--incognito',
        '--ignore-certificate-errors',
        '--ignore-certificate-errors-spki-list ',
      ],
      // 300 does not work.
      slowMo: 500,
    });
    const page = await browser.newPage();
    try {
      await scrape(page, idx);
      await browser.close();
    } catch (error) {
      // LOG ERRORS
      console.error('error: ', error);
      console.error('error.name: ', error.name);
      console.error('error.message: ', error.message);
      await browser.close();
    }
  }
  console.log('Current total downloads: ', idx);
  init();
})();

