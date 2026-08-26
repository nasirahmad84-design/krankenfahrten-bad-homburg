#!/usr/bin/env bash

set -Eeuo pipefail

required_variables=(
  LIVE_SITE_URL
  BLOG_ALERT_TOKEN
  BLOG_ALERT_REPOSITORY
  BLOG_ALERT_WORKFLOW
  BLOG_ALERT_RUN_URL
  BLOG_ALERT_RUN_ID
  BLOG_ALERT_CONCLUSION
  BLOG_ALERT_EVENT_NAME
  BLOG_ALERT_HEAD_SHA
)
for variable in "${required_variables[@]}"; do
  if [[ -z "${!variable:-}" ]]; then
    echo "Fehlende Alarmvariable: $variable" >&2
    exit 2
  fi
done

payload_file="$(mktemp)"
trap 'rm -f "$payload_file"' EXIT

PAYLOAD_FILE="$payload_file" node -e '
  const { writeFileSync } = require("node:fs");
  const payload = {
    repository: process.env.BLOG_ALERT_REPOSITORY,
    workflow: process.env.BLOG_ALERT_WORKFLOW,
    runUrl: process.env.BLOG_ALERT_RUN_URL,
    runId: process.env.BLOG_ALERT_RUN_ID,
    conclusion: process.env.BLOG_ALERT_CONCLUSION,
    eventName: process.env.BLOG_ALERT_EVENT_NAME,
    headSha: process.env.BLOG_ALERT_HEAD_SHA,
  };
  writeFileSync(process.env.PAYLOAD_FILE, JSON.stringify(payload));
'

status="$(/usr/bin/curl \
  --silent --show-error \
  --output /dev/null \
  --write-out '%{http_code}' \
  --max-time 30 \
  --header 'Content-Type: application/json' \
  --header "X-Blog-Alert-Token: ${BLOG_ALERT_TOKEN}" \
  --data-binary "@${payload_file}" \
  "${LIVE_SITE_URL%/}/api/blog-alert.php")"

if [[ "$status" != "204" ]]; then
  echo "Blog-Alarm konnte nicht versendet werden (HTTP $status)." >&2
  exit 1
fi

echo "Blog-Alarm wurde serverseitig versendet."
