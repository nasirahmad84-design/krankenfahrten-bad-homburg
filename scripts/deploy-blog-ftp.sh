#!/usr/bin/env bash

set -Eeuo pipefail

target="${1:-}"
slug="${2:-}"
root_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
config_file="${DEPLOY_CONFIG_FILE:-$root_dir/.env.deploy.local}"

if [[ "$target" != "test" && "$target" != "live" ]]; then
  echo "Aufruf: $0 test|live artikel-slug" >&2
  exit 2
fi
if [[ ! "$slug" =~ ^[a-z0-9]+(-[a-z0-9]+)*$ ]]; then
  echo "Ungültiger Artikel-Slug: $slug" >&2
  exit 2
fi
if [[ ! -f "$config_file" ]]; then
  echo "Deployment-Konfiguration fehlt: $config_file" >&2
  exit 2
fi

set -a
# shellcheck disable=SC1090
source "$config_file"
set +a

required_variables=(FTP_HOST FTP_USER FTP_PASSWORD FTP_TEST_DIRECTORY FTP_LIVE_DIRECTORY TEST_SITE_URL LIVE_SITE_URL)
for variable in "${required_variables[@]}"; do
  if [[ -z "${!variable:-}" ]]; then
    echo "Fehlender Wert in $config_file: $variable" >&2
    exit 2
  fi
done

if [[ "$target" == "test" ]]; then
  remote_directory="$FTP_TEST_DIRECTORY"
  site_url="$TEST_SITE_URL"
else
  remote_directory="$FTP_LIVE_DIRECTORY"
  site_url="$LIVE_SITE_URL"
  if [[ "${BLOG_DEPLOY_LIVE_CONFIRM:-}" != "JA" ]]; then
    echo "Live-Blogdeployment benötigt BLOG_DEPLOY_LIVE_CONFIRM=JA." >&2
    exit 1
  fi
fi

remote_directory="/${remote_directory#/}"
remote_directory="${remote_directory%/}/"
ftp_base="ftp://${FTP_HOST}${remote_directory}"
cd "$root_dir"

npm run verify:blog-export -- "$slug"

upload_file() {
  local file="$1"
  local relative_path="${file#out/}"
  local encoded_path
  encoded_path="$(RELATIVE_PATH="$relative_path" node -e 'process.stdout.write(process.env.RELATIVE_PATH.split("/").map(encodeURIComponent).join("/"))')"
  /usr/bin/curl \
    --silent --show-error --fail \
    --tls-max 1.2 --ssl-reqd --ftp-ssl-control --ftp-create-dirs --ftp-pasv \
    --retry 3 --retry-all-errors --retry-delay 2 \
    --user "${FTP_USER}:${FTP_PASSWORD}" \
    --upload-file "$file" \
    "${ftp_base}${encoded_path}"
  printf 'Hochgeladen: %s\n' "$relative_path"
}

echo "Übertrage ausschließlich Ratgeberdateien, Sitemap und benötigte Next-Assets …"
while IFS= read -r -d '' file; do upload_file "$file"; done < <(find "out/ratgeber" -type f -print0)
upload_file "out/sitemap.xml"
while IFS= read -r -d '' file; do upload_file "$file"; done < <(find "out/_next/static" -type f -print0)

article_url="${site_url%/}/ratgeber/${slug}/"
hub_url="${site_url%/}/ratgeber/"
/usr/bin/curl --silent --show-error --fail --location --max-time 30 "$hub_url" >/dev/null
article_html="$(/usr/bin/curl --silent --show-error --fail --location --max-time 30 "$article_url")"
if ! printf '%s' "$article_html" | /usr/bin/grep -Fq "https://krankenfahrten-bad-homburg.de/ratgeber/${slug}/"; then
  echo "Abbruch: Canonical ist nach dem Upload nicht korrekt erreichbar." >&2
  exit 1
fi

headers="$(/usr/bin/curl --silent --show-error --dump-header - --output /dev/null --max-time 30 "$article_url")"
if [[ "$target" == "test" ]]; then
  if ! printf '%s' "$headers" | /usr/bin/grep -Eiq '^X-Robots-Tag: noindex, nofollow, noarchive'; then
    echo "Abbruch: Testartikel besitzt keinen X-Robots-Tag." >&2
    exit 1
  fi
elif printf '%s' "$headers" | /usr/bin/grep -Eiq '^X-Robots-Tag:.*noindex'; then
  echo "Abbruch: Live-Artikel liefert unerwartet noindex." >&2
  exit 1
fi

echo "Blog-Delta auf $article_url erfolgreich veröffentlicht."
