import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Search, Filter, ShoppingBag } from 'lucide-react';

export const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useAuth();

  const queryQ = searchParams.get('q') || '';
  const queryCat = searchParams.get('category_id') || '';
  const queryInStock = searchParams.get('in_stock') || '1';

  const [q, setQ] = useState(queryQ);
  const [categoryId, setCategoryId] = useState(queryCat);
  const [inStock, setInStock] = useState(queryInStock === '1');

  const defaultProductImage = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80';

  const fallbackProducts = [
    {
      id: 1,
      name: 'Écouteurs Sans Fil Bluetooth Pro 5 - ANC',
      price: 4800,
      image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80',
      category: { name: 'Électronique & High-Tech' },
      supplier: { shop_name: 'Tech DZ Pro' },
    },
    {
      id: 2,
      name: 'Montre Connectée Sport Waterproof AMOLED 1.43"',
      price: 9500,
      image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
      category: { name: 'Électronique & High-Tech' },
      supplier: { shop_name: 'Tech DZ Pro' },
    },
    {
      id: 3,
      name: 'Chargeur Ultra Rapide GaN 65W Triple Port',
      price: 3600,
      image_url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&q=80',
      category: { name: 'Électronique & High-Tech' },
      supplier: { shop_name: 'Tech DZ Pro' },
    },
    {
      id: 4,
      name: 'Sac à Main Cuir Véritable Artisanat de Luxe',
      price: 7200,
      image_url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80',
      category: { name: 'Vêtements & Accessoires' },
      supplier: { shop_name: 'Amel Fashion & House' },
    },
    {
      id: 5,
      name: 'Veste Blazer Tailleur Élégante Femme',
      price: 7900,
      image_url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80',
      category: { name: 'Vêtements & Accessoires' },
      supplier: { shop_name: 'Amel Fashion & House' },
    },
    {
      id: 6,
      name: 'Robot Blender Multifonction 1200W Bol Verre Incassable',
      price: 11500,
      image_url: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600&q=80',
      category: { name: 'Maison & Électroménager' },
      supplier: { shop_name: 'Maison DZ Direct' },
    },
  ];

  useEffect(() => {
    api.get('/categories')
      .then((res) => {
        const catList = Array.isArray(res.data) ? res.data : Array.isArray(res.data?.data) ? res.data.data : [];
        setCategories(catList);
      })
      .catch(() => setCategories([]));
  }, []);

  const fetchProducts = (page = 1) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (categoryId) params.set('category_id', categoryId);
    if (inStock) params.set('in_stock', '1');
    params.set('page', page);

    api.get(`/products?${params.toString()}`)
      .then((res) => {
        const prodList = Array.isArray(res.data?.data) ? res.data.data : Array.isArray(res.data) ? res.data : [];
        setProducts(prodList.length > 0 ? prodList : fallbackProducts);
        setPagination(res.data.current_page ? res.data : null);
      })
      .catch(() => setProducts(fallbackProducts))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts(1);
  }, [searchParams]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const newParams = {};
    if (q) newParams.q = q;
    if (categoryId) newParams.category_id = categoryId;
    if (inStock) newParams.in_stock = '1';
    setSearchParams(newParams);
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 900 }}>Catalogue des Produits Marketeria</h1>
        <p style={{ color: 'var(--text-muted)' }}>Fiches techniques certifiées et garantie de conformité pré-expédition</p>
      </div>

      {/* Filter Bar */}
      <form onSubmit={handleFilterSubmit} className="card" style={{ marginBottom: '2.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: '220px' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Rechercher un produit ou une marque..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
            <Search size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>
        </div>

        <div style={{ minWidth: '180px' }}>
          <select className="form-select" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="">Toutes les catégories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="checkbox"
            id="inStockCheck"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
          />
          <label htmlFor="inStockCheck" style={{ fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>
            En stock uniquement
          </label>
        </div>

        <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '0.75rem 1.5rem', fontWeight: 700 }}>
          <Filter size={16} /> Filtrer
        </button>
      </form>

      {/* Product Grid */}
      {loading ? (
        <p style={{ textAlign: 'center', padding: '3rem' }}>Chargement des produits en cours...</p>
      ) : products.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Aucun produit ne correspond à votre recherche.
          </p>
          <button onClick={() => { setQ(''); setCategoryId(''); setInStock(true); setSearchParams({}); }} className="btn btn-secondary btn-sm">
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-4" style={{ marginBottom: '2.5rem', gap: '1.25rem' }}>
            {products.map((prod) => (
              <div key={prod.id} className="card card-interactive" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <img
                    src={prod.image_url || defaultProductImage}
                    alt={prod.name}
                    style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', marginBottom: '1rem' }}
                  />
                  <div className="badge badge-info" style={{ marginBottom: '0.5rem' }}>
                    {prod.category?.name || 'High-Tech'}
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                    <Link to={`/products/${prod.id}`} style={{ color: 'var(--text-main)' }}>{prod.name}</Link>
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.8rem' }}>
                    Vendeur : <strong>{prod.supplier?.shop_name || 'Tech DZ Pro'}</strong>
                  </p>
                </div>

                <div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.8rem' }}>
                    {parseFloat(prod.price).toLocaleString()} DZD
                  </div>
                  <button onClick={() => addToCart(prod, 1)} className="btn btn-primary btn-sm" style={{ width: '100%', fontWeight: 700 }}>
                    <ShoppingBag size={16} /> Ajouter au panier
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.last_page > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
              {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => fetchProducts(p)}
                  className={`btn btn-sm ${p === pagination.current_page ? 'btn-primary' : 'btn-secondary'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
