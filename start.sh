#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

cleanup() {
  local exit_code=$?
  if [[ -t 0 ]]; then
    echo
    echo "Moon launcher has stopped."
    read -r -p "Press Enter to close this window..." _
  fi
  exit "$exit_code"
}

trap cleanup EXIT

MODE="${1:-}"

print_help() {
  cat <<'HELP'
Moon local launcher

Usage:
  ./start.sh web       Start Docker services, seed DB, and run the Next web app
  ./start.sh android   Build/install the Android debug app when SDK + device exist
  ./start.sh ios       Build/run the iOS app on macOS with Xcode
  ./start.sh all       Start web stack, then attempt Android and iOS helpers

Local URLs:
  Web:     http://localhost:3000
  Health:  http://localhost:3000/api/health
  Adminer: http://localhost:8080

Demo login:
  Rider:    demo@moon.local / demo123
  Admin:    admin@moon.local / admin123
  Operator: operator@moon.local / operator123
HELP
}

require_command() {
  local command_name="$1"
  local message="$2"
  if ! command -v "$command_name" >/dev/null 2>&1; then
    echo "$message"
    exit 1
  fi
}

node_major() {
  node -p "Number(process.versions.node.split('.')[0])"
}

check_node() {
  require_command node "Node.js is required. Install Node 20 LTS, then run this script again."
  require_command npm "npm is required. Install Node 20 LTS with npm 10+, then run this script again."

  local major
  major="$(node_major)"
  if [[ "$major" -lt 20 ]]; then
    echo "Node 20+ is required. Current version: $(node -v)"
    echo "Install/use Node 20 LTS. With nvm: nvm install 20 && nvm use 20"
    exit 1
  fi
}

ensure_env() {
  if [[ ! -f .env && -f .env.example ]]; then
    cp .env.example .env
    echo "Created .env from .env.example"
  fi

  if [[ -f .env ]]; then
    set -a
    # shellcheck disable=SC1091
    source .env
    set +a
  fi
}

install_node_deps() {
  check_node
  if [[ ! -d node_modules ]] || [[ ! -d apps/web/node_modules ]]; then
    echo "Installing npm workspaces..."
    npm install
  fi
}

start_database() {
  require_command docker "Docker is required for MySQL, Redis, and Adminer."
  if ! docker info >/dev/null 2>&1; then
    echo "Docker is installed, but the daemon is not running. Start Docker Desktop and retry."
    exit 1
  fi

  echo "Starting MySQL, Redis, and Adminer..."
  docker compose up -d mysql redis adminer

  echo "Waiting for MySQL..."
  for _ in {1..45}; do
    if docker compose exec -T mysql mysqladmin ping -h localhost --silent >/dev/null 2>&1; then
      return
    fi
    sleep 2
  done

  echo "MySQL did not become ready in time."
  exit 1
}

prepare_database() {
  echo "Applying Prisma schema..."
  npm run db:push

  echo "Seeding local demo data..."
  npm run db:seed
}

start_web() {
  ensure_env
  install_node_deps
  start_database
  prepare_database

  echo
  echo "Moon web is starting at http://localhost:3000"
  echo "Demo login: demo@moon.local / demo123, admin@moon.local / admin123, operator@moon.local / operator123"
  npm run dev -- --filter=@moon/web
}

start_android() {
  require_command java "Java 17+ is required for Android builds."
  if [[ -z "${ANDROID_HOME:-}" && -z "${ANDROID_SDK_ROOT:-}" ]]; then
    echo "ANDROID_HOME or ANDROID_SDK_ROOT is not set. Install/open Android Studio, install SDK 34, then retry."
    exit 1
  fi

  cd "$ROOT_DIR/apps/android"
  if [[ -x ./gradlew ]]; then
    ./gradlew :app:installDebug
  else
    require_command gradle "Gradle was not found. Open apps/android in Android Studio or install Gradle locally."
    gradle :app:installDebug
  fi
}

start_ios() {
  if [[ "$(uname -s)" != "Darwin" ]]; then
    echo "iOS builds require macOS with Xcode. Open apps/ios/Moon.xcodeproj on a Mac."
    exit 0
  fi

  require_command xcodebuild "Xcode command-line tools are required. Install Xcode, then run xcode-select --install."
  cd "$ROOT_DIR/apps/ios"
  xcodebuild -project Moon.xcodeproj -scheme Moon -configuration Debug build
}

case "$MODE" in
  web)
    start_web
    ;;
  android)
    start_android
    ;;
  ios)
    start_ios
    ;;
  all)
    start_web &
    WEB_PID=$!
    sleep 8
    start_android || true
    start_ios || true
    wait "$WEB_PID"
    ;;
  ""|-h|--help|help)
    print_help
    ;;
  *)
    echo "Unknown mode: $MODE"
    print_help
    exit 1
    ;;
esac
