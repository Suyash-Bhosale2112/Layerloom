"""
Dataset Inspection Script
=========================
This script reads any geospatial file (.parquet, .geojson, .shp, .gpkg)
and prints key GIS properties:
- Feature count
- Coordinate Reference System (CRS) - Verifies EPSG:4326 (WGS84)
- Bounding Box [minX, minY, maxX, maxY]
- Column list and data types
"""

import sys
from pathlib import Path
import geopandas as gpd

def inspect_geospatial_file(file_path: str):
    path = Path(file_path)
    if not path.exists():
        print(f"Error: File '{file_path}' does not exist.")
        return

    print(f"\n==================================================")
    print(f"Inspecting: {path.name}")
    print(f"Size: {round(path.stat().st_size / (1024 * 1024), 2)} MB")
    print(f"==================================================")

    try:
        if path.suffix == '.parquet':
            gdf = gpd.read_parquet(path)
        else:
            gdf = gpd.read_file(path)

        print(f"Total Features / Rows: {len(gdf):,}")
        print(f"Geometry Type(s): {gdf.geometry.geom_type.unique().tolist()}")
        print(f"CRS (Coordinate System): {gdf.crs}")
        
        # Check CRS recommendation for Web GIS
        if gdf.crs is not None and gdf.crs.to_epsg() == 4326:
            print("CRS Status: OK (EPSG:4326 - WGS84 standard for Web GIS)")
        else:
            print(f"CRS Warning: Layer is in {gdf.crs}. For Web GIS, reproject using gdf.to_crs(epsg=4326)")

        # Calculate Bounding Box
        bounds = gdf.total_bounds
        print(f"Bounding Box [minX, minY, maxX, maxY]:")
        print(f"  [{bounds[0]:.4f}, {bounds[1]:.4f}, {bounds[2]:.4f}, {bounds[3]:.4f}]")

        print("\nColumns & Attribute Schema:")
        for col, dtype in gdf.dtypes.items():
            if col != 'geometry':
                print(f"  - {col} ({dtype})")

        print("\nFirst 3 rows preview:")
        print(gdf.drop(columns='geometry').head(3).to_string())

    except Exception as e:
        print(f"Error reading geospatial file: {e}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        inspect_geospatial_file(sys.argv[1])
    else:
        print("Usage: python pipeline/inspect_data.py <path_to_geospatial_file>")
        print("Example: python pipeline/inspect_data.py data/raw/india_states.geojson")
