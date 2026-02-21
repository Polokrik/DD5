# Clan d’Estain — Interactive Chronicle
Single-file HTML5 Canvas Adventure (Point & Click + Parser)

## 🎯 PROJECT PURPOSE

This project is a narrative adventure game adapting the real Tyranny of Dragons campaign played by the Clan d’Estain.

The game must:
- Be faithful to the recorded campaign events.
- Use a unified group system (Mode A).
- Support permanent death + replacement characters.
- Allow canonical progression and controlled divergences.
- Include serious and silly Game Over states with rollback.

---

# 🧱 CORE ARCHITECTURE RULES

## 1️⃣ Technical Constraints (NON-NEGOTIABLE)

- Single HTML file only.
- No external libraries.
- Canvas-based rendering.
- Pixel art style.
- imageSmoothingEnabled = false.
- NO random rendering per frame.
- All animations must be deterministic or precomputed.
- Data-driven structure (rooms, items, flags, characters).

---

## 2️⃣ UI LAYOUT (MANDATORY)

Layout must always follow:

1. Canvas (top)
2. CONTEXT window (narrative output)
3. PROMPT input line (input only)

❌ Narrative text must NEVER appear in the prompt area.
❌ Do not merge context and input.

---

## 3️⃣ GROUP SYSTEM (MODE A)

The player controls the group as a unified entity.

Each character has:
- state: active / injured / absent / dead / captured
- skill tags
- special abilities
- persistent narrative impact

Options appear conditionally:

[Option – Bjolnir: Redemption]
[Option – Malar: Stealth]
[Option – Darrin: Wild Magic]

If the character is dead or absent, the option must not appear.

---

## 4️⃣ DEATH & GAME OVER SYSTEM

Two types of failure:

### A) Canonical Failure
Leads to serious Game Over.
Example:
- Entire group dies
- Strategic collapse of Greenest

### B) Silly Failure
Leads to humorous Game Over.
Example:
- Insulting a dragon
- Throwing a dragon egg

After any Game Over:
- Restore last decision checkpoint.
- Do NOT restart entire game.

Checkpoint system must snapshot:
- group states
- flags
- variables
- inventory
- act progression

---

## 5️⃣ RESOLUTION SYSTEM

No visible dice.
Resolution must be narrative-based.

Possible results:
- Success
- Success with cost
- Failure
- Critical failure
- Death

Combat is abstracted (no full RPG mechanics).

---

## 6️⃣ STYLE & WRITING

- Language: French.
- Tone: Epic, immersive, serious.
- No modern slang.
- Slight irony allowed in silly Game Over only.
- Dialogues short and characterized.

---

## 7️⃣ VISUAL STYLE

- 32–48 color palette max.
- Sprite size: ~32x48.
- Deterministic fire/smoke animations.
- No procedural jitter.
- 320x200 logical resolution (scaled).

---

## 8️⃣ DATA STRUCTURE

All narrative content must be stored in structured objects:

- acts
- rooms
- flags
- characters
- variables
- dialogues
- puzzles
- checkpoints

No hard-coded branching logic inside UI functions.

---

## 9️⃣ CODE QUALITY REQUIREMENTS

- Clear separation: rendering / logic / data.
- Functions under 80 lines when possible.
- No global variable sprawl.
- Comment major systems.
- Add manual QA checklist at end of file.

---

## 🔟 DO NOT

- Do not invent canonical names if present in campaign logs.
- Do not override previous state logic.
- Do not remove rollback system.
- Do not introduce external dependencies.
- Do not randomize visuals per frame.

---

## ✅ ACCEPTANCE CRITERIA FOR ANY FEATURE

Before considering a feature complete:

- Does it respect UI separation?
- Does it respect group system?
- Does it handle character death correctly?
- Does it integrate with checkpoint system?
- Is it deterministic?
- Is the writing in French and tonally consistent?

If not, revise before completion.
