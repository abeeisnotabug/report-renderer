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
            wang-zhong-2025/wz-likelihood wang-zhong-2025/wang-zhong-2025 \
            sorensen-2026/kalman-intro; do
  mkdir -p "$stage/mlts/$(dirname "$page")"
  cp "$mlts/$page.html" "$stage/mlts/$page.html"
done

# Stochastik: the Stochastik II lecture companions (2026/27, one page per finished chapter) ->
# stochastik/stochastik2/<page>.html, the Stochastik III crash course (built on the 2022/23
# lecture) -> stochastik/stochastik3/crash-course.html
stoch="$HOME/Documents/Ausbildung/Mathe/8. Semester/Stochastik Perkowski"
mkdir -p "$stage/stochastik/stochastik2" "$stage/stochastik/stochastik3"
for page in ch1-conditional-expectation ch2-construction; do
  cp "$stoch/26-WS-Stoch2/companion/$page.html" "$stage/stochastik/stochastik2/$page.html"
done
cp "$stoch/companion/22-23-stoch3-crash-course.html" "$stage/stochastik/stochastik3/crash-course.html"
# the Stochastik III chapter 1 companion (Claude's page, theme: fsu, interactive figures)
cp "$stoch/25-WS-Stoch3/companion/ch1-gaussian-processes-Claude-fsu.html" "$stage/stochastik/stochastik3/ch1-gaussian-processes-Claude-fsu.html"

# CCFA and LST-R: the topic introduction -> ccfa/cc-in-lstr.html, the talk (version 3) ->
# ccfa/cc-lstr-talk.html
ccfa="$HOME/Documents/Works/FSU Jena/Projekte/Tobi/CCFA and LST-R/reports"
mkdir -p "$stage/ccfa"
cp "$ccfa/cc-in-lstr/cc-in-lstr.html" "$stage/ccfa/cc-in-lstr.html"
cp "$ccfa/../talks/cc-lstr-v3/cc-lstr-talk.html" "$stage/ccfa/cc-lstr-talk.html"

chmod -R a+rX "$stage"
rsync -a --delete "$stage/" li53vet@scotty.ads.uni-jena.de:/home/FSUJENA/li53vet/ShinyApps/reports/
rm -rf "$stage"
echo "published: https://scotty.ads.uni-jena.de/rshiny/li53vet/reports/"
