import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, MessageSquare, Bot, ArrowRight, RefreshCcw, ShoppingBag } from 'lucide-react';
import { ReturnCounterWidget } from '../../components/ReturnCounterWidget';
import { AiReturnAssistantModal } from '../../components/AiReturnAssistantModal';

export const CustomerDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const loadDashboard = () => {
    setLoading(true);
    setError('');
    api.get('/dashboard/customer')
      .then((res) => setData(res.data))
      .catch(() => setError('Impossible de charger vos données. Vérifiez que le serveur est démarré.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadDashboard(); }, []);

  if (loading) {
    return <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>Chargement de votre Tableau de Bord Client...</div>;
  }

  if (error) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--danger, #dc2626)', marginBottom: '1rem' }}>{error}</p>
        <button className="btn btn-primary" onClick={loadDashboard}>Réessayer</button>
      </div>
    );
  }

  const metrics = data?.metrics || {};
  const recentOrders = data?.recent_orders || [];
  const riskLevel = metrics.user_risk_level || 'reliable';

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>Espace Client & Mes Commandes</h1>
            {riskLevel === 'reliable' && (
              <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <ShieldCheck size={14} /> Acheteur Vérifié Fiable
              </span>
            )}
          </div>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>Bienvenue, {user?.name || ''}</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="btn"
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700,
              boxShadow: '0 4px 14px rgba(139, 92, 246, 0.4)',
            }}
          >
            <Bot size={18} /> Assistant IA Anti-Retour
          </button>
          <Link to="/returns" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderColor: 'var(--primary)', color: 'var(--primary)', fontWeight: 700 }}>
            <RefreshCcw size={17} /> Suivi Retours & Litiges
          </Link>
          <Link to="/products" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ShoppingBag size={18} /> Parcourir le Catalogue
          </Link>
        </div>
      </div>

      <div className="grid grid-4" style={{ marginBottom: '2rem', gap: '1rem' }}>
        {[
          { label: 'Commandes Totales', value: metrics.total_orders ?? 0, color: 'var(--text-main)' },
          { label: 'En Cours de Livraison', value: metrics.pending_orders ?? 0, color: 'var(--primary)' },
          { label: 'Commandes Livrées', value: metrics.delivered_orders ?? 0, color: 'var(--success)' },
          { label: 'Total des Achats', value: `${Number(metrics.total_spent ?? 0).toLocaleString()} DZD`, color: 'var(--primary)' },
        ].map((kpi) => (
          <div key={kpi.label} className="card" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.25rem' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 600 }}>{kpi.label}</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: kpi.color }}>{kpi.value}</div>
          </div>
        ))}
      </div>

      <ReturnCounterWidget userRole="customer" onOpenAiModal={() => setIsAiModalOpen(true)} />

      <div className="card" style={{ padding: '1.8rem', marginTop: '2rem', background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Suivi des Commandes Récentes</h3>
          <Link to="/customer/orders" className="btn btn-outline btn-sm">Historique complet</Link>
        </div>

        {recentOrders.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '1.5rem' }}>Vous n'avez pas encore passé de commande.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentOrders.map((order) => (
              <div key={order.id} style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--primary)' }}>Commande #{order.id}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Vendeur : <strong style={{ color: 'var(--text-main)' }}>{order.supplier?.shop_name || '—'}</strong> · Reçu le {new Date(order.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <span className={`badge ${order.status === 'delivered' ? 'badge-success' : 'badge-info'}`}>
                    {order.status}
                  </span>
                </div>
                <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '1.1rem' }}>
                  {parseFloat(order.total_amount || order.total || 0).toLocaleString()} DZD
                </div>
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <Link to={`/customer/chat/${order.id}`} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MessageSquare size={14} /> Discuter Vendeur
                  </Link>
                  <Link to="/customer/orders" className="btn btn-primary btn-sm">
                    Détails <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AiReturnAssistantModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} role="customer" />
    </div>
  );
};
