const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('@playwright/test');

async function main() {
  const directory = path.resolve(__dirname, '../assets/figma');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ deviceScaleFactor: 3, viewport: { width: 256, height: 256 } });

  try {
    for (const name of fs.readdirSync(directory).filter((file) => file.endsWith('.svg'))) {
      const svg = fs.readFileSync(path.join(directory, name), 'utf8');
      await page.setContent(`<html><body style="margin:0;background:transparent">${svg}</body></html>`);
      const bounds = await page.locator('svg').boundingBox();
      if (!bounds || bounds.width <= 0 || bounds.height <= 0) throw new Error(`Invalid SVG: ${name}`);
      await page.screenshot({
        path: path.join(directory, name.replace(/\.svg$/, '.png')),
        omitBackground: true,
        clip: { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height },
      });
      process.stdout.write(`${name} -> PNG\n`);
    }
  } finally {
    await browser.close();
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
