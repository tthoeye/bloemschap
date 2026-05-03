import chokidar from "chokidar";
import { execFileSync } from "node:child_process";
import path from "node:path";

const cwd = process.cwd();

function sh(cmd, args, { allowFailure = false } = {}) {
  try {
    return execFileSync(cmd, args, {
      cwd,
      stdio: ["ignore", "pipe", "pipe"],
      encoding: "utf8",
    }).trim();
  } catch (e) {
    const stdout = (e.stdout || "").toString();
    const stderr = (e.stderr || "").toString();
    const msg = [stdout, stderr].filter(Boolean).join("\n").trim();
    if (allowFailure) return msg;
    throw new Error(msg || e.message);
  }
}

function now() {
  return new Date().toISOString().replace("T", " ").replace(/\.\d+Z$/, "Z");
}

function log(line) {
  process.stdout.write(`[autodeploy ${now()}] ${line}\n`);
}

function envOrEmpty(name) {
  return (process.env[name] || "").trim();
}

const DEPLOY_SSH = envOrEmpty("DEPLOY_SSH"); // e.g. floreverbe@ssh.florever.be
const DEPLOY_PATH = envOrEmpty("DEPLOY_PATH"); // e.g. /var/www/bloemschap
const DEPLOY_PULL = envOrEmpty("DEPLOY_PULL") || "git pull --ff-only";

const COMMIT_PREFIX = envOrEmpty("AUTO_COMMIT_PREFIX") || "chore(autodeploy):";
const BRANCH = envOrEmpty("AUTO_BRANCH"); // optional override

function getBranch() {
  if (BRANCH) return BRANCH;
  return sh("git", ["rev-parse", "--abbrev-ref", "HEAD"]);
}

function hasChanges() {
  const out = sh("git", ["status", "--porcelain=v1"], { allowFailure: true });
  return out.trim().length > 0;
}

function ensureConfigOrExit() {
  if (!DEPLOY_SSH || !DEPLOY_PATH) {
    log("Missing deploy config. Set these env vars then re-run:");
    log('  DEPLOY_SSH="floreverbe@ssh.florever.be"');
    log('  DEPLOY_PATH="/path/to/repo/on/server"');
    log('Optional: DEPLOY_PULL="git pull --ff-only"');
    process.exit(1);
  }
}

let running = false;
let scheduled = false;
let timer = null;

async function runOnce() {
  if (running) {
    scheduled = true;
    return;
  }
  running = true;
  scheduled = false;

  try {
    if (!hasChanges()) {
      return;
    }

    const branch = getBranch();

    // Stage everything except ignored files.
    sh("git", ["add", "-A"]);

    // If add resulted in no staged changes, skip.
    const staged = sh("git", ["diff", "--cached", "--name-only"], {
      allowFailure: true,
    });
    if (!staged.trim()) return;

    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const msg = `${COMMIT_PREFIX} auto-save ${stamp}`;
    log(`Committing on ${branch}: ${msg}`);
    sh("git", ["commit", "-m", msg]);

    log(`Pushing ${branch}…`);
    sh("git", ["push", "origin", branch]);

    ensureConfigOrExit();
    log(`Pulling on server: ${DEPLOY_SSH}:${DEPLOY_PATH}`);
    sh("ssh", [
      DEPLOY_SSH,
      `cd ${JSON.stringify(DEPLOY_PATH)} && ${DEPLOY_PULL}`,
    ]);

    log("Done.");
  } catch (e) {
    log(`ERROR: ${e.message}`);
  } finally {
    running = false;
    if (scheduled) schedule();
  }
}

function schedule() {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => void runOnce(), 1200);
}

const ignored = (p) =>
  p.includes(`${path.sep}.git${path.sep}`) ||
  p.includes(`${path.sep}node_modules${path.sep}`) ||
  p.includes(`${path.sep}.cursor${path.sep}`) ||
  p.endsWith(`${path.sep}.DS_Store`) ||
  p.endsWith(`${path.sep}package-lock.json`);

log(`Watching ${path.resolve(cwd)} …`);
log("Debounce: 1200ms. Ctrl+C to stop.");

chokidar
  .watch(".", {
    ignored,
    ignoreInitial: true,
    // Avoid EMFILE ("too many open files") on macOS by polling rather than
    // opening a watch handle for every file (especially with node_modules present).
    usePolling: true,
    interval: 650,
    awaitWriteFinish: { stabilityThreshold: 400, pollInterval: 100 },
  })
  .on("all", (event, filePath) => {
    // Only react to file changes that matter
    if (event === "add" || event === "change" || event === "unlink") {
      log(`${event}: ${filePath}`);
      schedule();
    }
  });

