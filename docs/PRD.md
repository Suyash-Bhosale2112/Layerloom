# Product Requirements Document (PRD)
## Project: India Geospatial Data Explorer (India GeoExplorer)
*Version: 1.0 *

---

## 1. What Are We Building? 
Imagine a clean, fast website dedicated to **Indian Geospatial and Remote Sensing Data**.
If you are a student, researcher, or analyst who wants to see:
- Where India's state and district boundaries lie,
- Which districts have high cropping intensity or specific agricultural land-use,
- Where major rivers and water bodies flow,

...you usually have to search through scattered government websites, download messy Zip files with Shapefiles, and open them in QGIS.

**India GeoExplorer** solves this:
1. Anyone opens the website in their browser.
2. They see an interactive map of India with satellite and street map backdrops.
3. On the left side, they check a box (e.g., "India Districts" or "Cropping Intensity"). The layer instantly appears on the map.
4. They click on any district (like *Pune* or *Nagpur*), and an info box pops up showing its name, state, area, and key statistics.
5. If they want the raw data to work with in Python or QGIS, they click a **Download** button and get a clean **GeoParquet** or **GeoJSON** file.

---

## 2. Who Is This For?

1. **You (The Creator & Remote Sensing Analyst):**
   - You want a practical, portfolio-grade project that proves you can build modern web GIS applications without paying for expensive servers.
2. **GIS Students & Beginners in India:**
   - People who need clean, ready-to-use Indian boundary and agricultural data without digging through complex portals.
3. **Data Researchers & Agricultural Analysts:**
   - People who need instant spatial previews before downloading files for their Python/Pandas workflows.

---

## 3. Guiding Principles for Version 1 (Keeping It Simple)

To make sure you don't get overwhelmed:
- **No Complex Backends:** We will **not** build a complicated backend server (no Django, no Flask, no Node servers to keep running).
- **No Expensive Spatial Databases:** We will **not** set up PostgreSQL or PostGIS. You do not need a database just to display map boundaries.
- **Zero Cost Hosting:** We use free, reliable hosting platforms (GitHub + Cloudflare Pages).
- **Pre-computed Map Data (PMTiles):** Rather than asking a server to generate map images on the fly, we use lightweight pre-made vector tiles.
- **Use Free Public Indian Data:** We start with a curated list of 5 to 7 high-impact layers (States, Districts, Blocks, Cropping Intensity, Water Bodies).

---

## 4. MVP (Version 1) Feature List

### Feature 1: The Interactive India Map
- Shows India centered with clean boundary bounds.
- Navigation tools: Zoom in (+), Zoom out (-), Reset to India view, and scale bar (in kilometers).
- **Basemap Switcher:** Simple toggle between:
  - *Standard Map* (clean vector street/boundary style).
  - *Satellite Imagery* (real satellite view — essential for remote sensing enthusiasts!).

### Feature 2: Simple Layer Manager (Sidebar)
- A clean sidebar with checkboxes grouped into 3 simple categories:
  1. **Administrative Boundaries:** States, Districts.
  2. **Agriculture & Land Use:** Cropping intensity by district/block.
  3. **Water & Environment:** Major rivers and water bodies.
- Each layer has:
  - An **On/Off switch**.
  - A **Transparency (Opacity) slider** (so you can see satellite imagery underneath your polygons).
  - A simple color legend indicating what the colors mean.

### Feature 3: Click-to-Inspect (Attribute Popup / Sidebar Card)
- When a user clicks on any polygon on the map:
  - The clicked area highlights with a bright outline.
  - A neat panel displays its attributes (e.g., State: *Maharashtra*, District: *Nashik*, Code: *512*, Metric: *Values*).
  - Clear, human-friendly names (no confusing internal database codes).

### Feature 4: Search & Quick Zoom
- A simple search box where you can type "Maharashtra" or "Jaipur".
- The map automatically zooms directly to that state or district.

### Feature 5: Free Download Center
- Next to each layer in the catalogue or in the info popup, there is a **Download Data** button.
- Offers:
  - **GeoParquet** (Best for Python, GeoPandas, and modern data science).
  - **GeoJSON** (Best for web developers and drag-and-drop into QGIS).
- Displays clear data source attribution (e.g., *Data Source: LGD / Survey of India / Bharatlas Open Data* and *License: Open Data*).

---

## 5. Non-Goals for Version 1 (What We are NOT Doing Yet)

To prevent confusion and keep the project achievable:
- ❌ No user accounts or login passwords (everything is public and accessible).
- ❌ No user file uploads (users cannot upload their own shapefiles to our server in v1).
- ❌ No server-side spatial analysis (e.g., "buffer 10 km and intersect" is left for later versions).
- ❌ No paid cloud services (AWS, Google Cloud, paid mapbox tokens). Everything is 100% free.

---

## 6. How We Will Know It’s a Success (Definition of Done)

1. You can run the website on your local laptop with a single command (`npm run dev`).
2. You can zoom around India smoothly on both street map and satellite imagery.
3. You can toggle on the Indian State and District boundaries and agricultural layers without browser lag.
4. Clicking a district shows its details.
5. The site is published online with a free public URL on Cloudflare Pages so you can share it with colleagues or on LinkedIn.
