import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogIn, ShieldCheck, AlertCircle, Info } from 'lucide-react';

export const LoginPage = () => {
  const location = useLocation();
  const prefilled = location.state?.prefillEmail || '';

  const [email, setEmail] = useState(prefilled);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [infoNotice, setInfoNotice] = useState(prefilled ? `Compte détecté pour ${prefilled}. Saisissez votre mot de passe pour accéder à votre espace.` : '');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleQuickLogin = async (targetRole) => {
    setLoading(true);
    setError('');
    const targetEmail = targetRole === 'supplier' ? 'karim@techdz.com' : 'yacine@gmail.com';
    try {
      const loggedUser = await login(targetEmail, 'password123');
      if (targetRole === 'supplier' || loggedUser?.role === 'supplier') {
        navigate('/supplier/dashboard');
      } else {
        navigate('/customer/dashboard');
      }
    } catch (e) {
      setError(e.message || 'Erreur de connexion.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const cleanEmail = (email || '').trim().toLowerCase();
      const loggedUser = await login(cleanEmail, password);
      if (loggedUser?.role === 'admin') {
        navigate('/admin');
      } else if (loggedUser?.role === 'supplier') {
        navigate('/supplier/dashboard');
      } else {
        navigate('/customer/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Identifiants incorrects. Veuillez vérifier vos accès.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '4.5rem 1.5rem', maxWidth: '480px' }}>
      <div className="card" style={{ padding: '2.5rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <Link to="/" style={{ display: 'inline-block', marginBottom: '0.8rem' }} title="Accueil">
            <img
              src="/logo.png"
              alt="Marketeria Logo"
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                objectFit: 'contain',
                boxShadow: '0 4px 18px rgba(99, 102, 241, 0.25)',
                margin: '0 auto'
              }}
            />
          </Link>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Connexion Espace Membre</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Accédez à votre espace sécurisé Marketeria</p>
        </div>

        {/* 1-Click Quick Login Shortcuts */}
        <div style={{ background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.25)', borderRadius: '14px', padding: '1rem', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '0.78rem', color: '#a78bfa', fontWeight: 700, display: 'block', marginBottom: '0.6rem', textAlign: 'center', textTransform: 'uppercase' }}>
            ⚡ Accès Démo Jury (1-Clic)
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
            <button
              type="button"
              onClick={() => handleQuickLogin('customer')}
              className="btn btn-primary btn-sm"
              style={{ padding: '0.65rem 0.5rem', fontSize: '0.82rem', fontWeight: 700 }}
            >
              👤 Espace Client
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('supplier')}
              className="btn btn-secondary btn-sm"
              style={{ padding: '0.65rem 0.5rem', fontSize: '0.82rem', fontWeight: 700 }}
            >
              🏢 Espace Fournisseur
            </button>
          </div>
        </div>

        {infoNotice && (
          <div style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Info size={18} /> {infoNotice}
          </div>
        )}

        {error && (
          <div style={{ background: 'var(--error-bg)', color: 'var(--error)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Adresse Email</label>
            <input
              type="email"
              className="form-input"
              required
              placeholder="votre.email@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mot de passe</label>
            <input
              type="password"
              className="form-input"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem', marginBottom: '1.5rem' }} disabled={loading}>
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Pas encore de compte ? <Link to="/register" style={{ fontWeight: 600 }}>Créer un compte</Link>
        </div>
      </div>
    </div>
  );
};
