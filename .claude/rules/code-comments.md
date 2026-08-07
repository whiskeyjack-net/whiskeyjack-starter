---
paths:
  - "**"
---

# Code Comment Rules

Comments state what the code does and the constraints the code cannot show.
They are written for the next reader of the file, who was not present for the
change.

- **Lead with behavior**: what the module, function, or block does, in 1–4
  lines.
- **Keep only invisible constraints**: units, invariants, ordering
  requirements, platform quirks, why a value is what it is when the code cannot
  say.
- **Never narrate history or process.** No "used to", "previously", "the old
  approach", "an earlier draft", incident retellings. Git commits own the
  history – move the narrative into the commit message.
- **Never address the reviewer.** No justifying the change or comparing it to
  the alternative you didn't pick. If a rationale matters durably, one sentence
  stating a fact about the system is the ceiling.
- Comparative phrasing is fine when it describes current behavior; it is banned
  when it describes the diff.
- En dashes, never em dashes (see `copywriting.md` – applies to comments too).
