const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

(async () => {
  const docsDir = path.resolve(__dirname, '..', 'docs');
  const mmdPath = path.join(docsDir, 'architecture.mmd');
  const outPath = path.join(docsDir, 'Architecture.png');

  if (!fs.existsSync(mmdPath)) {
    console.error('Mermaid source not found:', mmdPath);
    process.exit(1);
  }

  const mermaidSrc = fs.readFileSync(mmdPath, 'utf8');

  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <style>body{margin:0;padding:8px;background:#fff}</style>
  <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
</head>
<body>
  <div class="mermaid">${mermaidSrc.replace(/</g,'&lt;')}</div>
  <script>
    mermaid.initialize({startOnLoad:true});
    function waitForRender(){
      const el = document.querySelector('.mermaid');
      if (!el) return;
      // heuristic: when element contains an svg child, assume rendered
      const svg = el.querySelector('svg');
      if (svg) {
        window.__MERMAID_RENDERED = true;
        return;
      }
      setTimeout(waitForRender, 50);
    }
    waitForRender();
  </script>
</body>
</html>`;

  const browser = await puppeteer.launch({args:['--no-sandbox','--disable-setuid-sandbox']});
  try {
    const page = await browser.newPage();
    await page.setContent(html, {waitUntil: 'networkidle0'});
    // wait until mermaid sets flag
    await page.waitForFunction('window.__MERMAID_RENDERED === true', {timeout: 10000});
    const el = await page.$('.mermaid svg');
    if (!el) throw new Error('Rendered SVG not found');
    const boundingBox = await el.boundingBox();
    const clip = {
      x: Math.max(0, boundingBox.x - 2),
      y: Math.max(0, boundingBox.y - 2),
      width: Math.min(Math.ceil(boundingBox.width + 4), Math.ceil(page.viewport().width)),
      height: Math.ceil(boundingBox.height + 4)
    };
    await page.screenshot({path: outPath, clip, omitBackground: false});
    console.log('Wrote', outPath);
  } catch (err) {
    console.error('Render failed:', err);
    process.exitCode = 2;
  } finally {
    await browser.close();
  }
})();
