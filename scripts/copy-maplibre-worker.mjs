// MapLibre's worker bundle imports "./maplibre-gl-shared.mjs" as a sibling.
// Turbopack hashes both files independently without rewriting that import, so
// the worker 404s on the unhashed sibling. Serve the pair from a stable path
// instead and point maplibre at it with setWorkerUrl().
import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "node_modules", "maplibre-gl", "dist");
const dest = join(root, "public", "maplibre");

mkdirSync(dest, { recursive: true });
for (const file of ["maplibre-gl-worker.mjs", "maplibre-gl-shared.mjs"]) {
  copyFileSync(join(src, file), join(dest, file));
}
