# India Geospatial Data Explorer - Project Architecture & Instructions

Welcome to the **India Geospatial Data Explorer** project!
This project is structured specifically for remote sensing and GIS professionals transitioning to cloud-native Web GIS.

---

## 📁 1. Project Folder Structure

```
India Geospatial Data Explorer/
│
├── Web_GIS/                      # Dedicated Python 3.12 Virtual Environment
│   ├── Scripts/                  # Python executable & pip
│   └── Lib/site-packages/        # Installed libraries (GeoPandas, DuckDB, PyArrow, etc.)
│
├── data/                         # Local Geospatial Datasets (NEVER uploaded to GitHub)
│   ├── raw/                      # Original Shapefiles, GeoTIFFs, or downloads
│   ├── processed/                # Cleaned, standardized GeoParquet & GeoJSON (EPSG:4326)
│   └── tiles/                    # Sliced PMTiles files ready for web streaming
│
├── pipeline/                     # Python Geospatial Processing Scripts
│   ├── inspect_data.py           # Tool to inspect CRS, feature count, bbox & attributes
│   └── (future ETL scripts)      # Scripts to reproject, clean, and convert datasets
│
├── frontend/                     # React + Vite + TypeScript Web GIS Application
│   ├── public/                   # Static public assets (icons, local sample data)
│   ├── src/
│   │   ├── components/           # UI & GIS components (Map, Sidebar, Inspector)
│   │   ├── services/             # Layer catalog and API connectors
│   │   ├── types/                # TypeScript interfaces for datasets and map layers
│   │   ├── App.tsx               # Main application layout and MapLibre container
│   │   ├── main.tsx              # React root entry point
│   │   └── index.css             # Tailwind CSS & global styles
│   ├── package.json              # Frontend npm dependencies
│   ├── vite.config.ts            # Vite bundler configuration
│   └── tailwind.config.js        # Tailwind styling configuration
│
├── docs/                         # Additional diagrams, notes, and reference data
├── .gitignore                    # Ensures heavy GIS data and node_modules are ignored
├── requirements.txt              # Pinned Python dependencies
├── PRD.md                        # Beginner-friendly Product Requirements Document
├── ARCHITECTURE.md               # Architecture and Web GIS guide
└── TASKS.md                      # Step-by-step roadmap
```

---

## 🐍 2. Python Environment (`Web_GIS`) Instructions

The dedicated Python virtual environment is located at `./Web_GIS`.

### How to Activate It:
In PowerShell inside this project folder:
```powershell
.\Web_GIS\Scripts\Activate.ps1
```
*(If PowerShell restricts script activation, you can run commands directly using `.\Web_GIS\Scripts\python.exe <script>`)*

### What is Installed:
- **`geopandas`** (v1.2.0): Handling spatial vector files (Shapefile, GeoJSON, GeoPackage, Parquet).
- **`pyarrow`** (v26.0.1): Reading & writing fast columnar GeoParquet files.
- **`duckdb`** (v2.0.1): In-memory analytical SQL database with spatial extensions.
- **`shapely`** (v2.2.0): Geometry operations (polygons, lines, points, intersections).
- **`pyproj`** (v3.8.0): Coordinate Reference System (CRS) transformations (e.g., UTM to EPSG:4326).
- **`fiona`** & **`pyogrio`**: High-performance GDAL vector file readers.
- **`requests`**: Fetching datasets and talking to open APIs (e.g. Bharatlas API).

### How to Test Your Data Inspection Script:
Whenever you place a new dataset into `data/raw/`:
```powershell
.\Web_GIS\Scripts\python.exe pipeline\inspect_data.py data\raw\my_dataset.geojson
```
It will report the feature count, bounding box, geometry type, and verify whether the CRS is properly set to **EPSG:4326 (WGS84)**.

---

## 🌐 3. Web GIS Frontend Instructions

The frontend is located in the `./frontend` folder and uses:
- **MapLibre GL JS** (Vector rendering engine)
- **PMTiles** (Single-file serverless tile reader)
- **React 19 + TypeScript + Vite**
- **Tailwind CSS** (Clean UI design)

### Running the Frontend:
To install npm packages and start the development server:
1. Ensure Node.js (v18+) is installed on your machine.
   *(If you don't have Node.js installed yet, download the LTS version from [nodejs.org](https://nodejs.org/))*.
2. Open terminal in the `frontend` directory:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
3. Open `http://localhost:3000` in your browser.

---

## 🚀 4. Recommended Next Steps

1. **Test the Python Environment:** Run a test script with your `Web_GIS` python.
2. **Obtain Initial Datasets:** We can place sample India State and District boundaries into `data/raw/` or link directly to Bharatlas's live vector tiles.
3. **Launch the Web Map:** Start the frontend server and view your interactive map canvas!
