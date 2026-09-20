const EARTH_RADIUS_METERS = 6378137;

// Returns a uniformly-random point within `radiusMeters` of (lat, lng).
// Used to blur a driver's exact GPS fix before it's shown on the public map.
function jitterCoordinate(lat, lng, radiusMeters) {
  const u = Math.random();
  const v = Math.random();
  const distance = radiusMeters * Math.sqrt(u);
  const angle = 2 * Math.PI * v;

  const dx = distance * Math.cos(angle);
  const dy = distance * Math.sin(angle);

  const dLat = (dy / EARTH_RADIUS_METERS) * (180 / Math.PI);
  const dLng = (dx / (EARTH_RADIUS_METERS * Math.cos((Math.PI * lat) / 180))) * (180 / Math.PI);

  return { lat: lat + dLat, lng: lng + dLng };
}

module.exports = { jitterCoordinate };
