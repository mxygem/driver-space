// Rough bounding box for Greater Phoenix, used to project real GPS
// coordinates onto the stylized map's SVG canvas. This is intentionally a
// simple equirectangular fit (good enough at this scale/latitude) rather
// than a true map projection.
export const MAP_BOUNDS = {
  north: 33.85, // Anthem / Cave Creek / Carefree
  south: 33.15, // Sun Lakes / Queen Creek
  west: -112.6, // Buckeye
  east: -111.55, // Apache Junction / Fountain Hills
};

export const MAP_VIEWBOX = { width: 1100, height: 880 };

export function projectLatLng(lat, lng) {
  const { north, south, west, east } = MAP_BOUNDS;
  const x = ((lng - west) / (east - west)) * MAP_VIEWBOX.width;
  const y = ((north - lat) / (north - south)) * MAP_VIEWBOX.height;
  return { x, y };
}

export function isWithinBounds(lat, lng) {
  const { north, south, west, east } = MAP_BOUNDS;
  return lat <= north && lat >= south && lng <= east && lng >= west;
}
