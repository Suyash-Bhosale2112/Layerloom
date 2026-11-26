import React from 'react';
import {
  Compass,
  Layers,
  Droplet,
  Trees,
  Sprout,
  Bus,
  GraduationCap,
  MapPin
} from 'lucide-react';
import { LayerCategory } from '../../types';

interface CategorySidebarProps {
  categories: { id: LayerCategory; label: string; count: number }[];
  selectedCategory: LayerCategory | 'All';
  onSelectCategory: (category: LayerCategory | 'All') => void;
  totalCount: number;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Boundaries: <MapPin className="h-4 w-4" />,
  Environment: <Trees className="h-4 w-4" />,
  Water: <Droplet className="h-4 w-4" />,
  'Agriculture & land use': <Sprout className="h-4 w-4" />,
  'Transport & mobility': <Bus className="h-4 w-4" />,
  'Health & education': <GraduationCap className="h-4 w-4" />
};

export const CategorySidebar: React.FC<CategorySidebarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  totalCount
}) => (
  <aside className="catalog-sidebar flex h-[54px] w-full shrink-0 flex-row border-b px-3 py-2 lg:h-full lg:w-[252px] lg:flex-col lg:border-b-0 lg:border-r lg:px-4 lg:py-6">
    <div className="mb-5 hidden px-2 lg:block">
      <div className="eyebrow mb-2">Workspace</div>
      <h2 className="text-sm font-semibold text-slate-100">Data catalogue</h2>
      <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
        Browse India&apos;s public geospatial layers by theme.
      </p>
    </div>

    <nav aria-label="Dataset categories" className="flex min-w-0 flex-1 gap-1 overflow-x-auto lg:block lg:space-y-1">
      <button
        type="button"
        onClick={() => onSelectCategory('All')}
        aria-current={selectedCategory === 'All' ? 'page' : undefined}
        className={`category-link w-auto shrink-0 lg:w-full ${selectedCategory === 'All' ? 'selected' : ''}`}
      >
        <span className="flex items-center gap-3">
          <Layers className="h-4 w-4 text-cyan-300" />
          <span>All datasets</span>
        </span>
        <span className="category-count">{totalCount}</span>
      </button>

      <div className="eyebrow hidden px-3 pb-1 pt-6 lg:block">Explore by theme</div>
      {categories.map((category) => (
        <button
          type="button"
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          aria-current={selectedCategory === category.id ? 'page' : undefined}
          className={`category-link w-auto shrink-0 lg:w-full ${selectedCategory === category.id ? 'selected' : ''}`}
        >
          <span className="flex min-w-0 items-center gap-3">
            <span className="category-icon">{CATEGORY_ICONS[category.id] || <Compass className="h-4 w-4" />}</span>
            <span className="truncate">{category.label}</span>
          </span>
          <span className="category-count">{category.count}</span>
        </button>
      ))}
    </nav>

    <div className="sidebar-note mt-auto hidden rounded-xl p-3.5 lg:block">
      <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold text-slate-200">
        <span className="status-dot" />
        Ready to explore
      </div>
      <p className="text-[10px] leading-relaxed text-slate-500">
        Vector tiles stream on demand from the configured PMTiles host.
      </p>
    </div>
  </aside>
);
