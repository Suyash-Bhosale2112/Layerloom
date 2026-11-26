import React from 'react';
import {
  ArrowUpRight,
  Calendar,
  Database,
  Download,
  HardDrive,
  Info,
  X
} from 'lucide-react';
import { PMTileLayerItem } from '../../types';
import { getPmtilesUrl } from '../../services/catalog';

interface LayerDetailDrawerProps {
  layer: PMTileLayerItem;
  onClose: () => void;
}

export const LayerDetailDrawer: React.FC<LayerDetailDrawerProps> = ({ layer, onClose }) => (
  <aside className="layer-detail-panel flex h-full w-[min(380px,calc(100vw-24px))] flex-col overflow-y-auto">
    <div className="flex items-start justify-between border-b border-white/[0.07] p-5">
      <div>
        <span className="text-[9px] font-semibold uppercase tracking-[0.17em] text-cyan-300">{layer.category}</span>
        <h2 className="mt-1.5 text-lg font-semibold leading-snug text-white">{layer.name}</h2>
      </div>
      <button type="button" onClick={onClose} className="icon-button" aria-label="Close layer details">
        <X className="h-4 w-4" />
      </button>
    </div>

    <div className="space-y-5 p-5 text-xs">
      <div className="grid grid-cols-2 gap-2">
        <div className="detail-meta">
          <Calendar className="h-3.5 w-3.5 text-slate-500" />
          <span>{layer.vintage || 'Vintage not specified'}</span>
        </div>
        <div className="detail-meta">
          <HardDrive className="h-3.5 w-3.5 text-slate-500" />
          <span>{layer.sizeMB} MB</span>
        </div>
      </div>

      <section>
        <h3 className="detail-heading"><Info className="h-3.5 w-3.5" /> About this layer</h3>
        <p className="detail-copy">{layer.description}</p>
        <p className="mt-2 text-[10px] leading-relaxed text-slate-500">
          Listed source: <span className="text-slate-400">{layer.attribution}</span>. Verify source terms before reuse; a dataset-specific licence is not supplied here.
        </p>
      </section>

      {layer.fields.length > 0 && (
        <section>
          <h3 className="detail-heading"><Database className="h-3.5 w-3.5" /> Listed attributes ({layer.fields.length})</h3>
          <div className="flex max-h-32 flex-wrap gap-1.5 overflow-y-auto rounded-xl border border-white/[0.07] bg-black/10 p-3">
            {layer.fields.map((field) => (
              <span key={field} className="field-chip">{field}</span>
            ))}
          </div>
        </section>
      )}

      <section>
        <h3 className="detail-heading"><Download className="h-3.5 w-3.5" /> Available data</h3>
        <a
          href={layer.downloads?.pmtiles || getPmtilesUrl(layer.fileName)}
          target="_blank"
          rel="noopener noreferrer"
          className="pmtiles-link group flex items-center justify-between gap-3 rounded-xl border p-3.5"
        >
          <span>
            <span className="block font-semibold text-slate-100 group-hover:text-cyan-200">Open PMTiles source</span>
            <span className="mt-1 block text-[10px] leading-relaxed text-slate-500">
              Hosted vector tiles · {layer.fileName}
            </span>
          </span>
          <ArrowUpRight className="h-4 w-4 shrink-0 text-cyan-300" />
        </a>
        <p className="mt-2 text-[10px] leading-relaxed text-slate-500">
          GeoParquet, GeoJSON, Shapefile and KML exports are not currently published for this layer.
        </p>
      </section>
    </div>
  </aside>
);
