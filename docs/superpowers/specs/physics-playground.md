# Spec — Physics Playground (`/physics`)

| | |
|---|---|
| **Owner** | Michael Cullen |
| **Status** | Approved — ready for implementation planning |
| **Last updated** | 2026-05-25 |

---

## Concept

A single dark canvas showing a neutrino's flavour state as a glowing point tracing geometry inside an equilateral triangle. Four named presets set the physics; one scrubber lets the visitor feel the oscillation.

Primary signal to visitor: *"This person finds these ideas beautiful."*

---

## The Triangle

An equilateral triangle dominates the canvas, vertices labelled **νe · νμ · ντ**, each in a distinct colour:

| Vertex | Flavour | Colour | Rationale |
|---|---|---|---|
| Top | νe | Burgundy `#7d4c67` | Site heritage accent; the born state |
| Bottom-left | νμ | Warm amber `#C8963E` | |
| Bottom-right | ντ | Cool slate `#4A7C9C` | |

The full oscillation path for the active preset is drawn as a faint luminous trace inside the triangle — the *shape of the strangeness*. A single bright glowing dot sits on that path at the position corresponding to the current L/E value, leaving a short fading tail as it moves.

The three vertex colours bleed subtly inward as a radial gradient so the triangle reads as a probability field, not just a diagram.

---

## Presets

Four named states, selectable via pill buttons. Default on load: **No Mixing**.

| Preset | Physics | Dominant Δm² | What the visitor sees |
|---|---|---|---|
| **No Mixing** | All θ = 0° | — | Point frozen at νe vertex. Triangle empty. The particle is born as something and stays that thing. |
| **Solar Neutrinos** | Real PDG values | Δm²₁₂ = 7.53×10⁻⁵ eV² | Slow, wide elliptical arc between νe and νμ. The particle the sun sends us quietly becomes something else. |
| **Atmospheric Neutrinos** | Real PDG values | Δm²₂₃ = 2.453×10⁻³ eV² | Tighter, faster oscillation mainly between νμ and ντ. |
| **Maximum Mixing** | All θ = 45° | — | Path blossoms into the most complex curve the triangle can hold. The particle is maximally strange. |

Switching presets animates the path morphing over ~600ms. "No Mixing" loads first — the frozen point invites the first question.

### PMNS mixing angle values per preset

| Preset | θ₁₂ | θ₁₃ | θ₂₃ |
|---|---|---|---|
| No Mixing | 0° | 0° | 0° |
| Solar Neutrinos | 33.4° | 8.6° | 49.2° |
| Atmospheric Neutrinos | 33.4° | 8.6° | 49.2° |
| Maximum Mixing | 45° | 45° | 45° |

Solar and Atmospheric use identical real PDG mixing angles — the difference is which Δm² term dominates the oscillation length.

---

## L/E Scrubber

A single horizontal slider below the triangle.

- **Label:** `Baseline / Energy (L/E)`
- **Readout:** current value in km/GeV
- **Subtext:** *"Drag to travel further from the source — or increase the neutrino's energy."*

Dragging moves the glowing dot along the path in real time. Animation is immediate — this is the one tactile moment on the page.

---

## Probability Readout

Three small live bars, one per flavour, in the vertex colours, showing P(νe), P(νμ), P(ντ) at the current L/E. Always sum to 1. No numerical labels — relative bar lengths are sufficient. Visual echo of the triangle, not a separate data display.

---

## PMNS Inset Panel

Small panel, bottom-right, low visual emphasis. Shows the three mixing angles for the active preset:

```
θ₁₂  33.4°
θ₁₃   8.6°
θ₂₃  49.2°
```

Updates with preset changes. Reads all zeros on "No Mixing." Signals to the technically curious that these are real measured parameters.

---

## Page Framing (minimal text)

**Heading:** `Neutrino Oscillation`

**Subhead:** *"A neutrino has no definite flavour in transit. It is all three at once."*

**Body (three sentences max):**
> *The flavour triangle shows where a neutrino's identity lives at any moment. The path it traces is determined by three mixing angles — real numbers measured by experiment, first confirmed in 2015. This is the mathematics at the centre of my M.Phys thesis.*

No further explanation. The visitor either engages or moves on.

---

## Visual & Technical Notes

**Canvas background:** deep ink `#1a1a2e` (consistent with hero motif).

**Implementation:** vanilla JS + HTML5 canvas. No external charting library. The triangle geometry and PMNS probability formula are straightforward to compute directly.

**Physics accuracy:**
- Default: two-flavour approximation using the dominant Δm² for each preset.
- Optional toggle (off by default, labelled "Full 3-flavour"): switches to full three-flavour computation. Low visual emphasis — for visitors who want it.

**Probability formula (two-flavour approximation):**
```
P(να → νβ) = sin²(2θ) · sin²(1.27 · Δm² · L / E)
```
where L is in km, E in GeV, Δm² in eV².

**Responsive behaviour:**
- Triangle scales to fill viewport width on mobile
- Scrubber remains full-width
- Preset pills stack 2×2 on small screens

**Mode-switch tab (future slot):**
The PRD specifies a second mode (GR / Interstellar Simulator). The page includes a tab or toggle for Mode 2, visually present but greyed out and labelled "Coming soon." Preserves the two-mode structure without blocking this phase.

---

## Relationship to PRD

This spec covers **Centerpiece B — Physics Playground**, specifically Mode 1 (Neutrino Oscillation Viewer). It resolves the open decision in PRD §13 item 2: *"exact simulation scope, controls, and visual treatment to be defined collaboratively before build."*

Source repos: `QuantumAndNeutrinos`, `QuantumPOC`.

Phase 4 of the PRD high-level plan can now begin once Phase 3 (Architecture Simulator) is complete or running in parallel.
