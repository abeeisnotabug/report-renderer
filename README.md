# report-renderer

Turns a Markdown report with LaTeX maths into one self-contained HTML page: maths rendered by
KaTeX ahead of time, fonts and figures embedded, collapsible layers, previews of cited items, and
display formulas that break by fixed rules on narrow screens. How reports look and are written:
[STYLE.md](STYLE.md).

## Use

```bash
~/Documents/Works/report-renderer/render.sh path/to/report.md
```

writes `path/to/report.html`. Needs pandoc and Node; KaTeX (pinned in `package.json`) is
installed into this folder on first use.

Every project uses this one copy; projects keep no renderer of their own. Where it is missing
(e.g. in a fresh cloud session):

```bash
git clone https://github.com/abeeisnotabug/report-renderer ~/Documents/Works/report-renderer
```

## Files

| File | What it does |
| --- | --- |
| `render.sh` | Finds pandoc, installs KaTeX if needed, runs `render.mjs`. |
| `render.mjs` | Markdown to HTML with pandoc, maths with KaTeX, page style, embedded figures. |
| `breaks.mjs` | Regroups display formulas so the browser breaks them by the rules in STYLE.md. |
| `layers.lua` | Pandoc filter: folding sections and items, links, "Uses:" lines, routes pages. Markup described at its top. |
| `layers.css`, `layers.js` | Style and script of layered pages. |
| `site/index.md`, `site/publish.sh` | The general index of all projects' reports, and the script that renders it and copies it with the listed reports to the group server scotty (`~/ShinyApps/reports/`, VPN needed). |

A change here changes every report the next time it is rendered.
