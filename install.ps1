$ErrorActionPreference = 'Stop'

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    throw '未找到 Node.js。请从 https://nodejs.org/en/download 安装后重试。'
}

node (Join-Path $PSScriptRoot 'install.mjs') --target $PSScriptRoot
if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
}
