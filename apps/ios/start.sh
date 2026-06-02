#!/usr/bin/env bash
set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$APP_DIR"

cleanup() {
  local exit_code=$?
  if [[ -t 0 ]]; then
    echo
    echo "iOS launcher has stopped."
    read -r -p "Press Enter to close this window..." _
  fi
  exit "$exit_code"
}

trap cleanup EXIT

if command -v xcodebuild >/dev/null 2>&1; then
  echo "Building the iOS app with Xcode tooling..."
  xcodebuild -project Moon.xcodeproj -scheme Moon -configuration Debug build
elif command -v open >/dev/null 2>&1; then
  echo "Xcode command-line tools were not found."
  echo "Opening the Xcode project instead..."
  open Moon.xcodeproj
else
  echo "Open Moon.xcodeproj in Xcode on macOS to build and run the iOS app."
  echo "Project root: $APP_DIR"
fi
