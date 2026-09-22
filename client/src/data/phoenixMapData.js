// Simplified/stylized road geometry for Greater Phoenix. Waypoints are
// approximate real-world lat/lng, hand-simplified for a clean, legible
// transit-map style rendering rather than survey accuracy.

export const FREEWAYS = [
  {
    id: 'i10',
    label: 'I-10',
    className: 'freeway freeway-interstate',
    path: [
      [33.43, -112.6],
      [33.43, -112.5],
      [33.432, -112.4],
      [33.437, -112.3],
      [33.445, -112.2],
      [33.448, -112.1],
      [33.448, -112.05],
      [33.43, -111.99],
      [33.38, -111.965],
      [33.3, -111.95],
      [33.22, -111.93],
      [33.15, -111.9],
    ],
  },
  {
    id: 'i17',
    label: 'I-17',
    className: 'freeway freeway-interstate',
    path: [
      [33.85, -112.15],
      [33.78, -112.155],
      [33.72, -112.15],
      [33.65, -112.135],
      [33.58, -112.115],
      [33.51, -112.1],
      [33.448, -112.096],
    ],
  },
  {
    id: 'us60-grand',
    label: 'US-60 (Grand Ave)',
    className: 'freeway freeway-us',
    path: [
      [33.448, -112.1],
      [33.49, -112.17],
      [33.55, -112.25],
      [33.6, -112.32],
      [33.65, -112.4],
      [33.7, -112.47],
      [33.74, -112.52],
    ],
  },
  {
    id: 'us60-superstition',
    label: 'US-60 (Superstition Fwy)',
    className: 'freeway freeway-us',
    path: [
      [33.4, -111.93],
      [33.415, -111.83],
      [33.415, -111.7],
      [33.415, -111.58],
      [33.42, -111.52],
    ],
  },
  {
    // Agua Fria (west) + Pima/Price (east) Freeways: a single, mostly
    // straight-sided loop open at the south, not a smooth oval.
    id: 'loop101',
    label: 'Loop 101',
    className: 'freeway freeway-loop',
    shape: 'rounded',
    path: [
      [33.43, -112.245], // south end, near I-10 (Avondale)
      [33.665, -112.245], // NW corner
      [33.685, -112.03], // NE corner (top, near I-17)
      [33.46, -111.875], // SE corner (east side, near Scottsdale/Tempe)
      [33.31, -111.98], // south end, near I-10 (Ahwatukee)
    ],
  },
  {
    // Red Mountain + Santan + South Mountain Freeways: one continuous
    // rounded-rectangle loop open at the north/west, closing back near I-10.
    id: 'loop202',
    label: 'Loop 202',
    className: 'freeway freeway-loop',
    shape: 'rounded',
    path: [
      [33.4, -111.93], // west end, near I-10/US-60 (Tempe)
      [33.42, -111.76], // NE corner
      [33.2, -111.78], // SE corner
      [33.2, -111.97], // SW corner
      [33.41, -112.14], // north end, near I-10 (Laveen)
    ],
  },
  {
    id: 'sr51',
    label: 'SR-51',
    className: 'freeway freeway-state',
    path: [
      [33.448, -112.05],
      [33.5, -112.045],
      [33.56, -112.035],
      [33.62, -112.02],
      [33.655, -112.0],
    ],
  },
];

export const CENTRAL_AVENUE = {
  id: 'central-ave',
  label: 'Central Ave',
  className: 'central-avenue',
  path: [
    [33.64, -112.074],
    [33.55, -112.074],
    [33.4484, -112.074],
    [33.36, -112.074],
    [33.3, -112.074],
  ],
};

export const CITIES = [
  { id: 'phoenix', name: 'Phoenix', lat: 33.4484, lng: -112.074, size: 'lg' },
  { id: 'scottsdale', name: 'Scottsdale', lat: 33.4942, lng: -111.9261, size: 'md' },
  { id: 'tempe', name: 'Tempe', lat: 33.4255, lng: -111.94, size: 'md' },
  { id: 'mesa', name: 'Mesa', lat: 33.4152, lng: -111.8315, size: 'md' },
  { id: 'chandler', name: 'Chandler', lat: 33.3062, lng: -111.8413, size: 'md' },
  { id: 'gilbert', name: 'Gilbert', lat: 33.3528, lng: -111.789, size: 'md' },
  { id: 'glendale', name: 'Glendale', lat: 33.5387, lng: -112.186, size: 'md' },
  { id: 'peoria', name: 'Peoria', lat: 33.5806, lng: -112.2374, size: 'sm' },
  { id: 'surprise', name: 'Surprise', lat: 33.6292, lng: -112.3679, size: 'sm' },
  { id: 'avondale', name: 'Avondale', lat: 33.46, lng: -112.32, size: 'sm' },
  { id: 'goodyear', name: 'Goodyear', lat: 33.42, lng: -112.39, size: 'sm' },
  { id: 'buckeye', name: 'Buckeye', lat: 33.4703, lng: -112.5838, size: 'sm' },
  { id: 'queencreek', name: 'Queen Creek', lat: 33.2487, lng: -111.6343, size: 'sm' },
  { id: 'apachejunction', name: 'Apache Junction', lat: 33.4151, lng: -111.5495, size: 'sm' },
  { id: 'fountainhills', name: 'Fountain Hills', lat: 33.6117, lng: -111.7174, size: 'sm' },
  { id: 'paradisevalley', name: 'Paradise Valley', lat: 33.5312, lng: -111.9647, size: 'sm' },
  { id: 'cavecreek', name: 'Cave Creek', lat: 33.8333, lng: -111.9509, size: 'sm' },
];

// Larger, informal neighborhood/district areas rendered as soft blobs.
export const NEIGHBORHOODS = [
  { id: 'downtown-phx', name: 'Downtown Phoenix', lat: 33.4484, lng: -112.074, rx: 30, ry: 24 },
  { id: 'arcadia', name: 'Arcadia', lat: 33.5, lng: -111.99, rx: 26, ry: 20 },
  { id: 'ahwatukee', name: 'Ahwatukee', lat: 33.335, lng: -112.0, rx: 30, ry: 20 },
  { id: 'old-town-scottsdale', name: 'Old Town Scottsdale', lat: 33.4942, lng: -111.9261, rx: 22, ry: 18 },
  { id: 'sun-city', name: 'Sun City', lat: 33.64, lng: -112.31, rx: 24, ry: 18 },
  { id: 'north-mountain', name: 'North Mountain', lat: 33.6, lng: -112.13, rx: 24, ry: 18 },
];
