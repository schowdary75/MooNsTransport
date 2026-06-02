#!/usr/bin/env bash
set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$APP_DIR/../.." && pwd)"

cleanup() {
  local exit_code=$?
  if [[ -t 0 ]]; then
    echo
    echo "Web launcher has stopped."
    read -r -p "Press Enter to close this window..." _
  fi
  exit "$exit_code"
}

trap cleanup EXIT

echo "Starting Moon Web App and services..."
cd "$ROOT_DIR"
./start.sh web
