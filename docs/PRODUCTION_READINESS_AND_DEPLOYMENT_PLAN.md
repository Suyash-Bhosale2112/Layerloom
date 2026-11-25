# India Geospatial Data Explorer / Layerloom

## Production Readiness and Live Deployment Plan

**Document purpose:** This document records the current project status, everything completed, and the complete set of work required before the portal is stable and publicly available.

**Current stage:** Functional frontend prototype/catalog implementation is in progress. It is not yet a production-ready live portal.

**Document date:** 25 November 2026

**Status definitions:**
- **Complete:** Implemented in the repository or otherwise confirmed.
- **Partial:** Some implementation exists, but important work remains.
- **Remaining:** Not implemented or not verified.
- **Blocked:** Cannot be completed until a decision, credential, source file, or external service is available.

---

## 1. Executive Summary

Layerloom is intended to be a serverless web GIS portal for browsing, viewing, inspecting, and downloading Indian geospatial datasets. The planned experience is a static React frontend with PMTiles vector data streamed directly from Cloudflare R2 or another public object store.

The repository currently contains:

- A React 19, TypeScript, Vite, Tailwind, and MapLibre frontend.
- A 49-item layer catalogue covering boundaries, environment, water, agriculture, transport, health, and education.
- A catalog/search interface.
- A map view with PMTiles loading, three basemap choices, zoom/reset controls, hover inspection, and a layer information drawer.
- Python GIS dependencies and a basic data-inspection script.
- Documentation for architecture, product requirements, roadmap, and Cloudflare R2 setup.
- A documented plan for free deployment through GitHub and Cloudflare Pages.

The portal is **not ready for public deployment**. The main blockers are:

1. The repository has no initial commit and no GitHub push history.
2. No PMTiles source folder or PMTiles files are currently present in the repository workspace.
3. No real Cloudflare R2 bucket, public tile domain, or production R2 credentials are confirmed.
4. GeoParquet, GeoJSON, KML, and Shapefile download files are not present.
5. Catalog metadata is largely descriptive and should be validated against the actual source datasets.
6. Deployment configuration and production environment variables are not configured.
7. Build, browser, mobile, accessibility, performance, security, and data-license checks have not been completed.
8. There is no CI/CD workflow, automated test suite, monitoring, backup process, or rollback procedure.

---

## 2. Project Objective

### 2.1 Primary goal

Create a public, fast, and low-cost India geospatial data portal where users can:

- Browse curated national geospatial datasets.
- Filter datasets by category.
- Search datasets by name or description.
- View a selected dataset as a vector layer on an interactive India map.
- Switch between dark, light, and satellite basemaps.
- Inspect available feature attributes.
- Understand the source, agency, vintage, geometry type, and size of a layer.
- Download approved dataset formats for use in QGIS, ArcGIS, Python, and web applications.

### 2.2 Intended users

- Remote sensing and GIS analysts.
- GIS students and researchers.
- Government and policy researchers.
- Agricultural and hydrology analysts.
- Developers building downstream geospatial applications.
- Portfolio reviewers and potential employers.

### 2.3 Product principles

- Public access without accounts in Version 1.
- No application server or spatial database in Version 1.
- Preprocessed and pre-tiled static data.
- Open-source frontend technologies.
- Low-cost static hosting.
- Direct dataset downloads.
- Clear source and license attribution.
- No paid map token requirement.

---

## 3. Final Production Architecture

### 3.1 Frontend

The production interface will be built using React, TypeScript, Vite, Tailwind CSS, MapLibre GL JS, and PMTiles. It should be deployed as static files to a CDN-backed host such as Cloudflare Pages.

### 3.2 Data storage

Preprocessed assets will be stored outside the Git repository:

- PMTiles for map rendering.
- GeoParquet for modern analytical workflows.
- GeoJSON for web and lightweight GIS use.
- Shapefile archives for traditional desktop GIS compatibility.
- KML or KMZ where useful.

Cloudflare R2 is the preferred storage platform because it supports PMTiles range requests and is designed to avoid egress fees.

### 3.3 Delivery flow

