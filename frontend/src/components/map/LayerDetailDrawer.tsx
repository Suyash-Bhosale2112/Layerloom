import React from 'react';
import { 
  Download, 
  X, 
  Database, 
  Info,
  Calendar,
  Building,
  HardDrive
} from 'lucide-react';
import { PMTileLayerItem } from '../../types';

interface LayerDetailDrawerProps {
  layer: PMTileLayerItem;
  onClose: () => void;
}

export const LayerDetailDrawer: React.FC<LayerDetailDrawerProps> = ({
  layer,
  onClose
}) => {
  return (
    <div className="w-[380px] bg-[#121417] border-r border-neutral-800 flex flex-col h-full z-20 shadow-2xl overflow-y-auto">
      {/* Header */}
      <div className="p-5 border-b border-neutral-800 flex items-start justify-between">
        <div>
          <span className="text-[11px] font-semibold text-orange-400 uppercase tracking-wider">
            {layer.category}
          </span>
          <h2 className="text-xl font-bold text-white mt-1 leading-snug">
            {layer.name}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-5 space-y-6 flex-1 text-sm">
        {/* Meta Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded bg-neutral-800 text-neutral-300 flex items-center gap-1.5 border border-neutral-700">
            <Building className="w-3.5 h-3.5 text-neutral-400" />
            {layer.attribution}
          </span>
          <span className="px-2.5 py-1 rounded bg-neutral-800 text-neutral-300 flex items-center gap-1.5 border border-neutral-700">
            <Calendar className="w-3.5 h-3.5 text-neutral-400" />
            {layer.vintage || '2024'}
          </span>
          <span className="px-2.5 py-1 rounded bg-neutral-800 text-neutral-300 flex items-center gap-1.5 border border-neutral-700">
            <HardDrive className="w-3.5 h-3.5 text-neutral-400" />
            {layer.sizeMB} MB
          </span>
        </div>

        {/* License Pill */}
        <div>
          <span className="inline-block px-2.5 py-1 rounded text-xs font-mono font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800">
            CC0-1.0 / Open Government Data (OGD)
          </span>
        </div>

        {/* Abstract */}
        <div>
          <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" />
            About this layer
          </h3>
          <p className="text-neutral-300 text-xs leading-relaxed bg-[#181a1f] p-3.5 rounded-lg border border-neutral-800">
            {layer.description}
          </p>
        </div>

        {/* Vector Attributes & Schema */}
        {layer.fields && layer.fields.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" />
              Vector Attributes ({layer.fields.length})
            </h3>
            <div className="flex flex-wrap gap-1.5 bg-[#181a1f] p-3 rounded-lg border border-neutral-800 max-h-36 overflow-y-auto">
              {layer.fields.map((f) => (
                <span
                  key={f}
                  className="px-2 py-0.5 rounded text-[11px] font-mono bg-neutral-800 text-neutral-300 border border-neutral-700"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Download Section - BharatAtlas Style */}
        <div>
          <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" />
            Download Formats
          </h3>

          <div className="space-y-2">
            {/* PMTiles Download */}
            <a
              href={`/pmtiles/${layer.relativePath}`}
              download={layer.fileName}
              className="flex items-center justify-between p-3 rounded-lg bg-[#181a1f] hover:bg-[#20242b] border border-neutral-800 hover:border-neutral-700 transition-all group"
            >
              <div>
                <div className="font-semibold text-white group-hover:text-orange-400 flex items-center gap-2">
                  <span>PMTiles</span>
                  <span className="text-[10px] font-mono bg-orange-950 text-orange-400 px-1.5 py-0.5 rounded border border-orange-800">
                    vector tiles
                  </span>
                </div>
                <div className="text-[11px] text-neutral-400 mt-0.5">
                  Web maps, MapLibre GL, Leaflet
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-neutral-400">
                  {layer.sizeMB} MB
                </span>
              </div>
            </a>

            {/* Parquet Download */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#181a1f] border border-neutral-800/60 opacity-80">
              <div>
                <div className="font-semibold text-neutral-200 flex items-center gap-2">
                  <span>Parquet / GeoParquet</span>
                  <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-800">
                    recommended
                  </span>
                </div>
                <div className="text-[11px] text-neutral-500 mt-0.5">
                  Analytics: DuckDB, pandas, geopandas
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-neutral-500">Fast Query</span>
              </div>
            </div>

            {/* GeoJSON & Shapefile Card */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#181a1f] border border-neutral-800/60 opacity-80">
              <div>
                <div className="font-semibold text-neutral-200">
                  GeoJSON / Shapefile / KML
                </div>
                <div className="text-[11px] text-neutral-500 mt-0.5">
                  Desktop GIS: QGIS, ArcGIS, Google Earth
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-neutral-500">GIS Suite</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
