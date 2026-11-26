import React from 'react';
import {
  ArrowUpRight,
  Database,
  Eye,
  Layers3,
  MapPin,
  Sparkles
} from 'lucide-react';
import { PMTileLayerItem, LayerCategory } from '../../types';

interface LayerTableProps {
  layers: PMTileLayerItem[];
  onSelectLayer: (layer: PMTileLayerItem) => void;
  activeCategory: LayerCategory | 'All';
  totalCount: number;
}

const formatSize = (size: number) => `${size < 10 ? size.toFixed(1) : Math.round(size)} MB`;

export const LayerTable: React.FC<LayerTableProps> = ({
  layers,
  onSelectLayer,
  activeCategory,
  totalCount
}) => (
  <section className="catalog-content min-w-0 flex-1 overflow-y-auto">
    <div className="catalog-inner mx-auto max-w-[1440px] px-5 pb-12 pt-6 sm:px-8 lg:px-10">
      <section className="catalog-hero relative mb-9 overflow-hidden rounded-[24px] border">
        <div className="hero-grid absolute inset-0" aria-hidden="true" />
        <div className="hero-copy relative z-10 max-w-[610px] px-6 py-8 sm:px-10 sm:py-10">
          <div className="hero-kicker mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.17em]">
            <Sparkles className="h-3 w-3" />
            A clearer view of India
          </div>
          <h1 className="max-w-[530px] text-[clamp(28px,4vw,47px)] font-semibold leading-[1.08] tracking-[-0.045em] text-white">
            Explore the layers
            <span className="hero-title-accent"> shaping our world.</span>
          </h1>
          <p className="mt-4 max-w-[430px] text-sm leading-6 text-slate-400">
            Discover boundaries, ecosystems, infrastructure and more through a growing collection of map-ready data.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <div className="hero-stat">
              <span className="text-xl font-semibold text-white">{totalCount}</span>
              <span className="text-[10px] text-slate-400">data layers</span>
            </div>
            <span className="stat-divider" />
            <div className="hero-stat">
              <span className="text-xl font-semibold text-white">6</span>
              <span className="text-[10px] text-slate-400">themes</span>
            </div>
            <span className="stat-divider" />
            <div className="hero-stat">
              <span className="text-xl font-semibold text-white">India</span>
              <span className="text-[10px] text-slate-400">in focus</span>
            </div>
          </div>
        </div>
        <div className="globe-stage" aria-hidden="true">
          <div className="globe-orbit globe-orbit-one" />
          <div className="globe-orbit globe-orbit-two" />
          <div className="globe">
            <div className="globe-surface" />
            <div className="globe-highlight" />
            <span className="globe-point point-one" />
            <span className="globe-point point-two" />
            <span className="globe-point point-three" />
          </div>
          <span className="globe-star star-one" />
          <span className="globe-star star-two" />
          <span className="globe-star star-three" />
          <span className="globe-star star-four" />
          <div className="globe-caption">
            <span className="globe-caption-pulse" />
            INDIA · 28°N 78°E
          </div>
        </div>
      </section>

      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="eyebrow mb-1.5">The collection</div>
          <h2 className="text-xl font-semibold tracking-tight text-white">
            {activeCategory === 'All' ? 'Explore datasets' : activeCategory}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Select a layer to preview it on the map.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 text-[11px] text-slate-400">
          <Layers3 className="h-3.5 w-3.5 text-cyan-300" />
          <span><strong className="font-semibold text-slate-200">{layers.length}</strong> layers</span>
        </div>
      </div>

      {layers.length > 0 ? (
        <div className="dataset-grid grid grid-cols-1 gap-3.5 md:grid-cols-2 2xl:grid-cols-3">
          {layers.map((layer, index) => (
            <article
              key={layer.id}
              className="dataset-card group"
              style={{ animationDelay: `${Math.min(index, 12) * 35}ms` }}
            >
              <button
                type="button"
                onClick={() => onSelectLayer(layer)}
                className="flex h-full w-full flex-col text-left"
                aria-label={`Preview ${layer.name} on map`}
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <span className="dataset-glyph"><Database className="h-[17px] w-[17px]" /></span>
                  <span className="dataset-category">{layer.category}</span>
                </div>
                <h3 className="text-[15px] font-semibold leading-snug text-slate-100 transition-colors group-hover:text-cyan-200">
                  {layer.name}
                </h3>
                <p className="mt-2 line-clamp-2 min-h-[38px] text-xs leading-[1.6] text-slate-500">
                  {layer.description}
                </p>
                <div className="mt-auto flex items-center justify-between gap-2 border-t border-white/[0.06] pt-4">
                  <div className="flex min-w-0 items-center gap-2 text-[10px] text-slate-500">
                    <span className="inline-flex shrink-0 items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {layer.geometryType || 'Vector'}
                    </span>
                    <span className="text-slate-700">/</span>
                    <span className="truncate">{layer.vintage || 'Vintage unavailable'}</span>
                    <span className="text-slate-700">/</span>
                    <span className="shrink-0">{formatSize(layer.sizeMB)}</span>
                  </div>
                  <span className="dataset-action">
                    <span className="sr-only">View map</span>
                    <Eye className="h-3.5 w-3.5" />
                    <ArrowUpRight className="h-3 w-3" />
                  </span>
                </div>
              </button>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state rounded-2xl border px-6 py-16 text-center">
          <Database className="mx-auto mb-3 h-6 w-6 text-slate-600" />
          <h3 className="text-sm font-medium text-slate-300">No datasets found</h3>
          <p className="mt-1 text-xs text-slate-500">Try another search or choose a different theme.</p>
        </div>
      )}
    </div>
  </section>
);
