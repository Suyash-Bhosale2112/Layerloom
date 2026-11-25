# Step-by-Step Beginner Execution Roadmap
## India Geospatial Data Explorer

This plan is written specifically for a beginner. We will take **one small step at a time**. You do not need to understand everything on Day 1 — we will build and learn piece by piece.

---

## 📌 Phase 1: Environment & Project Scaffolding
> **Goal:** Create the project folder, set up React + Vite, and see a basic webpage running in your browser.

- [ ] **Step 1.1: Initialize Git and Ignore Big Files**
  - Create a `.gitignore` so you never accidentally upload huge geospatial files (`*.parquet`, `*.pmtiles`, `*.shp`) to GitHub.
- [ ] **Step 1.2: Scaffold the Web Application**
  - Run Vite to set up a clean React + TypeScript template.
  - Install dependencies:
    - `maplibre-gl` (for the map canvas)
    - `pmtiles` (to read single-file vector tiles)
    - `lucide-react` (for clean icons like search, layers, download)
    - `tailwindcss` (for styling without writing complex CSS)
- [ ] **Step 1.3: Verify Local Server**
  - Start the local development server (`npm run dev`).
  - Open `http://localhost:5173` in your browser to confirm everything works.

---

## 📌 Phase 2: Building the Interactive India Map
> **Goal:** Display a full-screen interactive map centered on India with zoom controls and satellite imagery.

- [ ] **Step 2.1: Create the Base Map Component (`MapView.tsx`)**
  - Write a simple React component that initializes MapLibre GL JS.
  - Set the center coordinate to the center of India (`longitude: 78.9629, latitude: 22.5937`).
  - Set the initial zoom level to `4.5` so the entire country fits on screen.
- [ ] **Step 2.2: Add Essential Map Controls**
  - Add navigation controls (Zoom In `+`, Zoom Out `-`, and Compass reset).
  - Add a metric Scale Bar (showing distances in kilometers).
- [ ] **Step 2.3: Add Basemap Switcher**
  - Create a clean button to switch between:
    - **Carto Light / OSM** (Clean, neutral street/boundary map).
    - **Esri Satellite Imagery** (High-resolution satellite view for remote sensing context).

---

## 📌 Phase 3: Loading Your First Vector Layer with PMTiles
> **Goal:** Load an administrative boundary layer (e.g., India States or Districts) onto the map.

- [ ] **Step 3.1: Register PMTiles Protocol**
  - Add 3 lines of code in your map component to teach MapLibre how to read `.pmtiles` files directly via HTTP.
- [ ] **Step 3.2: Add India State/District Boundaries**
  - Connect a sample boundary layer to the map.
  - Set a clean border color (e.g., slate gray outline) and transparent fill.
- [ ] **Step 3.3: Add Hover Effect**
  - When the user's mouse hovers over a state or district, change the cursor to a pointer and give the polygon a slight highlight fill.

---

## 📌 Phase 4: Thematic Layer Manager & Controls
> **Goal:** Build the sidebar where users can turn layers on and off and adjust transparency.

- [ ] **Step 4.1: Create `catalog.json` (The Master Dataset List)**
  - A simple JSON file containing 4 to 6 initial layers:
    1. India States (Boundaries)
    2. India Districts (Boundaries)
    3. Cropping Intensity / Agricultural Blocks (Agriculture)
    4. Major Rivers & Water Basins (Water)
  - Each item has: Name, Category, Description, Source, and Tile URL.
- [ ] **Step 4.2: Build the Layer Panel UI**
  - Create a collapsible sidebar with categories.
  - Add simple checkboxes to toggle layers on and off.
- [ ] **Step 4.3: Add an Opacity Slider**
  - Add a slider (0% to 100%) so users can make a polygon semi-transparent to see the satellite imagery underneath.
- [ ] **Step 4.4: Add a Simple Legend**
  - Display a small legend in the corner showing what the layer colors represent.

---

## 📌 Phase 5: Click-to-Inspect Attributes & Search
> **Goal:** Let users click on any feature to read its details and search for states/districts.

- [ ] **Step 5.1: Click Event Listener**
  - When a user clicks a polygon, grab its attributes (e.g., `State Name`, `District Name`, `Area`).
- [ ] **Step 5.2: Attribute Inspector Card**
  - Show a neat floating drawer or popup with the details in clean, readable text.
  - Highlight the currently selected polygon with a bright border.
- [ ] **Step 5.3: Simple Search Bar**
  - Add an input box at the top.
  - When a user types a state or district name (e.g., "Kerala"), automatically center and zoom the map to that region.

---

## 📌 Phase 6: Download Center
> **Goal:** Let users download datasets for their own Python/QGIS work.

- [ ] **Step 6.1: Build the Download Modal**
  - A clean popup that displays:
    - Dataset name, feature count, and data source.
    - License disclaimer (e.g., Open Government Data).
    - Buttons: **Download GeoParquet** and **Download GeoJSON**.
- [ ] **Step 6.2: Link Direct File Downloads**
  - Provide direct download links to the files stored on Cloudflare R2 or public URLs.

---

## 📌 Phase 7: Free Online Deployment (Cloudflare Pages)
> **Goal:** Put the website on the internet so you have a live link to share with anyone!

- [ ] **Step 7.1: Push Code to GitHub**
  - Create a free GitHub repository and push your project code.
- [ ] **Step 7.2: Deploy on Cloudflare Pages**
  - Sign in to Cloudflare (100% free account).
  - Select "Pages" $\to$ "Connect to GitHub".
  - Cloudflare builds your site automatically and gives you a free URL (e.g., `https://india-geo-explorer.pages.dev`).
- [ ] **Step 7.3: Test on Desktop and Mobile**
  - Verify that the map loads fast and interactions work smoothly.

---

## 📌 Phase 8: Data Pipeline for Remote Sensing Analysts (Python)
> **Goal:** Learn how to convert your own Shapefiles or GeoPackages into GeoParquet and PMTiles.

- [ ] **Step 8.1: Python Inspection Script (`pipeline/inspect_data.py`)**
  - Use GeoPandas and DuckDB to inspect any geospatial dataset: check projection (ensure EPSG:4326), feature count, and column names.
- [ ] **Step 8.2: Convert to GeoParquet**
  - One-line export in GeoPandas: `gdf.to_parquet("output.parquet")`.
- [ ] **Step 8.3: Convert to PMTiles**
  - Use Tippecanoe (or online converters) to slice the geometry into a single `.pmtiles` file.
- [ ] **Step 8.4: Upload to Cloudflare R2**
  - Place the `.pmtiles` and `.parquet` files in your free R2 bucket with public read access enabled.

---

### How We Will Work Together
We will not rush or do everything in one giant mess. We will work **task-by-task**:
1. You say: *"Let's do Step 1.1 and 1.2"*.
2. I write the files, explain what every line does, and test it.
3. You review it, ask any questions, and see it run.
4. Then we move to the next step. You remain in complete control!
