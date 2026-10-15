import React from 'react';
import { ShieldCheck, Sparkles, Truck, Lock } from 'lucide-react';

export const ProtectionBanner = () => {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #16324F 0%, #2474B5 100%)',
      color: '#fff',
      padding: '2rem',
      borderRadius: 'var(--radius-lg)',
      margin: '2rem 0',
      boxShadow: 'var(--shadow-md)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.5rem', borderRadius: '12px' }}>
          <Sparkles size={24} color="#BFD4F0" />
        </div>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Return Prevention Intelligence</h3>
      </div>

      <p style={{ color: '#DDEFFC', fontSize: '1.05rem', maxWidth: '750px', marginBottom: '1.5rem', lineHeight: 1.6 }}>
        Notre marketplace intègre un moteur intelligent qui sécurise chaque transaction : suivi des livraisons en temps réel, messagerie directe fournisseur-client, et zéro risque de colis non réclamé.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(255,255,255,0.1)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)' }}>
          <ShieldCheck size={20} color="#BFD4F0" />
          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Fournisseurs vérifiés</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(255,255,255,0.1)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)' }}>
          <Truck size={20} color="#BFD4F0" />
          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Livraison suivie</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(255,255,255,0.1)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)' }}>
          <Lock size={20} color="#BFD4F0" />
          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Paiement sécurisé</span>
        </div>
      </div>
    </div>
  );
};
