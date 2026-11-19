#!/usr/bin/env bash
# Turns a TikZ drawing into an SVG next to it: fig.tex -> fig.svg. Text becomes outlines, so the
# SVG needs no fonts. Commit both files; the report includes the SVG, so knitting and rendering
# never need LaTeX (cloud sessions may have none).
# The .tex file is a whole document, e.g.
#   \documentclass[tikz,border=2pt]{standalone}
#   \begin{document}\begin{tikzpicture} ... \end{tikzpicture}\end{document}
# It compiles with pdflatex too. This script passes standalone the class option dvisvgm, which
# sets the TikZ driver, so the document class must be standalone.
# Needs latex and dvisvgm (TeX Live / MacTeX).
# Usage: tikz2svg.sh path/to/fig.tex [more.tex ...]
set -euo pipefail
for tex in "$@"; do
  dir="$(cd "$(dirname "$tex")" && pwd)"; name="$(basename "$tex" .tex)"
  tmp="$(mktemp -d)"
  (cd "$dir" && latex -interaction=nonstopmode -halt-on-error -output-directory="$tmp" -jobname="$name" \
    "\\PassOptionsToClass{dvisvgm}{standalone}\\input{$name.tex}" >"$tmp/out.log" 2>&1) \
    || { grep -A3 '^!' "$tmp/$name.log" >&2 || cat "$tmp/out.log" >&2; exit 1; }
  dvisvgm --no-fonts --bbox=papersize --optimize -o "$dir/$name.svg" "$tmp/$name.dvi" 2>&1 \
    | grep -i 'warn\|error' | grep -v 'PostScript specials ignored' >&2 || true   # those are standalone's bounding-box comments
  rm -rf "$tmp"
  echo "$dir/$name.svg"
done
