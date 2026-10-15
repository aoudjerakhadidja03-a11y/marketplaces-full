import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Store, ShieldCheck, MapPin, Globe, ExternalLink, FileText, CheckCircle2, Award, X } from 'lucide-react';

const MOCK_SUPPLIERS = [
  {
    id: 1,
    shop_name: 'TechStore DZ (Grossiste Electronique)',
    business_category: 'Électronique & High-Tech',
    sector: 'Grossiste & Distributeur Certifié',
    company_description: 'Grossiste leader en matériel informatique, accessoires mobiles et objets connectés avec garantie officielle et livraison 58 wilayas.',
    address: 'Hydra, Alger',
    website_url: 'techstore-dz.com',
    max_allowed_return_rate: 15,
    deposit_percent_for_risky: 30
  },
  {
    id: 2,
    shop_name: 'Moda Express DZ',
    business_category: 'Mode & Vêtements',
    sector: 'Fabricant & Importateur',
    company_description: 'Spécialiste du prêt-à-porter de haute qualité. Articles certifiés avec fiches techniques de guidage de taille strictes.',
    address: 'Bab Ezzouar, Alger',
    website_url: 'moda-express.dz',
    max_allowed_return_rate: 20,
    deposit_percent_for_risky: 25
  },
  {
    id: 3,
    shop_name: 'HomeDeco & Confort DZ',
    business_category: 'Maison & Décoration',
    sector: 'Grossiste Équipement Maison',
    company_description: 'Articles de maison, électroménager et décoration moderne avec contrôle qualité rigoureux avant expédition.',
    address: 'Oran, Algérie',
    website_url: 'homedeco.dz',
    max_allowed_return_rate: 10,
    deposit_percent_for_risky: 30
  }
];

export const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTechDocSupplier, setSelectedTechDocSupplier] = useState(null);

  useEffect(() => {
    api.get('/suppliers')
      .then((res) => {
        const list = res.data?.data || [];
        setSuppliers(list.length > 0 ? list : MOCK_SUPPLIERS);
      })
      .catch(() => setSuppliers(MOCK_SUPPLIERS))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <span style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#a78bfa', padding: '0.4rem 1rem', borderRadius: '30px', fontSize: '0.85rem', fontWeight: 600, display: 'inline-block', marginBottom: '0.8rem' }}>
          🏢 Réseau de Fournisseurs Certifiés
        </span>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, margin: '0.3rem 0' }}>Boutiques & Fabricants Professionnels</h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto' }}>
          Découvrez la vitrine officielle de chaque fournisseur, leurs fiches techniques certifiées, site web et engagement qualité.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Chargement des vitrines fournisseurs...</div>
      ) : suppliers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(30, 41, 59, 0.4)', borderRadius: '16px' }}>
          Aucun fournisseur répertorié pour le moment.
        </div>
      ) : (
        <div className="grid grid-3" style={{ gap: '1.5rem' }}>
          {suppliers.map((supp) => (
            <div
              key={supp.id}
              className="card"
              style={{
                background: 'rgba(30, 41, 59, 0.7)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '18px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
              }}
            >
              <div>
                {/* Header Card */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <div style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', padding: '0.75rem', borderRadius: '14px', color: '#fff', boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)' }}>
                      <Store size={26} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#fff' }}>{supp.shop_name}</h3>
                      <span style={{ fontSize: '0.75rem', color: '#34d399', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
                        <ShieldCheck size={14} /> Fournisseur Certifié
                      </span>
                    </div>
                  </div>
                </div>

                {/* Business Badge & Sector */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  <span style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>
                    {supp.business_category || 'Grossiste & Distributeur'}
                  </span>
                  <span style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#c084fc', border: '1px solid rgba(139, 92, 246, 0.3)', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>
                    {supp.sector || 'Toutes catégories'}
                  </span>
                </div>

                {/* Description */}
                <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: '1.5', marginBottom: '1.2rem' }}>
                  {supp.company_description || "Fournisseur agréé proposant des articles de haute qualité avec garantie et fiches techniques certifiées."}
                </p>

                {/* Info List */}
                <div style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin size={16} style={{ color: '#8b5cf6' }} />
                    <span>{supp.address || 'Alger, Algérie'}</span>
                  </div>

                  {supp.website_url ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Globe size={16} style={{ color: '#38bdf8' }} />
                      <a href={supp.website_url.startsWith('http') ? supp.website_url : `https://${supp.website_url}`} target="_blank" rel="noreferrer" style={{ color: '#38bdf8', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        {supp.website_url} <ExternalLink size={12} />
                      </a>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Globe size={16} style={{ color: '#64748b' }} />
                      <span style={{ color: '#64748b' }}>Boutique Officielle Certifiée</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <button
                  onClick={() => setSelectedTechDocSupplier(supp)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#e2e8f0',
                    padding: '0.6rem',
                    borderRadius: '10px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <FileText size={15} style={{ color: '#a78bfa' }} />
                  Voir Fiche Technique Pro
                </button>

                <Link
                  to={`/suppliers/${supp.id}`}
                  style={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    color: '#fff',
                    textAlign: 'center',
                    padding: '0.7rem',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    textDecoration: 'none',
                    boxShadow: '0 4px 14px rgba(139, 92, 246, 0.3)',
                  }}
                >
                  Accéder au Catalogue Articles
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tech Datasheet Modal */}
      {selectedTechDocSupplier && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999, padding: '1rem'
        }}>
          <div style={{
            background: '#0f172a', border: '1px solid rgba(139, 92, 246, 0.4)',
            borderRadius: '20px', maxWidth: '550px', width: '100%', padding: '1.8rem',
            color: '#fff', boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Award style={{ color: '#a78bfa', width: '24px', height: '24px' }} />
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>
                  Fiche Technique Professionnelle : {selectedTechDocSupplier.shop_name}
                </h3>
              </div>
              <button onClick={() => setSelectedTechDocSupplier(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem', color: '#cbd5e1' }}>
              <div style={{ background: 'rgba(30, 41, 59, 0.8)', padding: '1rem', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block' }}>Catégorie Officielle</span>
                <strong style={{ color: '#fff' }}>{selectedTechDocSupplier.business_category || 'Grossiste & Distributeur'}</strong>
              </div>

              <div style={{ background: 'rgba(30, 41, 59, 0.8)', padding: '1rem', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block' }}>Normes de Qualité & Garantie</span>
                <span style={{ color: '#34d399', fontWeight: 600 }}>✓ Conformité Certifiée & Garantie de Retour Sous 7 Jours</span>
              </div>

              <div style={{ background: 'rgba(30, 41, 59, 0.8)', padding: '1rem', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block' }}>Politique de Contrôle des Retours</span>
                <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.85rem' }}>
                  Seuil de tolérance fixé à {selectedTechDocSupplier.max_allowed_return_rate || 15}%. Pour tout client dépassant ce taux, un acompte préventif de {selectedTechDocSupplier.deposit_percent_for_risky || 30}% est exigé.
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedTechDocSupplier(null)}
              style={{
                width: '100%', marginTop: '1.5rem', background: '#6366f1', color: '#fff',
                border: 'none', padding: '0.8rem', borderRadius: '10px', fontWeight: 700, cursor: 'pointer'
              }}
            >
              Fermer la Fiche Technique
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
