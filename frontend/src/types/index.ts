export type LayerCategory =
  | 'Boundaries'
  | 'Environment'
  | 'Water'
  | 'Agriculture & land use'
  | 'Transport & mobility'
  | 'Health & education';

export interface PMTileLayerItem {
  id: string;
  name: string;
  category: LayerCategory;
  folderCategory: string;
  fileName: string;
  relativePath: string;
  sourceLayer: string;
  sizeMB: number;
  description: string;
  fields: string[];
  attribution: string;
  vintage?: string;
  featureCount?: string;
  geometryType?: 'Polygon' | 'MultiPolygon' | 'LineString' | 'Point';
  downloads?: {
    parquet?: string;
    pmtiles?: string;
    geojson?: string;
    kml?: string;
    shapefile?: string;
  };
}
