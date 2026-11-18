# Tyranny of Dragons — Pixel Art & Animation Polish Brief

> **Purpose:** operational visual reference for Claude Code during the pixel-art and animation polish phase.  
> The project architecture, campaign lore, chronology, UI structure and documentation already exist.  
> **Do not redesign the application, rewrite the lore, or restructure campaign data. Improve the existing visual implementation in place.**

---

## 1. Priorities

1. Environment-specific art direction
2. Readable pixel silhouettes
3. Animation quality and timing
4. Lighting
5. Depth and parallax
6. Visual storytelling
7. Consistency between sprites and environments

Every animation must have a narrative or atmospheric purpose.

Prefer:
- one strong focal animation;
- two subtle environmental animations;
- a mostly stable scene.

Avoid making everything move simply because it can.

---

## 2. Global visual target

Aim for **modern, high-quality fantasy pixel art**, not a literal recreation of an old 16-bit game.

Useful references for principles only, never copied assets:
- **Octopath Traveler**: lighting, atmosphere, depth
- **Sea of Stars**: environments and colour control
- **Chained Echoes**: readable fantasy characters
- **Dead Cells**: silhouettes and FX animation
- **Blasphemous**: dramatic medieval environments
- **Hyper Light Drifter**: restrained animation and environmental movement

Target direction:

`classic fantasy illustration -> intentional pixel-art reinterpretation -> modern lighting + subtle animation`

Avoid:
- pixelation filters;
- anti-aliasing and blur;
- excessive 1-pixel noise;
- smooth gradients inside sprites;
- fake CRT effects;
- chibi styling;
- generic glossy mobile-game aesthetics;
- painterly assets merely reduced in resolution.

The image must look **constructed in pixels**, not downsampled.

---

## 3. Pixel language

Build each asset in this order:

`SILHOUETTE -> COLOUR MASS -> LIGHT -> DETAIL`

At normal display size, important characters and objects must remain identifiable before fine detail becomes visible.

Use:
- hard pixel edges;
- deliberate pixel clusters;
- limited colour ramps;
- selective outlines;
- controlled dithering;
- strong silhouettes;
- slightly exaggerated important shapes.

Avoid arbitrary single-pixel texture noise. Every cluster should clarify form, material, light or motion.

---

## 4. Resolution and scaling

### Scene illustrations
- logical canvas: **320×180**
- typical display: **1280×720**
- scale: **×4 nearest-neighbour**

### Small environmental scenes
- logical canvas: **240×135**
- typical display: **960×540**

### Characters
- portrait sprite: **96×128**
- small sprite: **32×48** or **48×64**
- important character: around **64×96**
- giants / bespoke compositions may deliberately exceed this scale

Use integer scaling whenever the layout permits.

```css
.pixel-art {
  image-rendering: pixelated;
}
```

Avoid browser interpolation and fractional display scaling for core sprite assets.

---

# 5. Campaign visual progression

## Greenest / Verdure

### Identity
- medieval village at night
- burning timber buildings
- blue-black sky
- orange fire
- electric-blue lightning
- smoke and chaotic silhouettes

Core contrast:

`FIRE / orange  <->  DRAGON / electric blue`

This contrast should make Greenest recognisable almost immediately.

### Greenest hero composition
- foreground: refugees, raiders, broken carts, silhouettes
- midground: burning town
- architectural anchor: keep
- upper focal point: Lennithon circling the keep

Dragon and keep must remain readable at thumbnail size.

### Ambient animation
- flame: 4–6-frame visual cycle
- smoke: slow drift
- embers: sparse random particles
- flags: short restrained loop
- dragon silhouette: occasional background pass
- lightning: rare brief event

A dragon attack should momentarily influence the **whole scene lighting**, not simply add a lightning sprite.

### Drek'Thar vs Langdedrosa I
Use a large open combat circle. Greenest burns behind them. Langdedrosa visually dominates the frame. Drek'Thar feels isolated. Spectators create a framing ring.

Do not use a continuous combat animation. Prefer restrained idle vocabulary:
- breathing;
- weapon shift;
- cloth movement;
- rare electrical spark on Langdedrosa.

Save stronger motion for triggered attacks.

---

## Raider Camp

