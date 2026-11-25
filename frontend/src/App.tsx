import { useState, useMemo } from 'react';
import { Header } from './components/common/Header';
import { CategorySidebar } from './components/catalog/CategorySidebar';
import { LayerTable } from './components/catalog/LayerTable';
import { MapView } from './components/map/MapView';
import { PMTILES_CATALOG, CATEGORIES } from './services/catalog';
import { PMTileLayerItem, LayerCategory } from './types';

export default function App() {
  const [activeView, setActiveView] = useState<'catalog' | 'map'>('catalog');
  const [selectedCategory, setSelectedCategory] = useState<LayerCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLayer, setActiveLayer] = useState<PMTileLayerItem>(
    PMTILES_CATALOG.find((l) => l.id.includes('districts')) || PMTILES_CATALOG[0]
  );

  // Filtered layers based on selected category & search input
  const filteredLayers = useMemo(() => {
    return PMTILES_CATALOG.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.attribution.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleSelectLayer = (layer: PMTileLayerItem) => {
    setActiveLayer(layer);
    setActiveView('map');
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#0c0d0f] text-neutral-100 font-sans overflow-hidden">
      {/* Universal Top Header */}
      <Header
        activeView={activeView}
        onNavigateHome={() => setActiveView('catalog')}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
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
            />
          </>
        ) : (
          <MapView
            layer={activeLayer}
            onBack={() => setActiveView('catalog')}
            allLayers={PMTILES_CATALOG}
            onSwitchLayer={setActiveLayer}
          />
        )}
      </div>
    </div>
  );
}
