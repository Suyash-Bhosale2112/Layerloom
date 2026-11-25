import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import * as pmtiles from 'pmtiles';
import { ArrowLeft, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { PMTileLayerItem } from '../../types';
import { getPmtilesUrl } from '../../services/catalog';
import { LayerDetailDrawer } from './LayerDetailDrawer';

interface MapViewProps {
  layer: PMTileLayerItem;
  onBack: () => void;
  allLayers?: PMTileLayerItem[];
  onSwitchLayer?: (layer: PMTileLayerItem) => void;
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

export const MapView: React.FC<MapViewProps> = ({
  layer,
  onBack
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [basemap, setBasemap] = useState<'dark' | 'satellite' | 'positron'>('dark');
  const [showDrawer, setShowDrawer] = useState(true);
  const [hoveredProperties, setHoveredProperties] = useState<Record<string, any> | null>(null);

  // Setup MapLibre map and PMTiles protocol
  useEffect(() => {
    if (!mapContainer.current) return;

    // Register PMTiles protocol if not already registered
    const protocol = new pmtiles.Protocol();
    maplibregl.addProtocol('pmtiles', protocol.tile);

    const initialStyle: any = basemap === 'satellite' ? SATELLITE_STYLE : BASEMAP_URLS[basemap];

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: initialStyle,
      center: [78.9629, 22.5937], // Center of India
      zoom: 4.5,
      pitch: 0,
      attributionControl: false
    });

    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');
    mapRef.current = map;

    map.on('load', () => {
      addLayerToMap(map, layer);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update layer when layer or basemap changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (map.isStyleLoaded()) {
      addLayerToMap(map, layer);
    } else {
      map.once('load', () => addLayerToMap(map, layer));
    }
  }, [layer]);

  const changeBasemap = (type: 'dark' | 'satellite' | 'positron') => {
    setBasemap(type);
    const map = mapRef.current;
    if (!map) return;

    const targetStyle: any = type === 'satellite' ? SATELLITE_STYLE : BASEMAP_URLS[type];
    map.setStyle(targetStyle);

    map.once('style.load', () => {
      addLayerToMap(map, layer);
    });
  };

  const addLayerToMap = (map: maplibregl.Map, targetLayer: PMTileLayerItem) => {
    const sourceId = `pmtiles-source-${targetLayer.id}`;
    const pmtilesUrl = targetLayer.downloads?.pmtiles || getPmtilesUrl(targetLayer.fileName);

    // Remove existing layerloom layers if any
    const existingLayers = [
      'layerloom-fill',
      'layerloom-line',
      'layerloom-point'
    ];
    existingLayers.forEach((l) => {
      if (map.getLayer(l)) map.removeLayer(l);
    });

    // Remove old source if different
    if (map.getSource(sourceId)) {
      map.removeSource(sourceId);
    }

    try {
      map.addSource(sourceId, {
        type: 'vector',
        url: `pmtiles://${pmtilesUrl}`
      });

      const srcLayer = targetLayer.sourceLayer;
      const geomType = targetLayer.geometryType || 'MultiPolygon';

      if (geomType === 'Point') {
        map.addLayer({
          id: 'layerloom-point',
          type: 'circle',
          source: sourceId,
          'source-layer': srcLayer,
          paint: {
            'circle-color': '#f97316',
            'circle-radius': 4.5,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#ffffff',
            'circle-opacity': 0.85
          }
        });
      } else if (geomType === 'LineString') {
        map.addLayer({
          id: 'layerloom-line',
          type: 'line',
          source: sourceId,
          'source-layer': srcLayer,
          paint: {
            'line-color': '#06b6d4',
            'line-width': 2,
            'line-opacity': 0.8
          }
        });
      } else {
        // Polygons (Boundaries, Environment, Waterbodies)
        map.addLayer({
          id: 'layerloom-fill',
          type: 'fill',
          source: sourceId,
          'source-layer': srcLayer,
          paint: {
            'fill-color': '#0284c7',
            'fill-opacity': 0.22
          }
        });

        map.addLayer({
          id: 'layerloom-line',
          type: 'line',
          source: sourceId,
          'source-layer': srcLayer,
          paint: {
            'line-color': '#38bdf8',
            'line-width': 1.2,
            'line-opacity': 0.75
          }
        });
      }

      // Hover interaction on layer
      const activeInteractionLayer = geomType === 'Point' ? 'layerloom-point' : geomType === 'LineString' ? 'layerloom-line' : 'layerloom-fill';

      map.on('mousemove', activeInteractionLayer, (e) => {
        if (e.features && e.features[0]) {
          map.getCanvas().style.cursor = 'pointer';
          setHoveredProperties(e.features[0].properties);
        }
      });

      map.on('mouseleave', activeInteractionLayer, () => {
        map.getCanvas().style.cursor = '';
        setHoveredProperties(null);
      });
    } catch (err) {
      console.error('Error adding PMTiles layer:', err);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0c0d0f] overflow-hidden relative">
      {/* Top Navbar */}
      <header className="h-14 bg-[#121417] border-b border-neutral-800 px-4 flex items-center justify-between z-30 select-none">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Catalog</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
            <h1 className="text-sm font-bold text-white tracking-wide truncate max-w-sm">
              {layer.name}
            </h1>
            <span className="text-xs text-neutral-400 font-mono hidden md:inline">
              ({layer.attribution})
            </span>
          </div>
        </div>

        {/* Map Actions */}
        <div className="flex items-center gap-2">
          {/* Basemap Switcher */}
          <div className="flex items-center bg-[#181a1f] p-1 rounded-lg border border-neutral-800 text-xs">
            <button
              onClick={() => changeBasemap('dark')}
              className={`px-2.5 py-1 rounded transition-colors ${
                basemap === 'dark' ? 'bg-orange-500 text-white font-semibold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Dark
            </button>
            <button
              onClick={() => changeBasemap('satellite')}
              className={`px-2.5 py-1 rounded transition-colors ${
                basemap === 'satellite' ? 'bg-orange-500 text-white font-semibold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => changeBasemap('positron')}
              className={`px-2.5 py-1 rounded transition-colors ${
                basemap === 'positron' ? 'bg-orange-500 text-white font-semibold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Light
            </button>
          </div>

          <button
            onClick={() => setShowDrawer(!showDrawer)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              showDrawer
                ? 'bg-orange-500 text-white border-orange-500'
                : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700'
            }`}
          >
            About Layer
          </button>
        </div>
      </header>

      {/* Map Body Area */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Left Drawer */}
        {showDrawer && (
          <LayerDetailDrawer layer={layer} onClose={() => setShowDrawer(false)} />
        )}

        {/* Map Canvas */}
        <div ref={mapContainer} className="flex-1 w-full h-full" />

        {/* Live Hover Attribute Inspector */}
        {hoveredProperties && (
          <div className="absolute bottom-6 left-6 max-w-sm bg-[#121417]/95 backdrop-blur-md border border-neutral-700 rounded-xl p-4 shadow-2xl z-20 text-xs text-neutral-200 pointer-events-none">
            <div className="text-[10px] font-semibold text-orange-400 uppercase tracking-wider mb-1">
              Inspecting Feature
            </div>
            <div className="font-semibold text-white text-sm mb-2">
              {hoveredProperties.Dist || hoveredProperties.name || hoveredProperties.STATE || hoveredProperties.NAME || 'Feature Details'}
            </div>
            <div className="max-h-40 overflow-y-auto space-y-1 font-mono text-[11px]">
              {Object.entries(hoveredProperties).slice(0, 6).map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-neutral-800/80 py-0.5">
                  <span className="text-neutral-400">{k}:</span>
                  <span className="text-neutral-200 truncate ml-2 max-w-[180px]">{String(v)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Map Controls */}
        <div className="absolute right-4 top-4 flex flex-col gap-1.5 z-20">
          <button
            onClick={() => mapRef.current?.zoomIn()}
            className="p-2 bg-[#121417]/90 hover:bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200 transition-colors shadow-lg"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => mapRef.current?.zoomOut()}
            className="p-2 bg-[#121417]/90 hover:bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200 transition-colors shadow-lg"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => mapRef.current?.flyTo({ center: [78.9629, 22.5937], zoom: 4.5 })}
            className="p-2 bg-[#121417]/90 hover:bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200 transition-colors shadow-lg"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
