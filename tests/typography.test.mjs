import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import test from "node:test";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = (path) => readFileSync(join(root, path), "utf8");
const globals = read("src/app/globals.css");

test("landing utilities and CSS Modules share the same font tokens", () => {
  for (const [utility, token, family] of [
    ["sans", "body", "DM Sans"],
    ["display", "display", "Staatliches"],
    ["elegant", "elegant", "Belleza"],
  ]) {
    assert.ok(globals.includes(`--font-${utility}: var(--daccord-font-${token});`));
    assert.ok(globals.includes(`--daccord-font-${token}: "${family}"`));
  }
  assert.match(globals, /body\s*\{[^}]*font-family:\s*var\(--daccord-font-body\)/);
});

test("component styles cannot introduce independent font families", () => {
  function inspect(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) inspect(path);
      else if (entry.name.endsWith(".module.css")) {
        const css = readFileSync(path, "utf8");
        for (const [, family] of css.matchAll(/font-family\s*:\s*([^;}]+)/g)) {
          assert.match(family.trim(), /^var\(--daccord-font-(body|display|elegant)\)$/, path);
        }
      }
    }
  }
  inspect(join(root, "src"));
});

test("the shared layout loads all brand families and the bold UI weight", () => {
  const layout = read("src/app/layout.tsx");
  for (const font of ["dm-sans/400", "dm-sans/500", "dm-sans/600", "dm-sans/700", "dm-sans/800", "staatliches/400", "belleza/400"]) {
    assert.ok(layout.includes(`"@fontsource/${font}.css"`), font);
  }
});

test("core page titles use the landing's DM Sans bold hierarchy", () => {
  for (const [path, selector] of [
    ["src/components/catalog/product-catalog.module.css", ".hero h1"],
    ["src/app/sobre/sobre.module.css", ".heroCopy h1"],
    ["src/components/auth/auth-experience.module.css", ".pane h1"],
  ]) {
    const css = read(path);
    const title = css.slice(css.indexOf(selector)).split("}")[0];
    assert.match(title, /font-family:\s*var\(--daccord-font-body\)/, path);
    assert.match(title, /font-weight:\s*700/, path);
    assert.match(title, /letter-spacing:\s*-\.045em/, path);
  }
});
