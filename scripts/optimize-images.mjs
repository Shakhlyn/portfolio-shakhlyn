/**
 * Re-encodes every committed image in place, and writes a file back only when
 * the result is genuinely smaller. An optimiser that grows a file is worse than
 * no optimiser (docs/tickets/E15-tickets.md T09).
 *
 * Run with `yarn images`. It is deliberately NOT part of `yarn build`: the
 * outputs are committed, and a build step that rewrites tracked files makes
 * every CI run dirty.
 *
 * Dimensions are never changed. `src/data/profile.ts` and `src/data/projects.ts`
 * record explicit width/height for every image, and a script that silently
 * resized would desync the data from the file and reintroduce the layout shift
 * the aspect locks exist to prevent (docs/2-architecture.md §5, §7).
 *
 * A committed manifest of output hashes is what makes the run idempotent. WebP
 * and JPEG are lossy, so re-encoding an already-encoded file produces a
 * *different, slightly smaller, slightly worse* file every time — "write only if
 * smaller" does not stop that, it feeds it. A file whose hash is already in the
 * manifest is this script's own output and is left alone; change the source
 * image or the encoder settings and the hash stops matching, so it is picked up
 * again. (Defect found running E15-T09; recorded in E15-status.md §3.)
 */
import { createHash } from 'node:crypto';
import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const TARGETS = ['src/assets', 'public/og'];
const EXTENSIONS = new Set(['.webp', '.png', '.jpg', '.jpeg']);
const MANIFEST = fileURLToPath(new URL('./image-manifest.json', import.meta.url));

const digest = (buffer) => createHash('sha256').update(buffer).digest('hex');

const readManifest = async () => {
  const raw = await readFile(MANIFEST, 'utf8').catch(() => null);
  return raw ? JSON.parse(raw) : {};
};

const walk = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) return walk(path);
      return EXTENSIONS.has(extname(entry.name).toLowerCase()) ? [path] : [];
    }),
  );

  return files.flat();
};

/**
 * WebP sources are re-encoded at the quality the portrait was authored at.
 *
 * PNG and JPEG stay in their own format. `public/og/portfolio-og.png` is the
 * reason: LinkedIn's and Slack's unfurlers do not reliably decode WebP, and
 * that asset exists for exactly those two crawlers.
 */
const encode = (image, ext) => {
  if (ext === '.webp') return image.webp({ quality: 82, effort: 6 }).toBuffer();
  if (ext === '.png') return image.png({ compressionLevel: 9, palette: true }).toBuffer();
  return image.jpeg({ quality: 82, mozjpeg: true }).toBuffer();
};

const main = async () => {
  const dirs = [];
  for (const target of TARGETS) {
    const path = join(ROOT, target);
    if (await stat(path).catch(() => null)) dirs.push(path);
  }

  const files = (await Promise.all(dirs.map(walk))).flat().sort();
  const manifest = await readManifest();
  const next = {};
  const rows = [];
  let saved = 0;

  for (const file of files) {
    const name = relative(ROOT, file);
    const before = await readFile(file);
    const beforeHash = digest(before);
    const ext = extname(file).toLowerCase();
    const { width, height } = await sharp(before).metadata();
    const row = { file: name, size: `${width}x${height}`, before: before.length };

    if (manifest[name] === beforeHash) {
      next[name] = beforeHash;
      rows.push({ ...row, after: before.length, action: 'optimised' });
      continue;
    }

    const after = await encode(sharp(before), ext);
    const smaller = after.length < before.length;

    if (smaller) {
      await writeFile(file, after);
      saved += before.length - after.length;
    }

    next[name] = smaller ? digest(after) : beforeHash;
    rows.push({
      ...row,
      after: smaller ? after.length : before.length,
      action: smaller ? 'rewritten' : 'kept',
    });
  }

  await writeFile(MANIFEST, `${JSON.stringify(next, null, 2)}\n`);

  const pad = (value, width) => String(value).padEnd(width);
  const nameWidth = Math.max(...rows.map((row) => row.file.length), 4);

  process.stdout.write(
    `${pad('file', nameWidth)}  ${pad('size', 9)}  ${pad('before', 8)}  ${pad('after', 8)}  action\n`,
  );

  for (const row of rows) {
    process.stdout.write(
      `${pad(row.file, nameWidth)}  ${pad(row.size, 9)}  ${pad(row.before, 8)}  ${pad(row.after, 8)}  ${row.action}\n`,
    );
  }

  process.stdout.write(`\n${rows.length} images, ${saved} bytes saved\n`);
};

main().catch((error) => {
  process.stderr.write(`${error.stack ?? error}\n`);
  process.exitCode = 1;
});
