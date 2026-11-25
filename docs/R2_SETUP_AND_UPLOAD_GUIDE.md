# Cloudflare R2 Hosting & PMTiles Sync Guide for Layerloom

PMTiles is an archive format that enables web maps (MapLibre GL JS) to read vector tiles directly via **HTTP Range Requests (RFC 7233)**.
By using **Cloudflare R2**, you get **zero egress fees**, which means serving millions of map tile requests across India is essentially free under R2's generous free tier (10 GB storage, 10M read requests/month).

---

## 1. Setup Cloudflare R2 Bucket

1. Log into your [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. In the left sidebar, click **R2 Object Storage** -> **Overview**.
3. Click **Create bucket**:
   - **Bucket name**: `layerloom-pmtiles`
   - **Location**: Automatic or Western/Asia-Pacific.
   - Click **Create Bucket**.
4. In the bucket page, navigate to **Settings** tab:
   - **Public Access**: 
     - Option A: Connect a Custom Domain (e.g. `tiles.yourdomain.com`).
     - Option B: Enable **R2.dev subdomain** (allows direct public access like `https://pub-xxxxxx.r2.dev`).
   - **CORS Configuration**: Click **Add CORS rule** and paste:
     ```json
     [
       {
         "AllowedOrigins": ["*"],
         "AllowedMethods": ["GET", "HEAD"],
         "AllowedHeaders": ["Range", "Content-Type"],
         "ExposeHeaders": ["Content-Range", "ETag", "Content-Length"],
         "MaxAgeSeconds": 3600
       }
     ]
     ```
     *(This is mandatory for MapLibre to read byte ranges from PMTiles).*

---

## 2. Generate R2 S3 API Credentials

1. Go to **R2 Overview** -> Click **Manage R2 API Tokens** (on right side).
2. Click **Create API token**:
   - **Token name**: `Layerloom Uploader`
   - **Permissions**: `Admin Read & Write` (or Object Read & Write)
   - **TTL**: Forever or as preferred.
3. Save the generated credentials:
   - `Access Key ID`
   - `Secret Access Key`
   - `Endpoint URL` (e.g., `https://<account_id>.r2.cloudflarestorage.com`)

---

## 3. Upload All 49 PMTiles using AWS CLI or RClone

R2 is fully S3-compatible, so you can upload directly using standard tools.

### Option A: Using AWS CLI (Recommended)
Configure AWS CLI for R2:
```bash
aws configure --profile r2
# AWS Access Key ID: <YOUR_R2_ACCESS_KEY>
# AWS Secret Access Key: <YOUR_R2_SECRET_KEY>
# Default region name: auto
# Default output format: json
```

Sync the entire `PMTiles/` folder to R2 preserving folder paths (`Boundaries/`, `Water/`, etc.):
```bash
aws s3 sync "PMTiles/" s3://layerloom-pmtiles/ \
  --endpoint-url https://<account_id>.r2.cloudflarestorage.com \
  --profile r2
```

### Option B: Using Rclone or Cyberduck
1. Connect via S3 compatible storage using your endpoint URL.
2. Drag and drop the `PMTiles/` folder directly.

---

## 4. Connecting the Frontend to Cloudflare R2

In your frontend, set the base URL in an environment variable `.env.production`:

```env
VITE_TILES_BASE_URL=https://pub-xxxxxx.r2.dev
# or custom domain:
# VITE_TILES_BASE_URL=https://tiles.yourdomain.com
```

In `frontend/src/components/map/MapView.tsx`:
```ts
const baseUrl = import.meta.env.VITE_TILES_BASE_URL || `${window.location.origin}/pmtiles`;
const pmtilesUrl = `${baseUrl}/${targetLayer.relativePath}`;
```
During local development, the built-in Vite plugin will serve from local `PMTiles/` automatically. When deployed, it will stream tiles from Cloudflare R2!
