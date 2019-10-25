/* eslint no-await-in-loop: 0 */
/* eslint no-underscore-dangle: 0 */
/* eslint no-plusplus: 0 */

const fs = require('fs');
const uuid = require('uuid/v1');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');
const path = require('path');
// allDocuments has 68091 rows.
const allDocuments = require('./documents.json');

const excelIconSelector = 'img[src="./images/fileicons/small/icon_xls.gif"]';

async function waitForFileToDownload(downloadPath) {
  let filename;
  let counter = 0;

  await new Promise((resolve) => {
    const interval = setInterval(() => {
      if (counter === 100) {
        console.log('Took longer than 10 seconds to download.');
        clearInterval(interval);
        resolve();
      }

      if (filename && !filename.endsWith('.crdownload')) {
        clearInterval(interval);
        resolve();
      }
      counter++;
      [filename] = fs.readdirSync(downloadPath);
    }, 100);
  });

  return filename;
}

async function download(page, title) {
  const nestedFolder = uuid();
  const downloadPath = path.resolve(__dirname, 'downloads', nestedFolder);
  mkdirp(downloadPath);
  await page._client.send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath });
  await page.$eval(excelIconSelector, elem => elem.parentElement.click());
  const filename = await waitForFileToDownload(downloadPath);
  if (filename) {
    const filePath = path.resolve(downloadPath, filename);
    const newPath = path.resolve(__dirname, 'downloads', title);
    fs.renameSync(filePath, newPath);
    console.log('File downloaded to ', newPath);
  } else {
    console.log('Re-attempting.');
  }
  rimraf.sync(downloadPath);
  return !!filename;
}

function getTitle(document) {
  const titlePrefix = document['Document Title']
    .slice(9).split('-')[0].trim().toUpperCase();
  return `${titlePrefix}_${document['Document ID']}.xlsx`;
}

module.exports = async function scrape(page, idx) {
  /**
   * MAKE SURE downloads FOLDER IS EMPTY IF CHANGING START.
   * NUMBERS MUST BE LESS THAN 68091 (and START < END obviously)
   */
  const START = 0;
  const END = 68091;

  const documents = allDocuments.slice(START, END);
  let newIdx = idx;

  while (newIdx < documents.length) {
    const document = documents[newIdx];
    const title = getTitle(document);

    await page.goto(document.URL);
    console.log(`Navigating to ${document.URL}`);
    await page.waitForSelector(excelIconSelector, {
      timeout: 18000,
    });
    const downloaded = await download(page, title);
    newIdx = downloaded ? newIdx + 1 : newIdx;
  }
};
