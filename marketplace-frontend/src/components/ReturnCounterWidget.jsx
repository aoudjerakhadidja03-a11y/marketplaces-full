import React, { useState, useEffect } from 'react';
import { RefreshCw, RotateCcw, AlertTriangle, CheckCircle, ShieldAlert, FileText, Plus, Bot, ChevronRight, X, Send } from 'lucide-react';
import api from '../services/api';

export const ReturnCounterWidget = ({ userRole = 'customer', onOpenAiModal }) => {
  const [metrics, setMetrics] = useState({
    total_returns: 1,
    pending_returns: 0,
    approved_returns: 1,
    completed_returns: 1,
    return_rate_percent: 2.10,
    reliability_tier: 'trusted',
    payment_restriction: 'none',
  });
  
  const [tickets, setTickets] = useState([
    {
      id: 1,
      ticket_number: 'RET-774812-20260901',
      order_id: 3,
      reason_category: 'size_issue',
      reason_details: 'La veste était trop ajustée au niveau des épaules (Erreur de taille).',
      status: 'approved',
      refund_amount: 7900.00,
      created_at: '2026-09-01T10:00:00.000000Z',
      ai_prevention_advice: 'Conseil IA : Mettez à jour le guide des mensurations en cm sur cette fiche produit.',
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  // Manual Return Request Form State
  const [showManualCreate, setShowManualCreate] = useState(false);
  const [newTicket, setNewTicket] = useState({
    ticket_number: `RET-${Math.floor(100000 + Math.random() * 900000)}-2026`,
    reason_category: 'size_issue',
    reason_details: '',
    refund_amount: '',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [counterRes, ticketsRes] = await Promise.all([
        api.get('/returns/counter').catch(() => null),
        api.get('/returns').catch(() => null),
      ]);

      if (counterRes?.data?.success) {
        setMetrics(counterRes.data.data);
      }
      if (ticketsRes?.data?.success && Array.isArray(ticketsRes.data.data) && ticketsRes.data.data.length > 0) {
        setTickets(ticketsRes.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleManualCreateSubmit = async (e) => {
    e.preventDefault();
    const created = {
      id: Date.now(),
      ticket_number: newTicket.ticket_number,
      order_id: 1,
      reason_category: newTicket.reason_category,
      reason_details: newTicket.reason_details,
      status: 'pending_approval',
      refund_amount: parseFloat(newTicket.refund_amount || 4800.00),
      created_at: new Date().toISOString(),
      ai_prevention_advice: 'Demande manuelle enregistrée. Le fournisseur traitera ce ticket sous 24h.',
    };

    try {
      const res = await api.post('/returns', {
        order_id: 1,
        reason_category: newTicket.reason_category,
        reason_details: newTicket.reason_details,
      });
      if (res.data?.data) {
        setTickets(prev => [res.data.data, ...prev]);
      } else {
        setTickets(prev => [created, ...prev]);
      }
    } catch (err) {
      setTickets(prev => [created, ...prev]);
    }

    setMetrics(prev => ({
      ...prev,
      total_returns: prev.total_returns + 1,
      pending_returns: prev.pending_returns + 1,
    }));
    setShowManualCreate(false);
    setNewTicket({
      ticket_number: `RET-${Math.floor(100000 + Math.random() * 900000)}-2026`,
      reason_category: 'size_issue',
      reason_details: '',
      refund_amount: '',
    });
  };

  const filteredTickets = tickets.filter(t => filterStatus === 'all' || t.status === filterStatus);

  return (
    <div style={{
      background: 'var(--card-bg)',
      border: '1px solid var(--border-color)',
      borderRadius: '16px',
      padding: '1.8rem',
      marginBottom: '2rem',
    }}>
      
      {/* Header: Manual Return Tracker First */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <RotateCcw style={{ color: 'var(--primary)', width: '24px', height: '24px' }} />
            <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Suivi Manuel & Compteur des Retours (Codes RET-XXXX)
            </h3>
          </div>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Traçabilité physique et traitement manuel des dossiers de retour en temps réel
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Primary Action: Manual Ticket Creation */}
          <button
            onClick={() => setShowManualCreate(true)}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', fontWeight: 700 }}
          >
            <Plus size={16} /> Demande de retour manuelle
          </button>

          <button
            onClick={fetchData}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
          >
            <RefreshCw size={14} /> Actualiser
          </button>

          {/* Secondary / Optional: AI Assistant Helper */}
          {onOpenAiModal && (
            <button
              onClick={onOpenAiModal}
              className="btn btn-outline btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderColor: 'var(--primary)', color: 'var(--primary)', fontWeight: 600 }}
            >
              <Bot size={15} /> 💡 (Optionnel) Aide IA
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-4" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Total Dossiers</span>
          <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>{metrics.total_returns}</span>
        </div>

        <div style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--warning)', display: 'block' }}>En Attente de Traitement</span>
          <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--warning)' }}>{metrics.pending_returns}</span>
        </div>

        <div style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--primary)', display: 'block' }}>Validé & En Cours</span>
          <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)' }}>{metrics.approved_returns}</span>
        </div>

        <div style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--success)', display: 'block' }}>Taux de Retour Global</span>
          <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--success)' }}>{metrics.return_rate_percent}%</span>
        </div>
      </div>

      {/* Manual Ticket Creation Modal */}
      {showManualCreate && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 900, backdropFilter: 'blur(4px)', padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '520px', padding: '1.8rem', background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText color="var(--primary)" /> Formulaire Manuel de Demande de Retour
              </h3>
              <button onClick={() => setShowManualCreate(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleManualCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Numéro de Ticket (Auto-généré)</label>
                <input type="text" className="form-input" disabled value={newTicket.ticket_number} />
              </div>

              <div className="form-group">
                <label className="form-label">Motif du Retour *</label>
                <select className="form-select" value={newTicket.reason_category} onChange={(e) => setNewTicket({ ...newTicket, reason_category: e.target.value })}>
                  <option value="size_issue">Erreur de Taille / Mensurations non concordantes</option>
                  <option value="defective">Produit non conforme ou endommagé</option>
                  <option value="changed_mind">Changement d'avis acheteur</option>
                  <option value="delay">Délai de livraison dépassé</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Description du Problème Réel *</label>
                <textarea className="form-textarea" required rows={3} value={newTicket.reason_details} onChange={(e) => setNewTicket({ ...newTicket, reason_details: e.target.value })} placeholder="Précisez la raison détaillée..." />
              </div>

              <div className="form-group">
                <label className="form-label">Montant du Remboursement Souhaité (DZD) *</label>
                <input type="number" className="form-input" required value={newTicket.refund_amount} onChange={(e) => setNewTicket({ ...newTicket, refund_amount: e.target.value })} placeholder="Ex: 4800" />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowManualCreate(false)} className="btn btn-secondary">Annuler</button>
                <button type="submit" className="btn btn-primary">Enregistrer le Ticket Manuel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manual Return Tickets Pipeline List */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>Dossiers de Retour en Cours (Filtrage Manuel)</h4>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {['all', 'pending_approval', 'approved', 'in_transit', 'refunded'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                style={{
                  background: filterStatus === st ? 'var(--primary)' : 'var(--bg-subtle)',
                  border: '1px solid var(--border-color)',
                  color: filterStatus === st ? '#fff' : 'var(--text-muted)',
                  padding: '0.3rem 0.6rem',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {st === 'all' ? 'Tous' : st === 'pending_approval' ? 'En Attente' : st === 'approved' ? 'Validé' : st === 'in_transit' ? 'Transit' : st}
              </button>
            ))}
          </div>
        </div>

        {filteredTickets.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '1.5rem', background: 'var(--bg-subtle)', borderRadius: '10px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Aucun ticket de retour sous ce filtre.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filteredTickets.map((t) => (
              <div
                key={t.id}
                style={{
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '1rem 1.2rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.8rem',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--primary)' }}>{t.ticket_number}</span>
                    <span className="badge badge-info" style={{ fontSize: '0.75rem' }}>
                      {t.reason_category}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                    Motif : {t.reason_details} | Montant : <strong>{t.refund_amount} DZD</strong>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span className={`badge ${t.status === 'pending_approval' ? 'badge-warning' : t.status === 'approved' ? 'badge-info' : 'badge-success'}`}>
                    {t.status === 'pending_approval' ? '⏳ En Attente Vendeur' : t.status === 'approved' ? '✓ Validé' : t.status}
                  </span>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    {new Date(t.created_at).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
