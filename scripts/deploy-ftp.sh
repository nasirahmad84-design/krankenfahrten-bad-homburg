#!/usr/bin/env bash

set -Eeuo pipefail

target="${1:-}"
root_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
config_file="${DEPLOY_CONFIG_FILE:-$root_dir/.env.deploy.local}"

if [[ "$target" != "test" && "$target" != "live" ]]; then
  echo "Aufruf: $0 test|live" >&2
  exit 2
fi

if [[ ! -f "$config_file" ]]; then
  echo "Lokale Deployment-Konfiguration fehlt: $config_file" >&2
  echo "Kopiere .env.deploy.example nach .env.deploy.local und ergänze das Passwort." >&2
  exit 2
fi

set -a
# shellcheck disable=SC1090
source "$config_file"
set +a

required_variables=(
  FTP_HOST
  FTP_USER
  FTP_PASSWORD
  FTP_TEST_DIRECTORY
  FTP_LIVE_DIRECTORY
  TEST_SITE_URL
  LIVE_SITE_URL
)

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

  if [[ "${DEPLOY_LIVE_CONFIRM:-}" != "JA" ]]; then
    printf 'Wirklich auf die LIVE-Domain %s veröffentlichen? Tippe LIVE: ' "$site_url"
    read -r confirmation
    if [[ "$confirmation" != "LIVE" ]]; then
      echo "Live-Deployment abgebrochen."
      exit 1
    fi
  fi
fi

remote_directory="/${remote_directory#/}"
remote_directory="${remote_directory%/}/"
ftp_base="ftp://${FTP_HOST}${remote_directory}"

echo "Prüfe die serverseitige Formular-Konfiguration …"
if ! remote_api_entries="$(
  /usr/bin/curl \
    --silent \
    --show-error \
    --fail \
    --tls-max 1.2 \
    --ssl-reqd \
    --ftp-ssl-control \
    --ftp-pasv \
    --retry 2 \
    --retry-delay 1 \
    --user "${FTP_USER}:${FTP_PASSWORD}" \
    --list-only \
    "${ftp_base}api/"
)"; then
  echo "Abbruch: Das API-Verzeichnis auf $site_url konnte nicht sicher geprüft werden." >&2
  exit 1
fi

if ! printf '%s\n' "$remote_api_entries" | /usr/bin/tr -d '\r' | /usr/bin/grep -Fxq 'config.php'; then
  echo "Abbruch: Auf $site_url fehlt api/config.php. Die Datei muss vor dem Deployment serverseitig eingerichtet sein." >&2
  exit 1
fi

cd "$root_dir"

echo "Prüfe und baue das Deployment-Paket …"
npm test
npm run lint
npm run build
npm run test:export
npm run verify:deployment
git diff --check

if [[ ! -d out ]]; then
  echo "Build-Verzeichnis out/ fehlt." >&2
  exit 1
fi

if [[ -e out/api/config.php ]]; then
  echo "Abbruch: out/api/config.php darf niemals hochgeladen werden." >&2
  exit 1
fi

upload_file() {
  local file="$1"
  local relative_path="${2:-${file#out/}}"
  local encoded_path

  encoded_path="$(
    RELATIVE_PATH="$relative_path" node -e '
      const value = process.env.RELATIVE_PATH;
      process.stdout.write(value.split("/").map(encodeURIComponent).join("/"));
    '
  )"

  printf 'Lade hoch: %s\n' "$relative_path"

  /usr/bin/curl \
    --silent \
    --show-error \
    --fail \
    --tls-max 1.2 \
    --ssl-reqd \
    --ftp-ssl-control \
    --ftp-create-dirs \
    --ftp-pasv \
    --retry 2 \
    --retry-delay 1 \
    --user "${FTP_USER}:${FTP_PASSWORD}" \
    --upload-file "$file" \
    "${ftp_base}${encoded_path}"

  printf 'Hochgeladen: %s\n' "$relative_path"
}

echo "Übertrage Assets und PHP-Dateien verschlüsselt per FTPS …"
while IFS= read -r -d '' file; do
  upload_file "$file"
done < <(find out -type f ! -name '*.html' ! -name '.htaccess' -print0)

