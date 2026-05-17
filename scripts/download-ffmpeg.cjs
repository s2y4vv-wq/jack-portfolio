const https = require('https');
const fs = require('fs');
const path = require('path');

const FFMPEG_URL = 'https://github.com/GyanD/codexffmpeg/releases/download/8.0.1/ffmpeg-8.0.1-essentials_build.zip';
const dest = path.join(__dirname, 'ffmpeg.zip');

console.log('Downloading ffmpeg from GitHub...');

https.get(FFMPEG_URL, {
  headers: { 'User-Agent': 'Node.js' },
  timeout: 300000,
}, (response) => {
  if (response.statusCode >= 300 && response.statusCode < 400) {
    // Follow redirect
    console.log('Following redirect to:', response.headers.location);
    https.get(response.headers.location, { headers: { 'User-Agent': 'Node.js' } }, (res2) => {
      const file = fs.createWriteStream(dest);
      let size = 0;
      res2.on('data', (chunk) => { size += chunk.length; if (size % 1000000 < 100000) process.stdout.write('.'); });
      res2.pipe(file);
      file.on('finish', () => {
        console.log('\nDownloaded:', size, 'bytes');
        console.log('Saved to:', dest);
      });
    });
    return;
  }
  const file = fs.createWriteStream(dest);
  let size = 0;
  response.on('data', (chunk) => { size += chunk.length; if (size % 1000000 < 100000) process.stdout.write('.'); });
  response.pipe(file);
  file.on('finish', () => {
    console.log('\nDownloaded:', size, 'bytes');
    console.log('Saved to:', dest);
  });
}).on('error', (err) => {
  console.error('Download failed:', err.message);
});
