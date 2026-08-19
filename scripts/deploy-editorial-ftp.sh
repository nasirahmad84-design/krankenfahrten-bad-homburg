#!/usr/bin/env bash

set -Eeuo pipefail

root_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
config_file="${DEPLOY_CONFIG_FILE:-$root_dir/.env.deploy.local}"

if [[ -f "$config_file" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$config_file"
  set +a
fi

required_variables=(FTP_HOST FTP_USER FTP_PASSWORD FTP_TEST_DIRECTORY TEST_SITE_URL)
for variable in "${required_variables[@]}"; do
  if [[ -z "${!variable:-}" ]]; then
    echo "Fehlende Deployment-Variable: $variable (Umgebung oder $config_file)." >&2
    exit 2
  fi
done

remote_root="/${FTP_TEST_DIRECTORY#/}"
remote_root="${remote_root%/}/redaktion/"
ftp_base="ftp://${FTP_HOST}${remote_root}"
cockpit_url="${TEST_SITE_URL%/}/redaktion/"

cd "$root_dir"
npm run editorial:build
npm run editorial:verify
php -l out-editorial/index.php >/dev/null
php -l out-editorial/lib/auth.php >/dev/null
php -l out-editorial/content.php >/dev/null
php tests/php/editorial-auth-test.php
git diff --check

config_status="$(/usr/bin/curl --silent --show-error --output /dev/null --write-out '%{http_code}' --max-time 20 "${TEST_SITE_URL%/}/api/config.php")"
if [[ "$config_status" != "403" ]]; then
  echo "Abbruch: Die serverseitige API-Konfiguration liefert HTTP $config_status statt 403." >&2
  exit 1
fi

upload_file() {
  local file="$1"
  local relative_path="${file#out-editorial/}"
  local encoded_path
  encoded_path="$(RELATIVE_PATH="$relative_path" node -e 'process.stdout.write(process.env.RELATIVE_PATH.split("/").map(encodeURIComponent).join("/"))')"
  /usr/bin/curl \
    --silent --show-error --fail \
    --tls-max 1.2 --ssl-reqd --ftp-ssl-control --ftp-create-dirs --ftp-pasv \
    --retry 3 --retry-all-errors --retry-delay 2 \
    --user "${FTP_USER}:${FTP_PASSWORD}" \
    --upload-file "$file" \
    "${ftp_base}${encoded_path}"
  printf 'Hochgeladen: redaktion/%s\n' "$relative_path"
}

echo "Übertrage ausschließlich das interne Redaktionscockpit …"
while IFS= read -r -d '' file; do upload_file "$file"; done < <(find out-editorial -type f ! -name '.htaccess' -print0)
upload_file "out-editorial/.htaccess"

login_response="$(/usr/bin/curl --silent --show-error --dump-header - --max-time 20 "$cockpit_url")"
if ! printf '%s' "$login_response" | /usr/bin/grep -Eiq '^HTTP/[^ ]+ 200'; then
  echo "Abbruch: Das Cockpit liefert nach dem Upload nicht HTTP 200." >&2
  exit 1
fi
if ! printf '%s' "$login_response" | /usr/bin/grep -Fq 'Redaktionscockpit öffnen'; then
  echo "Abbruch: Die Loginansicht wurde nicht ausgeliefert." >&2
  exit 1
fi
if ! printf '%s' "$login_response" | /usr/bin/grep -Eiq '^X-Robots-Tag: noindex, nofollow, noarchive'; then
  echo "Abbruch: Der X-Robots-Tag des Cockpits fehlt." >&2
  exit 1
fi
if printf '%s' "$login_response" | /usr/bin/grep -Fq 'Vorbereitete Ratgeberartikel'; then
  echo "Abbruch: Artikelinhalte sind ohne Anmeldung sichtbar." >&2
  exit 1
fi

for protected_path in content.php lib/auth.php; do
  protected_status="$(/usr/bin/curl --silent --show-error --output /dev/null --write-out '%{http_code}' --max-time 20 "${cockpit_url}${protected_path}")"
  if [[ "$protected_status" != "403" ]]; then
    echo "Abbruch: redaktion/$protected_path liefert HTTP $protected_status statt 403." >&2
    exit 1
  fi
done

article_response="$(/usr/bin/curl --silent --show-error --max-time 20 "${cockpit_url}artikel/krankenfahrt-anfragen-welche-angaben/")"
if ! printf '%s' "$article_response" | /usr/bin/grep -Fq 'Redaktionscockpit öffnen'; then
  echo "Abbruch: Ein Artikelpfad wird vor der Anmeldung nicht auf die Loginansicht beschränkt." >&2
  exit 1
fi
if printf '%s' "$article_response" | /usr/bin/grep -Fq 'Welche Angaben werden benötigt'; then
  echo "Abbruch: Ein Artikel ist ohne Anmeldung lesbar." >&2
  exit 1
fi

echo "Redaktionscockpit mit Einmalcode-Login auf $cockpit_url veröffentlicht."