echo "Übertrage HTML-Dateien …"
while IFS= read -r -d '' file; do
  upload_file "$file"
done < <(find out -type f -name '*.html' -print0)

echo "Übertrage geschützte Verzeichniskonfigurationen …"
while IFS= read -r -d '' file; do
  upload_file "$file"
done < <(find out -type f -name '.htaccess' ! -path 'out/.htaccess' -print0)

echo "Übertrage abschließend die Root-Konfiguration …"
upload_file "out/.htaccess"

if [[ "$target" == "test" ]]; then
  staging_htaccess="$(mktemp "${TMPDIR:-/tmp}/krankenfahrten-staging-htaccess.XXXXXX")"
  {
    /bin/cat "out/.htaccess"
    printf '\n'
    /bin/cat "deployment/staging.htaccess.example"
  } >"$staging_htaccess"

  echo "Ergänze den Suchmaschinenschutz der Testdomain …"
  upload_file "$staging_htaccess" ".htaccess"
  /bin/rm -f "$staging_htaccess"
fi

echo "Prüfe die veröffentlichte Website …"
/usr/bin/curl --silent --show-error --fail --location --max-time 20 "${site_url}/" >/dev/null
/usr/bin/curl --silent --show-error --fail --location --max-time 20 "${site_url}/leistungen/" >/dev/null

response_headers="$(
  /usr/bin/curl --silent --show-error --dump-header - --output /dev/null \
    --max-time 20 "${site_url}/"
)"
if [[ "$target" == "test" ]]; then
  if ! printf '%s' "$response_headers" | /usr/bin/grep -Eiq '^X-Robots-Tag: noindex, nofollow, noarchive'; then
    echo "Testdomain liefert nicht den erforderlichen X-Robots-Tag." >&2
    exit 1
  fi
elif printf '%s' "$response_headers" | /usr/bin/grep -Eiq '^X-Robots-Tag:.*noindex'; then
  echo "Abbruch: Live-Domain liefert unerwartet einen noindex-Header." >&2
  exit 1
fi

status_404="$(
  /usr/bin/curl --silent --output /dev/null --write-out '%{http_code}' \
    --max-time 20 "${site_url}/deployment-404-check/"
)"
if [[ "$status_404" != "404" ]]; then
  echo "Warnung: Nicht vorhandene URL liefert HTTP $status_404 statt 404." >&2
  exit 1
fi

for protected_path in "api/config.php" "api/config.example.php"; do
  protected_status="$(
    /usr/bin/curl --silent --show-error --output /dev/null --write-out '%{http_code}' \
      --max-time 20 "${site_url}/${protected_path}"
  )"
  if [[ "$protected_status" != "403" ]]; then
    echo "Abbruch: ${site_url}/${protected_path} liefert HTTP $protected_status statt 403." >&2
    exit 1
  fi
done

form_preflight_payload="$(
  node <<'NODE'
const date = new Date();
date.setUTCDate(date.getUTCDate() + 1);
process.stdout.write(JSON.stringify({
  name: "Technischer Deployment-Test",
  phone: "0175 4142222",
  email: "",
  date: date.toISOString().slice(0, 10),
  time: "10:00",
  pickup: "Technischer Test-Abholort",
  destination: "Technisches Test-Ziel",
  reason: "Sonstiger Fahrtanlass",
  journey: "Nur Hinfahrt",
  notes: "Automatischer Konfigurationscheck ohne E-Mail-Versand.",
  consent: true,
  website: "",
  formStartedAt: 0,
}));
NODE
)"

form_preflight_status="$(
  /usr/bin/curl --silent --show-error --output /dev/null --write-out '%{http_code}' \
    --max-time 20 \
    --request POST \
    --header 'Content-Type: application/json' \
    --header "Origin: ${site_url}" \
    --data-binary "$form_preflight_payload" \
    "${site_url}/api/fahrtanfrage.php"
)"
if [[ "$form_preflight_status" != "400" ]]; then
  echo "Abbruch: Der Formular-Konfigurationscheck liefert HTTP $form_preflight_status statt 400." >&2
  echo "Prüfe api/config.php, allowed_origin und den PHP-Endpunkt auf $site_url." >&2
  exit 1
fi

echo "Deployment auf $site_url erfolgreich abgeschlossen."
