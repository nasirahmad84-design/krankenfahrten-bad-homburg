import { execFileSync } from "node:child_process";
import { createFileLedger } from "./google-business-publisher.mjs";

// The remote state commit MUST succeed before a Google POST is attempted.
// A cache/artifact alone is not a durable write-ahead log.
export function createGitLedger(directory, key, persist) {
  const file = createFileLedger(directory, key);
  const push = persist || (() => {
    const git = args => execFileSync("git", ["-C", directory, ...args], { stdio: "pipe" });
    try {
      git(["add", "--", "*.json"]);
      if (git(["diff", "--cached", "--name-only"]).toString().trim() === "") return;
      git(["-c", "user.name=krankenfahrten-google-bot", "-c", "user.email=41898282+github-actions[bot]@users.noreply.github.com", "commit", "-m", "chore: persist google post state"]);
      git(["push", "origin", "HEAD:refs/heads/gbp-state"]);
    } catch {
      throw new Error("Google-Versandstatus konnte nicht dauerhaft auf GitHub gesichert werden; kein weiterer Schreibversuch.");
    }
  });
  return { lock: () => file.lock(), unlock: () => file.unlock(), read: () => file.read(), write(state) { file.write(state); push(); } };
}