### Identity
- dry canyon
- dust
- ochre rock
- dense field of tents
- violet cult banners
- wooden watchtowers
- campfires

Palette language:
`ochre / brown / dusty red / dirty canvas / cult purple / warm fire`

### Ambient movement
- asynchronous fire loops
- banners with different phases
- drifting smoke
- tiny distant silhouettes
- rare birds

Never synchronize all repeated environmental loops.

### Infiltration
Tell the scene through movement direction and light. The infiltrating/disguised character should travel against the flow of distracted guards. Keep the diversion fire secondary to the infiltration path.

### Leosin rescue
Use moonlight and warm camp-light contrast. Foreground occlusion and relative stillness should sell stealth. Avoid combat FX unless the current scene actually depicts combat.

---

## Dragon Hatchery

This should produce one of the campaign's strongest environmental transitions:

`outside = dry + warm`

`inside = wet + cold + organic`

### Identity
- limestone caves
- purple fungi
- wet stone
- black dragon eggs
- green reflections
- dragon iconography
- deep shadows

### Ambient movement
- water droplets
- restrained fungus pulse
- torch flicker
- rare bats/stirges
- low mist
- very occasional egg motion

Egg animation should feel unpredictable rather than like a collectible:

`still -> still -> still -> tiny crack / shift -> still`

### Drek'Thar vs Langdedrosa II
Reverse the visual logic of the first duel.

Both silhouettes should now carry comparable weight. Drek'Thar moves forward. Langdedrosa no longer owns the composition. The environment is tighter and more claustrophobic.

Use framing to communicate the reversal of the rivalry before animation does.

### Black dragon egg chamber
The eggs are the focal point. Use humidity, reflections and negative space around them. Secondary threats may frame the chamber but should not overwhelm the eggs.

---

## Boule & Bill

These recurring black dragon wyrmlings should distinguish this campaign visually from a generic Tyranny of Dragons adaptation.

Do **not** turn them into cute cartoon mascots.

### Base language
- young black dragons
- awkward juvenile proportions
- oversized wings
- long necks
- glossy dark scales
- restrained acid-green accents
- mildly mischievous body language

If the current project does not already define their individual silhouettes, a useful distinction is:
- **Boule:** broader silhouette, shorter horns, grounded stance
- **Bill:** thinner silhouette, slightly longer horns, more inquisitive head angle

Do not overwrite already-established designs merely to adopt this suggestion.

### Idle vocabulary
- tail movement
- blink
- head tilt
- wing twitch
- tiny acidic vapour

Do not put every behaviour in every loop. Use occasional secondary actions so they feel alive rather than mechanical.

---

## Journey / Caravan

Deliberately reduce visual intensity after Greenest and the Hatchery.

Prioritise:
- wide landscapes
- large skies
- small characters
- long horizontal composition
- slow parallax

Suggested layer stack:

`sky -> distant mountains -> far trees -> road -> caravan -> foreground vegetation`

Movement can include wagon wheels, horse cycles, grass, clouds, birds and dust, but the scene should feel like breathing room rather than spectacle.

---

## Mere of Dead Men / Marais des Morts

Oppressive does not mean uniformly dark.

Suggested palette family:
- `#1b2924`
- `#27382d`
- `#40513c`
- `#687153`
- `#898060`
- fog grey
- restrained sick-yellow accents

Use:
- strong dark foreground masses;
- pale middle-ground fog;
- barely visible distant ruins/forms;
- broken water reflections.

### Motion
- extremely slow fog
- water ripples
- insects
- occasional bubble
- reeds
- rare distant swamp lights

Player sprites should remain sharper and slightly warmer than the environment.

---

## Castle Naerytar

The castle should read from silhouette before masonry detail.

Priority:
`tower shapes -> roof line -> large stone masses -> openings -> texture`

Do not spend the pixel budget drawing every brick. Marsh vegetation should partially consume the architecture. Small warm windows can contrast with the green-grey environment.

### Lizardfolk uprising
Do not animate a literal army of detailed sprites.

Use three depth levels:

**Foreground**
- 4–6 readable combatants

**Midground**
- reduced combat clusters

**Background**
- silhouettes
- spears
- torches
- movement accents

This communicates a large fight while preserving readability and performance.

