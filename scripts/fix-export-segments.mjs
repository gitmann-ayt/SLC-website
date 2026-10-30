/**
 * Runs after `next build` (npm "postbuild").
 *
 * On Windows, Next's static export writes the router's prefetch files with the
 * wrong shape: `about/__next.about/__PAGE__.txt` instead of the
 * `about/__next.about.__PAGE__.txt` the browser requests (it joins segment
 * paths containing "\" as folders). Every link prefetch then 404s. This moves
 * each file to the flat name. On macOS/Linux the export is already flat and
 * this does nothing.
 */
import { readdir, rename, rm, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const OUT = "out";

async function filesUnder(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await filesUnder(p)));
    else out.push(p);
  }
  return out;
}

async function walk(dir) {
  let moved = 0;
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (!e.isDirectory() || e.name === "_next" || e.name === "images") continue;
    const p = join(dir, e.name);
    if (e.name.startsWith("__next.")) {
      for (const f of await filesUnder(p)) {
        const flat = [e.name, ...relative(p, f).split(/[\\/]/)].join(".");
        await rename(f, join(dir, flat));
        moved++;
      }
      await rm(p, { recursive: true });
    } else {
      moved += await walk(p);
    }
  }
  return moved;
}

if (await stat(OUT).catch(() => null)) {
  const moved = await walk(OUT);
  if (moved) console.log(`fix-export-segments: flattened ${moved} prefetch files`);
}
