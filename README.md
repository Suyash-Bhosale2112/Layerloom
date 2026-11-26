# Layerloom

Layerloom is a browser-based catalogue and map preview for Indian geospatial
datasets. It is an implemented frontend prototype, not yet a complete,
production-ready geospatial data platform.

The application currently provides a 49-record dataset catalogue, catalogue
search and category filters, a MapLibre map with PMTiles overlays, feature
inspection, layer visibility and opacity controls, and Dark, Light, and
Satellite basemaps. Dataset preparation and hosting are separate from the
frontend.

For implementation details, architecture, limitations, and current project
status, see [Technical Documentation](docs/TECHNICAL_DOCUMENTATION.md).

## Current status

### Implemented

- Browse the static dataset catalogue by category and search its metadata.
- View multiple PMTiles vector layers together on a MapLibre map.
- Switch between CARTO Dark Matter, CARTO Positron, and Esri World Imagery
  basemaps.
- Toggle visible layers and adjust their opacity.
- Search among features currently rendered in the map viewport and zoom to a
  matching feature.
- Click features to inspect their properties. Highlighting depends on the
  vector tile feature having an ID.
- Open the hosted PMTiles source for a catalogue item.
- Inspect local geospatial files with the Python utility.
- Build the frontend with TypeScript and Vite. GitHub Actions runs the
  production build on pushes and pull requests.

### Not yet production-ready

- The catalogue metadata, inferred geometry types, data sources, licences,
  feature counts, and vintages need dataset-by-dataset verification.
- The repository does not include the full source datasets or a data-processing
  and tile-generation pipeline.
- GeoParquet, GeoJSON, Shapefile, and KML exports are not currently generated
  or offered as available downloads.
- There is no backend, spatial database, user authentication, or server-side
  geographic analysis.
- A production deployment is not configured.

Treat planned features in the PRD and roadmap as plans, not proof that they
have been implemented.

## Technology

| Area | Technology |
| --- | --- |
| User interface | React 19 and TypeScript |
| Build and development server | Vite 6 |
| Interactive maps | MapLibre GL JS |
| Vector tile access | PMTiles |
| Styling | Tailwind CSS |
| Icons | lucide-react |
| Geospatial file inspection | Python 3.12 and GeoPandas |
| CI build | GitHub Actions, Node.js 20 |

The Python requirements also include PyArrow, DuckDB, Shapely, Fiona, PyProj,
Requests, Pandas, OpenPyXL, and tqdm. The tracked Python utility currently
uses GeoPandas; the other packages are not wired into an automated processing
workflow.

## Architecture overview

The application is intentionally static:

1. The frontend imports `frontend/src/services/pmtilesCatalog.json` at build
   time and enriches its catalogue records in `catalog.ts`.
2. React renders the catalogue and map interfaces.
3. MapLibre renders vector tiles from PMTiles sources and displays the selected
   basemap.
4. PMTiles are read from a hosted data URL. The default base URL is
   `https://huggingface.co/datasets/suyashbhosale/PMTiles/resolve/main`.
5. The Python inspection script reads a local dataset and prints a report; it
   does not publish or transform that data.

Set `VITE_PMTILES_BASE_URL` at build time to use a different PMTiles host. The
host must make the required files available to the browser and support the
cross-origin and byte-range requests needed for PMTiles streaming.

The Vite configuration also provides a development-only `/pmtiles/` route for
files in a local `PMTiles/` directory. It is not a production tile server.
Large geospatial data files and the Python virtual environment are excluded
from Git; data directories in the repository are placeholders.

## Repository layout

```text
.
├── .github/
│   └── workflows/
│       └── frontend-build.yml  # CI: clean install and production build
├── data/
│   ├── raw/                    # Placeholder for source datasets
│   ├── processed/              # Placeholder for prepared datasets
│   └── tiles/                  # Placeholder for generated tiles
├── docs/
│   ├── ARCHITECTURE.md         # Introductory Web GIS architecture guide
│   ├── PRD.md                  # Product requirements and planned MVP
│   ├── TASKS.md                # Step-by-step roadmap
│   └── TECHNICAL_DOCUMENTATION.md
├── frontend/
│   ├── src/
│   │   ├── components/         # Catalogue, map, and shared UI
│   │   ├── services/           # Static catalogue and metadata
│   │   ├── types/              # TypeScript layer and category types
│   │   ├── App.tsx             # Application view state and composition
│   │   └── main.tsx            # React entry point
│   ├── package.json
│   └── vite.config.ts          # Vite config and dev-only PMTiles middleware
├── pipeline/
│   ├── inspect_data.py         # Read-only geospatial file inspection
│   └── install_node.py         # Optional Node.js installer utility
└── requirements.txt            # Python geospatial/data dependencies
```

## Run the frontend locally

Install Node.js 20, then run these commands from the repository root in
PowerShell:

```powershell
cd frontend
npm ci
npm run dev
```

Open the local URL printed by Vite. The Vite configuration uses port `3000`.

To build and preview the production bundle:

```powershell
npm run build
npm run preview
```

The build command runs the TypeScript project build followed by the Vite
production build. To use a non-default PMTiles host during local development,
set the environment variable before starting Vite:

```powershell
$env:VITE_PMTILES_BASE_URL = "https://your-public-pmtiles-host"
npm run dev
```

Vite environment variables are embedded at build time. Configure the same
variable in the build environment for production; changing it after the
frontend has been built will not change the bundle.

## Inspect a geospatial file

The utility accepts a path to a GeoParquet file or another vector format
supported by GeoPandas. It prints the file size, feature count, geometry types,
CRS, bounds, attribute columns, and a small data preview. It reports whether
the CRS is EPSG:4326, but does not reproject, validate, clean, convert, or
publish the input.

Install the Python dependencies in a virtual environment if needed:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Run the inspection from the repository root:

```powershell
python pipeline\inspect_data.py data\raw\your-file.geojson
```

If the project `Web_GIS` environment is already set up, you can invoke its
interpreter directly instead:

```powershell
.\Web_GIS\Scripts\python.exe pipeline\inspect_data.py data\raw\your-file.geojson
```

## CI

The GitHub Actions workflow in `.github/workflows/frontend-build.yml` runs on
pushes and pull requests. It uses Node.js 20, installs the locked frontend
dependencies with `npm ci`, and runs `npm run build`.

There is currently no frontend test script in `package.json`.

## Documentation

- [Technical documentation](docs/TECHNICAL_DOCUMENTATION.md) — current
  implementation, architecture, data flow, and known limitations.
- [Product requirements](docs/PRD.md) — intended product and planned MVP.
- [Architecture guide](docs/ARCHITECTURE.md) — introductory Web GIS concepts.
- [Task roadmap](docs/TASKS.md) — planned implementation steps.

## Production readiness

Before describing Layerloom as a live production portal, the project still
needs verified dataset metadata and licences, a repeatable data conversion
pipeline, production PMTiles hosting, working deployment configuration,
browser and data validation, and operational monitoring. See the technical
documentation for the current boundaries of the implementation.
