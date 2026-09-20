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
      [33.43, -112.36],
      [33.435, -112.3],
      [33.448, -112.1],
      [33.448, -112.05],
      [33.42, -111.965],
      [33.35, -111.965],
      [33.2, -111.93],
      [33.15, -111.9],
    ],
  },
  {
    id: 'i17',
    label: 'I-17',
    className: 'freeway freeway-interstate',
    path: [
      [33.85, -112.17],
      [33.72, -112.14],
      [33.62, -112.11],
      [33.55, -112.1],
      [33.48, -112.1],
      [33.448, -112.096],
    ],
  },
  {
    id: 'us60-grand',
    label: 'US-60 (Grand Ave)',
    className: 'freeway freeway-us',
    path: [
      [33.448, -112.1],
      [33.49, -112.19],
      [33.55, -112.28],
      [33.62, -112.36],
      [33.68, -112.44],
      [33.74, -112.52],
    ],
  },
  {
    id: 'us60-superstition',
    label: 'US-60 (Superstition Fwy)',
    className: 'freeway freeway-us',
    path: [
      [33.42, -111.965],
      [33.415, -111.83],
      [33.415, -111.7],
      [33.415, -111.55],
    ],
  },
  {
    id: 'loop101-agua-fria',
    label: 'Loop 101',
    className: 'freeway freeway-loop',
    path: [
      [33.55, -112.1],
      [33.585, -112.19],
      [33.575, -112.25],
      [33.5, -112.29],
      [33.435, -112.31],
    ],
  },
  {
    id: 'loop101-pima',
    label: 'Loop 101',
    className: 'freeway freeway-loop',
    path: [
      [33.55, -112.1],
      [33.62, -111.99],
      [33.605, -111.9],
      [33.5, -111.87],
      [33.4, -111.85],
      [33.33, -111.84],
    ],
  },
  {
    id: 'loop202-redmountain',
    label: 'Loop 202',
    className: 'freeway freeway-loop',
    path: [
      [33.448, -111.965],
      [33.44, -111.88],
      [33.42, -111.83],
      [33.415, -111.8],
    ],
  },
  {
    id: 'loop202-santan',
    label: 'Loop 202',
    className: 'freeway freeway-loop',
    path: [
      [33.4, -111.83],
      [33.35, -111.82],
      [33.3, -111.84],
      [33.28, -111.9],
      [33.25, -111.98],
    ],
  },
  {
    id: 'loop202-southmtn',
    label: 'Loop 202',
    className: 'freeway freeway-loop',
    path: [
      [33.25, -111.98],
      [33.3, -112.05],
      [33.38, -112.1],
      [33.4, -112.13],
    ],
  },
  {
    id: 'sr51',
    label: 'SR-51',
    className: 'freeway freeway-state',
    path: [
      [33.448, -112.05],
      [33.52, -112.03],
      [33.58, -112.02],
      [33.62, -112.0],
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
