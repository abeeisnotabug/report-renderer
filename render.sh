#!/usr/bin/env bash
# Renders a Markdown file with maths to one self-contained HTML page next to it.
# Needs pandoc and Node; KaTeX is installed into this folder on first use.
# - Mac: pandoc and Node from Homebrew.
# - Cloud sessions: pandoc comes from PyPI as pypandoc_binary if it is missing.
# Usage: render.sh path/to/report.md
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
md="$(cd "$(dirname "$1")" && pwd)/$(basename "$1")"

if command -v pandoc >/dev/null; then
  export PANDOC=pandoc
else
  python3 -c "import pypandoc" 2>/dev/null || pip install -q pypandoc_binary
  export PANDOC="$(python3 -c 'import pypandoc; print(pypandoc.get_pandoc_path())')"
fi
[ -d "$here/node_modules/katex" ] || (cd "$here" && npm install -q --no-audit --no-fund)

node "$here/render.mjs" "$md"
