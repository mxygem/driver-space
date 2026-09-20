import { useEffect, useState } from 'react';
import PhoenixMap from '../components/PhoenixMap';
import { api } from '../api/client';

const POLL_INTERVAL_MS = 20_000;

export default function LandingPage() {
  const [drivers, setDrivers] = useState([]);
  const [jitterRadius, setJitterRadius] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const data = await api.publicDrivers();
        if (!cancelled) {
          setDrivers(data.drivers);
          setJitterRadius(data.jitterRadiusMeters);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) setError(e.message);
      }
    }

    poll();
    const id = setInterval(poll, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return (
    <div className="page landing-page">
      <div className="landing-intro">
        <h1>Where are our drivers right now?</h1>
        <p>
          {drivers.length === 0
            ? 'No drivers are currently online.'
            : `${drivers.length} driver${drivers.length === 1 ? '' : 's'} currently online across the Valley.`}
        </p>
        {jitterRadius && (
          <p className="landing-disclaimer">
            Locations are approximate — shown within roughly {Math.round(jitterRadius)} meters of each
            driver's actual position for privacy, and refresh periodically.
          </p>
        )}
        {error && <p className="landing-error">Couldn't reach the server: {error}</p>}
      </div>
      <PhoenixMap markers={drivers} className="landing-map" />
    </div>
  );
}
