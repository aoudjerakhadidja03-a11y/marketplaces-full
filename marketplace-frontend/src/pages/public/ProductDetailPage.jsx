import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { ShoppingBag, ShieldCheck, Store, Star, Truck, AlertTriangle, FileText, CheckCircle2, Info, ArrowRight } from 'lucide-react';

const MOCK_FALLBACK_PRODUCT = {
  id: 1,
  name: 'Écouteurs Sans Fil Bluetooth Pro 5 - ANC',
  price: 4800,
  description: 'Écouteurs sans fil avec réduction active du bruit (ANC), autonomie 28h, son stéréo haute fidélité et micro antibruit. Fourni avec certificat de conformité et garantie 12 mois.',
  stock: 25,
  image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80',
  return_risk_score: 'low',
  category: { name: 'Électronique & High-Tech' },
  supplier: {
    id: 1,
    shop_name: 'Tech DZ Pro',
    company_description: 'Distributeur certifié matériel audio et accessoires mobiles.',
    business_category: 'Électronique & High-Tech',
    address: 'Alger Centre, Algérie',
    return_rate: '2.1'
  },
  specifications: {
    'Garantie': '12 Mois pièces et main d\'œuvre',
    'Origine': 'Produit certifié distributeur officiel DZ',
    'Statut Stock': 'En stock expédié sous 24h',
    'Politique Anti-Retour': 'Vérification pré-expédition active par SMS/Chat'
  }
};

