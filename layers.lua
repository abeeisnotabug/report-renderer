--[[
Lecture citations and exercises. Used by lecture companions; a page that has no such items or
citations is not affected:

  - Lecture statements are items themselves: `::: {#lec-3-38 .item}` with the title
    "**Lemma 3.38. [core] ...**". "Lemma 3.38" in the text links to it, and it enters the
    "Uses:" line under the label "Lemma 3.38".
  - Exercise-sheet items `::: {#sheet-6-1 .item}`, cited as "Sheet 6, Ex. 1" or "Sheet 6, Ex. 1(b)";
    tutorial items `::: {#tut-1-2 .item}`, cited as "Tutorial 1, Ex. 2" (a second exercise with the
    same number: `tut-1-16b`, cited as "Tutorial 1, Ex. 16b"); an item holding one part
    only, `::: {#sheet-12-1d .item}`, is cited as "Sheet 12, Ex. 1(d)".
  - The lecture's own exercises `::: {#exer-1-4 .item}`, cited as "Exercise 1.4" (English pages;
    German pages: "Aufgabe 1.4", see below).
  - Appendix numbers: "Theorem A.5" links to `lec-A-5`, "Definition C.12" to `lec-C-12`.
  - Unnumbered lecture figures `::: {#fig-3-1 .item}`, cited as "Figure 3.1".
  - Restated results from elsewhere (`.lec` blocks, e.g. Stochastik I) also enter "Uses:".
  - Items get a class for their kind (definition, result, example, remark, exercise), from the
    first word of the title after the label; layers.css colours the title by it.
  - German kind words are aliases of the English ones (table `aliases`: Satz = Theorem,
    Korollar = Corollary, Beispiel = Example, Bemerkung = Remark, Aufgabe = Exercise,
    Abbildung = Figure); the page
    shows the word as written, everything else sees the English kind. A German word is a
    citation word ("Satz 1.9" links to `lec-1-9`, "Aufgabe 1.4" to `exer-1-4`) only on a page
    whose own item titles begin with it, so "Satz 4.7" in an English page stays plain text.
  - Other pages: `pages: [appA-masstheorie.md]` in the YAML header. A citation with no entry on
    this page but an item on a listed page ("Lemma A.5", "Sheet 3, Ex. 3") links to a preview of
    that item's statement and status line; "Go there" opens the other page at the item, and the
    citation enters the "Uses:" line. A German word that begins item titles there is a citation
    word here too. A number written with a non-breaking space ("Lemma\ A.5") stays plain.
  - An exercise's "Uses:" line sits at the top of its folded solution, not under the task, so
    it does not give away the tools. Every other item's list is a closed fold "Uses" (below).

Collapsible layers for long reports. Active only when the YAML header has `layered: true`;
every other document passes through unchanged. render.mjs adds the matching CSS and script
when the output contains the toolbar this filter writes.

Markup (Pandoc fenced divs):

  ## W. Title {#sec-w .fold}        a section that folds; add .side for a side-trip section
  ::: gist                          one-line takeaway, shown while the section is closed
  ...
  :::

  ::: {#W4 .item}                   an item; [core] or [side trip] in its bold title sets the tag
  **W4. [core] Title.** Statement.  everything before `::: more` stays visible when closed
  ::: more
  Steps: ...                        shown only when the item is opened
  :::
  :::

  ::: {#W5 .item}                   an item with separate folds instead of `::: more`:
  **W5. [core] Title.** Statement.  the statement stays open; under it one closed fold each,
  ::: intuition                     "Intuition" (what it means, a picture, where it fails),
  ::: steps                         "Steps" (the derivation),
  ::: {.fold summary="Example"}     and named folds whose label says what kind they are
  :::

  ## W. Title {#sec-w .fold}        a section's plain-words layer (level L1): one closed fold
  ::: gist                          "In plain words", right after the gist, at the top level
  ::: plain                         of the section (not inside an item). Everyday words, an
  :::                               example or analogy, almost no notation.

  ::: need                          a need line, directly before an item (or a prose passage):
  ...                               one or two sentences, why the page needs it here; visible,
  :::                               with the label "Why here:"; belongs to the item that follows
                                    (data-for), and is a side trip with it

  ::: {.punch kind="why"}           a punch, inside an item after its statement (or after a display
  ...                               in prose): one to three sentences. kind why / demands / shows:
  :::                               visible, bold label "Why." / "Demands." / "Shows.", placed after
                                    the statement and its "In words" folds, before the "Uses" fold
                                    and the other folds. kind key (an exercise's key idea): a
                                    closed fold "Key idea", placed before the Hint and Solution
                                    folds. `label="..."` on either replaces the label's text
                                    (German pages). With `::: more`, put a visible punch before it.

  ::: why                           inside a step: the justification, folded under "Why"
  ::: {.fold summary="Tools"}       any other folded block, with its own summary text
  ::: {#lec-3-7 .lec}               a restated lecture result (target of lecture links)

Automatic:
  - "W4", "(T5," ... become links to items that exist; "Theorem 3.7(i)", "Stoch I, Satz 5.12"
    become links to lecture entries that exist (missing ones are reported on stderr).
  - Each item gets a "Uses" list: the earlier items its text refers to (override with
    uses="W4 T3", or uses="none"). It is a closed fold "Uses" (class `uses`), the first of the
    item's folds, after the whole statement (its "In words" folds and its visible punch belong to it), before
    Intuition and Steps; never between paragraphs of the statement. With `::: more` it is the first thing inside the opened item. An exercise's
    list is a "Uses:" line at the top of its folded solution instead.
  - R code blocks (and their #> output) fold under "R code".
  - A contents list (a side bar on wide screens) and a toolbar are added after the title.
    "Core only" appears only if something is tagged as a side trip.
    "Plain words only" appears only if the page has `::: plain` folds: it shows the opening,
    the section titles, their takeaways and the plain-words folds (opened), and hides the rest.
  - `uses: false` in the YAML header turns the "Uses" lists off.

Two routes: a routes page lists pairs of items that reach the same conclusion in two
reports, and each report shows its partner's statement under the item.

  routes page YAML:  sides: {basics: {md, html, name, cite}, mart: {...}}, side_order: [basics, mart]
  routes page body:  ::: {.pair basics="A5" mart="T8"} conclusion ::: (each pair shows both routes)
  report YAML:       routes: two-routes.md   side: basics
  In a report, "basics A5" (the other side's `cite` word plus a label) previews that item, and
  every item named in a pair gets a closed fold with its partner's statement and steps.
]]

local stringify = pandoc.utils.stringify
local List = pandoc.List

local item_index = {}   -- item id -> position in the document
local lec_ids = {}
local missing = {}
local comp = nil        -- the other report: {items, cite, html, used}

local function raw(s) return pandoc.RawBlock('html', s) end
local function esc(s)
  return (s:gsub('&', '&amp;'):gsub('<', '&lt;'):gsub('>', '&gt;'):gsub('"', '&quot;'))
end
local function xref(text, id, cls)
  return pandoc.Link(text, '#' .. id, '', pandoc.Attr('', { cls or 'xref' }))
end

-- Kind words in another language, each an alias of the English kind word it stands for. Titles
-- and citations show the word as written; everything that looks at the kind (item classes, CSS,
-- link targets) sees only the English word, through canon().
local aliases = { Satz = 'Theorem', Korollar = 'Corollary', Beispiel = 'Example',
  Bemerkung = 'Remark', Aufgabe = 'Exercise', Abbildung = 'Figure' }
local function canon(w) return aliases[w] or w end

local lec_words = { Theorem = true, Definition = true, Lemma = true, Example = true,
  Remark = true, Corollary = true, Proposition = true, Figure = true, Exercise = true }
-- alias words that begin the titles of this page's own lecture entries ("Satz 1.9."): only
-- these are linked without "Stoch I," in front, so "Satz 4.7" in an English page stays plain
local own_words = {}
-- the id a cited number points to: Figure 3.1 -> fig-3-1, Aufgabe 1.4 -> exer-1-4, else lec-
local function lec_id(word, num)
  local k = canon(word)
  return (k == 'Figure' and 'fig-' or k == 'Exercise' and 'exer-' or 'lec-') .. num:gsub('%.', '-')
end
local item_label = {}   -- item or lecture-entry id -> label shown in "Uses:" lines

-- a cited lecture entry: an item on this page, or a restated result
local function known(id) return item_index[id] ~= nil or lec_ids[id] ~= nil end

-- items of the other pages listed under `pages:` (id -> {head, title, html}); a citation that
-- has no entry on this page but one there links to a copy of its statement, `x-<id>`, kept in a
-- hidden store at the end of this page, whose "Go there" opens the other page
local ext, ext_used = {}, List()
local function ext_target(id)
  if not ext[id] then return nil end
  local xid = 'x-' .. id
  if not lec_ids[xid] then lec_ids[xid] = true; ext_used:insert(id) end
  return xid
end

-- "2.10(vii):" -> "2.10", "(vii)", ":";  "A.5," -> "A.5", "", ","
local function split_number(s)
  local num, rest = s:match('^(%u?%d*%.%d+)(.*)$')
  if not num then return nil end
  local sub = rest:match('^%([ivx]+%)') or ''
  return num, sub, rest:sub(#sub + 1)
end

local function is_str(x, pat) return x and x.t == 'Str' and x.text:match(pat) end

-- Replace item and lecture references in a list of inlines; record item references in refs.
local function linkify(inls, self, refs)
  local out = List()
  local i = 1
  while i <= #inls do
    local x = inls[i]
    local consumed = false
    if x.t == 'Str' and comp and comp.cite ~= '' then
      -- "basics A9c;" -> preview of item A9 of the other report
      local p0 = x.text:match('^(%(*)' .. comp.cite .. '$')
      local nxt = inls[i + 2]
      if p0 and inls[i + 1] and inls[i + 1].t == 'Space' and nxt and nxt.t == 'Str' then
        local cid, sub, post = nxt.text:match('^(%u%d+)(%l?)(.*)$')
        if cid and comp.items[cid] then
          if p0 ~= '' then out:insert(pandoc.Str(p0)) end
          out:insert(pandoc.Link(comp.cite .. ' ' .. cid .. sub, '#' .. comp.cite .. '-' .. cid, '',
            pandoc.Attr('', { 'xref' })))
          if post ~= '' then out:insert(pandoc.Str(post)) end
          comp.used[cid] = true
          i, consumed = i + 3, true
        end
      end
    end
    if not consumed and x.t == 'Str' then
      local pre, id, post = x.text:match('^([%(%[]*)(%u%l?%d+)(.*)$')
      if id and item_index[id] and id ~= self and not post:match('^%w') then
        if pre ~= '' then out:insert(pandoc.Str(pre)) end
        out:insert(xref(id, id))
        if post ~= '' then out:insert(pandoc.Str(post)) end
        if refs then refs:insert(id) end
        i, consumed = i + 1, true
      end
      if not consumed then
        -- "Sheet 6, Ex. 1(b)", "Tutorial 1, Ex. 2"
        local p0, sword = x.text:match('^(%(*)(%a+)$')
        if sword ~= 'Sheet' and sword ~= 'Tutorial' then p0 = nil end
        local sprefix = sword == 'Tutorial' and 'tut-' or 'sheet-'
        local sn = inls[i + 2] and inls[i + 2].t == 'Str' and inls[i + 2].text:match('^(%d+),$')
        if p0 and sn and is_str(inls[i + 4], '^Ex%.$') and inls[i + 6] and inls[i + 6].t == 'Str' then
          -- "Ex. 16b": a letter right after the number is part of the exercise's name (tut-1-16b)
          local en, rest = inls[i + 6].text:match('^(%d+%l?)(.*)$')
          if en then
            local sub = rest:match('^%(%l+%)') or ''
            local post = rest:sub(#sub + 1)
            local sid = sprefix .. sn .. '-' .. en
            local part = sid .. sub:gsub('[()]', '')
            if sub ~= '' and (known(part) or ext[part]) then sid = part end
            local tid = known(sid) and sid or ext_target(sid)
            if sid == self then
              for t = i, i + 6 do out:insert(inls[t]) end
              i, consumed = i + 7, true
            elseif tid then
              if p0 ~= '' then out:insert(pandoc.Str(p0)) end
              out:insert(xref(sword .. ' ' .. sn .. ', Ex. ' .. en .. sub, tid, 'xref lecref'))
              if post ~= '' then out:insert(pandoc.Str(post)) end
              if refs then refs:insert(tid) end
              i, consumed = i + 7, true
            else
              missing[sid] = sword .. ' ' .. sn .. ', Ex. ' .. en
            end
          end
        end
      end
      if not consumed then
        -- "Stoch I, Satz 5.12"
        local p0 = x.text:match('^(%(*)Stoch$')
        if p0 and is_str(inls[i + 2], '^I,$') and is_str(inls[i + 4], '^%a+$')
            and lec_words[canon(inls[i + 4].text)] and inls[i + 6] and inls[i + 6].t == 'Str' then
          local num, sub, post = split_number(inls[i + 6].text)
          if num then
            local lid = 'lec-s1-' .. num:gsub('%.', '-')
            local label = 'Stoch I, ' .. inls[i + 4].text .. ' ' .. num .. sub
            if lid == self then
              -- a lecture entry's own title: keep the words, no link
              for t = i, i + 6 do out:insert(inls[t]) end
              i, consumed = i + 7, true
            elseif known(lid) then
              if p0 ~= '' then out:insert(pandoc.Str(p0)) end
              out:insert(xref(label, lid, 'xref lecref'))
              if post ~= '' then out:insert(pandoc.Str(post)) end
              if refs then refs:insert(lid) end
              i, consumed = i + 7, true
            else
              missing[lid] = label
            end
          end
        end
      end
      if not consumed then
        -- "Theorem 3.7(i)"
        local p0, word = x.text:match('^(%(*)(%a+)$')
        local linked_word = word and (aliases[word] and own_words[word] or not aliases[word] and lec_words[word])
        if linked_word and inls[i + 1] and inls[i + 1].t == 'Space'
            and inls[i + 2] and inls[i + 2].t == 'Str' then
          local num, sub, post = split_number(inls[i + 2].text)
          if num then
            local lid = lec_id(word, num)
            local tid = lid ~= self and (known(lid) and lid or ext_target(lid))
            if lid == self then
              -- a lecture entry's own title: no link
            elseif tid then
              if p0 ~= '' then out:insert(pandoc.Str(p0)) end
              out:insert(xref(word .. ' ' .. num .. sub, tid, 'xref lecref'))
              if post ~= '' then out:insert(pandoc.Str(post)) end
              if refs then refs:insert(tid) end
              i, consumed = i + 3, true
            else
              missing[lid] = word .. ' ' .. num
            end
          end
        end
      end
    end
    if not consumed then
      out:insert(x)
      i = i + 1
    end
  end
  return out
end

local function linkify_block(blk, self, refs)
  return blk:walk {
    traverse = 'topdown',
    Link = function(l) return l, false end,   -- never link inside an existing link
    Inlines = function(inls) return linkify(inls, self, refs) end,
  }
end

-- R code blocks and their "#>" output, folded; a block fenced {.r .open} stays open.
-- A folded block is marked .folded, because a top-level block passes here twice (pass 2 folds
-- the document's blocks, then `folded` walks each one again).
local function fold_code(blocks)
  local out = List()
  local i = 1
  while i <= #blocks do
    local b = blocks[i]
    if b.t == 'CodeBlock' and b.classes:includes('r') and not b.classes:includes('open')
        and not b.classes:includes('folded') then
      b.classes:insert('folded')
      out:insert(raw('<details class="rcode"><summary>R code</summary>'))
      out:insert(b)
      i = i + 1
      while blocks[i] and blocks[i].t == 'CodeBlock' and blocks[i].text:match('^#>') do
        out:insert(blocks[i])
        i = i + 1
      end
      out:insert(raw('</details>'))
    else
      out:insert(b)
      i = i + 1
    end
  end
  return out
end

local has_plain = false

-- "Why here:" -> Str Space Str ...; a custom label (`label="..."`) is used as written
local function words(text)
  local inl = List()
  for w in text:gmatch('%S+') do
    if #inl > 0 then inl:insert(pandoc.Space()) end
    inl:insert(pandoc.Str(w))
  end
  return inl
end

-- `blocks` with `label` (an inline) and a space in front of the first paragraph; a first block
-- that is no paragraph gets a paragraph of its own for the label
local function labelled(blocks, label)
  local out = List(blocks)
  local first = out[1]
  if first and (first.t == 'Para' or first.t == 'Plain') then
    local inl = List { label, pandoc.Space() }
    inl:extend(first.content)
    out[1] = pandoc.Para(inl)
  else
    out:insert(1, pandoc.Para { label })
  end
  return out
end

local punch_label = { why = 'Why.', demands = 'Demands.', shows = 'Shows.' }

local function fold_divs(blk)
  return blk:walk {
    Div = function(d)
      -- a need line (`::: need`): why the page needs the item that follows; visible, with a label.
      -- (done once: the label span marks a need line that is already built)
      if d.classes:includes('need') then
        local f = d.content[1]
        local f1 = f and (f.t == 'Para' or f.t == 'Plain') and f.content[1]
        if f1 and f1.t == 'Span' and f1.classes:includes('need-label') then return nil end
        local lab = pandoc.Span(words(d.attributes.label or 'Why here:'), pandoc.Attr('', { 'need-label' }))
        return pandoc.Div(labelled(d.content, lab), pandoc.Attr(d.identifier, { 'need' }))
      end
      -- a punch (`kind` is set only on the markup, never on the result, so it is built once):
      -- why / demands / shows stay visible after the statement with a bold label; key (an
      -- exercise's key idea) is a closed fold
      if d.classes:includes('punch') and d.attributes.kind then
        local kind = d.attributes.kind
        if kind == 'key' then
          local out = List { raw('<details class="fold sub key"><summary>'
            .. esc(d.attributes.label or 'Key idea') .. '</summary>') }
          out:extend(d.content)
          out:insert(raw('</details>'))
          return out
        elseif punch_label[kind] then
          local lab = pandoc.Strong(words(d.attributes.label or punch_label[kind]))
          return pandoc.Div(labelled(d.content, lab), pandoc.Attr(d.identifier, { 'punch', 'punch-' .. kind }))
        end
        error('layers.lua: punch kind "' .. kind .. '" is none of why, demands, shows, key')
      end
      -- a section's plain-words layer (L1)
      if d.classes:includes('plain') then
        has_plain = true
        local out = List { raw('<details class="fold plain"><summary>In plain words</summary>') }
        out:extend(d.content)
        out:insert(raw('</details>'))
        return out
      end
      -- an item's own folds: Intuition and Steps (named folds use .fold with a summary)
      local own = d.classes:includes('intuition') and 'intuition' or d.classes:includes('steps') and 'steps'
      if own then
        local label = own == 'intuition' and 'Intuition' or 'Steps'
        local out = List { raw('<details class="fold sub ' .. own .. '"><summary>' .. label .. '</summary>') }
        out:extend(d.content)
        out:insert(raw('</details>'))
        return out
      end
      if d.classes:includes('why') or d.classes:includes('fold') then
        local label = d.attributes.summary or 'Why'
        local cls = d.classes:includes('why') and 'why' or 'fold'
        local out = List { raw('<details class="' .. cls .. '"><summary>' .. esc(label) .. '</summary>') }
        out:extend(d.content)
        out:insert(raw('</details>'))
        return out
      end
    end,
    Blocks = fold_code,
  }
end

local show_uses = true
local has_side = false

-- "Lemma 3.38. [core] ..." -> "result"; "C4. [core] Exercise in the lecture ..." -> "exercise"
local kinds = { Definition = 'def', Theorem = 'res', Lemma = 'res', Corollary = 'res',
  Proposition = 'res', Result = 'res', Example = 'ex', Remark = 'rem', Exercise = 'exer',
  Sheet = 'exer', Tutorial = 'exer', Figure = 'fig', Overview = 'ov' }
local function item_kind(title)
  local first = title:match('^(%a+)')
  if first and kinds[canon(first)] then return kinds[canon(first)] end
  local after = title:match('^[^%]]*%]%s*(%a+)')
  return after and kinds[canon(after)] or nil
end

-- the label an item or restated result is cited by
local function label_of(id, title)
  local num = id:match('^lec%-s1%-(%d+%-%d+)$')
  if num then
    local word = title:match('(%a+) ' .. num:gsub('%-', '%%.')) or 'Satz'
    return 'Stoch I, ' .. word .. ' ' .. num:gsub('%-', '.')
  end
  num = id:match('^lec%-(%u?%d*%-%d+)$')
  if num then
    local word = title:match('(%a+) ' .. num:gsub('%-', '%%.')) or 'Result'
    return word .. ' ' .. num:gsub('%-', '.')
  end
  local sn, en, part = id:match('^sheet%-(%d+)%-(%d+)(%l?)$')
  if sn then return 'Sheet ' .. sn .. ', Ex. ' .. en .. (part ~= '' and '(' .. part .. ')' or '') end
  sn, en = id:match('^tut%-(%d+)%-(%d+%l?)$')
  if sn then return 'Tutorial ' .. sn .. ', Ex. ' .. en end
  num = id:match('^fig%-(%d+%-%d+)$')
  if num then
    local word = title:match('(%a+) ' .. num:gsub('%-', '%%.')) or 'Figure'
    return word .. ' ' .. num:gsub('%-', '.')
  end
  num = id:match('^exer%-(%u?%d*%-%d+)$')
  if num then
    local word = title:match('(%a+) ' .. num:gsub('%-', '%%.')) or 'Exercise'
    return word .. ' ' .. num:gsub('%-', '.')
  end
  return id
end

local function item_blocks(d, refs)
  local id = d.identifier
  local title = stringify(d.content[1] or '')
  local tag = title:match('%[side trip%]') and 'side' or 'core'
  if tag == 'side' then has_side = true end
  local kind = item_kind(title)
  if kind then tag = tag .. ' k-' .. kind end
  -- the Uses line
  local uses = List()
  if d.attributes.uses then
    if d.attributes.uses ~= 'none' then
      for u in d.attributes.uses:gmatch('%S+') do uses:insert(u) end
    end
  else
    -- earlier items on this page, in page order, then restated results, in order of mention
    local seen, restated = {}, List()
    for _, r in ipairs(refs) do
      if not seen[r] then
        if item_index[r] and item_index[r] < item_index[id] then seen[r] = true; uses:insert(r)
        elseif not item_index[r] and lec_ids[r] then seen[r] = true; restated:insert(r) end
      end
    end
    table.sort(uses, function(a, b) return item_index[a] < item_index[b] end)
    uses:extend(restated)
  end
  -- an exercise's "Uses:" line names the tools of its solution, so it opens with the solution
  -- (a paragraph, already hidden); every other item gets a closed fold "Uses" after its statement
  local spoiler = kind == 'exer'
  local uses_html, uses_fold = nil, nil
  if #uses > 0 and show_uses then
    local links = {}
    for _, u in ipairs(uses) do
      links[#links + 1] = '<a class="xref" href="#' .. u .. '">' .. esc(item_label[u] or u) .. '</a>'
    end
    if spoiler then
      uses_html = raw('<p class="uses">Uses: ' .. table.concat(links, ', ') .. '</p>')
    else
      uses_fold = raw('<details class="fold sub uses"><summary>Uses</summary><p>'
        .. table.concat(links, ', ') .. '</p></details>')
    end
  end
  -- split at the first `::: more`
  local head, tail, split = List(), List(), false
  for _, b in ipairs(d.content) do
    if not split and b.t == 'Div' and b.classes:includes('more') then
      split = true
      tail:extend(b.content)
    elseif split then
      tail:insert(b)
    else
      head:insert(b)
    end
  end
  local out = List()
  if split then
    out:insert(raw('<details class="item ' .. tag .. '" id="' .. id .. '"><summary>'))
    out:extend(head)
    out:insert(raw('<span class="more-hint"></span></summary>'))
    -- opened with the item: the "Uses" fold first, an exercise's line first in its solution
    if uses_fold then out:insert(uses_fold) end
    if uses_html then out:insert(uses_html) end
    out:extend(tail)
    out:insert(raw('</details>'))
  else
    -- an item with its own folds (`::: intuition`, `::: steps`, named `.fold`s after the
    -- statement): the statement stays open, then its visible punch (`::: {.punch kind="why"}`),
    -- then the closed fold "Uses" (an exercise's line opens its fold "Solution ..." instead),
    -- then the other folds; an exercise's key idea fold comes before its Hint and Solution
    local function is_fold(b) return b.t == 'RawBlock' and b.text:match('^<details class="fold') end
    -- top-level groups of the head: a fold (opening block to its matching close) or one block
    local groups, depth, gs = {}, 0, nil
    for i, b in ipairs(head) do
      local o = b.t == 'RawBlock' and b.text:match('^<details')
      local c = b.t == 'RawBlock' and b.text:match('^</details>')
      if depth == 0 then
        if o then depth, gs = 1, i else groups[#groups + 1] = { s = i, e = i } end
      else
        if o then depth = depth + 1 elseif c then depth = depth - 1 end
        if depth == 0 then
          local t = head[gs].text
          groups[#groups + 1] = { s = gs, e = i, fold = is_fold(head[gs]),
            inwords = t:match('<summary>In words</summary>') ~= nil,
            key = t:match('^<details class="fold sub key"') ~= nil,
            hint = t:match('<summary>Hint') ~= nil or t:match('<summary>Hinweis') ~= nil
              or t:match('<summary>Solution') ~= nil or t:match('<summary>Lösung') ~= nil }
        end
      end
    end
    -- parts in order, without the visible punches (a Div of class `punch`, which is part of
    -- neither the statement nor a fold) and the key idea folds, which are placed below
    local parts, vis, keys = {}, List(), List()
    for _, g in ipairs(groups) do
      local b = head[g.s]
      if g.s == g.e and b.t == 'Div' and b.classes:includes('punch') then
        vis:insert(b)
      elseif g.key then
        for k = g.s, g.e do keys:insert(head[k]) end
      else
        parts[#parts + 1] = g
      end
    end
    -- the statement ends at its first fold that is not an "In words" fold (those follow the
    -- displays of the statement); the punch and the "Uses" fold go there, else at the end
    local pos, keypos = #parts + 1, nil
    for k, g in ipairs(parts) do
      if g.fold and not g.inwords then pos = k; break end
    end
    for k, g in ipairs(parts) do
      if g.fold and g.hint then keypos = k; break end
    end
    keypos = keypos or pos
    out:insert(raw('<div class="item ' .. tag .. '" id="' .. id .. '">'))
    for k = 1, #parts + 1 do
      if k == pos then
        out:extend(vis)
        if uses_fold then out:insert(uses_fold) end
      end
      if k == keypos then out:extend(keys) end
      local g = parts[k]
      if g then
        for i = g.s, g.e do
          local b = head[i]
          if is_fold(b) and not b.text:match('^<details class="fold sub') then
            b = raw((b.text:gsub('^<details class="fold"', '<details class="fold sub"', 1)))
          end
          out:insert(b)
          if uses_html and is_fold(b) and b.text:match('<summary>Solution') then
            out:insert(uses_html); uses_html = nil
          end
        end
      end
    end
    if uses_html then out:insert(uses_html) end
    out:insert(raw('</div>'))
  end
  return out
end

-- Two routes -------------------------------------------------------------------------------

local function read_md(name)
  local dir = pandoc.path.directory(PANDOC_STATE.input_files[1])
  local p = pandoc.path.join { dir, name }
  local fh = io.open(p, 'r')
  if not fh then error('layers.lua: cannot read ' .. p) end
  local txt = fh:read('a')
  fh:close()
  return pandoc.read(txt, 'markdown')
end

-- item id -> {head, tail, side} for every item of a document
local function extract_items(d)
  local t = {}
  for _, b in ipairs(d.blocks) do
    if b.t == 'Div' and b.classes:includes('item') then
      local head, tail, split = List(), List(), false
      for _, x in ipairs(b.content) do
        if not split and x.t == 'Div' and x.classes:includes('more') then
          split = true
          tail:extend(x.content)
        elseif split then
          tail:insert(x)
        else
          head:insert(x)
        end
      end
      local title = stringify(b.content[1] or '')
      t[b.identifier] = { head = head, tail = tail, side = title:match('%[side trip%]') ~= nil }
    end
  end
  return t
end

local function folded(blocks)
  return fold_divs(pandoc.Div(blocks)).content
end

-- another report's item, as a closed fold: statement, then its steps in a nested fold
local function embed(it, label, href, cls)
  local out = List { raw('<details class="route' .. (cls or '') .. '"><summary>' .. esc(label) .. '</summary>') }
  out:extend(folded(it.head))
  if #it.tail > 0 then
    out:insert(raw('<details class="fold"><summary>Steps and details</summary>'))
    out:extend(folded(it.tail))
    out:insert(raw('</details>'))
  end
  out:insert(raw('<p class="route-link"><a href="' .. href .. '">Open in the full report →</a></p>'))
  out:insert(raw('</details>'))
  return out
end

local function meta_str(m) return m and stringify(m) or '' end

-- sides and pairs from the routes page
local function load_routes(rdoc)
  local sides, order = {}, List()
  for k, v in pairs(rdoc.meta.sides or {}) do
    sides[k] = { md = meta_str(v.md), html = meta_str(v.html), name = meta_str(v.name), cite = meta_str(v.cite) }
  end
  for _, k in ipairs(rdoc.meta.side_order or {}) do order:insert(stringify(k)) end
  local pairs_ = List()
  rdoc:walk { Div = function(d)
    if d.classes:includes('pair') then
      local p = { content = d.content, ids = {} }
      for _, k in ipairs(order) do
        p.ids[k] = List()
        for id in (d.attributes[k] or ''):gmatch('%S+') do p.ids[k]:insert(id) end
      end
      pairs_:insert(p)
    end
  end }
  return sides, order, pairs_
end

local function label_for(side, id)
  return side.name .. ': ' .. (side.cite ~= '' and (side.cite .. ' ') or '') .. id
end

function Pandoc(doc)
  if not doc.meta.layered then return nil end
  if doc.meta.uses ~= nil and doc.meta.uses == false then show_uses = false end

  -- two routes: the routes page itself, or a report that belongs to one
  local sides, order, route_pairs, side_items = nil, nil, nil, {}
  local partners = {}   -- item id here -> list of {side, id} on the other side
  local this = meta_str(doc.meta.side)
  if doc.meta.sides then
    sides, order, route_pairs = load_routes(doc)
  elseif doc.meta.routes then
    sides, order, route_pairs = load_routes(read_md(meta_str(doc.meta.routes)))
  end
  if sides then
    for _, k in ipairs(order) do
      if k ~= this then side_items[k] = extract_items(read_md(sides[k].md)) end
    end
    if this ~= '' then
      for _, p in ipairs(route_pairs) do
        for _, mine in ipairs(p.ids[this]) do
          partners[mine] = partners[mine] or List()
          for _, k in ipairs(order) do
            if k ~= this then
              for _, other in ipairs(p.ids[k]) do partners[mine]:insert({ k, other }) end
            end
          end
        end
      end
      for _, k in ipairs(order) do
        if k ~= this and sides[k].cite ~= '' then
          comp = { items = side_items[k], cite = sides[k].cite, html = sides[k].html, used = {} }
        end
      end
    end
  end

  -- pass 1: which items and lecture entries exist, and in which order
  local n = 0
  for _, b in ipairs(doc.blocks) do
    if b.t == 'Div' and b.classes:includes('item') then
      n = n + 1
      item_index[b.identifier] = n
      -- the title is the first block that is not a punch (a punch may be written anywhere in the item)
      local first = b.content[1]
      for _, c in ipairs(b.content) do
        if not (c.t == 'Div' and c.classes:includes('punch')) then first = c; break end
      end
      local title = stringify(first or '')
      item_label[b.identifier] = label_of(b.identifier, title)
      -- "Satz 1.9. ..." makes "Satz" a citation word on this page
      local w = title:match('^(%a+) %u?%d*%.%d+%.')
      if w and aliases[w] then own_words[w] = true end
    end
  end
  doc:walk { Div = function(d)
    if d.classes:includes('lec') then
      lec_ids[d.identifier] = true
      item_label[d.identifier] = label_of(d.identifier, stringify(d.content[1] or ''))
    end
  end }

  -- other pages (`pages: [appA.md, ...]`): their items, for citations this page cannot resolve
  for _, p in ipairs(doc.meta.pages or {}) do
    local md = stringify(p)
    local html = md:gsub('%.md$', '') .. '.html'
    for _, b in ipairs(read_md(md).blocks) do
      if b.t == 'Div' and b.classes:includes('item') and not item_index[b.identifier] then
        -- the statement and status line: the blocks before the first fold
        local head = List()
        for _, x in ipairs(b.content) do
          if x.t == 'Div' and (x.classes:includes('more') or x.classes:includes('intuition')
              or x.classes:includes('steps') or x.classes:includes('fold') or x.classes:includes('why')
              or (x.classes:includes('punch') and x.attributes.kind == 'key')) then
            break
          end
          head:insert(x)
        end
        local title = stringify(b.content[1] or '')
        ext[b.identifier] = { head = head, html = html }
        item_label['x-' .. b.identifier] = label_of(b.identifier, title)
        local w = title:match('^(%a+) %u?%d*%.%d+%.')
        if w and aliases[w] then own_words[w] = true end
      end
    end
  end

  -- pass 2: links, items, folds
  local blocks = List()
  local pre = fold_code(doc.blocks)
  for bi, b in ipairs(pre) do
    if b.t == 'Div' and b.classes:includes('item') then
      local refs = List()
      local linked = linkify_block(b, b.identifier, refs)
      linked = fold_divs(linked)
      blocks:extend(item_blocks(linked, refs))
      for _, pr in ipairs(partners[b.identifier] or {}) do
        local k, other = pr[1], pr[2]
        local it = side_items[k][other]
        if not it then error('layers.lua: no item ' .. other .. ' in ' .. sides[k].md) end
        local side_cls = stringify(b.content[1] or ''):match('%[side trip%]') and ' side' or ''
        blocks:extend(embed(it, label_for(sides[k], other), sides[k].html .. '#' .. other, ' inreport' .. side_cls))
      end
    elseif b.t == 'Div' and b.classes:includes('pair') then
      local out = List { raw('<div class="item pair">') }
      out:extend(linkify_block(pandoc.Div(b.content), nil, nil).content)
      for _, k in ipairs(order) do
        for id in (b.attributes[k] or ''):gmatch('%S+') do
          local it = side_items[k][id]
          if not it then error('layers.lua: no item ' .. id .. ' in ' .. sides[k].md) end
          out:extend(embed(it, label_for(sides[k], id), sides[k].html .. '#' .. id, ''))
        end
      end
      out:insert(raw('</div>'))
      blocks:extend(out)
    else
      local self = (b.t == 'Div' and b.classes:includes('lec')) and b.identifier or nil
      -- wrapped, so that a fold at the top level of a section (`::: plain`, `::: {.fold}`)
      -- folds too: a walk does not visit the block it starts from
      local res = folded({ linkify_block(b, self, nil) })
      -- a need line directly before an item belongs to it: `data-for` names the item, and a
      -- side trip's need line is a side trip too ("Core only" hides both)
      local nxt = pre[bi + 1]
      if b.t == 'Div' and b.classes:includes('need') and nxt and nxt.t == 'Div'
          and nxt.classes:includes('item') and res[1] and res[1].t == 'Div' then
        res[1].attributes['data-for'] = nxt.identifier
        if stringify(nxt.content[1] or ''):match('%[side trip%]') then res[1].classes:insert('side') end
      end
      blocks:extend(res)
    end
  end

  -- pass 3: sections, contents list, toolbar
  local out, toc = List(), {}
  local open_sec = false
  local i = 1
  while i <= #blocks do
    local b = blocks[i]
    if b.t == 'Header' and b.level == 2 then
      if open_sec then out:insert(raw('</details>')); open_sec = false end
      local side = b.classes:includes('side')
      if side then has_side = true end
      toc[#toc + 1] = '<li' .. (side and ' class="side"' or '') .. '><a href="#' .. b.identifier .. '">'
        .. esc(stringify(b.content)) .. '</a></li>'
      local fold = b.classes:includes('fold')
      b = pandoc.Header(2, b.content, pandoc.Attr(b.identifier))
      if fold then
        out:insert(raw('<details class="sec' .. (side and ' side' or '') .. '"><summary>'))
        out:insert(b)
        while blocks[i + 1] and blocks[i + 1].t == 'Div' and blocks[i + 1].classes:includes('gist') do
          i = i + 1
          out:insert(pandoc.Div(blocks[i].content, pandoc.Attr('', { 'gist' })))
        end
        out:insert(raw('</summary>'))
        open_sec = true
      else
        out:insert(b)
      end
    else
      out:insert(b)
    end
    i = i + 1
  end
  if open_sec then out:insert(raw('</details>')) end

  if comp then
    local store = List { raw('<div id="companion-store" hidden>') }
    for cid in pairs(comp.used) do
      store:insert(raw('<div id="' .. comp.cite .. '-' .. cid .. '" class="ext" data-href="' .. comp.html .. '#' .. cid .. '">'))
      store:extend(folded(comp.items[cid].head))
      store:insert(raw('</div>'))
    end
    store:insert(raw('</div>'))
    out:extend(store)
  end
  if #ext_used > 0 then
    local store = List { raw('<div id="page-store" hidden>') }
    for _, id in ipairs(ext_used) do
      store:insert(raw('<div id="x-' .. id .. '" class="ext" data-href="' .. ext[id].html .. '#' .. id .. '">'))
      store:extend(folded(ext[id].head))
      store:insert(raw('</div>'))
    end
    store:insert(raw('</div>'))
    out:extend(store)
  end

  local nav = raw('<nav id="toc"><p class="toc-title">Contents</p><ol>' .. table.concat(toc) .. '</ol></nav>')
  local bar = raw('<div id="layer-toolbar">'
    .. '<a class="tb" href="#toc" id="tb-toc">Contents</a>'
    .. '<button class="tb" id="tb-open">Open all</button>'
    .. '<button class="tb" id="tb-close">Close all</button>'
    .. (has_side and '<label class="tb"><input type="checkbox" id="tb-core"> Core only</label>' or '')
    .. (has_plain and '<label class="tb"><input type="checkbox" id="tb-plain"> Plain words only</label>' or '')
    .. '</div>')
  local final = List()
  local placed = false
  for _, b in ipairs(out) do
    final:insert(b)
    if not placed and b.t == 'Header' and b.level == 1 then
      final:insert(nav)
      placed = true
    end
  end
  if not placed then final:insert(1, nav) end
  final:insert(1, bar)

  for id, label in pairs(missing) do
    io.stderr:write('layers.lua: no lecture entry #' .. id .. ' for "' .. label .. '"\n')
  end
  doc.blocks = final
  return doc
end
