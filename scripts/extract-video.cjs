const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();

  const videoUrls = new Set();

  // Intercept all network requests
  page.on('request', (request) => {
    const url = request.url();
    if (url.includes('.mp4') || url.includes('video') || url.includes('m3u8') || url.includes('storage/uploads')) {
      videoUrls.add(url);
    }
  });

  page.on('response', async (response) => {
    const url = response.url();
    const contentType = response.headers()['content-type'] || '';
    if (contentType.includes('video') || url.includes('.mp4') || url.includes('m3u8')) {
      videoUrls.add(url);
    }
  });

  const targetUrl = 'https://app.tapnow.ai/home/taptv/22/b0d3c5b2-1060-4f94-9820-67378d13baf1?order=final_score&event_id=22';

  try {
    await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 60000 });
    // Wait extra time for dynamic content
    await page.waitForTimeout(8000);

    // Also check page for video elements
    const pageVideos = await page.evaluate(() => {
      const videos = [];
      document.querySelectorAll('video, source').forEach((el) => {
        const src = el.getAttribute('src') || el.currentSrc;
        if (src) videos.push(src);
      });
      return videos;
    });
    pageVideos.forEach((url) => videoUrls.add(url));

    console.log('=== FOUND VIDEO URLS ===');
    videoUrls.forEach((url) => console.log(url));
    if (videoUrls.size === 0) {
      console.log('No video URLs found directly. Listing all mp4-like requests...');
    }
  } catch (e) {
    console.error('Error:', e.message);
  }

  await browser.close();
})();
