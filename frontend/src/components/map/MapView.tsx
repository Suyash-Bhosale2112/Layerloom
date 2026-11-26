import React, { FormEvent, useEffect, useRef, useState } from 'react';
import maplibregl, { MapLayerMouseEvent } from 'maplibre-gl';
import * as pmtiles from 'pmtiles';
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Info,
  Layers3,
  LocateFixed,
  Search,
  X,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { PMTileLayerItem } from '../../types';
import { getPmtilesUrl } from '../../services/catalog';
import { LayerDetailDrawer } from './LayerDetailDrawer';

interface MapViewProps {
  layer: PMTileLayerItem;
  onBack: () => void;
  allLayers: PMTileLayerItem[];
}

interface ActiveLayer {
  layer: PMTileLayerItem;
  opacity: number;
}

interface SelectedFeature {
  layerName: string;
  properties: Record<string, unknown>;
  source: string;
  sourceLayer?: string;
  id?: string | number;
}

interface LayerRecord {
  sourceId: string;
  layerIds: string[];
  interactiveLayerId: string;
  clickHandler: (event: MapLayerMouseEvent) => void;
  moveHandler: (event: MapLayerMouseEvent) => void;
  leaveHandler: () => void;
}

const BASEMAP_URLS = {
  dark: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
  positron: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'
};

const SATELLITE_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    'esri-satellite': {
      type: 'raster',
      tiles: [
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      ],
      tileSize: 256,
      attribution: '&copy; Esri, Maxar'
    }
  },
  layers: [
    {
      id: 'satellite-tiles',
      type: 'raster',
      source: 'esri-satellite',
      minzoom: 0,
      maxzoom: 19
    }
  ]
};

const protocol = new pmtiles.Protocol();
maplibregl.addProtocol('pmtiles', protocol.tile);

const layerIdsFor = (id: string) => {
  const safeId = id.replace(/[^a-zA-Z0-9_-]/g, '-');
  return {
    sourceId: `layerloom-source-${safeId}`,
    fillId: `layerloom-fill-${safeId}`,
    lineId: `layerloom-line-${safeId}`,
    pointId: `layerloom-point-${safeId}`
  };
};

const colorForCategory = (category: PMTileLayerItem['category']) => {
  const colors: Record<PMTileLayerItem['category'], string> = {
    Boundaries: '#fb923c',
    Environment: '#4ade80',
    Water: '#38bdf8',
    'Agriculture & land use': '#a3e635',
    'Transport & mobility': '#fbbf24',
    'Health & education': '#fb7185'
  };
  return colors[category];
};

const collectCoordinates = (value: unknown, result: [number, number][] = []) => {
  if (!Array.isArray(value)) return result;
  if (value.length >= 2 && typeof value[0] === 'number' && typeof value[1] === 'number') {
    result.push([value[0], value[1]]);
  } else {
    value.forEach((item) => collectCoordinates(item, result));
  }
  return result;
};

