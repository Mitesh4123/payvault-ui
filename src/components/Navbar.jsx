import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';
import logoImg from '../assets/safe-box.png';
export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const links = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/deposit', label: 'Deposit' },
    { to: '/withdraw', label: 'Withdraw' },
    { to: '/transfer', label: 'Transfer' },
    { to: '/transactions', label: 'History' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/dashboard" className="navbar-logo">
  <img 
    src={logoImg} 
    width="48" 
    height="48" 
    alt="PayVault Logo" 
  />
  <span className="logo-text">PayVault</span>
</Link>
        <div className="navbar-links">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`nav-link ${location.pathname === l.to ? 'nav-link--active' : ''}`}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div className="navbar-right">
          <span className="nav-user">{user.name.split(' ')[0]}</span>
          <button className="btn btn-outline btn-sm" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
}