<!-- Template: optional blind review of a talk (big-tasks Bl1 to Bl5; talk-writing skill, stage Sg
after the reader). Run only if RMB said yes. Fill every <...> and delete this comment. One fresh
Sonnet session, high effort, second account, tools Read and Write only. The review folder holds
only what the audience sees and hears: the screenshots and `notes.txt`. Make them first, with
scripts, not by hand:
  THEME=light NODE_PATH=$(npm root -g) node ~/Documents/Works/report-renderer/talk/shoot.mjs <deck>.html
  node ~/Documents/Works/report-renderer/talk/notes-dump.mjs <deck folder> <review folder>/notes.txt
then copy `<deck>-shots-light/` into the review folder and delete the other files of the shoot
(overview, presenter views, report.txt). The persona is the audience description of the talk's
own brief. -->

# Brief: sit through the talk on <topic> as a first-time listener and report every point of confusion

## Why this task exists

W1. You are a critical audience member at a <minutes>-minute talk that you have never seen. Your
job is to report every point where you are confused, not to figure things out.

W2. Who you are: <audience: field, what you know, what you do not know, how you think, for
example whether you think in path diagrams>. You have never seen this talk or its project before.

## Material

M1. Read only these, in `<review folder>/`: the screenshots `<shots folder>/sNN-kMM.png` (slide
NN, build state MM; a slide reveals its content step by step, state 00 first), and `notes.txt`,
the speaker's words as bullet points per slide and state. Treat the notes as the spoken words
heard while that state is on screen. Do not open any other file on this computer, do not search
the file system, do not read any HTML or source code.

## Rules that simulate a real listener

R1. Go strictly in order: slide 1 state 0, then state 1, and so on through the last state of
slide 1, then slide 2. Open every state of every slide, never only the first and the last. Read
the notes of a slide only while you are on that slide: never read ahead, never read the notes of
a later slide. Never go back to an earlier screenshot or earlier notes once you have moved past
a slide.

R2. Limited memory. After each slide, write a "memory card" of at most 6 short items: the
symbols, abbreviations and claims you still hold. To add an item when the card is full, drop one.
When judging a later slide you may use only your current memory card plus what is on that slide
and in its notes. If a slide uses a symbol, abbreviation, label or result that is not on your
card and not restated on the slide, flag it as "forgotten or never defined"; do not reconstruct
it.

R3. Be critical, not charitable. If you have to guess what something means, flag it. If a number
appears and you cannot see where it comes from, flag it. If a title claims something and you
cannot connect it to what is on the slide, flag it. If the point of a slide (why it is here,
what you should take from it) is unclear, flag it. Do not spend effort solving puzzles; a
confused listener does not.

R4. Also flag: jargon or new terms introduced without definition, too much on one slide for the
time, terms that seem to name the same thing differently, one letter with two meanings, arrows or
lines whose meaning changes or is not stated, references you cannot use (slide numbers, section
numbers, line numbers, names of people), status tags or review marks on a slide, and places where
an order change would help (something used before it is explained).

## Output

O1. Write `blind-review.md` in the review folder, appending after each slide (so partial results
survive). Format per slide:

    ## Slide N: <title as you read it>
    Confusions:
    N.1 <what confuses you>: <why: what is missing>
    N.2 ...
    What I took away: <one sentence, or "nothing">
    Memory card: <items>

O2. At the end of the file add `## Overall`: O1 to O10, the ten confusions that hurt most, worst
first; "Main message as I understood it", three sentences at most (if you cannot say, say so);
"Where I got lost for good": slide number and why.

## Limits

L1. Read only this brief and the files named in M1. Write only `blind-review.md`. No git. No
subagents, other models or web search. No package installs.

L2. Final reply: the path of `blind-review.md` and its "Overall" section, nothing else.
