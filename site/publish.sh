#!/bin/sh
# Renders site/index.md and copies it and the listed reports to the group server scotty
# (university VPN needed). Served at https://scotty.ads.uni-jena.de/rshiny/li53vet/reports/
# (behind the URZ login). Render the reports themselves first. To add a project: a folder
# variable, a list of its pages, a copy loop, and a section in index.md.
set -e
here=$(cd "$(dirname "$0")" && pwd)
stage=$(mktemp -d)

"$here/../render.sh" "$here/index.md"
cp "$here/index.html" "$stage/index.html"

# MLTS count and survival: lit/<folder>/<page>.html -> mlts/<folder>/<page>.html
# (survival-overview is left out on purpose: notes on an unpublished manuscript)
mlts="$HOME/Documents/Works/FSU Jena/Projekte/MLTS Count and Survival/lit"
for page in basics/survival basics/gp-ou-crash-course basics/radon-nikodym-report \
            henderson-2000/hdd-background henderson-2000/henderson-2000 \
            wang-zhong-2025/wz-likelihood wang-zhong-2025/wang-zhong-2025; do
  mkdir -p "$stage/mlts/$(dirname "$page")"
  cp "$mlts/$page.html" "$stage/mlts/$page.html"
done

chmod -R a+rX "$stage"
rsync -a --delete "$stage/" li53vet@scotty.ads.uni-jena.de:/home/FSUJENA/li53vet/ShinyApps/reports/
rm -rf "$stage"
echo "published: https://scotty.ads.uni-jena.de/rshiny/li53vet/reports/"
