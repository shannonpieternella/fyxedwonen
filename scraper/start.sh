#!/usr/bin/env bash
set -euo pipefail

# Simple one-liner runner for the scraper without manual setup steps.
# Creates a virtualenv under scraper/.venv, installs requirements, reads MONGODB_URI
# from the environment or from server/.env, then runs the config runner.

HERE="$(cd "$(dirname "$0")" && pwd)"
VENV="$HERE/.venv"

if [ ! -d "$VENV" ]; then
  echo "🐍 Creating Python virtualenv in $VENV"
  python3 -m venv "$VENV"
fi

source "$VENV/bin/activate"

if [ "${SCRAPER_SKIP_PIP:-0}" != "1" ]; then
  echo "📦 Installing/updating Python dependencies"
  pip install --upgrade pip >/dev/null
  pip install -r "$HERE/requirements.txt" >/dev/null
else
  echo "📦 Skipping pip install (SCRAPER_SKIP_PIP=1)"
fi

# Resolve Mongo URI: prefer env, fallback to scraper/.env then server/.env
if [ -z "${MONGODB_URI:-}" ]; then
  if [ -f "$HERE/.env" ]; then
    export MONGODB_URI=$(grep -E '^MONGODB_URI=' "$HERE/.env" | sed 's/^MONGODB_URI=//')
  fi
fi
if [ -z "${MONGODB_URI:-}" ]; then
  if [ -f "$HERE/../server/.env" ]; then
    export MONGODB_URI=$(grep -E '^MONGODB_URI=' "$HERE/../server/.env" | sed 's/^MONGODB_URI=//')
  fi
fi

if [ -z "${MONGODB_URI:-}" ]; then
  echo "❌ MONGODB_URI is not set (env or server/.env)."
  echo "   Please export MONGODB_URI or add it to server/.env."
  exit 1
fi

# Ensure a database name is known. If URI has no default DB and MONGODB_DB is empty, default to 'fyxed'.
if [ -z "${MONGODB_DB:-}" ]; then
  case "$MONGODB_URI" in
    *"/"*"?"*|*"/"*[a-zA-Z0-9]*) : ;; # URI appears to include a path/db
    *) export MONGODB_DB="fyxed" ;;
  esac
fi

# Masked URI for display
MASKED_URI="$(echo "$MONGODB_URI" | sed -E 's#(mongodb(\+srv)?://)[^:@/]+(:[^@/]+)?@#\1***:***@#')"
echo "🔌 Using Mongo URI: $MASKED_URI"
echo "📂 Database: ${MONGODB_DB:-<default in URI>} (collection: properties)"

# Defaults
SOURCES="${SCRAPER_SOURCES:-pararius}"
CITIES="${SCRAPER_CITIES:-Amsterdam}"
MAX_ITEMS="${SCRAPER_MAX:-0}"

usage() {
  cat <<USAGE
Usage: npm run scrape -- [--sources pararius,kamernet] [--cities "Amsterdam,Utrecht"] [--max 50]
Environment:
  MONGODB_URI (required)  | MONGODB_DB (optional)
  SCRAPER_LOG=DEBUG       | SCRAPER_OBEY=0 to ignore robots during testing
USAGE
}

# Allow CLI overrides: --sources, --cities, --max (require a value)
while [[ $# -gt 0 ]]; do
  case "$1" in
    --sources)
      if [[ -z "${2-}" || "${2-}" == --* ]]; then echo "❌ Missing value for --sources"; usage; exit 2; fi
      SOURCES="$2"; shift 2;;
    --cities)
      if [[ -z "${2-}" || "${2-}" == --* ]]; then echo "❌ Missing value for --cities"; usage; exit 2; fi
      CITIES="$2"; shift 2;;
    --max)
      if [[ -z "${2-}" || "${2-}" == --* ]]; then echo "❌ Missing value for --max"; usage; exit 2; fi
      MAX_ITEMS="$2"; shift 2;;
    -h|--help)
      usage; exit 0;;
    *)
      echo "⚠️  Unknown argument: $1"; usage; exit 2;;
  esac
done

export SCRAPER_DELAY="${SCRAPER_DELAY:-0.75}"
export SCRAPER_CONCURRENCY="${SCRAPER_CONCURRENCY:-6}"
export SCRAPER_LOG="${SCRAPER_LOG:-INFO}"
export SCRAPER_OBEY="${SCRAPER_OBEY:-1}"
export SCRAPY_SETTINGS_MODULE="rentbird_scraper.settings"

echo "🚀 Starting scraper: sources=$SOURCES cities=$CITIES max=$MAX_ITEMS (log=$SCRAPER_LOG, robots=$( [[ "${SCRAPER_OBEY}" == "1" ]] && echo obey || echo ignore ))"
"$VENV/bin/python" "$HERE/run_sources.py" --sources "$SOURCES" --cities "$CITIES" --max "$MAX_ITEMS"
