#!/usr/bin/env bash
set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$APP_DIR"

cleanup() {
  local exit_code=$?
  if [[ -t 0 ]]; then
    echo
    echo "Android launcher has stopped."
    read -r -p "Press Enter to close this window..." _
  fi
  exit "$exit_code"
}

trap cleanup EXIT

if [[ -x ./gradlew ]]; then
  echo "Building and installing the Android app via Gradle wrapper..."
  ./gradlew :app:installDebug
elif command -v gradle >/dev/null 2>&1; then
  echo "Building the Android app via local Gradle..."
  gradle :app:installDebug
else
  echo "Gradle was not found."
  echo "Open this folder in Android Studio to install the Android SDK and run the app."
  echo "Project root: $APP_DIR"
fi
