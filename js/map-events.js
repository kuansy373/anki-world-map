import { LAYER_ORDER } from './config.js';
import { getFeatureId, getRegion } from './utils.js';
import { getDisplayName, getRegionDisplayName } from './lang.js';
import { regionColors } from './regions.js';
import { geojsonData, filledFeatures, fillFeature, clearFeature } from './map-layers.js';

// maplibregl → CDN（グローバル）

let map;
let _updateProgress;
let _getCurrentRegionQuery;
const openCountryPopups = new Map();

// ==================
// ユーティリティ
// ==================

function isCoveredByUpperLayer(key, point) {
  const upperLayers = LAYER_ORDER.slice(LAYER_ORDER.indexOf(key) + 1).map(k => `${k}-fill`);
  return map.queryRenderedFeatures(point, { layers: upperLayers }).length > 0;
}

// ==================
// ポップアップ
// ==================

function createResetPopup(key, id, name, region, lngLat) {
  if (openCountryPopups.has(id)) {
    openCountryPopups.get(id).popup.remove();
    openCountryPopups.delete(id);
    return;
  }

  const popup = new maplibregl.Popup()
    .setLngLat(lngLat)
    .setHTML(buildCountryPopupHTML(name, region, id))
    .addTo(map);

  openCountryPopups.set(id, { popup, key, name, region });
  popup.on('close', () => openCountryPopups.delete(id));

  setTimeout(() => {
    popup.getElement().querySelector('.popup-reset-btn')
      ?.addEventListener('click', () => {
        clearFeature(key, id);
        popup.remove();
        _updateProgress(_getCurrentRegionQuery());
      });
  }, 0);
}

function buildCountryPopupHTML(name, region, id) {
  return `
    <div class="popup-content">
      <div class="popup-name">${getDisplayName(name)}</div>
      <div class="popup-region">
        <span>${getRegionDisplayName(region)}</span>
        <button class="popup-reset-btn" data-feature-id="${id}"></button>
      </div>
    </div>
  `;
}

// ==================
// クリックイベント
// ==================

function toggleFeatureFill(key, e) {
  const feature   = e.features[0];
  const props     = feature.properties;
  const featureId = getFeatureId(key, feature);
  const name      = props.name || 'Unknown';
  const region    = getRegion(props, key);
  const fillColor = regionColors[region] || regionColors.Default;

  if (!filledFeatures[featureId]) {
    fillFeature(key, featureId, fillColor);
    _updateProgress(_getCurrentRegionQuery());
  } else {
    createResetPopup(key, featureId, name, region, e.lngLat);
  }
}

function registerCountryClickEvents() {
  LAYER_ORDER.forEach(key => {
    map.on('click', `${key}-fill`, e => {
      if (isCoveredByUpperLayer(key, e.point)) return;
      toggleFeatureFill(key, e);
    });

    map.on('mouseenter', `${key}-fill`, () => { map.getCanvas().style.cursor = 'pointer'; });
    map.on('mouseleave', `${key}-fill`, () => { map.getCanvas().style.cursor = ''; });
  });
}

// ==================
// 経線・緯線クリックイベント
// ==================

// Map: key=uniqueId, value={ layerId, sourceId }
const highlightedLines = new Map();

function getLineInfo(layerId, feature) {
  const isMeridian = layerId === 'meridians-line-hitarea';
  const isDateLine = layerId === 'dateLine-line-hitarea';

  if (isDateLine) {
    return {
      uniqueId: 'date_line',
      label: getDisplayName('International Date Line'),
      highlightFeature: geojsonData.dateLine.features[0]
    };
  }

  const coords = feature.geometry.coordinates;
  const degree = Math.round(isMeridian ? coords[0][0] : coords[0][1]);
  const uniqueId = (isMeridian ? 'lon_' : 'lat_') + degree;
  const label = getDisplayName(isMeridian ? 'Lng: ' : 'Lat: ') + degree + '°';
  const highlightFeature = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: isMeridian
        ? [[degree, -85.0511], [degree, 85.0511]]
        : [[-180, degree], [180, degree]]
    }
  };

  return { uniqueId, label, highlightFeature };
}

