---
name: particle-background
description: Integrate 3D particle effects (from Particleify or custom Three.js) as website backgrounds. Use this skill when adding particle/WebGL visual effects to project websites, landing pages, or dashboards while preserving hero sections and content readability.
---

# 3D Particle Background Integration

This skill documents a proven workflow for integrating Three.js particle effects into website backgrounds. The particles render a logo or custom image as a 3D point cloud, creating a premium ambient background.

## Architecture Overview

```
┌─────────────────────────────────┐
│  Website HTML                   │
│  ┌──────────────────────────┐   │
│  │ #particle-container      │   │  ← position:fixed, z-index:-1
│  │ (Three.js Canvas)        │   │     pointer-events:none
│  └──────────────────────────┘   │
│  ┌──────────────────────────┐   │
│  │ Hero Section             │   │  ← z-index:2, background:#opaque
│  │ (blocks particles)       │   │     Particles invisible here
│  └──────────────────────────┘   │
│  ┌──────────────────────────┐   │
│  │ Content Sections         │   │  ← z-index:1, transparent bg
│  │ (particles show through) │   │     Particles visible as ambient
│  └──────────────────────────┘   │
└─────────────────────────────────┘
```

## Step-by-Step Integration

### 1. Prepare Assets from Source

If the source is a standalone HTML file (e.g., from [Particleify](https://particleify.tailzen.com)):

**Extract the logo image:**
```bash
# If the source contains a base64-encoded image, extract it:
# Find the base64 string in the JS (starts with "data:image/png;base64,")
# Decode and save as PNG:
echo "<base64_string>" | base64 --decode > docs/my-logo-particle.png
```

**Extract the JS module:**
- Copy the core JavaScript (Three.js setup, shaders, animation loop) into a standalone `.js` file
- Replace any inline base64 image with a dynamic `new Image()` loader pointing to the extracted PNG
- Wrap in an IIFE to avoid global scope pollution
- Add an auto-init that looks for `#particle-container` in the DOM

### 2. Configure for Background Use

In the extracted JS file, apply these background-optimized settings:

```javascript
// Key overrides for background mode (vs standalone full-screen mode):
const CONFIG = {
    particleCount: 80000,    // Reduce from 150K+ for performance
    particleSize: 67,        // Keep original or adjust per taste
    opacity: 1.0,            // Full opacity in JS; control via CSS container
};
```

**Important:** Do NOT set opacity in JS. Control it via the HTML container's inline `opacity` style — this allows per-page tuning without modifying JS.

### 3. HTML Integration Template

Add to the target HTML page, right after `<body>`:

```html
<!-- 3D Particle Background -->
<div id="particle-container"
     style="position:fixed; top:0; left:0; width:100vw; height:100vh;
            z-index:-1; pointer-events:none; opacity:0.5;">
</div>
```

Add scripts before `</body>`:

```html
<!-- Three.js (required) -->
<script src="https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js"></script>
<!-- Particle effect module -->
<script src="my-particle.js"></script>
```

### 4. Hero Section Exclusion (Critical)

The hero section MUST have an **opaque background** to fully block particles behind it. Semi-transparent overlays alone will NOT work.

**CSS approach (preferred):**
```css
.hero {
    position: relative;
    z-index: 2;                    /* Higher than particle container */
    background: #0a0a0f;          /* MUST be fully opaque */
}
```

**Inline style approach (for maximum reliability):**
```html
<section class="hero" style="background:#0a0a0f; z-index:2;">
```

### Why NOT to use `clip-path`

DO NOT use `clip-path: inset(...)` on the particle container to exclude the hero area:
- `clip-path` with `position:fixed` clips based on viewport, not scroll position
- As user scrolls, the particles remain clipped in the wrong area
- The opaque hero background approach is simpler and more reliable

### 5. Opacity Tuning Guide

| Use Case | Recommended Opacity | Notes |
|----------|-------------------|-------|
| Dashboard / dark UI | `0.5 - 0.7` | Content cards have their own dark backgrounds |
| Landing page | `0.4 - 0.6` | Balance visibility vs readability |
| Full-screen showcase | `0.8 - 1.0` | When particles are the primary visual |
| Light theme sites | `0.15 - 0.3` | Very subtle; particles may need color inversion |

### 6. Performance Checklist

- [ ] **Particle count** ≤ 100K for background use (150K+ only for standalone)
- [ ] **`pointer-events: none`** on container (prevents blocking clicks)
- [ ] **`z-index: -1`** on container (stays behind all content)
- [ ] **No `requestAnimationFrame` when tab hidden** (check if the source handles `visibilitychange`)
- [ ] **Test on mobile** — consider disabling particles on `matchMedia('(max-width: 768px)')` if performance is poor
- [ ] **Image file** extracted from base64 (saves ~30% page weight vs inline base64)

### 7. Customizing for Different Projects

Each project uses a **different logo image** but the same integration pattern.

#### Quick-Start for a New Project

```bash
# 1. Copy the templates into your project
cp skills/toolkit/particle-background/templates/particle-bg.js  YOUR_PROJECT/docs/
cp skills/toolkit/particle-background/templates/integration-snippet.html YOUR_PROJECT/docs/  # reference only

# 2. Generate your particle image
#    Option A: Use Particleify (https://particleify.tailzen.com)
#              Upload your logo → adjust settings → Export HTML → extract base64 image
#    Option B: Use any transparent PNG logo directly (white/light on transparent works best)

# 3. Save your logo image
cp your-logo.png YOUR_PROJECT/docs/my-logo-particle.png

# 4. Edit particle-bg.js — change IMAGE_PATH on line 18
#    const IMAGE_PATH = './my-logo-particle.png';

# 5. Edit particle-bg.js — change baseColor to match your project's brand
#    See color presets below

# 6. Copy integration-snippet.html sections into your actual HTML files
```

#### Template Files Included

| File | Purpose |
|------|---------|
| `templates/particle-bg.js` | Ready-to-use particle JS module. Change `IMAGE_PATH` and `CONFIG` at the top. |
| `templates/integration-snippet.html` | HTML snippets to copy-paste: container div, hero exclusion, scripts. |

#### Color Presets by Theme

Adjust `CONFIG.baseColor` in `particle-bg.js` to match your project's brand:

```javascript
// Gold (MUSE default)
baseColor: { r: 1.0, g: 0.85, b: 0.4 }

// Cyan / Tech blue
baseColor: { r: 0.3, g: 0.8, b: 1.0 }

// Purple / Creative
baseColor: { r: 0.7, g: 0.4, b: 1.0 }

// Green / Nature
baseColor: { r: 0.3, g: 1.0, b: 0.6 }

// Red-Orange / Energy
baseColor: { r: 1.0, g: 0.4, b: 0.2 }

// White / Neutral
baseColor: { r: 1.0, g: 1.0, b: 1.0 }
```

#### Hero Background Color per Theme

The hero `background` must match the site's primary bg color:

```
Dark theme:   background: #0a0a0f
Navy theme:   background: #0d1117
Light theme:  background: #ffffff
Custom:       background: var(--bg-primary)  /* if CSS variable is opaque */
```

#### Effect modes available (Particleify-exported code):
- `default` — particles morph into image shape
- `scatter` — particles randomly spread
- `explode` — outward burst from center
- `vortex` — spiral motion
- `pulse` — breathing scale effect
- `wave` — wave distortion

## Common Pitfalls

| Pitfall | Solution |
|---------|----------|
| Particles visible through hero | Add `background: <opaque-color>` + `z-index:2` to hero section |
| Colors look washed out | Increase container opacity (0.5+), don't over-reduce |
| Page interactions blocked | Ensure `pointer-events:none` on container |
| Huge page size | Extract base64 images to separate PNG files |
| Particles not visible | Check `z-index` conflicts; content sections may need transparent backgrounds |
| Performance issues on mobile | Reduce `particleCount` or disable entirely via media query |
| `clip-path` used for hero exclusion | Don't! Use opaque hero background instead (see Step 4) |

## File Structure

### Skill Template Files
```
skills/toolkit/particle-background/
├── SKILL.md                              # This guide
└── templates/
    ├── particle-bg.js                    # Copy & customize per project
    └── integration-snippet.html          # HTML reference snippets
```

### Per-Project Target Structure
```
your-project/docs/
├── index.html              # Landing page (particles + hero exclusion)
├── dashboard.html          # Dashboard (full particle background)
├── my-logo-particle.png    # Your project's logo image
├── particle-bg.js          # Customized from template
└── style.css               # Includes hero background fix
```

## Reference Implementation

The canonical working implementation is in the MUSE project:
- **JS module**: `docs/muse-particle.js` (advanced version with GLSL shaders)
- **Logo image**: `docs/muse-logo-particle.png`
- **Dashboard integration**: `docs/dashboard.html` (full background, opacity 0.6)
- **Landing page integration**: `docs/index.html` (hero excluded via opaque bg)

## Dependencies

- **Three.js** v0.160.0 (CDN, ~600KB gzipped) — required for WebGL rendering
- No other runtime dependencies