---

## Talis' Hunting Lodge

This is a visual reset after the swamp.

### Identity
- cold
- clean
- quiet
- isolated
- snow
- pine forest
- dark timber
- stone
- warm windows
- pale blue moonlight

The exterior may initially feel almost reassuring.

### Ambient motion
- restrained snow
- chimney smoke
- tree movement
- window-light variation
- occasional drake movement

### Talis / Ellyjobel
Treat this primarily as an interpersonal scene rather than a boss encounter.

Use:
- controlled poses
- eye-line
- spacing
- fireplace movement
- environmental stillness

The absence of explosive FX is part of the scene's power.

---

## Parnast -> Skyreach / Cumulus

Parnast should intentionally feel small. The reveal of Skyreach changes the adventure's scale.

Composition principle:

`tiny village + tiny characters -> ABSURDLY LARGE FLYING CASTLE`

Do not force the whole castle neatly into the viewport. Let towers and structures leave the frame. Cropping often conveys scale better than adding more detail.

---

## Skyreach Castle

### Identity
- ice blue
- cyan
- white
- deep navy
- cold violet shadows
- small gold accents

### Primary rule: scale
Doors, furniture, steps, corridors and structural members must continuously remind the viewer that the architecture is giant-scale.

### Ice rendering
Do not approximate ice as a blue rectangle with a white edge.

Use distinct ramps for:
- surface ice;
- deep ice;
- transmitted light.

Suggested base ramp:
- shadow `#18263f`
- deep `#294565`
- mid `#477496`
- ice `#76a9be`
- light `#b9dce2`
- highlight `#edf7f3`

Use rare near-black cracks. Internal reflections may shift very slowly. Large masses of ice should feel mostly static and heavy.

### Esclarotta
Avoid a generic low-opacity ghost sprite.

Build the apparition with opacity hierarchy:
- outer silhouette: faint
- main body: medium
- important facial/gesture areas: stronger
- luminous edges: strongest

Animate independently:
- hair drift
- garment edges
- opacity variation
- small particles

Avoid constant up/down floating. Prefer parts of the silhouette slowly forming and dissolving.

### Blagothkus
First reading: **GIANT**.

Do not merely scale a normal humanoid sprite by 1.5. In bespoke compositions, a roughly 100–140 logical-pixel height can work against 48–64-pixel human-scale figures, depending on the existing project's camera and sprite language.

Deliberate cropping in dialogue compositions can strengthen the feeling of scale.

### Rezmir
Visual language:
- black armour
- black-dragon forms
- acid-green accents
- cult purple
- hard silhouette

Suggested attack staging:
`anticipation -> attack -> acid stream -> impact splash -> residual droplets -> recovery`

Residual acid colour can briefly remain on affected floor pixels. FX must not bury Rezmir's silhouette.

### Glazhael
The reveal should exploit camouflage.

Initially let the white dragon merge with ice formations. Then progressively separate the silhouette through:
- eye opening
- head movement
- wing unfolding
- shadow separation

Cold breath should use:
- white core
- pale-cyan edge
- ice particles
- brief environmental desaturation
- frost residue

Avoid a blue laser-beam look.

---

# 6. Animation system

## Timing principles
Do not force every element onto one frame rate.

Useful starting ranges, to adapt to the current implementation:
- character idle: **6–10 fps**
- walking: **8–12 fps**
- combat FX: **12–18 fps**
- fire: **8–12 fps**
- water: **4–8 fps**
- flags: **4–6 fps**
- fog / snow: continuous slow movement
- large background movement: extremely slow

These are starting points, not mandatory globals.

## Phase offsets
Repeated environmental loops should not change frames together. Give fires, banners, particles, lights and similar repeated elements different initial phases and subtle timing variation.

## Hierarchy
### Level 1 — story-critical
- dragon
- important NPC
- magical event
- major reveal

### Level 2 — environmental life
- fire
- snow
- water
- fog
- banners

### Level 3 — micro-animation
- spark
- dust
- leaf
- blink
- tiny reflection

Avoid many simultaneous Level-1 movements unless the event specifically calls for chaos.

