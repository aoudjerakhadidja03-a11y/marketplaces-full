import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Store, ShieldCheck, Globe, MapPin, Building, FileText, Phone } from 'lucide-react';
import { SupplierPenaltyManager } from '../../components/SupplierPenaltyManager';

export const ShopProfilePage = () => {
  const { user, refreshUser } = useAuth();
  const supplier = user?.supplier || {};

  const [shopName, setShopName] = useState(supplier.shop_name || user?.shop_name || '');
  const [businessCategory, setBusinessCategory] = useState(supplier.business_category || 'Grossiste & Distributeur');
  const [sector, setSector] = useState(supplier.sector || user?.sector || '');
  const [address, setAddress] = useState(supplier.address || user?.address || '');
  const [websiteUrl, setWebsiteUrl] = useState(supplier.website_url || '');
  const [companyDescription, setCompanyDescription] = useState(supplier.company_description || '');
  const [technicalSupportContact, setTechnicalSupportContact] = useState(supplier.technical_support_contact || '');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    api.put('/supplier/profile', {
      shop_name: shopName,
      business_category: businessCategory,
      sector,
      address,
      website_url: websiteUrl,
      company_description: companyDescription,
      technical_support_contact: technicalSupportContact,
    })
      .then((res) => {
        setMessage(res.data.message || 'Profil de la boutique mis à jour avec succès.');
        if (refreshUser) refreshUser();
      })
      .catch((err) => setError(err.response?.data?.message || 'Erreur mise à jour profil.'))
      .finally(() => setLoading(false));
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '850px', margin: '0 auto' }}>

      {/* Main Profile Form */}
      <div className="card" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>Profil & Vitrine Professionnelle</h1>
            <p style={{ color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>Présentation de votre entreprise, fiches techniques et réseaux</p>
          </div>
          <span className={`badge ${supplier.verification_status === 'verified' ? 'badge-success' : 'badge-warning'}`}>
            {supplier.verification_status === 'verified' ? '✓ Boutique Vérifiée' : '⏳ En attente'}
          </span>
        </div>

        {message && <div style={{ background: 'var(--success-bg)', color: 'var(--success)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', fontSize: '0.9rem' }}>{message}</div>}
        {error && <div style={{ background: 'var(--error-bg)', color: 'var(--error)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', fontSize: '0.9rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem' }}>
            <div className="form-group">
              <label className="form-label">Nom de la boutique *</label>
              <input type="text" className="form-input" required value={shopName} onChange={(e) => setShopName(e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">Catégorie d'entreprise *</label>
              <select className="form-input" value={businessCategory} onChange={(e) => setBusinessCategory(e.target.value)}>
                <option value="Grossiste & Distributeur">Grossiste & Distributeur</option>
                <option value="Fabricant Officiel">Fabricant Officiel</option>
                <option value="Distributeur Exclusif">Distributeur Exclusif</option>
                <option value="Artisan / Producteur">Artisan / Producteur</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem' }}>
            <div className="form-group">
              <label className="form-label">Secteur d'activité principal *</label>
              <input type="text" className="form-input" required value={sector} onChange={(e) => setSector(e.target.value)} placeholder="Ex: Électronique, Textile, Outillage..." />
            </div>

            <div className="form-group">
              <label className="form-label">Lien du site web / Réseaux sociaux</label>
              <input type="text" className="form-input" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://votre-site-entreprise.com" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Adresse physique complète *</label>
            <input type="text" className="form-input" required value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Présentation & Description de l'entreprise</label>
            <textarea
              className="form-input"
              rows={3}
              value={companyDescription}
              onChange={(e) => setCompanyDescription(e.target.value)}
              placeholder="Décrivez votre savoir-faire, vos garanties et vos conditions de livraison..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contact Support Technique & Service Client</label>
            <input
              type="text"
              className="form-input"
              value={technicalSupportContact}
              onChange={(e) => setTechnicalSupportContact(e.target.value)}
              placeholder="Ex: support@fournisseur.dz ou +213 555 123 456"
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem', fontWeight: 700 }} disabled={loading}>
            {loading ? 'Enregistrement...' : 'Mettre à jour la Vitrine Boutique'}
          </button>
        </form>
      </div>

      {/* Supplier Penalty & Return Rules Manager */}
      <SupplierPenaltyManager
        supplierData={supplier}
        onProfileUpdated={() => {
          if (refreshUser) refreshUser();
        }}
      />
    </div>
  );
};
