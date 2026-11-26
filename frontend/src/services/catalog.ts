import { PMTileLayerItem } from '../types';
import rawCatalog from './pmtilesCatalog.json';

// Curated layer specifics mapping vintage, feature counts, and geometry types
const LAYER_ENRICHMENTS: Record<string, Partial<PMTileLayerItem>> = {
  lgd_states: {
    vintage: '2024',
    attribution: 'Survey of India / LGD',
    featureCount: '36 states & UTs',
    geometryType: 'MultiPolygon',
    description: 'Official state and union territory boundaries of India from Local Government Directory.'
  },
  lgd_districts: {
    vintage: '2024',
    attribution: 'LGD',
    featureCount: '785 districts',
    geometryType: 'MultiPolygon',
    description: 'Every district in India from the Local Government Directory (LGD). 785 polygons joined with state boundaries.'
  },
  india_boundary_999f09a2: {
    vintage: '2024',
    attribution: 'LGD',
    featureCount: '1 country boundary',
    geometryType: 'MultiPolygon',
    description: 'National outer boundary polygon of the Republic of India.'
  },
  lgd_subdistricts: {
    vintage: '2024',
    attribution: 'LGD',
    featureCount: '6,471 sub-districts (Tehsils)',
    geometryType: 'MultiPolygon',
    description: 'Sub-district / Taluk / Tehsil administrative boundaries across Indian states.'
  },
  lgd_blocks_c00ac144: {
    vintage: '2024',
    attribution: 'LGD',
    featureCount: '7,146 community development blocks',
    geometryType: 'MultiPolygon',
    description: 'Community Development (CD) Blocks administrative boundaries.'
  },
  lgd_panchayats_f71f9f17: {
    vintage: '2024',
    attribution: 'LGD',
    featureCount: '3,19,287 gram panchayats',
    geometryType: 'MultiPolygon',
    description: 'Gram Panchayat administrative boundaries under Panchayati Raj.'
  },
  lgd_villages_c08c0de4: {
    vintage: '2024',
    attribution: 'LGD',
    featureCount: '5,84,615 villages',
    geometryType: 'MultiPolygon',
    description: 'Comprehensive village boundaries across India.'
  },
  sbm_ulbs: {
    vintage: '2024',
    attribution: 'MoHUA / Swachh Bharat Mission',
    featureCount: '4,800+ ULBs',
    geometryType: 'MultiPolygon',
    description: 'Urban Local Bodies (ULBs) and Municipalities across India.'
  },
  pmgsy_habitations_57ce07aa: {
    vintage: '2023',
    attribution: 'NRRDA / PMGSY',
    featureCount: 'Habitations',
    geometryType: 'Point',
    description: 'Rural habitations connected under Pradhan Mantri Gram Sadak Yojana.'
  },
  wris_rivers: {
    vintage: '2023',
    attribution: 'India-WRIS / CWC',
    featureCount: 'All major rivers',
    geometryType: 'LineString',
    description: 'National river stream networks and perennial river lines.'
  },
  wris_river_polygons: {
    vintage: '2023',
    attribution: 'India-WRIS / CWC',
    featureCount: 'River basins & floodplains',
    geometryType: 'MultiPolygon',
    description: 'River banks, wide channels, and perennial water flow polygons.'
  },
  wris_basin: {
    vintage: '2023',
    attribution: 'India-WRIS / CWC',
    featureCount: '25 major basins',
    geometryType: 'MultiPolygon',
    description: 'Major river drainage basin polygons across India.'
  },
  wris_subbasin: {
    vintage: '2023',
    attribution: 'India-WRIS / CWC',
    featureCount: '100+ sub-basins',
    geometryType: 'MultiPolygon',
    description: 'River sub-basin subdivisions for hydrologic planning.'
  },
  wris_waterbodies_036baf92: {
    vintage: '2023',
    attribution: 'India-WRIS / CWC',
    featureCount: '5,00,000+ waterbodies',
    geometryType: 'MultiPolygon',
    description: 'Complete census of tanks, ponds, and surface water bodies.'
  },
  wris_lakes: {
    vintage: '2023',
    attribution: 'India-WRIS',
    featureCount: 'Lakes & lagoons',
    geometryType: 'MultiPolygon',
    description: 'Inland freshwater and brackish water lakes.'
  },
  wris_reservoirs: {
    vintage: '2023',
    attribution: 'India-WRIS',
    featureCount: 'Major reservoirs',
    geometryType: 'MultiPolygon',
    description: 'Storage reservoirs behind major and medium dams.'
  },
  wris_canals: {
    vintage: '2023',
    attribution: 'India-WRIS',
    featureCount: 'Irrigation canals',
    geometryType: 'LineString',
    description: 'Main irrigation canals, distributaries, and branches.'
  },
  wris_watershed: {
    vintage: '2023',
    attribution: 'India-WRIS',
    featureCount: 'Micro-watersheds',
    geometryType: 'MultiPolygon',
    description: 'Watershed delineations for soil and water conservation.'
  },
  bharatmaps_dams: {
    vintage: '2024',
    attribution: 'Central Water Commission / Bharatmaps',
    featureCount: '5,300+ dams',
    geometryType: 'Point',
    description: 'National Register of Large Dams (NRLD) point locations.'
  },
  airports_95354cb6: {
    vintage: '2024',
    attribution: 'AAI / DGCA',
    featureCount: '150+ operational airports',
    geometryType: 'Point',
    description: 'Civilian and military airports, airstrips, and heliports.'
  },
  gatishakti_morth_national_highways_aa8ad6a8: {
    vintage: '2024',
    attribution: 'PM GatiShakti / MoRTH',
    featureCount: 'National Highway grid',
    geometryType: 'LineString',
    description: 'Complete National Highways network under MoRTH & NHAI.'
  },
  ir_tracks: {
    vintage: '2024',
    attribution: 'Indian Railways / CRIS',
    featureCount: 'All railway lines',
    geometryType: 'LineString',
    description: 'Indian Railways broad gauge, meter gauge, and electrified routes.'
  },
  ir_stations_merged_0707fb2d: {
    vintage: '2024',
    attribution: 'Indian Railways / CRIS',
    featureCount: '8,000+ railway stations',
    geometryType: 'Point',
    description: 'Railway passenger stations and junctions across India.'
  },
  pmgsy_roads_ef6db65b: {
    vintage: '2024',
    attribution: 'PMGSY / MoRD',
    featureCount: 'Rural roads network',
    geometryType: 'LineString',
    description: 'Pradhan Mantri Gram Sadak Yojana rural road connections.'
  },
  urban_rail_lines_825e3a50: {
    vintage: '2024',
    attribution: 'MoHUA / Metro Rail',
    featureCount: 'Metro & RRTS lines',
    geometryType: 'LineString',
    description: 'Operational and under-construction Metro rail and RRTS alignments.'
  },
  ncog_udise_schools: {
    vintage: '2024',
    attribution: 'Ministry of Education / UDISE+',
    featureCount: '14,89,115 schools',
    geometryType: 'Point',
    description: 'Comprehensive geolocation of all government and private schools.'
  },
  nhp_hospital_directory_2025: {
    vintage: '2025',
    attribution: 'National Health Portal (NHP)',
    featureCount: '35,000+ hospitals',
    geometryType: 'Point',
    description: 'Public, private, and trust hospitals across all states.'
  },
  india_health_facilities_nic_fc08f98d: {
    vintage: '2024',
    attribution: 'National Informatics Centre / MoHFW',
    featureCount: 'Health centres & PHCs',
    geometryType: 'Point',
    description: 'Primary Health Centres (PHC), CHCs, and sub-centres.'
  },
  gatishakti_wildlife_sanctuaries_and_national_parks: {
    vintage: '2024',
    attribution: 'MoEFCC / Wildlife Institute of India',
    featureCount: '106 NPs & 560+ Sanctuaries',
    geometryType: 'MultiPolygon',
    description: 'Protected Areas including National Parks, Wildlife Sanctuaries, and Tiger Reserves.'
  },
  bharatmaps_parivesh_crz2019_regulatory_zones: {
    vintage: '2024',
    attribution: 'MoEFCC / PARIVESH',
    featureCount: 'Coastal zones',
    geometryType: 'MultiPolygon',
    description: 'Coastal Regulation Zone (CRZ I, II, III, IV) boundaries under CRZ Notification 2019.'
  },
  fsi_beats_49e7afdf: {
    vintage: '2024',
    attribution: 'Forest Survey of India (FSI)',
    featureCount: 'Forest beats',
    geometryType: 'MultiPolygon',
    description: 'Forest administration beat-level boundaries for field surveillance.'
  },
  fsi_ranges_a8999d0f: {
    vintage: '2024',
    attribution: 'Forest Survey of India (FSI)',
    featureCount: 'Forest ranges',
    geometryType: 'MultiPolygon',
    description: 'Forest range boundaries under territorial forest divisions.'
  },
  gsi_landslide_inventory: {
    vintage: '2024',
    attribution: 'Geological Survey of India (GSI)',
    featureCount: '80,000+ landslide polygons',
    geometryType: 'MultiPolygon',
    description: 'National landslide susceptibility and historical event mapping.'
  },
  corestack_lulc_blocks_2023_24_c752e481: {
    vintage: '2023-24',
    attribution: 'CoRE Stack / FES',
    featureCount: '7,146 Blocks',
    geometryType: 'MultiPolygon',
    description: 'Land Use Land Cover (LULC) statistics aggregated at block level.'
  },
  agro_climatic_zones: {
    vintage: '2023',
    attribution: 'Planning Commission / ICAR',
    featureCount: '15 zones',
    geometryType: 'MultiPolygon',
    description: 'Planning Commission 15 Agro-Climatic Zones based on rainfall and climate.'
  },
  agro_ecological_zones: {
    vintage: '2023',
    attribution: 'NBSS&LUP / ICAR',
    featureCount: '20 sub-regions',
    geometryType: 'MultiPolygon',
    description: 'National Bureau of Soil Survey 20 Agro-Ecological Regions.'
  }
};

