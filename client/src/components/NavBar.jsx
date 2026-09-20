import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header className="nav-bar">
      <Link to="/" className="nav-brand">
        Driver Space <span className="nav-brand-sub">Phoenix Metro</span>
      </Link>
      <nav className="nav-links">
        {!user && (
          <Link to="/login" className="nav-link">
            Driver / Admin Login
          </Link>
        )}
        {user?.role === 'driver' && (
          <Link to="/driver" className="nav-link">
            My Dashboard
          </Link>
        )}
        {user?.role === 'admin' && (
          <Link to="/admin" className="nav-link">
            Admin
          </Link>
        )}
        {user && (
          <button type="button" className="nav-link nav-link-button" onClick={handleLogout}>
            Log out ({user.display_name})
          </button>
        )}
      </nav>
    </header>
  );
}
