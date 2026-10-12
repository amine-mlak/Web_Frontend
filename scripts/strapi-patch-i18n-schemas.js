"use strict";

const fs = require("fs");
const path = require("path");

const LOCALIZED_TYPES = new Set([
  "string",
  "text",
  "richtext",
  "blocks",
  "email",
  "enumeration",
]);

const SHARED_FIELDS = new Set([
  "slug",
  "hex",
  "order",
  "cluster",
  "year",
  "publishedAt",
]);

function patchAttributes(attributes) {
  if (!attributes || typeof attributes !== "object") {
    return;
  }

  for (const [name, definition] of Object.entries(attributes)) {
    if (!definition || typeof definition !== "object") {
      continue;
    }

    const shared =
      SHARED_FIELDS.has(name) ||
      definition.type === "uid" ||
      definition.type === "integer" ||
      definition.type === "biginteger" ||
      definition.type === "float" ||
      definition.type === "decimal" ||
      definition.type === "boolean" ||
      definition.type === "date" ||
      definition.type === "datetime" ||
      definition.type === "time" ||
      definition.type === "media" ||
      definition.type === "relation" ||
      definition.type === "json" ||
      definition.type === "password";

    const localized =
      !shared &&
      (LOCALIZED_TYPES.has(definition.type) ||
        definition.type === "component" ||
        definition.type === "dynamiczone");

    definition.pluginOptions = {
      ...(definition.pluginOptions || {}),
      i18n: { localized },
    };
  }
}

function patchSchemaFile(file) {
  const schema = JSON.parse(fs.readFileSync(file, "utf8"));
  if (schema.kind !== "collectionType" && schema.kind !== "singleType") {
    return false;
  }

  schema.pluginOptions = {
    ...(schema.pluginOptions || {}),
    i18n: { localized: true },
  };
  patchAttributes(schema.attributes);
  fs.writeFileSync(file, `${JSON.stringify(schema, null, 2)}\n`);
  return true;
}

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) {
    return files;
  }

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, files);
    } else if (entry.name === "schema.json") {
      files.push(full);
    } else if (
      entry.name.endsWith(".json") &&
      full.includes(`${path.sep}components${path.sep}`)
    ) {
      files.push(full);
    }
  }

  return files;
}

function patchRoot(root) {
  const files = [...walk(path.join(root, "api")), ...walk(path.join(root, "src", "api")), ...walk(path.join(root, "components")), ...walk(path.join(root, "src", "components"))];
  const unique = [...new Set(files)];
  let count = 0;
  for (const file of unique) {
    if (file.includes(`${path.sep}user${path.sep}`) || file.includes("plugin")) {
      continue;
    }
    try {
      if (patchSchemaFile(file)) {
        count += 1;
        console.log(`localized ${path.relative(root, file)}`);
      }
    } catch (error) {
      console.error(`skip ${file}: ${error.message}`);
    }
  }
  console.log(`patched ${count} schemas`);
}

const root = process.argv[2] || path.join(__dirname, "..", ".tmp-strapi-catalog");
patchRoot(root);