1. The browser loads the static React application from Cloudflare Pages.
2. The frontend loads the layer catalogue.
3. The user selects a dataset.
4. MapLibre requests only the required PMTiles byte ranges.
5. R2 returns the requested bytes to the browser.
6. MapLibre renders the visible vector features.
7. The user inspects feature attributes or opens download options.
8. Download links serve approved files directly from R2 or a download CDN.

### 3.4 Production separation

Source code and application configuration must remain in GitHub. Large datasets, credentials, API secrets, private configuration, and uploaded files must not be committed to Git.

---

## 4. What Is Complete

### 4.1 Repository and project setup

**Status: Complete for local prototype, partial for production.**

- A project folder structure has been created.
- A Python 3.12 virtual environment named `Web_GIS` is present locally.
- Node and frontend dependencies are declared in `frontend/package.json`.
- A package lock file is present.
- A `.gitignore` has been created for virtual environments, build output, geospatial datasets, PMTiles, archives, and environment variables.
- Core project documentation has been created.

Remaining setup work:
- Create the first Git commit and push the repository.
- Decide and document the supported Node and npm versions.
- Remove committed or locally available environment-specific/generated dependencies if inappropriate.
- Add repository-level lint, test, formatting, and CI commands.

### 4.2 Frontend application

**Status: Complete as an initial prototype.**

- React application entry point exists.
- Two main views are implemented: catalog and map.
- Category navigation is implemented.
- Catalog text search is implemented.
- Layer selection opens the map view.
- Header navigation is implemented.
- A layer table provides source, vintage, size, geometry, and map action information.
- A layer details drawer provides metadata and download-format presentation.
- The UI uses React, Tailwind CSS, and Lucide icons.

Remaining frontend work:
- Add responsive mobile layouts and test narrow-screen behavior.
- Add loading, timeout, and error states for map sources.
- Verify accessibility, keyboard navigation, focus states, and contrast.
- Replace placeholder or unverified metadata.
- Add explicit success and failure behavior for downloads.
- Make catalogue behavior and map behavior consistent with real catalog data.
- Add pagination or virtualisation if the catalogue becomes larger.
- Remove prototype-level visual assumptions that may affect data attribution or licensing.

### 4.3 Map experience

**Status: Partial.**

Implemented:
- MapLibre GL JS map.
- India-centered initial view.
- Dark, light, and Esri satellite basemap choices.
- PMTiles protocol registration.
- Zoom in, zoom out, and reset controls.
- Vector point, line, and polygon rendering.
- Basic cursor hover behavior.
- Basic feature property inspection.
- Attribution control.
- Layer change handling.

Remaining work:
- Enable or verify scale bar control.
- Add compass/reset behavior in a consistent production UI.
- Add click-to-select behavior for a persistent selected-feature panel.
- Improve attribute-name formatting.
- Remove generic internal field names and show approved human-readable labels.
- Add selected-feature highlighting.
- Add search and quick zoom for states or districts.
- Support multiple simultaneously active layers only if included in the V1 scope.
- Implement layer opacity controls.
- Implement legends for thematic styles.
- Add map loading and tile-error indicators.
- Test polygon, line, and point behavior with real PMTiles.
- Add bounds and zoom limits suitable for India.
- Add data source attribution for basemaps and vector datasets.
- Verify Esri satellite imagery terms and usage conditions.
- Confirm whether MapLibre and PMTiles require a fallback for unsupported browsers.

### 4.4 Data catalogue

**Status: Partial, 49 catalogue entries are declared.**

The catalogue contains 49 entries grouped as:

| Category | Count |
|---|---:|
| Boundaries | 10 |
| Environment | 12 |
| Water | 11 |
| Agriculture & land use | 3 |
| Transport & mobility | 9 |
| Health & education | 4 |

Implemented:
- Catalogue JSON and TypeScript mappings.
- Category counts.
- Catalogue filtering and search.
- Basic geometry inference.
- Metadata enrichment for selected layers.

Remaining work:
- Reconcile the catalogue with the actual PMTiles inventory.
- Remove or clearly mark entries that do not have deployable files.
- Verify layer IDs, source-layer names, relative paths, fields, and geometry types.
- Validate agency/source attribution against source licenses.
- Validate vintage and feature counts.
- Add download file availability fields.
- Add data-quality and freshness fields.
- Introduce a machine-readable schema and automated catalogue validation.
- Add source URLs and official dataset links where available.
- Remove unsupported claims such as "open" or "CC0" unless verified.

