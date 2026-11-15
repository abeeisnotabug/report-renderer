// Warns about wrapped lines that pandoc reads as the start of a list. Inside a list item, a line
// that starts with "1. " or "- " right after a line of the same paragraph starts a nested list,
// and the sentence breaks off at that point (for example "... its determinant is" / "1. The ...").
// Outside list items pandoc keeps such a line in the paragraph, so only indented lines count.
// A line is reported when it starts with a list marker, is indented, and sits at the text column
// of the line before, which is text of the same paragraph or list item (not blank, not a fence,
// not a display) and stops mid-sentence: its last character is a letter, a digit, a comma, a
// semicolon, a dash, an opening bracket or a dollar sign. A nested list after a line that ends
// with a colon, a full stop or a closing bracket is meant and not reported. Code blocks and $$ displays are skipped.
// Usage: check(markdownText) -> array of strings.
const MARK = /^(\s*)(\d+[.)]|[-+*])(\s+)\S/;

export function check(text) {
  const lines = text.split('\n'), out = [];
  let code = false, math = false;
  for (let i = 0; i < lines.length; i++) {
    const s = lines[i], t = s.trim();
    if (/^(```|~~~)/.test(t)) { code = !code; continue; }
    if (code) continue;
    if (t === '$$') { math = !math; continue; }
    if (math || i === 0) continue;
    const m = s.match(MARK);
    if (!m) continue;
    const p = lines[i - 1], pt = p.trim();
    if (pt === '' || pt.startsWith(':::') || pt === '$$' || pt.startsWith('|') || pt.startsWith('<')) continue;
    if (pt.startsWith('$$') || !/[\p{L}\p{N},;$(\[\-–—]$/u.test(pt)) continue;
    const pm = p.match(MARK);
    const col = pm ? pm[1].length + pm[2].length + pm[3].length : p.match(/^\s*/)[0].length;
    if (pm && pm[1].length === m[1].length) continue; // the next item of the same list
    if (m[1].length === 0 || m[1].length !== col) continue;
    out.push(`line ${i + 1}: "${t.slice(0, 40)}" starts a list inside a paragraph; move the line break`);
  }
  return out;
}
