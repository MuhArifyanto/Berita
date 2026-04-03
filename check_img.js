const fs = require('fs');
const https = require('https');

const homeUrls = (fs.readFileSync('src/app/home/home.html', 'utf8').match(/https:\/\/images\.unsplash\.com\/[^\"]+/g) || []);
const serviceUrls = (fs.readFileSync('src/app/news.service.ts', 'utf8').match(/https:\/\/images\.unsplash\.com\/[^\']+/g) || []);
const urls = [...new Set([...homeUrls, ...serviceUrls])];

const checkUrl = (url) => {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve({ url, status: res.statusCode });
    }).on('error', (e) => {
      resolve({ url, error: e.message });
    });
  });
};

(async () => {
  for (const url of urls) {
    const res = await checkUrl(url);
    if (res.status !== 200 && res.status !== 301 && res.status !== 302 && res.status !== 307 && res.status !== 308) {
      console.log('BROKEN:', res.url, res.status || res.error);
    }
  }
  console.log('DONE CHECKING IMAGES');
})();