export const MapView: React.FC<MapViewProps> = ({ layer, onBack, allLayers }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const activeLayersRef = useRef<ActiveLayer[]>([]);
  const layerRecordsRef = useRef<Map<string, LayerRecord>>(new Map());
  const selectedFeatureRef = useRef<SelectedFeature | null>(null);
  const [activeLayers, setActiveLayers] = useState<ActiveLayer[]>([{ layer, opacity: 78 }]);
  const [basemap, setBasemap] = useState<'dark' | 'satellite' | 'positron'>('dark');
  const [showManager, setShowManager] = useState(true);
  const [showLayerInfo, setShowLayerInfo] = useState(false);
  const [layerQuery, setLayerQuery] = useState('');
  const [placeQuery, setPlaceQuery] = useState('');
  const [selectedFeature, setSelectedFeature] = useState<SelectedFeature | null>(null);
  const [mapError, setMapError] = useState('');

  activeLayersRef.current = activeLayers;

  const addLayer = (map: maplibregl.Map, activeLayer: ActiveLayer) => {
    const { layer: item, opacity } = activeLayer;
    const ids = layerIdsFor(item.id);
    if (!map.getSource(ids.sourceId)) {
      map.addSource(ids.sourceId, {
        type: 'vector',
        url: `pmtiles://${item.downloads?.pmtiles || getPmtilesUrl(item.fileName)}`
      });
    }

    const color = colorForCategory(item.category);
    const geometryType = item.geometryType || 'MultiPolygon';
    const layerIds: string[] = [];
    let interactiveLayerId = ids.fillId;

    if (geometryType === 'Point') {
      interactiveLayerId = ids.pointId;
      if (!map.getLayer(ids.pointId)) {
        map.addLayer({
          id: ids.pointId,
          type: 'circle',
          source: ids.sourceId,
          'source-layer': item.sourceLayer,
          paint: {
            'circle-color': ['case', ['boolean', ['feature-state', 'selected'], false], '#fde047', color],
            'circle-radius': 5,
            'circle-stroke-width': 1.5,
            'circle-stroke-color': '#f8fafc',
            'circle-opacity': opacity / 100
          }
        });
      }
      layerIds.push(ids.pointId);
    } else if (geometryType === 'LineString') {
      interactiveLayerId = ids.lineId;
      if (!map.getLayer(ids.lineId)) {
        map.addLayer({
          id: ids.lineId,
          type: 'line',
          source: ids.sourceId,
          'source-layer': item.sourceLayer,
          paint: {
            'line-color': ['case', ['boolean', ['feature-state', 'selected'], false], '#fde047', color],
            'line-width': 2.5,
            'line-opacity': opacity / 100
          }
        });
      }
      layerIds.push(ids.lineId);
    } else {
      if (!map.getLayer(ids.fillId)) {
        map.addLayer({
          id: ids.fillId,
          type: 'fill',
          source: ids.sourceId,
          'source-layer': item.sourceLayer,
          paint: {
            'fill-color': ['case', ['boolean', ['feature-state', 'selected'], false], '#fde047', color],
            'fill-opacity': Math.min(0.42, (opacity / 100) * 0.42)
          }
        });
      }
      if (!map.getLayer(ids.lineId)) {
        map.addLayer({
          id: ids.lineId,
          type: 'line',
          source: ids.sourceId,
          'source-layer': item.sourceLayer,
          paint: {
            'line-color': ['case', ['boolean', ['feature-state', 'selected'], false], '#fde047', color],
            'line-width': 1.15,
            'line-opacity': opacity / 100
          }
        });
      }
      layerIds.push(ids.fillId, ids.lineId);
    }

    const clickHandler = (event: MapLayerMouseEvent) => {
      const feature = event.features?.[0];
      if (!feature) return;

      const previous = selectedFeatureRef.current;
      if (previous?.id !== undefined) {
        map.setFeatureState(
          { source: previous.source, sourceLayer: previous.sourceLayer, id: previous.id },
          { selected: false }
        );
      }
      if (feature.id !== undefined) {
        map.setFeatureState(
          { source: ids.sourceId, sourceLayer: item.sourceLayer, id: feature.id },
          { selected: true }
        );
      }

      const next: SelectedFeature = {
        layerName: item.name,
        properties: (feature.properties || {}) as Record<string, unknown>,
        source: ids.sourceId,
        sourceLayer: item.sourceLayer,
        id: feature.id
      };
      selectedFeatureRef.current = next;
      setSelectedFeature(next);
    };
    const moveHandler = () => {
      map.getCanvas().style.cursor = 'pointer';
    };
    const leaveHandler = () => {
      map.getCanvas().style.cursor = '';
    };

    map.on('click', interactiveLayerId, clickHandler);
    map.on('mousemove', interactiveLayerId, moveHandler);
    map.on('mouseleave', interactiveLayerId, leaveHandler);
    layerRecordsRef.current.set(item.id, {
      sourceId: ids.sourceId,
      layerIds,
      interactiveLayerId,
      clickHandler,
      moveHandler,
      leaveHandler
    });
  };

  const removeLayer = (map: maplibregl.Map, item: PMTileLayerItem) => {
    const record = layerRecordsRef.current.get(item.id);
    if (!record) return;
    map.off('click', record.interactiveLayerId, record.clickHandler);
    map.off('mousemove', record.interactiveLayerId, record.moveHandler);
    map.off('mouseleave', record.interactiveLayerId, record.leaveHandler);
    record.layerIds.forEach((id) => {
      if (map.getLayer(id)) map.removeLayer(id);
    });
    if (map.getSource(record.sourceId)) map.removeSource(record.sourceId);
    layerRecordsRef.current.delete(item.id);
    if (selectedFeatureRef.current?.source === record.sourceId) {
      selectedFeatureRef.current = null;
      setSelectedFeature(null);
    }
  };

  const synchronizeLayers = (map: maplibregl.Map, nextLayers: ActiveLayer[]) => {
    if (!map.isStyleLoaded()) return;
    setMapError('');
    const visibleIds = new Set(nextLayers.map(({ layer: item }) => item.id));
    Array.from(layerRecordsRef.current.keys()).forEach((itemId) => {
      if (visibleIds.has(itemId)) return;
      const item = allLayers.find((candidate) => candidate.id === itemId);
      if (item) removeLayer(map, item);
    });

    nextLayers.forEach((activeLayer) => {
      const record = layerRecordsRef.current.get(activeLayer.layer.id);
      if (!record || !map.getSource(record.sourceId)) {
        layerRecordsRef.current.delete(activeLayer.layer.id);
        addLayer(map, activeLayer);
        return;
      }

      const geometryType = activeLayer.layer.geometryType || 'MultiPolygon';
      if (geometryType === 'Point') {
        map.setPaintProperty(record.layerIds[0], 'circle-opacity', activeLayer.opacity / 100);
      } else if (geometryType === 'LineString') {
        map.setPaintProperty(record.layerIds[0], 'line-opacity', activeLayer.opacity / 100);
      } else {
        map.setPaintProperty(record.layerIds[0], 'fill-opacity', Math.min(0.42, (activeLayer.opacity / 100) * 0.42));
        map.setPaintProperty(record.layerIds[1], 'line-opacity', activeLayer.opacity / 100);
      }
    });
  };

  useEffect(() => {
    if (!mapContainer.current) return;
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: BASEMAP_URLS.dark,
      center: [78.9629, 22.5937],
      zoom: 4.5,
      pitch: 0,
      attributionControl: false
    });
    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');
    mapRef.current = map;

    map.once('load', () => synchronizeLayers(map, activeLayersRef.current));
    map.on('error', (event) => {
      const message = event.error?.message || 'Map data could not be loaded.';
      setMapError(message);
    });

    return () => {
      map.remove();
      mapRef.current = null;
      layerRecordsRef.current.clear();
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (map) synchronizeLayers(map, activeLayers);
  }, [activeLayers]);

  const changeBasemap = (type: 'dark' | 'satellite' | 'positron') => {
    setBasemap(type);
    const map = mapRef.current;
    if (!map) return;
    selectedFeatureRef.current = null;
    setSelectedFeature(null);
    map.setStyle(type === 'satellite' ? SATELLITE_STYLE : BASEMAP_URLS[type]);
    map.once('style.load', () => {
      layerRecordsRef.current.forEach((record) => {
        map.off('click', record.interactiveLayerId, record.clickHandler);
        map.off('mousemove', record.interactiveLayerId, record.moveHandler);
        map.off('mouseleave', record.interactiveLayerId, record.leaveHandler);
      });
      layerRecordsRef.current.clear();
      synchronizeLayers(map, activeLayersRef.current);
    });
  };

  const toggleLayer = (item: PMTileLayerItem) => {
    setActiveLayers((current) => {
      const exists = current.some(({ layer: active }) => active.id === item.id);
      if (exists) return current.filter(({ layer: active }) => active.id !== item.id);
      return [...current, { layer: item, opacity: 78 }];
    });
  };

  const setLayerOpacity = (itemId: string, opacity: number) => {
    setActiveLayers((current) =>
      current.map((active) => active.layer.id === itemId ? { ...active, opacity } : active)
    );
  };

  const searchVisibleFeatures = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const map = mapRef.current;
    const query = placeQuery.trim().toLowerCase();
    if (!map || !query) return;

    const candidates = map.queryRenderedFeatures().filter((feature) => feature.source.startsWith('layerloom-source-'));
    const match = candidates.find((feature) =>
      Object.entries(feature.properties || {}).some(([key, value]) =>
        /name|district|dist|state|stname|village|block|tehsil|taluk|place|town|city|locality/i.test(key) &&
        String(value).toLowerCase().includes(query)
      )
    );
    if (!match) {
      setMapError('No matching feature is currently visible. Zoom to the area or enable its layer and try again.');
      return;
    }

    const coordinates = collectCoordinates(
      'coordinates' in match.geometry ? match.geometry.coordinates : []
    );
    if (coordinates.length) {
      const bounds = coordinates.reduce(
        (result, coordinate) => result.extend(coordinate),
        new maplibregl.LngLatBounds(coordinates[0], coordinates[0])
      );
      map.fitBounds(bounds, { padding: 90, maxZoom: 11, duration: 900 });
    }

    const next: SelectedFeature = {
      layerName: allLayers.find((item) => layerIdsFor(item.id).sourceId === match.source)?.name || 'Map feature',
      properties: (match.properties || {}) as Record<string, unknown>,
      source: match.source,
      sourceLayer: match.sourceLayer,
      id: match.id
    };
    const previous = selectedFeatureRef.current;
    if (previous?.id !== undefined) {
      map.setFeatureState(
        { source: previous.source, sourceLayer: previous.sourceLayer, id: previous.id },
        { selected: false }
      );
    }
    if (next.id !== undefined) {
      map.setFeatureState(
        { source: next.source, sourceLayer: next.sourceLayer, id: next.id },
        { selected: true }
      );
    }
    selectedFeatureRef.current = next;
    setSelectedFeature(next);
    setMapError('');
  };

  const activeIds = new Set(activeLayers.map(({ layer: item }) => item.id));
  const filteredLayers = allLayers.filter((item) => {
    const query = layerQuery.toLowerCase().trim();
    return !query || item.name.toLowerCase().includes(query) || item.category.toLowerCase().includes(query);
  });

  return (
    <div className="map-workspace relative flex min-h-0 flex-1 flex-col overflow-hidden">
      <header className="map-toolbar z-20 flex min-h-[58px] shrink-0 flex-wrap items-center justify-between gap-3 border-b px-4 py-2.5 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <button type="button" onClick={onBack} className="map-back">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Catalogue</span>
          </button>
          <span className="hidden h-6 w-px bg-white/10 sm:block" />
          <div className="min-w-0">
            <div className="truncate text-xs font-semibold text-slate-100">{layer.name}</div>
            <div className="text-[10px] text-slate-500">
              {activeLayers.length} visible {activeLayers.length === 1 ? 'layer' : 'layers'}
            </div>
          </div>
        </div>

        <form onSubmit={searchVisibleFeatures} className="map-place-search order-3 flex w-full items-center gap-2 rounded-lg border px-2.5 py-1.5 md:order-none md:w-auto">
          <Search className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
          <input
            type="search"
            value={placeQuery}
            onChange={(event) => setPlaceQuery(event.target.value)}
            placeholder="Find visible state, district, village..."
            aria-label="Search currently visible map features"
            className="w-full bg-transparent text-[11px] text-slate-100 outline-none placeholder:text-slate-500 md:w-[210px]"
          />
        </form>

        <div className="flex items-center gap-2">
          <div className="basemap-switch flex items-center rounded-lg border p-1" aria-label="Basemap">
            {(['dark', 'satellite', 'positron'] as const).map((type) => (
              <button
                type="button"
                key={type}
                onClick={() => changeBasemap(type)}
                aria-pressed={basemap === type}
                className={`basemap-option ${basemap === type ? 'active' : ''}`}
              >
                {type === 'positron' ? 'Light' : type === 'dark' ? 'Dark' : 'Satellite'}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setShowManager((value) => !value)}
            aria-expanded={showManager}
            aria-label="Toggle layer manager"
            className={`manager-toggle ${showManager ? 'active' : ''}`}
          >
            <Layers3 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Layers</span>
            {showManager ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
          </button>
          <button
            type="button"
            onClick={() => setShowLayerInfo((value) => !value)}
            aria-expanded={showLayerInfo}
            aria-label="Toggle layer details"
            className={`manager-toggle ${showLayerInfo ? 'active' : ''}`}
          >
            <Info className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Details</span>
          </button>
        </div>
      </header>

      <div className="relative min-h-0 flex-1">
        <div ref={mapContainer} className="absolute inset-0" />

        {showManager && (
          <aside className="layer-manager absolute bottom-3 left-3 top-3 z-10 flex w-[min(300px,calc(100vw-24px))] flex-col overflow-hidden rounded-2xl border shadow-2xl md:left-4 md:top-4 md:w-[320px]">
            <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3.5">
              <div>
                <h2 className="text-xs font-semibold text-white">Layer manager</h2>
                <p className="mt-0.5 text-[10px] text-slate-500">Toggle and style map overlays</p>
              </div>
              <button type="button" onClick={() => setShowManager(false)} className="icon-button" aria-label="Close layer manager">
                <X className="h-4 w-4" />
              </button>
            </div>

            <label className="manager-search mx-3 mt-3 flex items-center gap-2 rounded-lg border px-2.5 py-2">
              <Search className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
              <input
                type="search"
                value={layerQuery}
                onChange={(event) => setLayerQuery(event.target.value)}
                placeholder="Filter layers..."
                aria-label="Filter available map layers"
                className="w-full bg-transparent text-[11px] text-slate-100 outline-none placeholder:text-slate-500"
              />
            </label>

            <div className="manager-list min-h-0 flex-1 overflow-y-auto px-2 pb-2 pt-2">
              {filteredLayers.map((item) => {
                const isVisible = activeIds.has(item.id);
                const activeLayer = activeLayers.find(({ layer: active }) => active.id === item.id);
                return (
                  <div key={item.id} className={`manager-item ${isVisible ? 'visible' : ''}`}>
                    <button
                      type="button"
                      onClick={() => toggleLayer(item)}
                      aria-pressed={isVisible}
                      className="manager-item-main flex w-full items-center gap-2.5 px-2.5 py-2 text-left"
                    >
                      <span className={`layer-checkbox ${isVisible ? 'checked' : ''}`}>
                        {isVisible && <Check className="h-3 w-3" />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[11px] font-medium text-slate-200">{item.name}</span>
                        <span className="mt-0.5 block truncate text-[9px] text-slate-500">{item.category}</span>
                      </span>
                      {isVisible ? <Eye className="h-3.5 w-3.5 text-cyan-300" /> : <EyeOff className="h-3.5 w-3.5 text-slate-600" />}
                    </button>
                    {isVisible && activeLayer && (
                      <label className="manager-opacity mx-3 mb-2 flex items-center gap-2.5">
                        <span className="shrink-0 text-[9px] text-slate-500">Opacity</span>
                        <input
                          type="range"
                          min="10"
                          max="100"
                          value={activeLayer.opacity}
                          onChange={(event) => setLayerOpacity(item.id, Number(event.target.value))}
                          aria-label={`${item.name} opacity`}
                          className="h-1 w-full cursor-pointer accent-cyan-400"
                        />
                        <span className="w-7 text-right text-[9px] tabular-nums text-slate-400">{activeLayer.opacity}%</span>
                      </label>
                    )}
                  </div>
                );
              })}
              {filteredLayers.length === 0 && (
                <p className="px-3 py-8 text-center text-[11px] text-slate-500">No matching layers.</p>
              )}
            </div>

            <div className="border-t border-white/[0.07] px-3 py-2.5 text-[9px] text-slate-500">
              {activeLayers.length} active · Click a feature to inspect its attributes
            </div>
            {activeLayers.length > 0 && (
              <div className="border-t border-white/[0.07] px-3 py-2.5">
                <div className="mb-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-500">Legend</div>
                <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                  {activeLayers.map(({ layer: item }) => (
                    <div key={item.id} className="flex max-w-full items-center gap-1.5" title={`${item.name}: ${item.geometryType || 'vector'} layer`}>
                      <span
                        className={`legend-swatch ${item.geometryType === 'Point' ? 'point' : item.geometryType === 'LineString' ? 'line' : 'polygon'}`}
                        style={{ backgroundColor: colorForCategory(item.category), borderColor: colorForCategory(item.category) }}
                      />
                      <span className="max-w-[155px] truncate text-[9px] text-slate-400">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
        )}

        <div className="map-controls absolute right-3 top-3 z-10 flex flex-col gap-1.5 md:right-4 md:top-4">
          <button type="button" onClick={() => mapRef.current?.zoomIn()} className="map-control" aria-label="Zoom in">
            <ZoomIn className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => mapRef.current?.zoomOut()} className="map-control" aria-label="Zoom out">
            <ZoomOut className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => mapRef.current?.flyTo({ center: [78.9629, 22.5937], zoom: 4.5 })} className="map-control" aria-label="Reset map to India">
            <LocateFixed className="h-4 w-4" />
          </button>
        </div>

        {selectedFeature && !showLayerInfo && (
          <section className="feature-inspector absolute bottom-3 right-3 z-10 max-h-[45%] w-[min(360px,calc(100vw-24px))] overflow-hidden rounded-2xl border shadow-2xl md:bottom-4 md:right-4">
            <div className="flex items-start justify-between border-b border-white/[0.07] px-4 py-3">
              <div className="min-w-0">
                <div className="mb-1 flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-cyan-300">
                  <Info className="h-3 w-3" /> Feature inspection
                </div>
                <h3 className="truncate text-xs font-semibold text-white">{selectedFeature.layerName}</h3>
              </div>
              <button type="button" onClick={() => setSelectedFeature(null)} className="icon-button" aria-label="Close feature details">
                <X className="h-4 w-4" />
              </button>
            </div>
            <dl className="max-h-44 space-y-0 overflow-y-auto px-4 py-2">
              {Object.entries(selectedFeature.properties).length ? (
                Object.entries(selectedFeature.properties).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-[minmax(75px,0.7fr)_minmax(0,1.3fr)] gap-3 border-b border-white/[0.05] py-1.5 text-[10px] last:border-0">
                    <dt className="truncate text-slate-500">{key}</dt>
                    <dd className="break-words text-slate-200">{String(value ?? '—')}</dd>
                  </div>
                ))
              ) : (
                <p className="py-3 text-[10px] text-slate-500">No attributes are available for this feature.</p>
              )}
            </dl>
          </section>
        )}

        {mapError && (
          <div role="status" className="map-error absolute bottom-4 left-1/2 z-20 flex max-w-[min(560px,calc(100vw-24px))] -translate-x-1/2 items-start gap-2 rounded-xl border px-3.5 py-2.5 text-[10px] shadow-xl">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span className="max-h-16 overflow-y-auto">{mapError}</span>
            <button type="button" onClick={() => setMapError('')} aria-label="Dismiss map message">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {showLayerInfo && (
          <div className="absolute inset-y-3 right-3 z-20 overflow-hidden rounded-2xl border shadow-2xl md:inset-y-4 md:right-4">
            <LayerDetailDrawer layer={layer} onClose={() => setShowLayerInfo(false)} />
          </div>
        )}

      </div>
    </div>
  );
};
