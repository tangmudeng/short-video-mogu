#!/usr/bin/env sh
set -eu

if ! command -v node >/dev/null 2>&1; then
  echo "未找到 Node.js。请从 https://nodejs.org/en/download 安装后重试。" >&2
  exit 1
fi

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
exec node "$SCRIPT_DIR/install.mjs" --target "$SCRIPT_DIR"
