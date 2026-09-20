// In dev, Vite proxies '/api' to the local server (see vite.config.js). In
// production the client is typically hosted separately (e.g. Netlify) from
// the API, so VITE_API_BASE_URL must point at the deployed API's origin.
const API_BASE = `${import.meta.env.VITE_API_BASE_URL || ''}/api`;

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

export const api = {
  login: (username, password) => request('/auth/login', { method: 'POST', body: { username, password } }),
  me: (token) => request('/auth/me', { token }),
  publicDrivers: () => request('/public/drivers'),
  setDriverStatus: (token, online) =>
    request('/driver/status', { method: 'POST', token, body: { online } }),
  sendLocation: (token, lat, lng, accuracy) =>
    request('/driver/location', { method: 'POST', token, body: { lat, lng, accuracy } }),
  adminListDrivers: (token) => request('/admin/drivers', { token }),
  adminCreateDriver: (token, username, password, displayName) =>
    request('/admin/drivers', { method: 'POST', token, body: { username, password, displayName } }),
  adminForceOffline: (token, id) => request(`/admin/drivers/${id}/force-offline`, { method: 'POST', token }),
};
