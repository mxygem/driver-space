import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import PhoenixMap from '../components/PhoenixMap';

const UPDATE_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

export default function DriverDashboard() {
  const { token, user } = useAuth();
  const [online, setOnline] = useState(false);
  const [status, setStatus] = useState('offline');
  const [lastSent, setLastSent] = useState(null);
  const [lastPosition, setLastPosition] = useState(null);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  const sendLocationOnce = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return;
    }
    setStatus('locating…');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        try {
          const res = await api.sendLocation(token, latitude, longitude, accuracy);
          setLastSent(new Date(res.updatedAt));
          setLastPosition({
            id: user.id,
            name: user.display_name,
            lat: res.jittered.lat,
            lng: res.jittered.lng,
          });
          setStatus('online');
          setError(null);
        } catch (e) {
          setError(e.message);
          setStatus('error sending location');
        }
      },
      (geoErr) => {
        setError(`Couldn't get your location: ${geoErr.message}`);
        setStatus('location error');
      },
      { enableHighAccuracy: true, timeout: 15_000, maximumAge: 60_000 }
    );
  }, [token, user]);

  const goOnline = useCallback(async () => {
    try {
      await api.setDriverStatus(token, true);
      setOnline(true);
      setError(null);
      sendLocationOnce();
      intervalRef.current = setInterval(sendLocationOnce, UPDATE_INTERVAL_MS);
    } catch (e) {
      setError(e.message);
    }
  }, [token, sendLocationOnce]);

  const goOffline = useCallback(async () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    try {
      await api.setDriverStatus(token, false);
    } catch (e) {
      setError(e.message);
    }
    setOnline(false);
    setStatus('offline');
    setLastPosition(null);
  }, [token]);

  useEffect(
    () => () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    },
    []
  );

  function handleToggle() {
    if (online) {
      goOffline();
    } else {
      goOnline();
    }
  }

  return (
    <div className="page driver-page">
      <h1>Hi, {user.display_name}</h1>
      <div className="driver-toggle-card">
        <label className="switch">
          <input type="checkbox" checked={online} onChange={handleToggle} />
          <span className="switch-slider" />
        </label>
        <div>
          <p className="driver-status-line">
            You are currently <strong>{online ? 'ONLINE' : 'OFFLINE'}</strong>
          </p>
          <p className="driver-status-detail">Status: {status}</p>
          {lastSent && (
            <p className="driver-status-detail">Last location sent: {lastSent.toLocaleTimeString()}</p>
          )}
          <p className="driver-status-detail">
            While online, your location is sent every 5 minutes. A randomized privacy buffer is applied
            before it's ever shown on the public map.
          </p>
        </div>
      </div>
      {error && <p className="form-error">{error}</p>}
      {online && lastPosition && (
        <div className="driver-map-preview">
          <p>Roughly how customers see you on the public map (approximate, jittered):</p>
          <PhoenixMap markers={[lastPosition]} highlightMarkerId={lastPosition.id} />
        </div>
      )}
    </div>
  );
}
