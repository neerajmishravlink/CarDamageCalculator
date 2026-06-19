param(
  [string]$Requirements = "tools/requirements-docs.txt",
  [string]$Script = "tools/build_docs.py"
)

Write-Host "Installing docs build dependency..."
python -m pip install -r $Requirements

Write-Host "Building static docs..."
python $Script

Write-Host "Docs built. Open docs\index.html in a browser to view."