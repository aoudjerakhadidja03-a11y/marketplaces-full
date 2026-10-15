import React, { useState } from 'react';
import { ShieldAlert, Save, Sliders, CheckCircle, Info } from 'lucide-react';
import api from '../services/api';

export const SupplierPenaltyManager = ({ supplierData, onProfileUpdated }) => {
  const [maxRate, setMaxRate] = useState(supplierData?.max_allowed_return_rate || 15);
  const [requirePrepayment, setRequirePrepayment] = useState(supplierData?.require_prepayment_for_risky ?? true);
  const [disableCod, setDisableCod] = useState(supplierData?.disable_cod_for_risky ?? true);
  const [depositPercent, setDepositPercent] = useState(supplierData?.deposit_percent_for_risky || 30);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await api.put('/supplier/profile', {
        max_allowed_return_rate: parseInt(maxRate),
        require_prepayment_for_risky: requirePrepayment,
        disable_cod_for_risky: disableCod,
        deposit_percent_for_risky: parseInt(depositPercent),
      });

      if (res.data) {
        setMessage({ type: 'success', text: 'Règles de pénalités et modalités de paiement enregistrées.' });
        if (onProfileUpdated) onProfileUpdated();
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Erreur lors de l\'enregistrement des paramètres.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      background: 'rgba(30, 41, 59, 0.7)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(239, 68, 68, 0.2)',
      borderRadius: '16px',
      padding: '1.5rem',
      color: '#f8fafc',
      marginBottom: '2rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.2rem' }}>
        <ShieldAlert style={{ color: '#ef4444', width: '24px', height: '24px' }} />
        <div>
          <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>
            Supervision & Pénalités des Clients à Fort Taux de Retour
          </h3>
          <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
            Définissez les exigences de paiement applicables aux clients à risque pour limiter les retours abusifs
          </span>
        </div>
      </div>

      {message && (
        <div style={{
          padding: '0.8rem 1rem',
          borderRadius: '10px',
          marginBottom: '1.2rem',
          fontSize: '0.85rem',
          background: message.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          border: message.type === 'success' ? '1px solid #10b981' : '1px solid #ef4444',
          color: message.type === 'success' ? '#34d399' : '#fca5a5',
        }}>
          {message.text}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem', marginBottom: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.4rem', fontWeight: 600 }}>
            Seuil Max de Taux de Retour Toléré (%)
          </label>
          <input
            type="number"
            value={maxRate}
            onChange={(e) => setMaxRate(e.target.value)}
            min="5"
            max="50"
            style={{
              width: '100%',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              padding: '0.6rem 0.8rem',
              color: '#fff',
            }}
          />
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Au-delà de ce taux, le client sera pénalisé</span>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.4rem', fontWeight: 600 }}>
            Acompte Obligatoire (%)
          </label>
          <input
            type="number"
            value={depositPercent}
            onChange={(e) => setDepositPercent(e.target.value)}
            min="10"
            max="100"
            style={{
              width: '100%',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              padding: '0.6rem 0.8rem',
              color: '#fff',
            }}
          />
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Exigé lors de la commande des clients risqués</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontSize: '0.9rem' }}>
          <input
            type="checkbox"
            checked={disableCod}
            onChange={(e) => setDisableCod(e.target.checked)}
            style={{ width: '18px', height: '18px', accentColor: '#ef4444' }}
          />
          <span>Désactiver le Paiement à la Livraison (COD) pour tous les clients douteux</span>
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontSize: '0.9rem' }}>
          <input
            type="checkbox"
            checked={requirePrepayment}
            onChange={(e) => setRequirePrepayment(e.target.checked)}
            style={{ width: '18px', height: '18px', accentColor: '#8b5cf6' }}
          />
          <span>Exiger un prépaiement ou acompte systématique pour les comptes à haut risque</span>
        </label>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        style={{
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          border: 'none',
          color: '#fff',
          padding: '0.6rem 1.2rem',
          borderRadius: '10px',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <Save style={{ width: '16px', height: '16px' }} />
        {saving ? 'Enregistrement...' : 'Appliquer la Politique de Pénalités'}
      </button>
    </div>
  );
};
