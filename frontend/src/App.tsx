import { lazy, Suspense, useMemo, useState } from 'react';
import { Header } from './components/common/Header';
import { CategorySidebar } from './components/catalog/CategorySidebar';
import { LayerTable } from './components/catalog/LayerTable';
import { PMTILES_CATALOG, CATEGORIES } from './services/catalog';
import { PMTileLayerItem, LayerCategory } from './types';

const MapView = lazy(() =>
  import('./components/map/MapView').then((module) => ({ default: module.MapView }))
);

export default function App() {
  const [activeView, setActiveView] = useState<'catalog' | 'map'>('catalog');
  const [selectedCategory, setSelectedCategory] = useState<LayerCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLayer, setActiveLayer] = useState<PMTileLayerItem>(
    PMTILES_CATALOG.find((item) => item.id === 'lgd_districts') || PMTILES_CATALOG[0]
  );

  const filteredLayers = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return PMTILES_CATALOG.filter((item) => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.attribution.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleSelectLayer = (layer: PMTileLayerItem) => {
    setActiveLayer(layer);
    setActiveView('map');
  };

  return (
    <div className="app-shell flex h-screen w-screen flex-col overflow-hidden text-slate-100">
      <Header
        activeView={activeView}
        onNavigateHome={() => setActiveView('catalog')}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
        {activeView === 'catalog' ? (
          <>
            <CategorySidebar
              categories={CATEGORIES}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              totalCount={PMTILES_CATALOG.length}
            />
            <LayerTable
              layers={filteredLayers}
              onSelectLayer={handleSelectLayer}
              activeCategory={selectedCategory}
              totalCount={PMTILES_CATALOG.length}
            />
          </>
        ) : (
          <Suspense fallback={<div className="flex flex-1 items-center justify-center text-xs text-slate-400">Preparing map...</div>}>
            <MapView
              layer={activeLayer}
              onBack={() => setActiveView('catalog')}
              allLayers={PMTILES_CATALOG}
            />
          </Suspense>
        )}
      </main>
    </div>
  );
}
