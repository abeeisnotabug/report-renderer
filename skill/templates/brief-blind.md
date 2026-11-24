<!-- Template: optional blind review of a report page (big-tasks Bl1 to Bl5; report-writing skill,
after the reader stage). Run only if RMB said yes. Fill every <...> and delete this comment. One
fresh Sonnet session, high effort, second account, tools Read and Write only. The work folder
holds only what the reviewer may see: `page-text.txt` and this brief. Make the text first:
`node ~/Documents/Works/report-renderer/page-text.mjs <page.html> <work folder>/page-text.txt`.
The persona is the audience description of the report's own brief. -->

# Brief: read the page on <topic> as a first-time reader and report every point of confusion

## Why this task exists

W1. You are a critical reader of a page that you have never seen. Your job is to report every
point where you are confused, not to work it out.

W2. Who you are: <audience: field, what you know, what you do not know, how you think>. You
have never seen this page or its project before.

## Material

M1. Read only `<work folder>/page-text.txt`: the text of the rendered page in reading order.
Headings are kept. The content of a fold (a closed box that a reader may open) is included and
marked `[FOLD start: <title>]` and `[FOLD end]`. Do not open any other file on this computer, do
not search the file system, do not read any source or HTML.

## Rules that simulate a real reader

R1. Go strictly in order, section by section, and read every section: never only the first and
the last, never skip one. Never look ahead. Never go back to an earlier section once you have
moved past it. Open a fold when you reach it and read it where it stands.

R2. Limited memory. After each section, write a "memory card" of at most 6 short items: the
symbols, abbreviations and claims you still hold. To add an item when the card is full, drop one.
When judging a later section you may use only your current memory card plus what is in that
section. If a section uses a symbol, abbreviation, label or result that is not on your card and
not restated there, flag it as "forgotten or never defined"; do not reconstruct it.

R3. Be critical, not charitable. If you have to guess what something means, flag it. If a number
appears and you cannot see where it comes from, flag it. If a heading claims something and you
cannot connect it to what is in the section, flag it. If the point of a section (why it is here,
what you should take from it) is unclear, flag it. Do not spend effort solving puzzles; a
confused reader does not.

R4. Also flag: jargon or new terms introduced without definition, too much in one section,
terms that seem to name the same thing differently, one symbol with two meanings, references you
cannot use (section numbers, line numbers, labels, names of people), and places where an order
change would help (something used before it is explained).

## Output

O1. Write `blind-review.md` in the work folder, appending after each section (so partial results
survive). Format per section:

    ## Section N: <heading as you read it>
    Confusions:
    N.1 <what confuses you>: <why: what is missing>
    N.2 ...
    What I took away: <one sentence, or "nothing">
    Memory card: <items>

O2. At the end of the file add `## Overall`: O1 to O10, the ten confusions that hurt most, worst
first; "Main message as I understood it", three sentences at most (if you cannot say, say so);
"Where I got lost for good": section and why.

## Limits

L1. Read only this brief and `page-text.txt`. Write only `blind-review.md`. No git. No
subagents, other models or web search. No package installs.

L2. Final reply: the path of `blind-review.md` and its "Overall" section, nothing else.
