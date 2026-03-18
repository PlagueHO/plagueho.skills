<#
.SYNOPSIS
    Build marketplace.json from individual plugin.json files.

.DESCRIPTION
    Scans every plugins/<name>/plugin.json file and aggregates them into
    the root .github/plugin/marketplace.json. The marketplace envelope
    (name, metadata, owner) is preserved; the plugins array is rebuilt
    from the individual plugin.json files sorted by name.

.PARAMETER RepoRoot
    Path to the repository root. Defaults to four levels up from this script.

.EXAMPLE
    .\Update-MarketplaceFromPlugins.ps1
    .\Update-MarketplaceFromPlugins.ps1 -RepoRoot "C:\repo"
#>
[CmdletBinding()]
param(
    [Parameter()]
    [string]$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$marketplacePath = Join-Path $RepoRoot '.github' 'plugin' 'marketplace.json'
$pluginsDir = Join-Path $RepoRoot 'plugins'

# ---------------------------------------------------------------------------
# Read the existing marketplace envelope
# ---------------------------------------------------------------------------

if (-not (Test-Path $marketplacePath)) {
    Write-Error "marketplace.json not found at: $marketplacePath"
    exit 1
}

$marketplace = Get-Content -Path $marketplacePath -Raw -Encoding UTF8 | ConvertFrom-Json

# ---------------------------------------------------------------------------
# Discover plugin.json files
# ---------------------------------------------------------------------------

if (-not (Test-Path $pluginsDir)) {
    Write-Error "plugins directory not found at: $pluginsDir"
    exit 1
}

$pluginJsonFiles = Get-ChildItem -Path $pluginsDir -Filter 'plugin.json' -Recurse -Depth 1 |
    Sort-Object FullName

if ($pluginJsonFiles.Count -eq 0) {
    Write-Warning "No plugin.json files found under $pluginsDir"
    exit 0
}

Write-Host "Found $($pluginJsonFiles.Count) plugin.json file(s)."

# ---------------------------------------------------------------------------
# Build the plugins array
# ---------------------------------------------------------------------------

$plugins = [System.Collections.ArrayList]::new()

foreach ($file in $pluginJsonFiles) {
    $pluginData = Get-Content -Path $file.FullName -Raw -Encoding UTF8 | ConvertFrom-Json

    # Derive the plugin directory name from the path
    # e.g., plugins/azure-infrastructure/plugin.json -> azure-infrastructure
    $pluginDirName = (Split-Path $file.DirectoryName -Leaf)

    # Build the marketplace plugin entry — source is just the directory name
    $entry = [ordered]@{
        name        = $pluginData.name
        source      = $pluginDirName
        description = $pluginData.description
        version     = $pluginData.version
    }

    $null = $plugins.Add([PSCustomObject]$entry)
    Write-Host "  Added: $($pluginData.name) ($pluginDirName)"
}

# Sort plugins by name
$plugins = [System.Collections.ArrayList]@($plugins | Sort-Object name)

# ---------------------------------------------------------------------------
# Write updated marketplace.json
# ---------------------------------------------------------------------------

$marketplace.plugins = @($plugins)

$json = ($marketplace | ConvertTo-Json -Depth 10) + "`n"
$pluginDir = Split-Path $marketplacePath -Parent
if (-not (Test-Path $pluginDir)) {
    New-Item -Path $pluginDir -ItemType Directory -Force | Out-Null
}
Set-Content -Path $marketplacePath -Value $json -Encoding UTF8 -NoNewline

Write-Host "`nMarketplace updated with $($plugins.Count) plugin(s) at: $marketplacePath"
