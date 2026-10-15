import React from 'react';
import { ShieldCheck, Mail, Phone, MapPin, Sparkles } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{ background: '#0f172a', color: '#DDEFFC', paddingTop: '3.5rem', paddingBottom: '2rem', marginTop: '4rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="container grid grid-4" style={{ marginBottom: '2.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontWeight: 900, fontSize: '1.4rem', color: '#fff', marginBottom: '1rem' }}>
            <img
              src="/logo.png"
              alt="Marketeria Logo"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                objectFit: 'contain',
                display: 'block'
              }}
            />
            <span>Mar<span style={{ color: '#8b5cf6' }}>keteria</span></span>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.6 }}>
            La marketplace intelligente B2B/B2C labellisée avec technologie IA prédictive de prévention des retours, fiches techniques certifiées et réseau logistique 58 Wilayas.
          </p>
        </div>

        <div>
          <h4 style={{ color: '#fff', marginBottom: '1rem', fontWeight: 700 }}>Plateforme</h4>
          <ul style={{ listStyle: 'none', lineHeight: 2, fontSize: '0.9rem' }}>
            <li><a href="/products" style={{ color: '#94a3b8' }}>Tous les produits</a></li>
            <li><a href="/suppliers" style={{ color: '#94a3b8' }}>Fournisseurs certifiés</a></li>
            <li><a href="/delivery-partners" style={{ color: '#94a3b8' }}>Réseau Logistique 58 Wilayas</a></li>
            <li><a href="/register" style={{ color: '#94a3b8' }}>Devenir Vendeur Pro</a></li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: '#fff', marginBottom: '1rem', fontWeight: 700 }}>Innovation & Label</h4>
          <ul style={{ listStyle: 'none', lineHeight: 2, fontSize: '0.9rem', color: '#94a3b8' }}>
            <li>✓ Algorithme de Prévention des Retours IA</li>
            <li>✓ Fiches techniques certifiées avec mensurations</li>
            <li>✓ Protection acheteur & vendeur contre les annulations</li>
            <li>✓ Messagerie directe sécurisée et suivi n8n</li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: '#fff', marginBottom: '1rem', fontWeight: 700 }}>Contact & Siège</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem', color: '#94a3b8' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={16} color="#8b5cf6" /> Alger, Algérie</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Phone size={16} color="#8b5cf6" /> 0774159472</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={16} color="#8b5cf6" /> contact@marketeria.dz</div>
          </div>
        </div>
      </div>

      <div className="container" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>
        © {new Date().getFullYear()} Marketeria DZ — Tous droits réservés. Plateforme labellisée conformément aux normes e-commerce et de protection des données.
      </div>
    </footer>
  );
};
