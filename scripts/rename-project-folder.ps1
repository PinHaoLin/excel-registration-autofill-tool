$ErrorActionPreference = "Stop"

$currentFolder = Split-Path -Parent $PSScriptRoot
$parentFolder = Split-Path -Parent $currentFolder
$targetName = "excel-registration-autofill-tool"
$targetFolder = Join-Path $parentFolder $targetName

if ((Split-Path -Leaf $currentFolder) -eq $targetName) {
  Write-Host "Project folder is already named $targetName."
  exit 0
}

if (Test-Path -LiteralPath $targetFolder) {
  throw "Target folder already exists: $targetFolder"
}

Rename-Item -LiteralPath $currentFolder -NewName $targetName
Write-Host "Renamed project folder to $targetName."
