param(
  [string]$Output = "docs/Architecture.png"
)

$mdPath = "docs/Architecture.md"
if (-not (Test-Path $mdPath)) { Write-Error "$mdPath not found"; exit 1 }

$md = Get-Content $mdPath -Raw
$pattern = '(?s)```mermaid(.*?)```'
$match = [regex]::Match($md, $pattern)
if (-not $match.Success) { Write-Error "No mermaid block found in $mdPath"; exit 1 }

$mermaid = $match.Groups[1].Value.Trim()
$inFile = "docs/architecture_diagram.mmd"
Set-Content -Path $inFile -Value $mermaid -Encoding UTF8

# Use npx to run mermaid-cli (will install temporarily if needed)
Write-Host "Rendering mermaid diagram to $Output (using npx @mermaid-js/mermaid-cli)..."
$npxCmd = "npx --yes @mermaid-js/mermaid-cli -i `"$inFile`" -o `"$Output`""
Write-Host $npxCmd

$proc = Start-Process -FilePath "npx" -ArgumentList "--yes","@mermaid-js/mermaid-cli","-i",$inFile,"-o",$Output -NoNewWindow -Wait -PassThru
if ($proc.ExitCode -ne 0) { Write-Error "mmdc failed with exit code $($proc.ExitCode)"; exit $proc.ExitCode }

Write-Host "Wrote $Output"