### 4.5 Python data pipeline

**Status: Partial.**

Implemented:
- Python virtual environment with GIS packages.
- `inspect_data.py` for reading geospatial formats.
- CRS validation for EPSG:4326.
- Feature count, geometry type, bounding box, schema, and preview output.

Remaining work:
- Create an end-to-end conversion pipeline.
- Validate input data formats and corrupt or malformed sources.
- Reproject all web datasets to EPSG:4326.
- Repair or standardise geometry.
- Remove invalid geometries and duplicate identifiers.
- Standardise column names and field types.
- Generate GeoParquet files.
- Generate GeoJSON where size permits.
- Generate PMTiles with Tippecanoe or an equivalent tool.
- Generate KML/Shapefile archives where licensed and useful.
- Generate/download manifest metadata.
- Automate repeatable builds and checks.
- Store source provenance and transformation history.
- Add tests for geometry validity, coordinate ranges, CRS, and expected feature counts.

### 4.6 Documentation

**Status: Complete at an initial level.**

The repository contains:

- `README.md`
- `docs/PRD.md`
- `docs/ARCHITECTURE.md`
- `docs/TASKS.md`
- `docs/R2_SETUP_AND_UPLOAD_GUIDE.md`

Remaining documentation:
- Deployment runbook.
- Production environment configuration guide.
- Data publication and update procedure.
- Incident and rollback procedure.
- Browser support policy.
- Data quality and licence register.
- API-free architecture limitations.
- Ownership and maintenance procedure.

---

## 5. What Is Remaining for Production

## 5.1 Critical blockers

### A. Establish source control and repository history

**Status: Remaining.**

The repository currently has no commits and has untracked project files. Before deployment:

- Create the root repository correctly.
- Add a complete initial commit.
- Push it to GitHub.
- Protect the `main` branch.
- Require pull request review or at least a protected merge flow.
- Add branch, issue, and release conventions.
- Confirm that generated, private, and sensitive files are excluded.
- Add an appropriate licence for the application source code.

### B. Add and validate production geospatial assets

**Status: Remaining and currently blocking map functionality.**

The source tree contains no actual files in `PMTiles/`, and `data/raw`, `data/processed`, and `data/tiles` contain only placeholder `.gitkeep` files.

Required actions:

1. Obtain authoritative source datasets.
2. Record source URL, provider, download date, licence, refresh schedule, and restrictions.
3. Inspect and validate CRS and geometry.
4. Reproject to EPSG:4326.
5. Clean malformed attributes and geometries.
6. Produce PMTiles for all approved layers.
7. Confirm MapLibre source-layer names match the catalogue.
8. Verify min/max zoom levels.
9. Verify file sizes and browser performance.
10. Generate download formats.
11. Upload PMTiles and downloadable files to R2.

No live map layer should be advertised until this process is completed.

### C. Configure Cloudflare R2

**Status: Remaining.**

Required production setup:

- Create the R2 bucket.
- Choose a public tile domain or custom domain.
- Configure DNS if a custom domain is used.
- Enable public read access only for approved files.
- Configure CORS for allowed origins, `GET`, `HEAD`, Range, and required response headers.
- Test HTTP Range requests.
- Test tile loading from an incognito/private browser session.
- Create an uploader role with the minimum required permissions.
- Store credentials only in secret storage or CI/CD secrets.
- Configure cache and MIME types.
- Add lifecycle and backup procedures.
- Set storage and request limits or budget alerts if supported.

### D. Set production frontend configuration

**Status: Remaining.**

Required configuration:

- Add a production tile base URL.
- Add production download base URLs.
- Keep a safe local-development fallback.
- Define environment variable names for both development and production.
- Add `.env.example` without secrets.
- Confirm that production assets do not rely on the local Vite range middleware.
- Configure custom-domain routing.
- Add redirects or fallback behaviour for direct URLs and refresh navigation.

### E. Repair and verify downloads

**Status: Remaining.**

The PMTiles download currently points to a local `/pmtiles/...` URL. Parquet, GeoJSON, Shapefile, and KML cards are presented but are not active download links.

