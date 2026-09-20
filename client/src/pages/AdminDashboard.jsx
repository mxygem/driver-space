import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

const REFRESH_INTERVAL_MS = 15_000;

export default function AdminDashboard() {
  const { token } = useAuth();
  const [drivers, setDrivers] = useState([]);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ username: '', password: '', displayName: '' });
  const [formError, setFormError] = useState(null);
  const [creating, setCreating] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const data = await api.adminListDrivers(token);
      setDrivers(data.drivers);
      setError(null);
    } catch (e) {
      setError(e.message);
    }
  }, [token]);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, REFRESH_INTERVAL_MS);
    return () => clearInterval(id);
  }, [refresh]);

  async function handleCreate(e) {
    e.preventDefault();
    setFormError(null);
    setCreating(true);
    try {
      await api.adminCreateDriver(token, form.username, form.password, form.displayName);
      setForm({ username: '', password: '', displayName: '' });
      refresh();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setCreating(false);
    }
  }

  async function handleForceOffline(id) {
    try {
      await api.adminForceOffline(token, id);
      refresh();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="page admin-page">
      <h1>Admin: Driver Roster</h1>
      {error && <p className="form-error">{error}</p>}

      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>Status</th>
            <th>Exact location</th>
            <th>Last update</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {drivers.map((d) => (
            <tr key={d.id}>
              <td>{d.name}</td>
              <td>{d.username}</td>
              <td>
                <span className={`status-pill ${d.online ? 'status-online' : 'status-offline'}`}>
                  {d.online ? 'Online' : 'Offline'}
                </span>
              </td>
              <td>{d.lat && d.lng ? `${d.lat.toFixed(5)}, ${d.lng.toFixed(5)}` : '—'}</td>
              <td>{d.updatedAt ? new Date(d.updatedAt).toLocaleTimeString() : '—'}</td>
              <td>
                {d.online && (
                  <button type="button" onClick={() => handleForceOffline(d.id)}>
                    Force offline
                  </button>
                )}
              </td>
            </tr>
          ))}
          {drivers.length === 0 && (
            <tr>
              <td colSpan={6}>No driver accounts yet.</td>
            </tr>
          )}
        </tbody>
      </table>

      <h2>Add a driver account</h2>
      <form className="admin-create-form" onSubmit={handleCreate}>
        <label>
          Display name
          <input
            value={form.displayName}
            onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
            required
          />
        </label>
        <label>
          Username
          <input
            value={form.username}
            onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
            required
          />
        </label>
        <label>
          Temporary password
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            required
          />
        </label>
        {formError && <p className="form-error">{formError}</p>}
        <button type="submit" disabled={creating}>
          {creating ? 'Adding…' : 'Add driver'}
        </button>
      </form>
    </div>
  );
}
