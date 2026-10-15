import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Store, Check, X, ShieldCheck, Globe } from 'lucide-react';

export const AdminSuppliersValidation = () => {
  const [pendingSuppliers, setPendingSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingSuppliers = () => {
    setLoading(true);
    api.get('/admin/suppliers/pending')
      .then((res) => setPendingSuppliers(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPendingSuppliers();
  }, []);

  const handleVerify = (id, status) => {
    if (window.confirm(`Confirmer le statut '${status}' pour cette boutique ?`)) {
      api.post(`/admin/suppliers/${id}/verify`, { status })
        .then((res) => {
          alert(res.data.message);
          fetchPendingSuppliers();
        })
        .catch((err) => alert(err.response?.data?.message || 'Erreur lors de la validation.'));
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Validation des Fournisseurs</h1>
        <p style={{ color: 'var(--text-muted)' }}>Examinez et validez les demandes d'ouverture de boutique</p>
      </div>

      {loading ? (
        <p>Chargement des demandes...</p>
      ) : pendingSuppliers.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <ShieldCheck size={48} color="var(--success)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Aucune demande en attente</h3>
          <p style={{ color: 'var(--text-muted)' }}>Toutes les demandes de boutique fournisseur ont été traitées.</p>
        </div>
      ) : (
        <div className="grid grid-2">
          {pendingSuppliers.map((supp) => (
            <div key={supp.id} className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ background: 'var(--bg-subtle)', padding: '0.75rem', borderRadius: '12px', color: 'var(--primary)' }}>
                  <Store size={28} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{supp.shop_name}</h3>
                  <span className="badge badge-warning">En attente d'approbation</span>
                </div>
              </div>

              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                <div><strong>Représentant :</strong> {supp.user?.name} ({supp.user?.email})</div>
                <div><strong>Téléphone :</strong> {supp.user?.phone}</div>
                <div><strong>Secteur :</strong> {supp.sector}</div>
                <div><strong>Adresse :</strong> {supp.address}</div>
                {supp.website_url && (
                  <div><strong>Lien :</strong> <a href={supp.website_url} target="_blank" rel="noreferrer">{supp.website_url}</a></div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <button onClick={() => handleVerify(supp.id, 'verified')} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                  <Check size={16} /> Valider la boutique
                </button>
                <button onClick={() => handleVerify(supp.id, 'rejected')} className="btn btn-outline btn-sm" style={{ borderColor: 'var(--error)', color: 'var(--error)' }}>
                  <X size={16} /> Refuser
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
