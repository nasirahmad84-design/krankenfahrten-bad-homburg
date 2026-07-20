import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve, sep } from "node:path";

const root = resolve("out");
const port = Number(process.env.PORT || 8080);
const types = { ".html": "text/html; charset=UTF-8", ".js": "text/javascript; charset=UTF-8", ".css": "text/css; charset=UTF-8", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".ico": "image/x-icon", ".php": "text/plain; charset=UTF-8" };

createServer((request, response) => {
  const pathname = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`).pathname;
  if (pathname === "/api/fahrtanfrage.php" && request.method === "POST") return mockEndpoint(request, response);
  if (request.method !== "GET" && request.method !== "HEAD") return json(response, 405, { success: false, type: "server" });
  const relative = normalize(decodeURIComponent(pathname)).replace(/^[/\\]+/, "");
  let file = join(root, relative);
  if (pathname.endsWith("/")) file = join(file, "index.html");
  else if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
  if (!file.startsWith(root + sep) || !existsSync(file) || !statSync(file).isFile()) file = join(root, "404.html");
  response.writeHead(file.endsWith("404.html") ? 404 : 200, { "Content-Type": types[extname(file)] || "application/octet-stream" });
  if (request.method === "HEAD") return response.end();
  createReadStream(file).pipe(response);
}).listen(port, "127.0.0.1", () => process.stdout.write(`Static export test server: http://127.0.0.1:${port}\n`));

function mockEndpoint(request, response) {
  let raw = "";
  request.on("data", (chunk) => { raw += chunk; if (raw.length > 16384) request.destroy(); });
  request.on("end", () => {
    let body = {}; try { body = JSON.parse(raw); } catch { return json(response, 400, { success: false, type: "validation", errors: { form: "Ungültige Anfrage." } }); }
    if (body.email === "validation@example.com") return json(response, 400, { success: false, type: "validation", errors: { email: "PHP-Validierungsfehler" } });
    if (body.email === "server@example.com") return json(response, 500, { success: false, type: "server", message: "Versandfehler" });
    if (body.email === "timeout@example.com") return setTimeout(() => json(response, 200, { success: true, message: "Zu spät" }), 15000);
    return json(response, 200, { success: true, message: "Anfrage wurde übermittelt." });
  });
}

function json(response, status, body) {
  response.writeHead(status, { "Content-Type": "application/json; charset=UTF-8", "X-Content-Type-Options": "nosniff" });
  response.end(JSON.stringify(body));
}
