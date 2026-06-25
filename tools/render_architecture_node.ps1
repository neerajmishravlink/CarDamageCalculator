param(
  [string]$Out = "docs/Architecture.png"
)

# Ensure Node is available
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Error "Node.js is not available in PATH. Install Node.js and try again."; exit 1
}

Write-Host "Installing puppeteer (may download Chromium on first run)..."
npm install puppeteer --no-audit --no-fund

Write-Host "Running Node renderer..."
node tools/render_architecture_node.js

if (Test-Path $Out) { Write-Host "Wrote $Out" } else { Write-Error "Render did not produce $Out"; exit 2 }