Before launch:

- Create each approved downloadable file.
- Verify file names and formats.
- Add working PMTiles, GeoParquet, GeoJSON, Shapefile, and KML links where approved.
- Remove unsupported format options.
- Display file size and feature count.
- Add download start and failure feedback.
- Test direct downloads on desktop and mobile.
- Add licence and source text to each download.
- Consider checksums or release metadata for large downloads.

---

## 5.2 Data quality and governance

### Dataset validation

- Identify the canonical boundary datasets.
- Verify Indian state and union-territory coverage.
- Verify district coverage against an approved official year.
- Validate coordinates, topology, and geometry validity.
- Remove null names and duplicate identifiers.
- Avoid presenting inaccurate or outdated counts.
- Verify source licence and redistribution permission.
- Add data disclaimer and update date.
- Create a release manifest with per-layer metadata.

### Attribution and licensing

- Replace blanket "CC0-1.0 / Open Government Data" text with source-specific verified licences.
- Do not claim that all sources use the same licence.
- Add agency names, source links, acquisition dates, terms, and restrictions.
- Verify whether Esri basemap attribution and usage are appropriate.
- Add visible cartographic and data attribution.
- Include terms for screenshot or API use if required by the source.

### Production metadata

Each published layer should contain:

- Stable ID.
- Human-readable name.
- Category.
- Source organisation.
- Original source URL.
- Licence.
- Vintage.
- Acquisition date.
- Feature count.
- Geometry type.
- CRS.
- PMTiles source-layer name.
- File size.
- Download availability.
- Validation status.
- Update frequency.
- Data disclaimer.

---

## 5.3 Application development remaining

### Map interactions

- Add persistent click selection.
- Highlight selected features.
- Add a search-to-location workflow.
- Zoom to matching state or district boundaries.
- Add opacity slider.
- Add thematic legends.
- Add optional layer visibility toggling.
- Improve hover cards to use human-readable field names.
- Add a clear "no features" or "data not loaded" state.
- Add map bounds and minimum zoom policy.
- Add mobile touch behaviour.

### Catalog and search

- Improve search ranking.
- Add sorting controls.
- Add result count and active filter labels.
- Add empty states and reset filters.
- Consider pagination or virtualisation.
- Add metadata badges for download formats.
- Prevent broken catalogue entries from appearing.
- Add catalogue schema validation during build.

### Production UI

- Add branded favicon and social preview image.
- Add page title and meta description.
- Add Open Graph and Twitter metadata.
- Add a footer with sources, policy, licence, contact, and update information.
- Add privacy and terms pages if analytics or external requests require them.
- Add an accessible loading screen.
- Add service/data warning notifications.
- Confirm desktop and mobile breakpoints.

### Performance

- Measure initial JavaScript bundle size.
- Lazy-load map-related code if it materially improves initial load.
- Optimise fonts and icons.
- Verify map tiles are being requested efficiently.
- Check PMTiles range request behavior.
- Use compression and cache headers.
- Test low-bandwidth and high-latency users.
- Set PMTiles zoom and simplification thresholds appropriately.
- Remove unused dependencies and assets.

---

## 5.4 Testing

The project needs a formal test stage before deployment.

### Data tests

- Every catalogue entry has an existing source tile file.
- Every source-layer name exists.
- Every geometry is valid.
- Every web geometry is in EPSG:4326.
- Feature counts match the metadata.
- Bounding boxes are valid.
- No private or restricted columns are included.
- Download formats open successfully in QGIS and Python.
- Licence and source metadata are complete.

### Frontend unit tests

- Catalogue filtering.
- Category counts.
- Search matching.
- Geometry type selection.
- Download URL generation.
- Metadata fallback behavior.
- Map error handling.

### Browser integration tests

- Application loads on supported browsers.
- Catalog search and category filters work.
- Map opens for each geometry type.
- PMTiles loads from R2.
- Hover/click behavior works.
- Basemap switching works.
- Download links work.
- Back navigation works.
- Mobile controls work.
- Deep links and refreshes work.

### Recommended browser matrix

Test at minimum on current:

