import React from 'react';
import { Eye, HardDrive, ShieldCheck, MapPin } from 'lucide-react';
import { PMTileLayerItem } from '../../types';

interface LayerTableProps {
  layers: PMTileLayerItem[];
  onSelectLayer: (layer: PMTileLayerItem) => void;
  activeCategory: string;
}

export const LayerTable: React.FC<LayerTableProps> = ({
  layers,
  onSelectLayer,
  activeCategory
}) => {
  return (
    <div className="flex-1 flex flex-col h-full bg-[#0c0d0f] overflow-hidden">
      {/* Table Header Section */}
      <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white capitalize">
            {activeCategory === 'All' ? 'All Geospatial Layers' : activeCategory}
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Boundaries, hydrology, transportation, amenities, and environmental domains across India.
          </p>
        </div>
        <div className="text-sm text-neutral-400 font-mono">
          <span className="text-white font-bold">{layers.length}</span> layers available
        </div>
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-neutral-800 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider bg-[#101216]/60 sticky top-0 backdrop-blur z-10">
              <th className="py-3 px-6">Layer Name</th>
              <th className="py-3 px-4">Source / Agency</th>
              <th className="py-3 px-4">Vintage</th>
              <th className="py-3 px-4">Size & Scale</th>
              <th className="py-3 px-4">Geometry</th>
              <th className="py-3 px-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/60 text-sm">
            {layers.map((layer) => (
              <tr
                key={layer.id}
                className="hover:bg-[#15181e] transition-colors group cursor-pointer"
                onClick={() => onSelectLayer(layer)}
              >
                <td className="py-4 px-6">
                  <div className="font-semibold text-neutral-100 group-hover:text-orange-400 transition-colors">
                    {layer.name}
                  </div>
                  <div className="text-xs text-neutral-400 line-clamp-1 mt-0.5 max-w-lg">
                    {layer.description}
                  </div>
                </td>
                <td className="py-4 px-4 text-xs font-mono text-neutral-300">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-300">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    {layer.attribution}
                  </span>
                </td>
                <td className="py-4 px-4 text-xs font-mono text-neutral-400">
                  {layer.vintage || '2024'}
                </td>
                <td className="py-4 px-4 text-xs font-mono text-neutral-300">
                  <div className="flex items-center gap-1">
                    <HardDrive className="w-3 h-3 text-neutral-500" />
                    <span>{layer.sizeMB} MB</span>
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    {layer.featureCount}
                  </div>
                </td>
                <td className="py-4 px-4 text-xs font-mono text-neutral-400">
                  <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">
                    <MapPin className="w-3 h-3 text-orange-400" />
                    {layer.geometryType || 'Vector'}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectLayer(layer);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#1e2229] hover:bg-orange-500 hover:text-white text-neutral-200 border border-neutral-700 hover:border-orange-500 transition-all shadow-sm"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View map</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {layers.length === 0 && (
          <div className="text-center py-20 text-neutral-500">
            No layers found matching your query.
          </div>
        )}
      </div>
    </div>
  );
};
