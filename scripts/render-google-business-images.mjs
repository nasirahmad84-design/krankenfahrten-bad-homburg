import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import sharp from "sharp";
import { createHash } from "node:crypto";

// Own, reproducible informational graphics; no patient data, external imagery or AI API.
const root = process.cwd();
const plan = JSON.parse(readFileSync(resolve(root, "automation/blog/google-business-planned.json"), "utf8"));
const captions = {
  "arzttermin-abholzeit-unterschied": ["Arzttermin", "und Abholzeit", "Zwei Uhrzeiten. Eine klare Absprache."],
  "klinikfahrt-usingen-richtiger-standort": ["Klinikfahrt", "nach Usingen", "Standort und Eingang vorab klären."],
  "wetterwarnung-krankenfahrt-organisieren": ["Wetterwarnung?", "Fahrt abstimmen.", "Ort und Zeitraum der Meldung prüfen."],
  "fahrtanfrage-nachricht-keine-diagnosen": ["Fahrtdaten.", "Keine Befunde.", "Nur nötige Angaben zur Fahrt senden."],
  "anfrage-gesendet-fahrt-bestaetigt": ["Angefragt ist", "nicht bestätigt.", "Auf die ausdrückliche Zusage achten."],
  "abholung-dunkelheit-treffpunkt": ["Abholung", "bei Dunkelheit", "Den richtigen Eingang vereinbaren."],
  "stufen-hauseingang-krankenfahrt": ["Stufen am", "Hauseingang?", "Benötigte Unterstützung vorher klären."],
  "klinikfahrt-demenz-absprachen": ["Klinikfahrt", "bei Demenz", "Begleitung und Kontakte vorab klären."],
};
if (plan.some(item => !captions[item.slug])) throw new Error("Für ein neues Thema fehlt ein eigener geprüfter Bildtext.");
const logo = readFileSync(resolve(root, "public/brand/logo.svg")).toString("base64");
const directory = resolve(root, "public/images/google-business");
mkdirSync(directory, { recursive: true });
const escape = value => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;");
const images = {};
for (const item of plan) {
  const [first, second, subtitle] = captions[item.slug];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900">
    <rect width="1200" height="900" fill="#f4f7fb"/>
    <circle cx="1120" cy="840" r="290" fill="#e4edda"/>
    <rect x="76" y="80" width="1048" height="740" rx="34" fill="white"/>
    <rect x="76" y="80" width="13" height="740" rx="6" fill="#63a333"/>
    <image x="140" y="126" width="410" height="134" href="data:image/svg+xml;base64,${logo}"/>
    <text x="143" y="321" font-family="Arial, sans-serif" font-size="22" letter-spacing="3" fill="#52647a">RATGEBER · KRANKENFAHRTEN</text>
    <text x="139" y="424" font-family="Arial, sans-serif" font-size="73" font-weight="700" fill="#08265b">${escape(first)}</text>
    <text x="139" y="513" font-family="Arial, sans-serif" font-size="73" font-weight="700" fill="#08265b">${escape(second)}</text>
    <text x="143" y="601" font-family="Arial, sans-serif" font-size="29" fill="#52647a">${escape(subtitle)}</text>
    <path d="M144 652 H1054" stroke="#dbe3ec" stroke-width="2"/>
    <text x="143" y="713" font-family="Arial, sans-serif" font-size="24" fill="#08265b">krankenfahrten-bad-homburg.de</text>
    <circle cx="1031" cy="709" r="27" fill="#63a333"/>
    <path d="M1020 709 H1042 M1033 700 L1042 709 L1033 718" fill="none" stroke="white" stroke-width="3"/>
  </svg>`;
  const buffer = await sharp(Buffer.from(svg)).jpeg({ quality: 91, mozjpeg: true }).toBuffer();
  if (buffer.length < 10240 || buffer.length > 5 * 1024 * 1024) throw new Error("Bildgröße außerhalb der Vorgaben.");
  writeFileSync(resolve(directory, item.slug + ".jpg"), buffer);
  images[item.slug] = {
    sourceUrl: "https://krankenfahrten-bad-homburg.de/images/google-business/" + item.slug + ".jpg",
    alt: first + " " + second + " – " + subtitle,
    width: 1200, height: 900, bytes: buffer.length, sha256: createHash("sha256").update(buffer).digest("hex"),
    rights: "Eigene Informationsgrafik mit bestehendem Betreiberlogo; keine fremden Fotos oder personenbezogenen Daten.",
  };
  console.log(item.slug + ": " + buffer.length + " Bytes");
}
writeFileSync(resolve(root, "automation/blog/google-business-images.json"), JSON.stringify(images, null, 2) + "\n");
