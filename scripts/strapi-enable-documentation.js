"use strict";

/**
 * Run inside the Strapi container (Coolify terminal), from the CMS app root
 * or with STRAPI_ROOT=/opt/app.
 *
 *   node /path/to/scripts/strapi-enable-documentation.js
 *
 * Community plugin only. Never prints tokens. Restart Strapi after it succeeds.
 * Then: Settings > Documentation > Restricted Access ON + password.
 */

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const STRAPI_ROOT = path.resolve(
  process.env.STRAPI_ROOT || process.cwd(),
);
const REPO_STRAPI = path.resolve(__dirname, "..", "strapi");

const DOCUMENTATION_BLOCK = `  documentation: {
    enabled: true,
    config: {
      openapi: '3.0.0',
      info: {
        version: '1.0.0',
        title: 'BEER CMS API',
        description: 'OpenAPI for the self-hosted Community Strapi of BEER Küchenmanufaktur. Restricted Access must stay on.',
      },
      'x-strapi-config': {
        plugins: [],
        path: '/documentation',
      },
    },
  },`;

function die(message) {
  console.error(`[documentation] ${message}`);
  process.exit(1);
}

function log(message) {
  console.log(`[documentation] ${message}`);
}

function copyFile(from, to) {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
}

function injectDocumentation(source) {
  if (/documentation\s*:/.test(source)) {
    return { source, injected: false, reason: "already-present" };
  }

  const patterns = [
    /(module\.exports\s*=\s*\(\s*\{\s*env\s*\}\s*\)\s*=>\s*\(\s*\{)/,
    /(export\s+default\s+\(\s*\{\s*env\s*\}\s*\)\s*=>\s*\(\s*\{)/,
    /(module\.exports\s*=\s*\(\s*env\s*\)\s*=>\s*\(\s*\{)/,
    /(export\s+default\s+\(\s*env\s*\)\s*=>\s*\(\s*\{)/,
    /(module\.exports\s*=\s*\{)/,
    /(export\s+default\s*\{)/,
  ];

  for (const re of patterns) {
    if (re.test(source)) {
      return {
        source: source.replace(re, `$1\n${DOCUMENTATION_BLOCK}\n`),
        injected: true,
        reason: "injected",
      };
    }
  }

  return { source, injected: false, reason: "unknown-shape" };
}

function installPlugin(root) {
  const pkg = path.join(root, "package.json");
  if (!fs.existsSync(pkg)) {
    die(`No package.json in ${root}. Set STRAPI_ROOT to the Strapi app.`);
  }

  const hasLock = fs.existsSync(path.join(root, "pnpm-lock.yaml"))
    ? "pnpm"
    : fs.existsSync(path.join(root, "yarn.lock"))
      ? "yarn"
      : "npm";

  const cmds = {
    npm: ["npm", ["install", "@strapi/plugin-documentation", "--save"]],
    yarn: ["yarn", ["add", "@strapi/plugin-documentation"]],
    pnpm: ["pnpm", ["add", "@strapi/plugin-documentation"]],
  };
  const [bin, args] = cmds[hasLock];
  log(`Installing @strapi/plugin-documentation with ${hasLock}…`);
  const result = spawnSync(bin, args, {
    cwd: root,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (result.status !== 0) {
    die(`${hasLock} install failed.`);
  }
}

function ensurePluginsConfig(root) {
  const configDir = path.join(root, "config");
  fs.mkdirSync(configDir, { recursive: true });

  const jsPath = path.join(configDir, "plugins.js");
  const tsPath = path.join(configDir, "plugins.ts");
  const template = path.join(REPO_STRAPI, "config", "plugins.js");
  const existing = fs.existsSync(tsPath)
    ? tsPath
    : fs.existsSync(jsPath)
      ? jsPath
      : null;

  if (!existing) {
    if (!fs.existsSync(template)) {
      die(`Missing template ${template}`);
    }
    copyFile(template, jsPath);
    log(`Wrote ${jsPath}`);
    return;
  }

  const before = fs.readFileSync(existing, "utf8");
  const { source, injected, reason } = injectDocumentation(before);
  if (reason === "already-present") {
    log(`${path.basename(existing)} already enables documentation.`);
    return;
  }
  if (injected) {
    fs.writeFileSync(existing, source);
    log(`Injected documentation into ${existing}`);
    return;
  }

  const fragment = path.join(configDir, "beer-documentation.plugin.fragment.js");
  fs.writeFileSync(
    fragment,
    `// Merge this key into ${path.basename(existing)}\nmodule.exports = {\n${DOCUMENTATION_BLOCK}\n};\n`,
  );
  log(
    `Could not auto-merge ${existing}. Fragment written to ${fragment}. Add the documentation key by hand, then restart.`,
  );
}

function ensureSettings(root) {
  const from = path.join(
    REPO_STRAPI,
    "src",
    "extensions",
    "documentation",
    "config",
    "settings.json",
  );
  const to = path.join(
    root,
    "src",
    "extensions",
    "documentation",
    "config",
    "settings.json",
  );
  if (!fs.existsSync(from)) {
    die(`Missing ${from}`);
  }
  copyFile(from, to);
  log(`Wrote ${to}`);
}

function main() {
  if (!fs.existsSync(STRAPI_ROOT)) {
    die(`STRAPI_ROOT does not exist: ${STRAPI_ROOT}`);
  }
  log(`Strapi root: ${STRAPI_ROOT}`);
  installPlugin(STRAPI_ROOT);
  ensurePluginsConfig(STRAPI_ROOT);
  ensureSettings(STRAPI_ROOT);
  log("Done. Restart the Strapi service in Coolify.");
  log("Open /documentation — it is public (Restricted Access off).");
}

main();
