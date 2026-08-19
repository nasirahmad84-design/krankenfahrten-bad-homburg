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

echo "Prüfe den Verzeichnisschutz vor dem Upload …"
preflight_status="$(/usr/bin/curl --silent --show-error --output /dev/null --write-out '%{http_code}' --max-time 20 "$cockpit_url")"
if [[ "$preflight_status" != "401" ]]; then
  echo "Abbruch: $cockpit_url liefert HTTP $preflight_status statt 401." >&2
  echo "Richte zuerst im ALL-INKL-KAS einen Verzeichnisschutz für /redaktion/ ein." >&2
  exit 1
fi

cd "$root_dir"
npm run editorial:build
npm run editorial:verify
git diff --check

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
while IFS= read -r -d '' file; do upload_file "$file"; done < <(find out-editorial -type f -print0)

postflight_headers="$(/usr/bin/curl --silent --show-error --dump-header - --output /dev/null --max-time 20 "$cockpit_url")"
if ! printf '%s' "$postflight_headers" | /usr/bin/grep -Eiq '^HTTP/[^ ]+ 401'; then
  echo "Abbruch: Der Verzeichnisschutz ist nach dem Upload nicht mehr aktiv." >&2
  exit 1
fi
if ! printf '%s' "$postflight_headers" | /usr/bin/grep -Eiq '^WWW-Authenticate: Basic'; then
  echo "Abbruch: Der Server meldet keinen HTTP-Basic-Verzeichnisschutz." >&2
  exit 1
fi

echo "Redaktionscockpit geschützt auf $cockpit_url veröffentlicht."
