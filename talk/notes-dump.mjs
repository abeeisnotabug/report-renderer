// Writes the speaker notes of a deck as plain text, one block per slide and state, for a reader
// who needs the notes without the page (blind review, proofreading).
//   node notes-dump.mjs <deck folder> [out.txt]      (without out.txt: to the screen)
// Reads the folder's slides*.html in file-name order (like build.mjs), takes each <section class="slide">,
// its <aside class="notes">, each <ul data-step="k"> and each <li>; strips tags, unescapes entities.
// Format:   slide 01 state 00:
//             · first note
// Slides are numbered over all files; a slide without notes gives "(no notes)". No dependencies.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
const [dir, out] = process.argv.slice(2);
if (!dir) { console.error('usage: node notes-dump.mjs <deck folder> [out.txt]'); process.exit(1); }
const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', minus: '−', hellip: '…', ndash: '–', mdash: '—' };
const unesc = (s) => s.replace(/&(?:#(\d+)|#x([0-9a-f]+)|([a-z]+));/gi, (m, d, x, n) =>
  d ? String.fromCodePoint(+d) : x ? String.fromCodePoint(parseInt(x, 16)) : (ENT[n.toLowerCase()] ?? m));
const text = (h) => unesc(h.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
let files = [];
try { files = readdirSync(dir).filter((f) => /^slides.*\.html$/.test(f)).sort(); } catch { console.error('cannot read folder ' + dir); process.exit(1); }
if (!files.length) { console.error('no slides*.html in ' + dir); process.exit(1); }
const pad = (n) => String(n).padStart(2, '0');
const lines = [];
let n = 0;
for (const f of files) {
  for (const m of readFileSync(join(dir, f), 'utf8').matchAll(/<section\b([^>]*)>([\s\S]*?)<\/section>/g)) {
    if (!/class="[^"]*\bslide\b/.test(m[1])) continue;
    n++;
    const notes = (/<aside class="notes">([\s\S]*?)<\/aside>/.exec(m[2]) || [])[1];
    const uls = notes ? [...notes.matchAll(/<ul data-step="(\d+)"[^>]*>([\s\S]*?)<\/ul>/g)] : [];
    if (!uls.length) { lines.push(`slide ${pad(n)} state 00:`, '  (no notes)'); continue; }
    for (const u of uls) {
      lines.push(`slide ${pad(n)} state ${pad(+u[1])}:`);
      for (const li of u[2].matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/g)) lines.push('  · ' + text(li[1]));
    }
  }
}
const res = lines.join('\n') + '\n';
if (out) { writeFileSync(out, res); console.log('wrote', out, n, 'slides,', lines.length, 'lines'); } else process.stdout.write(res);