- Chrome on Windows.
- Edge on Windows.
- Firefox.
- Safari on macOS or iOS.
- Chrome on Android.

### Build verification

- Install Node and npm on a clean environment.
- Run the production build.
- Verify TypeScript compilation.
- Verify Vite output.
- Inspect bundle warnings.
- Serve the production build locally.
- Test direct static asset loading.
- Confirm no absolute localhost or development URLs remain.

---

## 5.5 Deployment

### GitHub preparation

- Create the GitHub repository.
- Commit source code.
- Push the `main` branch.
- Enable branch protection.
- Add repository description and topics.
- Add a deployment badge or status only after CI is active.

### Cloudflare Pages setup

Create a Pages project connected to GitHub with:

- Framework preset: Vite.
- Root directory: `frontend`.
- Build command: `npm run build`.
- Build output: `frontend/dist`.
- Node version: a fixed supported version, preferably the current stable LTS.
- Production environment variables: tile and download domains.
- Preview environment variables: non-production tile and download domains or same public data domain.

Before the live domain is published:

- Deploy to a Pages preview URL.
- Smoke-test all critical workflows.
- Run desktop and mobile checks.
- Test range requests and downloads.
- Review logs and browser console.
- Obtain stakeholder approval.

### Custom domain

- Choose the production domain or subdomain.
- Configure DNS in Cloudflare.
- Enable HTTPS.
- Redirect HTTP and alternate hostname variants.
- Test TLS certificate validity.
- Configure security headers.
- Add cache rules where appropriate.

### DNS and CDN

- Use Cloudflare as DNS/CDN where practical.
- Configure cache control for static assets.
- Confirm that HTML and catalogue JSON are not cached incorrectly.
- Confirm that PMTiles responses support range requests and cache correctly.
- Confirm large downloads are served efficiently.

---

## 5.6 Security and privacy

- Keep R2 API credentials outside Git.
- Store uploader credentials in a password vault or CI secret.
- Use least-privilege R2 credentials.
- Rotate credentials after setup and before team changes.
- Use HTTPS throughout.
- Restrict CORS origins to the approved portal domains in production.
- Add security headers, including CSP, frame protection, referrer policy, and MIME sniffing protection.
- Verify third-party basemap and tile providers.
- Minimise analytics and disclose tracking.
- Do not collect personal data unless needed and disclosed.
- Review uploaded/source data for personal or sensitive information.
- Add a reporting channel for copyright or licence concerns.

---

## 5.7 Operations

### Monitoring

Add or configure:

- Cloudflare Pages deployment notifications.
- R2 storage usage and request monitoring.
- Website uptime monitoring.
- Client-side error reporting, with privacy safeguards.
- Broken asset and broken download checks.
- Search or browser console issue tracking.

### Backups

- Back up source datasets outside Git.
- Version or snapshot the R2 bucket.
- Maintain a second copy of source assets.
- Maintain a release manifest for every deployed data version.
- Keep a known-good previous frontend deployment available for rollback.

### Update process

For every data update:

1. Acquire and document the source.
2. Run the data validation pipeline.
3. Generate new web and download files.
4. Upload to a versioned staging prefix.
5. Update a staging catalogue.
6. Run browser, GIS, and metadata checks.
7. Publish to a release manifest.
8. Promote the assets to the production prefix or domain.
9. Update catalogue metadata and frontend deployment.
10. Confirm the live portal.

### Rollback

- Revert frontend deployment to the previous Pages deployment.
- Restore the previous catalogue release.
- Restore the previous R2 prefix or object versions.
- Communicate any temporary data issue if needed.
- Record incident details and corrective action.

---

## 6. Detailed Start-to-Deployment Roadmap

### Phase 1: Repository and environment

- [ ] Create the GitHub repository and initial commit.
- [ ] Push source code to `main`.
- [ ] Configure branch protection.
- [ ] Confirm Node, npm, Python, and GIS tool versions.
- [ ] Add `.env.example`.
- [ ] Confirm a clean build environment.

**Exit condition:** A clean checkout builds successfully and the repository contains no secrets or heavy data files.

### Phase 2: Dataset sourcing

