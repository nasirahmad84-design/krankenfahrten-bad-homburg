#!/usr/bin/env bash

set -Eeuo pipefail

run_directory="${1:-}"
if [[ -z "$run_directory" ]]; then
  echo "Aufruf: $0 automation/blog/articles/RUN-ID" >&2
  exit 2
fi

root_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$root_dir"

slug="$(node -e '
  const fs = require("node:fs");
  const path = require("node:path");
  const run = JSON.parse(fs.readFileSync(path.join(process.argv[1], "run-status.json"), "utf8"));
  process.stdout.write(run.articleSlug);
' "$run_directory")"

echo "Prüfe ausschließlich den freigegebenen Bloglauf …"
npm run blog:validate -- "$run_directory"
npm run blog:promote -- "$run_directory" -- --dry-run
npm run blog:promote -- "$run_directory"
npm run blog:generate
npm run test:blog

echo "Erzeuge den statischen Export als technische Voraussetzung für die Artikeldateien …"
npm run build
npm run verify:blog-export -- "$slug"
git diff --check

echo "Blog-Release vorbereitet: $slug"