## CSS vs sprite animation
Prefer **CSS / existing compositor effects** for:
- slow translation
- opacity
- parallax
- fog
- snow layers
- simple particles
- light pulses
- restrained camera movement

Prefer **sprite sheets / explicit animation frames** for:
- characters
- creatures
- complex fire
- attacks
- important object articulation
- rotations where pixel integrity matters

Avoid arbitrary CSS rotation of pixel sprites. Draw important rotated states as real sprite frames instead.

## Camera movement
Use tiny camera movement only for high-impact establishing moments such as:
- dragon reveal
- Skyreach reveal
- major magical events

Ordinary scenes should remain stable. Never let camera treatment make UI text or controls drift.

---

# 7. Implementation guardrails for Claude Code

- Preserve existing component behaviour unless a visual requirement genuinely requires a change.
- Prefer local, reversible visual polish over broad refactors.
- Respect the project's current design tokens, component patterns and asset pipeline.
- Reuse existing sprite/animation infrastructure when suitable.
- Do not introduce a new animation library merely to reproduce an effect already achievable cleanly in the current stack.
- Keep decorative animation separate from lore/campaign state when possible.
- Decorative animation must never block interaction.
- Respect `prefers-reduced-motion` for non-essential movement.
- Avoid layout shifts when imagery loads.
- Keep pixel-art scaling integer-based wherever practical.
- Never smooth/interpolate low-resolution source sprites.
- Do not add motion simply because an element can be animated.
- Preserve focal hierarchy when adding particles or lighting.
- Test static readability with animation paused.

---

# 8. Scene review checklist

Before accepting a scene, verify:

1. What should the viewer notice first?
2. Can that focal point be recognised from silhouette alone?
3. Does the palette clearly belong to this chapter/location?
4. Is foreground / midground / background separation obvious?
5. What is moving?
6. Why is each moving element moving?
7. Do important sprites survive at native logical resolution?
8. Is there any accidental smoothing?
9. Do loops visibly reset?
10. Are repeated environmental cycles phase-shifted?
11. Do FX preserve character silhouettes?
12. Does movement support narrative hierarchy?
13. Is the scene understandable with animation paused?
14. Does reduced-motion mode remain visually complete?
15. Could half the movement be removed without losing meaning?

If the answer to 15 is yes, simplify.

---

# 9. Highest-priority bespoke polish targets

When polish effort is limited, concentrate bespoke treatment on:

1. Greenest burning / Lennithon attack
2. Drek'Thar vs Langdedrosa I
3. Raider Camp infiltration
4. Drek'Thar vs Langdedrosa II
5. Black dragon egg chamber
6. Boule & Bill recurring animation set
7. Caravan travel / parallax
8. Mere of Dead Men traversal
9. Castle Naerytar uprising
10. Talis / Ellyjobel encounter
11. Skyreach reveal
12. Esclarotta / Blagothkus interaction
13. Rezmir confrontation
14. Glazhael reveal

---

# 10. Compact master instruction for coding passes

Use this at the start of a Claude Code visual-polish task:

```text
PIXEL ART POLISH MODE

The application structure, campaign content and documentation already exist.
Do not redesign the application.
Do not restructure campaign data.
Do not rewrite lore.
Do not replace working components unless the visual implementation genuinely requires it.

Focus on improving the existing scene in place.

Priority order:
1. focal hierarchy and silhouette readability
2. environment-specific art direction
3. pixel integrity
4. animation timing
5. lighting
6. depth/parallax
7. atmospheric micro-motion
8. consistency with surrounding assets

Every animation must have a narrative or atmospheric purpose.
Prefer one excellent focal animation plus two subtle environmental animations over many constantly moving elements.

Pixel art must look intentionally constructed at low resolution.
Never simulate pixel art through a pixelation filter on high-resolution artwork.
Do not smooth low-resolution assets.
Preserve existing functionality.
Respect reduced-motion preferences.
Before finishing, verify that the scene remains readable with all animation paused.
```

---

# Final principle

The target is **not maximum animation**.

The target is for every major location to become identifiable through its:
- palette;
- silhouette;
- scale;
- lighting;
- atmosphere;
- one or two signature movements.

If an effect looks impressive but makes the scene less readable, less intentionally pixel-art, less coherent with the existing project or less specific to the campaign, remove it.
