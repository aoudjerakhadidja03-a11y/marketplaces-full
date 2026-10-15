import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, User as UserIcon, LogOut, ShieldCheck, Store, LayoutDashboard, Truck, RotateCcw, Mail, Sparkles } from 'lucide-react';

export const Navbar = () => {
  const { user, logout, cart } = useAuth();
  const navigate = useNavigate();

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const getDashboardRoute = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'supplier') return '/supplier/dashboard';
    return '/customer/dashboard';
  };

  const getReturnCounterRoute = () => {
    return '/returns';
  };

  return (
    <header className="header-glass">
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem' }}>
        
        {/* Sleek Marketeria Pro Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
          <img
            src="/logo.png"
            alt="Marketeria Logo"
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              objectFit: 'contain',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.25)',
              display: 'block'
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.5px', lineHeight: 1 }}>
              Mar<span style={{ color: 'var(--primary)' }}>keteria</span>
            </span>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.8px', textTransform: 'uppercase', marginTop: '2px' }}>
              Marketplace & IA Anti-Retour
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', gap: '1.4rem', alignItems: 'center', fontWeight: 600 }}>
          <Link to="/" style={{ color: 'var(--text-main)' }}>Accueil</Link>
          <Link to="/products" style={{ color: 'var(--text-main)' }}>Produits</Link>
          <Link to="/suppliers" style={{ color: 'var(--text-main)' }}>Fournisseurs</Link>
          <Link to="/returns" style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <RotateCcw size={16} /> Suivi Retours
          </Link>
          <Link to="/delivery-partners" style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Truck size={17} /> 58 Wilayas
          </Link>
          <Link to="/contact" style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Mail size={17} /> Contact
          </Link>
        </nav>

        {/* User Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {/* Cart Icon */}
          <Link to="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center', color: 'var(--text-main)' }}>
            <ShoppingBag size={24} />
            {totalCartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-10px',
                background: 'var(--primary)',
                color: '#fff',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 800
              }}>
                {totalCartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Link to={getReturnCounterRoute()} className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderColor: 'rgba(139, 92, 246, 0.4)', color: '#c084fc' }}>
                <RotateCcw size={15} />
                <span>Suivi Retours</span>
              </Link>

              <Link to={getDashboardRoute()} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                {user.role === 'supplier' ? <Store size={16} /> : <LayoutDashboard size={16} />}
                <span>
                  {user.role === 'supplier' ? 'Boutique' : user.role === 'admin' ? 'Admin' : 'Mon Espace'}
                </span>
              </Link>

              <button onClick={() => { logout(); navigate('/'); }} className="btn btn-outline btn-sm" title="Déconnexion">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">Connexion</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Créer un compte</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