- [ ] Approve the initial launch dataset list.
- [ ] Obtain official source files.
- [ ] Record source/licence metadata.
- [ ] Inspect and validate all files.
- [ ] Decide which 49 entries are launch-ready.
- [ ] Separate later or unverified datasets from the launch catalogue.

**Exit condition:** The first launch release contains only verified, licensed, inspectable datasets.

### Phase 3: Data conversion

- [ ] Reproject to EPSG:4326.
- [ ] Repair geometry and remove invalid features.
- [ ] Normalise names and fields.
- [ ] Generate GeoParquet.
- [ ] Generate GeoJSON.
- [ ] Generate PMTiles.
- [ ] Generate KML/Shapefile where appropriate.
- [ ] Generate a release manifest.

**Exit condition:** Every release asset passes automated and manual GIS validation.

### Phase 4: Cloud storage

- [ ] Create R2 bucket.
- [ ] Configure public read access.
- [ ] Configure CORS and range requests.
- [ ] Upload assets.
- [ ] Test direct tile and download URLs.
- [ ] Configure cache and MIME types.
- [ ] Document storage structure.

**Exit condition:** Browsers can retrieve PMTiles byte ranges and all download formats.

### Phase 5: Frontend completion

- [ ] Remove or activate placeholder format cards.
- [ ] Add real production URLs.
- [ ] Add click selection and attribute panel.
- [ ] Add search-to-feature or state/district search.
- [ ] Add opacity and legend controls if included in V1.
- [ ] Improve loading/error states.
- [ ] Complete accessibility and responsive checks.
- [ ] Add data and source attribution.
- [ ] Add legal/policy footer content.

**Exit condition:** The complete V1 user journey works against production assets.

### Phase 6: Validation

- [ ] Run clean production build.
- [ ] Run frontend and data tests.
- [ ] Test desktop and mobile browsers.
- [ ] Validate every PMTiles and download asset.
- [ ] Check all external licences and attributions.
- [ ] Perform security/privacy review.
- [ ] Complete performance testing.

**Exit condition:** No critical or high-severity defect remains open.

### Phase 7: Staging deployment

- [ ] Connect GitHub to Cloudflare Pages.
- [ ] Configure preview environment variables.
- [ ] Deploy preview build.
- [ ] Configure preview tile/download domain.
- [ ] Run stakeholder and end-user acceptance testing.
- [ ] Fix issues found in staging.

**Exit condition:** Preview deployment passes the complete acceptance checklist.

### Phase 8: Production domain launch

- [ ] Configure custom domain or production Pages URL.
- [ ] Configure HTTPS and redirects.
- [ ] Configure security headers and cache rules.
- [ ] Publish catalogue and assets.
- [ ] Run final smoke tests.
- [ ] Announce the live portal.

**Exit condition:** The public URL is accessible, data loads, downloads work, and monitoring is active.

### Phase 9: Post-launch operation

- [ ] Record baseline uptime and performance.
- [ ] Publish update and incident ownership.
- [ ] Monitor broken assets and API/provider changes.
- [ ] Schedule dataset refreshes.
- [ ] Collect user feedback.
- [ ] Plan V2 features without changing V1 stability.

---

## 7. Production Acceptance Checklist

The portal can be considered ready for public launch only when all items below are satisfied.

### Repository

- [ ] Source code is committed and pushed.
- [ ] No secrets or large datasets are in Git.
- [ ] Licence information is documented.
- [ ] Main branch is protected.

### Build

- [ ] Clean install succeeds.
- [ ] TypeScript build succeeds.
- [ ] Vite production build succeeds.
- [ ] Production build runs on static hosting.
- [ ] No development URLs remain in production.

### Data

- [ ] All launch entries exist on R2.
- [ ] Every PMTiles file opens in MapLibre.
- [ ] Every source-layer name is correct.
- [ ] State, district, and national boundaries are accurate.
- [ ] All data is in EPSC:4326 or the explicitly planned map CRS.
- [ ] No invalid geometry remains.
- [ ] Every feature count is verified.
- [ ] Every source and licence is verified.

### Frontend

- [ ] Catalog loads.
- [ ] Search and filters work.
- [ ] Map loads.
- [ ] All three basemaps work.
- [ ] PMTiles layers render.
- [ ] Hover and click inspection work.
- [ ] Zoom/reset controls work.
- [ ] Download links work.
- [ ] Error states are visible and understandable.
- [ ] Mobile layout is usable.

