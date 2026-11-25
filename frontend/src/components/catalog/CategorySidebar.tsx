import React from 'react';
import { 
  Compass, 
  MapPin, 
  Layers, 
  Droplet, 
  Trees, 
  Sprout, 
  Bus, 
  GraduationCap 
} from 'lucide-react';
import { LayerCategory } from '../../types';

interface CategorySidebarProps {
  categories: { id: LayerCategory; label: string; count: number }[];
  selectedCategory: LayerCategory | 'All';
  onSelectCategory: (category: LayerCategory | 'All') => void;
  totalCount: number;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Boundaries': <MapPin className="w-4 h-4 text-orange-400" />,
  'Environment': <Trees className="w-4 h-4 text-emerald-400" />,
  'Water': <Droplet className="w-4 h-4 text-cyan-400" />,
  'Agriculture & land use': <Sprout className="w-4 h-4 text-lime-400" />,
  'Transport & mobility': <Bus className="w-4 h-4 text-amber-400" />,
  'Health & education': <GraduationCap className="w-4 h-4 text-rose-400" />
};

export const CategorySidebar: React.FC<CategorySidebarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  totalCount
}) => {
  return (
    <aside className="w-72 bg-[#121417] border-r border-neutral-800 p-4 flex flex-col h-full select-none">
      <div className="mb-6 px-2">
        <h2 className="text-xs font-semibold text-neutral-400 tracking-wider uppercase">
          Catalog Categories
        </h2>
        <p className="text-xs text-neutral-500 mt-0.5">Explore 49 open GIS datasets</p>
      </div>

      <nav className="space-y-1.5 flex-1 overflow-y-auto pr-1">
        <button
          onClick={() => onSelectCategory('All')}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            selectedCategory === 'All'
              ? 'bg-[#1e2229] text-white border border-neutral-700'
              : 'text-neutral-400 hover:bg-[#181a1f] hover:text-neutral-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <Layers className="w-4 h-4 text-orange-400" />
            <span>All Layers</span>
          </div>
          <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 font-mono">
            {totalCount}
          </span>
        </button>

        <div className="pt-3 pb-1 px-2">
          <span className="text-[11px] font-semibold text-neutral-500 tracking-wider uppercase">
            Domains
          </span>
        </div>

        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#1e2229] text-white border border-neutral-700'
                  : 'text-neutral-400 hover:bg-[#181a1f] hover:text-neutral-200'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                {CATEGORY_ICONS[cat.id] || <Compass className="w-4 h-4 text-neutral-400" />}
                <span className="truncate">{cat.label}</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 font-mono ml-2">
                {cat.count}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="mt-auto pt-4 border-t border-neutral-800 px-2 text-xs text-neutral-500">
        <div className="flex items-center justify-between">
          <span>Engine</span>
          <span className="text-neutral-300 font-mono text-[11px]">MapLibre + PMTiles</span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span>Cloud Ready</span>
          <span className="text-emerald-400 font-mono text-[11px]">Cloudflare R2 / S3</span>
        </div>
      </div>
    </aside>
  );
};
