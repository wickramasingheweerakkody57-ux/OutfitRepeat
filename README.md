# OutfitRepeat — Clothing Combination Planner

OutfitRepeat is a luxury fashion editorial digital wardrobe atelier and intelligent clothing combination planner. It empowers conscious fashion enthusiasts to digitize what they own, curate mix-and-match ensembles across 4 visual slots, track garment wear frequency, and optimize capsule wardrobe efficiency.

## Key Features

### 1. Luxury Editorial Experience
- Curated luxury fashion editorial aesthetic inspired by modern publications (*Playfair Display* headings, *Poppins* body typography, and `#FAF8F5` warm minimalist palette).
- Seamless, responsive navigation with mobile drawer support and smooth transitions.
- High-definition photography with graceful aspect-ratio image containers and fallback handlers.

### 2. Digital Wardrobe Management
- Categorized garment view: **All Items, Tops & Blouses, Bottoms & Trousers, Dresses & Jumpsuits, Shoes & Footwear, Accessories & Bags**.
- Real-time search filtering by garment name, color hue, or category.
- Add new clothing items with local image file uploads (with automatic client-side canvas compression) or high-res image URLs.
- Edit and delete items with instant sync across the canvas and analytics.

### 3. Mix-and-Match Outfit Planner
- Four dedicated visual outfit slots:
  1. **Top** (Tops & One-Piece Dresses)
  2. **Bottom**
  3. **Shoes**
  4. **Accessories**
- Interactive garment vault sidebar with category tabs.
- Effortless slotting and garment replacement upon selection.
- Clear Canvas, Save to Favourites, and Log as Worn Today actions.

### 4. Lookbook & Wear Journal
- **Saved Favourites**: Private lookbook with multi-piece thumbnail collages and one-click **Load in Planner** functionality.
- **Wear History**: Chronological style diary tracking wear dates and garment usage, with accidental duplicate log prevention and **Re-style** triggers.

### 5. Personal Dashboard & Capsule Analytics
- Real-time dynamic KPI metrics:
  - **Total Wardrobe Items**
  - **Saved Outfit Combinations**
  - **Total Worn Logs**
  - **Capsule Wardrobe Efficiency (%)** with progress indicator
- Dynamic category distribution breakdown.

### 6. Data Persistence
- Full offline-first browser `localStorage` persistence for garments, uploaded images, saved outfits, and wear logs.
- Pre-populated with luxury editorial sample pieces for an immediate out-of-the-box demonstration.

## Project Structure

- `index.html` — Accessible, semantic HTML5 structure with modern editorial landing section, dashboard, wardrobe, planner, lookbook, and footer.
- `styles.css` — Modern CSS design system featuring custom properties, responsive grids, rounded cards, subtle shadows, and fluid typography.
- `script.js` — Vanilla JavaScript ES6+ application logic handling state, persistence, search, image compression, slot routing, and dynamic analytics.