function registerLineClickEvents() {
  const topLayers = LAYER_ORDER.flatMap(k => [`${k}-fill`, `${k}-line`]);
  ['meridians-line-hitarea', 'parallels-line-hitarea', 'dateLine-line-hitarea'].forEach(layerId => {
    const isDateLine = layerId === 'dateLine-line-hitarea';

    map.on('click', layerId, e => {
      const topFeatures = map.queryRenderedFeatures(e.point, { layers: topLayers });
      if (topFeatures.length > 0 || !e.features.length) return;

      if (isDateLine) {
        const meridianFeatures = map.queryRenderedFeatures(e.point, { layers: ['meridians-line-hitarea'] });
        if (meridianFeatures.length > 0) return;
      }

      const { uniqueId, label, highlightFeature } = getLineInfo(layerId, e.features[0]);
      const hlLayerId  = `highlight-line-${uniqueId}`;
      const hlSourceId = `highlight-source-${uniqueId}`;

      if (highlightedLines.has(uniqueId)) {
        if (map.getLayer(hlLayerId))   map.removeLayer(hlLayerId);
        if (map.getSource(hlSourceId)) map.removeSource(hlSourceId);
        highlightedLines.delete(uniqueId);
        return;
      }

      map.addSource(hlSourceId, { type: 'geojson', data: highlightFeature });
      map.addLayer({ id: hlLayerId, type: 'line', source: hlSourceId, paint: { 'line-color': '#ff7171', 'line-width': 1.5 } });
      map.moveLayer(hlLayerId);
      const linePopup = new maplibregl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(`<strong>${label}</strong>`)
        .addTo(map);
      highlightedLines.set(uniqueId, { layerId: hlLayerId, sourceId: hlSourceId, label, lngLat: e.lngLat, popup: linePopup });
    });

    map.on('mousemove', layerId, e => {
      const topFeatures = map.queryRenderedFeatures(e.point, { layers: topLayers });
      map.getCanvas().style.cursor = topFeatures.length === 0 ? 'pointer' : '';
    });

    map.on('mouseleave', layerId, () => { map.getCanvas().style.cursor = ''; });
  });
}

export function refreshOpenPopups() {
  for (const [id, { popup, key, name, region }] of openCountryPopups) {
    popup.setHTML(buildCountryPopupHTML(name, region, id));
    popup.getElement().querySelector('.popup-reset-btn')
      ?.addEventListener('click', () => {
        clearFeature(key, id);
        popup.remove();
        _updateProgress(_getCurrentRegionQuery());
      });
  }

  for (const [uniqueId, info] of highlightedLines) {
    if (!info.popup) continue;
    const newLabel = relabelLine(uniqueId);
    info.popup.setHTML(`<strong>${newLabel}</strong>`);
    info.label = newLabel;
  }
}

function relabelLine(uniqueId) {
  if (uniqueId === 'date_line') return getDisplayName('International Date Line');
  if (uniqueId.startsWith('lon_')) {
    const deg = uniqueId.slice(4);
    return getDisplayName('Lng: ') + deg + '°';
  }
  if (uniqueId.startsWith('lat_')) {
    const deg = uniqueId.slice(4);
    return getDisplayName('Lat: ') + deg + '°';
  }
  return uniqueId;
}

// ==================
// 初期化（エントリーポイント）
// ==================

export function initMapEvents(_map, {
  updateProgress,
  getCurrentRegionQuery,
}) {
  map                  = _map;
  _updateProgress      = updateProgress;
  _getCurrentRegionQuery = getCurrentRegionQuery;
}

export function registerClickEvents() {
  registerCountryClickEvents();
  registerLineClickEvents();
}