export const PMTILES_BASE_URL =
  import.meta.env.VITE_PMTILES_BASE_URL ||
  'https://huggingface.co/datasets/suyashbhosale/PMTiles/resolve/main';

export function getPmtilesUrl(fileName: string): string {
  return `${PMTILES_BASE_URL.replace(/\/+$/, '')}/${encodeURIComponent(fileName)}`;
}

export const PMTILES_CATALOG: PMTileLayerItem[] = (rawCatalog as any[]).map(item => {
  const enrichment = LAYER_ENRICHMENTS[item.id] || {};
  
  // Infer geometry type if not manually set
  let geom: 'Polygon' | 'MultiPolygon' | 'LineString' | 'Point' = 'MultiPolygon';
  const lowerId = item.id.toLowerCase();
  if (lowerId.includes('river') || lowerId.includes('highway') || lowerId.includes('road') || lowerId.includes('track') || lowerId.includes('canal') || lowerId.includes('lines') || lowerId.includes('tunnel')) {
    geom = 'LineString';
  } else if (lowerId.includes('airport') || lowerId.includes('station') || lowerId.includes('bus') || lowerId.includes('hospital') || lowerId.includes('school') || lowerId.includes('health') || lowerId.includes('dam') || lowerId.includes('habitation')) {
    geom = 'Point';
  }

  return {
    ...item,
    vintage: enrichment.vintage,
    attribution:
      enrichment.attribution ||
      (item.attribution === 'Government of India / Open Data'
        ? 'Source attribution not verified'
        : item.attribution || 'Source attribution not specified'),
    featureCount: enrichment.featureCount,
    geometryType: enrichment.geometryType || geom,
    description:
      enrichment.description ||
      (!item.description || item.description.startsWith('/tmp/') || item.description === item.sourceLayer
        ? `A map-ready layer for ${item.name}. A detailed dataset description is not available.`
        : item.description),
    downloads: {
      pmtiles: getPmtilesUrl(item.fileName)
    }
  };
});

export const CATEGORIES: { id: PMTileLayerItem['category']; label: string; count: number }[] = [
  { id: 'Boundaries', label: 'Boundaries', count: 0 },
  { id: 'Environment', label: 'Environment', count: 0 },
  { id: 'Water', label: 'Water', count: 0 },
  { id: 'Agriculture & land use', label: 'Agriculture & land use', count: 0 },
  { id: 'Transport & mobility', label: 'Transport & mobility', count: 0 },
  { id: 'Health & education', label: 'Health & education', count: 0 }
];

// Compute exact category counts
CATEGORIES.forEach(cat => {
  cat.count = PMTILES_CATALOG.filter(layer => layer.category === cat.id).length;
});
