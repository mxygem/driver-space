import { useMemo } from 'react';
import { projectLatLng, MAP_VIEWBOX } from '../lib/geoProjection';
import { smoothPathD } from '../lib/smoothPath';
import { FREEWAYS, CENTRAL_AVENUE, CITIES, NEIGHBORHOODS } from '../data/phoenixMapData';
import './PhoenixMap.css';

function pathToSmoothD(path) {
  return smoothPathD(path.map(([lat, lng]) => projectLatLng(lat, lng)));
}

/**
 * Stylized Greater Phoenix map: major freeways, Central Ave, cities, and a
 * few informal neighborhood districts, plus optional live driver markers.
 */
export default function PhoenixMap({ markers = [], onMarkerClick, highlightMarkerId, className = '' }) {
  const freewayLines = useMemo(
    () => FREEWAYS.map((fwy) => ({ ...fwy, d: pathToSmoothD(fwy.path) })),
    []
  );
  const centralAveD = useMemo(() => pathToSmoothD(CENTRAL_AVENUE.path), []);

  return (
    <svg
      className={`phoenix-map ${className}`}
      viewBox={`0 0 ${MAP_VIEWBOX.width} ${MAP_VIEWBOX.height}`}
      role="img"
      aria-label="Stylized map of Greater Phoenix"
    >
      <rect className="map-background" x="0" y="0" width={MAP_VIEWBOX.width} height={MAP_VIEWBOX.height} />

      {NEIGHBORHOODS.map((n) => {
        const { x, y } = projectLatLng(n.lat, n.lng);
        return (
          <g key={n.id} className="neighborhood">
            <ellipse cx={x} cy={y} rx={n.rx} ry={n.ry} className="neighborhood-blob" />
            <text x={x} y={y + n.ry + 14} className="neighborhood-label" textAnchor="middle">
              {n.name}
            </text>
          </g>
        );
      })}

      {freewayLines.map((fwy) => (
        <path key={fwy.id} d={fwy.d} className={fwy.className} fill="none" />
      ))}

      <path d={centralAveD} className={CENTRAL_AVENUE.className} fill="none" />

      {CITIES.map((city) => {
        const { x, y } = projectLatLng(city.lat, city.lng);
        return (
          <g key={city.id} className={`city city-${city.size}`}>
            <circle cx={x} cy={y} r={city.size === 'lg' ? 6 : city.size === 'md' ? 4.5 : 3.5} className="city-dot" />
            <text x={x + 8} y={y + 4} className="city-label">
              {city.name}
            </text>
          </g>
        );
      })}

      {markers.map((marker) => {
        const { x, y } = projectLatLng(marker.lat, marker.lng);
        const isHighlighted = marker.id === highlightMarkerId;
        return (
          <g
            key={marker.id}
            className={`driver-marker ${isHighlighted ? 'driver-marker-highlight' : ''}`}
            transform={`translate(${x}, ${y})`}
            onClick={() => onMarkerClick && onMarkerClick(marker)}
            style={{ cursor: onMarkerClick ? 'pointer' : 'default' }}
          >
            <circle r="14" className="driver-marker-pulse" />
            <circle r="7" className="driver-marker-dot" />
            {marker.name && (
              <text y="-18" textAnchor="middle" className="driver-marker-label">
                {marker.name}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
