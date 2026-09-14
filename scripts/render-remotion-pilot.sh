#!/usr/bin/env bash
set -euo pipefail

project_root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$project_root"

article="automation/blog/published/krankenfahrt-oder-krankentransport-unterschied.json"
output_directory="artifacts/remotion"

mkdir -p "$output_directory"

npx remotion render remotion/index.ts ArticleExplainer \
  "$output_directory/krankenfahrt-oder-krankentransport-1080x1920.mp4" \
  --props="$article" \
  --codec=h264 \
  --crf=20 \
  --overwrite

npx remotion still remotion/index.ts ArticleStill \
  "$output_directory/krankenfahrt-oder-krankentransport-1200x900.png" \
  --props="$article" \
  --image-format=png \
  --overwrite

echo "Remotion-Pilot erzeugt unter $output_directory/."
