const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const uuid = require('uuid/v1');
const mkdirp = require('mkdirp');
const documents = require('./documents.json');

const excelIconSelector = 'img[src="./images/fileicons/small/icon_xls.gif"]';

async function waitForFileToDownload(downloadPath) {
  let filename;
  while (!filename || filename.endsWith('.crdownload')) {
    // eslint-disable-next-line
    await new Promise(resolve => setTimeout(resolve, 10));
    [filename] = fs.readdirSync(downloadPath);
  }
  return filename;
}

function cleanFolder(downloadedPath, newFilename, downloadPath) {
  const newPath = path.resolve(__dirname, 'downloads', newFilename);
  fs.rename(downloadedPath, newPath, (err) => {
    if (err) throw err;
    fs.rmdir(downloadPath, { recursive: true }, (error) => {
      if (error) throw error;
    });
  });
  return newPath;
}

async function download(page, title) {
  const nestedFolder = uuid();
  const downloadPath = path.resolve(__dirname, 'downloads', nestedFolder);
  mkdirp(downloadPath);
  // eslint-disable-next-line
  await page._client.send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath });
  await page.$eval(excelIconSelector, elem => elem.parentElement.click());
  const filename = await waitForFileToDownload(downloadPath);
  const downloadedPath = path.resolve(downloadPath, filename);
  const newPath = cleanFolder(downloadedPath, title, downloadPath);
  console.log('File downloaded to ', newPath);
}

async function scrape() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  console.log('opening browser.');
  await page.setViewport({ width: 1280, height: 666 });
  const newDocs = documents;
  // .slice(34);
  // configure AFTER ls | wc -l

  // eslint-disable-next-line
  for (let document of newDocs) {
    const titlePrefix = document['Document Title']
      .slice(9).split('-')[0].trim().toUpperCase();
    const title = `${titlePrefix}_${document['Document ID']}.xlsx`;
    // eslint-disable-next-line
    await page.goto(document.URL);
    await page.waitForSelector(excelIconSelector);
    await download(page, title);
  }
  // loop here on Links.

  await browser.close();
}

(async () => {
  scrape();
})();
