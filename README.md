# OutfitRepeat — Clothing Combination Planner

> **Live Application Demo:** [https://wickramasingheweerakkody57-ux.github.io/OutfitRepeat/#home](https://wickramasingheweerakkody57-ux.github.io/OutfitRepeat/#home)

**OutfitRepeat** is a luxury fashion editorial digital wardrobe atelier and intelligent clothing combination planner. Inspired by modern high-fashion publications (*Vogue*, *Harper's Bazaar*, *Net-a-Porter*), it empowers conscious fashion enthusiasts to digitize what they own, curate mix-and-match ensembles across 4 visual slots, track garment wear frequency, and optimize capsule wardrobe efficiency.

---

## ✦ System Architecture & Core Modules

### 1. Editorial Landing Experience (`#home`)
- **Visual Identity:** Luxury fashion editorial typography (*Playfair Display* serif headings paired with *Poppins* geometric body font) set against a warm minimalist palette (`#FAF8F5`, `#F3EFEA`, and `#111111` with `#A38244` warm champagne gold accents).
- **Hero Atelier:** High-definition photography frames, tagline (*"Sustainable Digital Closet"*), and instant navigation triggers to the Outfit Planner and Digital Wardrobe.
- **Pillars of Mindful Fashion:** Highlighting the #30Wears philosophy, cost-per-wear awareness, and circular styling principles.
- **Editorial Footer:** Navigation shortcuts, sustainability pledges, and brand credentials.

### 2. Digital Wardrobe Management (`#wardrobe`)
- **Category Filter Pills:** Real-time garment counts across **All Items**, **Tops & Blouses**, **Bottoms & Trousers**, **Dresses & Jumpsuits**, **Shoes & Footwear**, and **Accessories & Bags**.
- **Instant Search:** Real-time query filtering matching garment names, color hues, or category tags with instant clear controls.
- **Garment Registration Modal:** Add new clothing items with local image file uploads (featuring client-side HTML5 canvas compression to conserve storage quotas) or external image URLs.
- **CRUD Operations:** Seamlessly edit or delete garments with automatic cascading updates to active planner slots, saved looks, and closet statistics.

### 3. Interactive Mix-and-Match Outfit Planner (`#planner`)
- **Four Dedicated Visual Slots:**
  1. `01 / Top` — Tops, blouses, shirts, or one-piece dresses.
  2. `02 / Bottom` — Tailored trousers, denim, skirts, and shorts.
  3. `03 / Shoes` — Loafers, mules, heels, and sneakers.
  4. `04 / Accessories` — Totes, bucket bags, and sunglasses.
- **Interactive Garment Vault:** Filterable sidebar by category; clicking any piece immediately routes it into its appropriate slot. Selecting another item from that category smoothly replaces the existing piece.
- **Action Suite:**
  - **Clear Canvas:** Flushes all 4 slots.
  - **Save to Favourites:** Validates combinations (minimum 2 pieces) and stores the look in your private lookbook.
  - **Log as Worn Today:** Logs the combination to your chronological style journal.
  - **Duplicate Prevention:** Intelligently checks against same-day signatures to avoid redundant wear logs.

### 4. Saved Favourites Lookbook (`#favourites`)
- Displays curated combinations in high-resolution multi-garment collages.
- Details piece counts, item names, and date saved.
- **Load in Planner ↗:** Re-populates the outfit directly into the 4 planner slots in a single click and navigates to the workspace.

### 5. Chronological Wear History (`#history`)
- Timeline tracking every worn ensemble with calendar day markers and garment thumbnail strips.
- Helps monitor cost-per-wear and garment utilization frequency.
- **Re-style Trigger:** Loads any historical outfit back into the planner atelier.

### 6. Personal Dashboard & Capsule Analytics (`#dashboard`)
- Dynamic, auto-calculating analytics updating with every action:
  - **Total Wardrobe Items:** Current volume across all 5 categories.
  - **Saved Outfit Combinations:** Count of active lookbook ensembles.
  - **Total Worn Logs:** Total recorded wear events.
  - **Capsule Wardrobe Efficiency (%):** Dynamic metric measuring the proportion of unique wardrobe pieces actively styled into outfits.
- **Wardrobe Composition Breakdown:** Visual proportional progress bars for each clothing category.

---

## ✦ Technical Specifications

- **Front-End Stack:** Vanilla JavaScript (ES6+), Semantic HTML5, Modern Responsive CSS3 (Custom Properties, Flexbox, CSS Grid).
- **Offline-First Storage:** Persistent storage using browser `localStorage` (`outfitrepeat_items_v2`, `outfitrepeat_favs_v2`, `outfitrepeat_history_v2`).
- **Responsive Design:** Fluid layouts optimized for ultra-wide desktops, tablets, and mobile screens with custom drawer navigation.
- **Zero External JS Dependencies:** Lightweight, fast, and privacy-preserving with no tracking or server overhead.

---

## ✦ Project Structure

```
OutfitRepeat/
│
├── index.html       # Application markup and section templates
├── styles.css       # Complete luxury editorial design system & responsive rules
├── script.js        # State management, slot routing, search, compression, & analytics
└── README.md        # System documentation and live deployment links
```

---

## ✦ Getting Started Locally

1. Clone or download the repository:
   ```bash
   git clone https://github.com/wickramasingheweerakkody57-ux/OutfitRepeat.git
   ```
2. Navigate to the project directory:
   ```bash
   cd OutfitRepeat
   ```
3. Open `index.html` in any modern web browser (Chrome, Safari, Firefox, Edge). No build tools, compilers, or server dependencies required.