### Deployment

- [ ] Cloudflare Pages build is connected.
- [ ] R2 public access is configured.
- [ ] CORS and Range Requests pass tests.
- [ ] Production domain and HTTPS work.
- [ ] Preview and production deployments are separated.
- [ ] Rollback procedure is documented and tested.

### Operations

- [ ] Monitoring is enabled.
- [ ] Uptime checks are active.
- [ ] Broken asset checks are active.
- [ ] Data update owner is identified.
- [ ] Incident owner is identified.
- [ ] Backup location is identified.

---

## 8. Recommended Launch Scope

For a stable first release, use a limited and fully verified dataset set rather than publishing all 49 catalogue entries immediately.

### Recommended initial V1 release

- India national boundary.
- India states and union territories.
- India districts.
- Major rivers or waterbodies.
- A small set of transport or environmental layers.
- One or two clearly licensed agricultural or land-use datasets.

The remaining catalogue entries can be marked as "coming soon" only if the UI supports that state; otherwise, they should not appear until assets and metadata exist.

### V1 should include

- Catalogue search.
- Category filtering.
- Map view.
- PMTiles rendering.
- Basemap switcher.
- Zoom and reset.
- Attribute hover/click.
- Layer description and source.
- Working PMTiles download.
- Working GeoParquet/GeoJSON download for launch datasets.
- Live public URL.

### V1 should not include

- User accounts.
- Private uploads.
- Server-side spatial analysis.
- A spatial database.
- Paid basemap subscriptions.
- Real-time remote-sensing processing.
- Unverified dataset claims.
- Placeholder download formats.

---

## 9. Production Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| PMTiles files are missing | Map cannot render | Complete data conversion and R2 upload before launch |
| Incorrect layer source names | Empty or broken map layers | Validate source metadata against catalogue automatically |
| Licence or attribution issues | Legal and reputational risk | Maintain a source/licence register and verify permissions |
| Large tile files | Slow map loading | Apply appropriate simplification and zoom thresholds |
| R2 CORS/range configuration is wrong | Browser tile failures | Test Range, CORS, and cross-domain loading before launch |
| Catalogue contains unverified counts | Wrong information | Replace estimates with validated counts or remove entries |
| Frontend build does not work on clean machine | Deployment fails | Fix Node setup and run clean build validation |
| Third-party basemap changes | Map visual layer fails | Implement an error state and approved fallback basemap |
| Data becomes outdated | Portal accuracy declines | Document vintage and add scheduled refresh checks |
| API or source endpoint changes | Download or attribution issues | Prefer static releases and snapshot source assets |

---

## 10. Required Decisions Before Implementation Starts

The following decisions should be documented or confirmed:

1. Which domain will host the live portal?
2. Which datasets are included in the first public release?
3. Which sources are officially approved for redistribution?
4. Which licence text applies to each dataset?
5. Will Esri satellite imagery remain in V1?
6. Is one visible layer at a time sufficient for V1?
7. Which search behavior is required: catalogue search, feature search, or both?
8. Which download formats must be available at launch?
9. Who will own data refresh and source monitoring?
10. Who will own Cloudflare Pages and R2 credentials?
11. What is the target browser support policy?
12. Is analytics required, and if yes, what privacy disclosure is required?

---

## 11. Definition of Done for the Live Portal

The project is complete when:

- The source code is in a version-controlled GitHub repository.
- The frontend builds automatically and is deployed on Cloudflare Pages.
- The public portal URL uses HTTPS.
- Approved PMTiles data is hosted on R2 or an equivalent CDN-compatible location.
- The catalogue contains only verified launch datasets.
- Users can search and filter the catalogue.
- Users can open a dataset and view it on the India map.
- Attribute and source information are accurate.
- Working downloads are available for all announced formats.
- Source and licence attribution is visible.
- Desktop and mobile tests pass.
- Data quality, security, and privacy checks pass.
- Monitoring and rollback procedures are ready.
- A named owner has been assigned to maintain data and deployment.

Until these conditions are met, the portal should be described internally as a **prototype or staging build**, not a production live portal.
