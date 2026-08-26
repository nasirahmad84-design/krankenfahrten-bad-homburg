#!/usr/bin/env bash

set -Eeuo pipefail

root_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
required_variables=(FTP_HOST FTP_USER FTP_PASSWORD FTP_TEST_DIRECTORY FTP_LIVE_DIRECTORY TEST_SITE_URL LIVE_SITE_URL BLOG_ALERT_TOKEN EDITORIAL_LOGIN_EMAIL)
for variable in "${required_variables[@]}"; do
  if [[ -z "${!variable:-}" ]]; then
    echo "Fehlende Setup-Variable: $variable" >&2
    exit 2
  fi
done

if [[ ! "$BLOG_ALERT_TOKEN" =~ ^[a-fA-F0-9]{64}$ ]]; then
  echo "BLOG_ALERT_TOKEN muss aus 64 hexadezimalen Zeichen bestehen." >&2
  exit 1
fi
if ! php -r 'exit(filter_var($argv[1], FILTER_VALIDATE_EMAIL) ? 0 : 1);' "$EDITORIAL_LOGIN_EMAIL"; then
  echo "EDITORIAL_LOGIN_EMAIL ist keine gültige E-Mail-Adresse." >&2
  exit 1
fi

cd "$root_dir"
php -l public/api/blog-alert.php >/dev/null
php -l public/api/lib/blog-alert.php >/dev/null
php tests/php/blog-alert-test.php
git diff --check

temp_dir="$(mktemp -d)"
trap 'rm -rf "$temp_dir"' EXIT
mkdir -p "$temp_dir/api/lib"
cp public/api/blog-alert.php "$temp_dir/api/blog-alert.php"
cp public/api/lib/blog-alert.php "$temp_dir/api/lib/blog-alert.php"

token_hash="$(BLOG_ALERT_TOKEN_VALUE="$BLOG_ALERT_TOKEN" node -e 'process.stdout.write(require("node:crypto").createHash("sha256").update(process.env.BLOG_ALERT_TOKEN_VALUE).digest("hex"))')"
printf "<?php\ndeclare(strict_types=1);\n\nreturn [\n    'token_sha256' => '%s',\n    'recipient' => '%s',\n];\n" \
  "$token_hash" "$EDITORIAL_LOGIN_EMAIL" > "$temp_dir/api/.blog-alert-config.php"
php -l "$temp_dir/api/.blog-alert-config.php" >/dev/null

upload_target() {
  local remote_directory="$1"
  local label="$2"
  local ftp_base="ftp://${FTP_HOST}/${remote_directory#/}"
  ftp_base="${ftp_base%/}/"
  while IFS= read -r -d '' file; do
    local relative_path="${file#${temp_dir}/}"
    local encoded_path
    encoded_path="$(RELATIVE_PATH="$relative_path" node -e 'process.stdout.write(process.env.RELATIVE_PATH.split("/").map(encodeURIComponent).join("/"))')"
    /usr/bin/curl \
      --silent --show-error --fail \
      --tls-max 1.2 --ssl-reqd --ftp-ssl-control --ftp-create-dirs --ftp-pasv \
      --retry 3 --retry-all-errors --retry-delay 2 \
      --user "${FTP_USER}:${FTP_PASSWORD}" \
      --upload-file "$file" \
      "${ftp_base}${encoded_path}"
    printf 'Hochgeladen (%s): %s\n' "$label" "$relative_path"
  done < <(find "$temp_dir" -type f -print0)
}

probe_target() {
  local site_url="${1%/}"
  local method_status config_status
  method_status="$(/usr/bin/curl --silent --show-error --output /dev/null --write-out '%{http_code}' --max-time 20 "$site_url/api/blog-alert.php")"
  config_status="$(/usr/bin/curl --silent --show-error --output /dev/null --write-out '%{http_code}' --max-time 20 "$site_url/api/.blog-alert-config.php")"
  [[ "$method_status" == "405" ]] || { echo "Alarm-Endpunkt auf $site_url liefert HTTP $method_status statt 405." >&2; exit 1; }
  [[ "$config_status" == "403" ]] || { echo "Alarmkonfiguration auf $site_url liefert HTTP $config_status statt 403." >&2; exit 1; }
}

echo "Installiere Alarm-Endpunkt zuerst auf der Testdomain …"
upload_target "$FTP_TEST_DIRECTORY" test
probe_target "$TEST_SITE_URL"

echo "Installiere den geprüften Alarm-Endpunkt auf der Produktionsdomain …"
upload_target "$FTP_LIVE_DIRECTORY" live
probe_target "$LIVE_SITE_URL"

BLOG_ALERT_REPOSITORY="nasirahmad84-design/krankenfahrten-bad-homburg" \
BLOG_ALERT_WORKFLOW="Geplanter Blog-Queue-Release" \
BLOG_ALERT_RUN_URL="https://github.com/nasirahmad84-design/krankenfahrten-bad-homburg/actions/runs/0" \
BLOG_ALERT_RUN_ID="0" \
BLOG_ALERT_CONCLUSION="test" \
BLOG_ALERT_EVENT_NAME="setup" \
BLOG_ALERT_HEAD_SHA="$(git rev-parse HEAD)" \
bash scripts/send-blog-alert.sh

echo "Blog-Alarmierung installiert und mit einer Testmail geprüft."
