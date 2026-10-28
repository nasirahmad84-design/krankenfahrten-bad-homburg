import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";

const images = JSON.parse(readFileSync("automation/blog/google-business-images.json", "utf8"));
const mode = process.argv[2];
if (!["backup", "upload"].includes(mode)) throw new Error("backup oder upload erforderlich.");
const backup = resolve(process.env.RUNNER_TEMP || "/tmp", "google-images-backup");
const targets = [
  ["https://test.krankenfahrten-bad-homburg.de", process.env.FTP_TEST_DIRECTORY],
  ["https://krankenfahrten-bad-homburg.de", process.env.FTP_LIVE_DIRECTORY],
];
const hash = data => createHash("sha256").update(data).digest("hex");
for (const [origin, directory] of targets) {
  const report = [];
  for (const [slug, image] of Object.entries(images)) {
    if (!/^[a-z0-9-]+$/.test(slug)) throw new Error("Ungültiger Bildname.");
    const path = "/images/google-business/" + slug + ".jpg";
    const local = readFileSync(resolve("public" + path));
    if (hash(local) !== image.sha256 || local.length !== image.bytes) throw new Error("Lokales Bild weicht vom Manifest ab.");
    if (mode === "backup") {
      const response = await fetch(origin + path, { redirect: "error", signal: AbortSignal.timeout(20000) });
      if (![200, 404].includes(response.status)) throw new Error("Bildsicherung nicht möglich (HTTP " + response.status + ").");
      const folder = resolve(backup, new URL(origin).hostname);
      mkdirSync(folder, { recursive: true });
      if (response.ok) writeFileSync(resolve(folder, slug + ".jpg"), Buffer.from(await response.arrayBuffer()));
      report.push({ slug, previousStatus: response.status });
      writeFileSync(resolve(folder, "manifest.json"), JSON.stringify(report, null, 2));
    } else {
      for (const name of ["FTP_HOST", "FTP_USER", "FTP_PASSWORD"]) if (!process.env[name]) throw new Error("FTP-Konfiguration fehlt.");
      if (!directory || !/^\/[a-z0-9.-]+\/$/.test(directory)) throw new Error("Exaktes FTP-Ziel fehlt.");
      // Credentials are provided on curl stdin, never as command-line arguments.
      const quote = value => value.replaceAll("\\", "\\\\").replaceAll('"', '\\"');
      const result = spawnSync("curl", ["--config", "-", "--silent", "--show-error", "--fail", "--ssl-reqd", "--ftp-ssl-control", "--tls-max", "1.2", "--disable-epsv", "--ftp-pasv", "--ftp-create-dirs", "--connect-timeout", "20", "--max-time", "60", "--retry", "2", "--upload-file", "public" + path, "ftp://" + process.env.FTP_HOST + directory.replace(/\/$/, "") + path], {
        input: 'user = "' + quote(process.env.FTP_USER + ":" + process.env.FTP_PASSWORD) + '"\n', encoding: "utf8",
      });
      if (result.status !== 0) throw new Error("FTPS-Bildupload fehlgeschlagen; Zugangsdaten werden nicht ausgegeben.");
      const response = await fetch(origin + path, { redirect: "error", signal: AbortSignal.timeout(20000) });
      const remote = Buffer.from(await response.arrayBuffer());
      if (!response.ok || !/image\/jpeg/i.test(response.headers.get("content-type") || "") || hash(remote) !== image.sha256) throw new Error("Remote-Bildprüfung fehlgeschlagen.");
      console.log(new URL(origin).hostname + ": " + slug + " geprüft.");
    }
  }
}