export const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviewsData, setReviewsData] = useState({ average_rating: 5, total_reviews: 3, reviews: [] });
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('specs'); // 'specs' | 'prevention' | 'supplier'
  const [addedMessage, setAddedMessage] = useState(false);
  const { addToCart } = useAuth();

  const defaultProductImage = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&q=80';

  useEffect(() => {
    Promise.all([
      api.get(`/products/${id}`),
      api.get(`/products/${id}/reviews`).catch(() => ({ data: { average_rating: 5, total_reviews: 3, reviews: [] } })),
    ])
      .then(([prodRes, revRes]) => {
        setProduct(prodRes.data || MOCK_FALLBACK_PRODUCT);
        setReviewsData(revRes.data || { average_rating: 5, total_reviews: 3, reviews: [] });
      })
      .catch(() => {
        setProduct({ ...MOCK_FALLBACK_PRODUCT, id: id || 1 });
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>Chargement de la fiche technique produit...</div>;
  if (!product) return <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>Produit introuvable.</div>;

  const reviewsList = Array.isArray(reviewsData.reviews) ? reviewsData.reviews : [];

  // Parse specifications if string or object
  let specsObj = {};
  if (product.specifications) {
    specsObj = typeof product.specifications === 'string' ? JSON.parse(product.specifications) : product.specifications;
  } else {
    // Default Fallback Specs for Demonstration
    specsObj = {
      'Garantie': '12 Mois pièces et main d\'œuvre',
      'Origine': 'Produit certifié distributeur officiel',
      'Statut Stock': product.stock > 0 ? 'En stock expédié sous 24h' : 'Sur commande',
      'Politique Anti-Retour': 'Vérification pré-expédition active par SMS/Chat',
    };
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 3000);
  };

  const getRiskBadge = (score) => {
    if (score === 'high') {
      return <span className="badge badge-danger" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}><AlertTriangle size={14} /> Risque de retour : Élevé (Vérification requise)</span>;
    }
    if (score === 'medium') {
      return <span className="badge badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}><Info size={14} /> Risque de retour : Moyen</span>;
    }
    return <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}><ShieldCheck size={14} /> Risque de retour : Faible (Article certifié)</span>;
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      
      {/* Breadcrumb Navigation */}
      <div style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        <Link to="/" style={{ color: 'var(--text-muted)' }}>Accueil</Link> /{' '}
        <Link to="/products" style={{ color: 'var(--text-muted)' }}>Catalogue</Link> /{' '}
        <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{product.name}</span>
      </div>

      <div className="grid grid-2" style={{ gap: '3rem', alignItems: 'start', marginBottom: '3rem' }}>
        
        {/* Left Column: Main Product Image & Badges */}
        <div>
          <div className="card" style={{ padding: '1rem', position: 'relative', overflow: 'hidden' }}>
            <img
              src={product.image_url || defaultProductImage}
              alt={product.name}
              style={{ width: '100%', maxHeight: '450px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
            />
            <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem' }}>
              {getRiskBadge(product.return_risk_score)}
            </div>
          </div>

          {/* Key Selling Highlights */}
          <div className="grid grid-2" style={{ gap: '1rem', marginTop: '1.5rem' }}>
            <div className="card" style={{ padding: '1rem', textAlign: 'center', background: 'var(--bg-subtle)' }}>
              <Truck size={22} color="var(--primary)" style={{ marginBottom: '0.3rem' }} />
              <h5 style={{ fontWeight: 700, margin: '0.2rem 0', fontSize: '0.95rem' }}>Livraison 58 Wilayas</h5>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Expédition Yalidine / Nord-Sud</span>
            </div>
            <div className="card" style={{ padding: '1rem', textAlign: 'center', background: 'var(--bg-subtle)' }}>
              <ShieldCheck size={22} color="var(--success)" style={{ marginBottom: '0.3rem' }} />
              <h5 style={{ fontWeight: 700, margin: '0.2rem 0', fontSize: '0.95rem' }}>Garantie Anti-Retour</h5>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Protection acheteur & vendeur</span>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Overview & Purchase Options */}
        <div>
          <div className="badge badge-info" style={{ marginBottom: '0.8rem' }}>
            {product.category?.name || 'High-Tech & Matériel Pro'}
          </div>

          <h1 style={{ fontSize: '2.1rem', fontWeight: 800, marginBottom: '0.8rem', color: 'var(--text-main)', lineHeight: 1.3 }}>
            {product.name}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', color: '#F59E0B' }}>
              <Star size={18} fill="#F59E0B" />
              <span style={{ fontWeight: 700, marginLeft: '0.3rem', color: 'var(--text-main)', fontSize: '1.05rem' }}>
                {reviewsData.average_rating || '5.0'}
              </span>
            </div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              ({reviewsData.total_reviews || 0} avis clients vérifiés après livraison)
            </span>
          </div>

          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '1.5rem' }}>
            {parseFloat(product.price).toLocaleString()} DZD
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem' }}>
            {product.description}
          </p>

          {/* Supplier Info Box */}
          <div className="card" style={{ background: 'var(--bg-subtle)', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <Store size={26} color="var(--primary)" />
              <div>
                <h4 style={{ fontWeight: 700, margin: 0 }}>{product.supplier?.shop_name || 'Tech DZ Pro'}</h4>
                <span className="badge badge-success" style={{ fontSize: '0.75rem', marginTop: '0.2rem' }}>
                  <ShieldCheck size={12} /> Fournisseur Certifié DZ (Taux de retour : {product.supplier?.return_rate || '2.1'}%)
                </span>
              </div>
            </div>
            {product.supplier?.id && (
              <Link to={`/suppliers/${product.supplier.id}`} className="btn btn-secondary btn-sm">
                Boutique <ArrowRight size={14} />
              </Link>
            )}
          </div>

          {/* Add to Cart Actions */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                style={{ padding: '0.75rem 1.2rem', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '1.1rem' }}
              >
                -
              </button>
              <span style={{ padding: '0.75rem 1.2rem', fontWeight: 700, fontSize: '1.05rem' }}>{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                style={{ padding: '0.75rem 1.2rem', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '1.1rem' }}
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="btn btn-primary"
              style={{ flex: 1, padding: '0.95rem 1.5rem', fontSize: '1.05rem', fontWeight: 700 }}
              disabled={product.stock <= 0}
            >
              <ShoppingBag size={20} />
              {product.stock > 0 ? 'Ajouter au panier' : 'Rupture de stock'}
            </button>
          </div>

          {addedMessage && (
            <div style={{ padding: '0.8rem 1rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#10b981', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
              <CheckCircle2 size={18} /> Produit ajouté au panier avec succès !
            </div>
          )}

        </div>
      </div>

      {/* Interactive Technical Datasheet Tabs (Fiche Technique & Prévention IA) */}
      <section className="card" style={{ padding: '2rem', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.8rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('specs')}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.1rem',
              fontWeight: 700,
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              color: activeTab === 'specs' ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: activeTab === 'specs' ? '3px solid var(--primary)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <FileText size={20} /> Fiche Technique Détaillée
          </button>
          <button
            onClick={() => setActiveTab('prevention')}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.1rem',
              fontWeight: 700,
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              color: activeTab === 'prevention' ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: activeTab === 'prevention' ? '3px solid var(--primary)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <ShieldCheck size={20} /> Prévention IA des Retours
          </button>
          <button
            onClick={() => setActiveTab('supplier')}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.1rem',
              fontWeight: 700,
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              color: activeTab === 'supplier' ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: activeTab === 'supplier' ? '3px solid var(--primary)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Store size={20} /> Informations Vendeur Pro
          </button>
        </div>

        {/* Tab 1: Technical Specs Matrix */}
        {activeTab === 'specs' && (
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.2rem' }}>Spécifications & Caractéristiques Produit</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.2rem' }}>
              {Object.entries(specsObj).map(([key, value], idx) => (
                <div key={idx} style={{ background: 'var(--bg-subtle)', padding: '1rem 1.2rem', borderRadius: 'var(--radius-sm)', borderLeft: '4px solid var(--primary)' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '0.3rem', fontWeight: 600 }}>
                    {key}
                  </span>
                  <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {typeof value === 'object' ? JSON.stringify(value) : value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: AI Anti-Return Prevention Info */}
        {activeTab === 'prevention' && (
          <div style={{ background: 'rgba(99, 102, 241, 0.05)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
              <ShieldCheck size={28} color="var(--primary)" />
              <div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Algorithme de Prévention des Erreurs de Commande</h4>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Score calculé par l'Agent IA Marketplace DZ</span>
              </div>
            </div>

            <p style={{ lineHeight: 1.6, color: 'var(--text-main)', marginBottom: '1.2rem' }}>
              Notre plateforme analyse en amont les caractéristiques de cet article pour éliminer 95% des retours dus à une erreur de taille, de compatibilité ou d'attentes mal calibrées.
            </p>

            <div className="grid grid-2" style={{ gap: '1rem' }}>
              <div style={{ background: 'var(--card-bg)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <h5 style={{ fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--success)' }}>✔ Conseil Vérification Avant Achat</h5>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>
                  {specsObj['Guide Anti-Retour'] || 'Vérifiez la taille, les dimensions ou les spécifications techniques affichées ci-dessus avant de confirmer votre commande.'}
                </p>
              </div>
              <div style={{ background: 'var(--card-bg)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <h5 style={{ fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--primary)' }}>⚡ Confirmation Pré-Expédition</h5>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>
                  Une fois la commande passée, le fournisseur ou notre assistant IA validera avec vous la concordance des détails par messagerie ou SMS.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Supplier Details */}
        {activeTab === 'supplier' && (
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem' }}>À Propos du Vendeur Partenaire</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {product.supplier?.company_description || 'Grossiste et fabricant officiel certifié sur la plateforme.'}
            </p>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>Catégorie Pro</span>
                <span style={{ fontWeight: 700 }}>{product.supplier?.business_category || 'Distributeur Exclusif'}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>Localisation</span>
                <span style={{ fontWeight: 700 }}>{product.supplier?.address || 'Alger, Algérie'}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>Taux de retour boutique</span>
                <span style={{ fontWeight: 700, color: 'var(--success)' }}>{product.supplier?.return_rate || '2.10'}% (Excellente réputation)</span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Verified Customer Reviews Section */}
      <section className="card" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.5rem' }}>Avis clients vérifiés</h3>

        {reviewsList.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>Aucun avis déposé pour le moment. Seuls les acheteurs ayant confirmé la réception peuvent soumettre une évaluation.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {reviewsList.map((rev) => (
              <div key={rev.id} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{rev.customer?.name || 'Client vérifié DZ'}</span>
                  <div style={{ display: 'flex', color: '#F59E0B' }}>
                    {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                      <Star key={i} size={15} fill="#F59E0B" />
                    ))}
                  </div>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0, lineHeight: 1.5 }}>
                  {rev.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
