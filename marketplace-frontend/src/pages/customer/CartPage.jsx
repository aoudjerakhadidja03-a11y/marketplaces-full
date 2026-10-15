import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Trash2, AlertCircle, ShoppingBag, ArrowRight } from 'lucide-react';

export const CartPage = () => {
  const { cart, removeFromCart, updateCartQuantity, addToCart } = useAuth();
  const navigate = useNavigate();

  // Group cart items by supplier
  const groupedCart = cart.reduce((acc, item) => {
    const suppId = item.product.supplier?.id || 'unknown';
    const suppName = item.product.supplier?.shop_name || 'Boutique Partenaire';
    if (!acc[suppId]) {
      acc[suppId] = { supplierName: suppName, items: [] };
    }
    acc[suppId].items.push(item);
    return acc;
  }, {});

  const supplierCount = Object.keys(groupedCart).length;
  const grandTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '900px' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Mon Panier</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Vérifiez les articles dans votre panier avant de passer commande</p>

      {cart.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
          <ShoppingBag size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Votre panier est vide</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Parcourez notre catalogue ou ajoutez un produit test pour simuler une commande.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
            <Link to="/products" className="btn btn-primary">Découvrir les produits</Link>
            <button
              onClick={() => {
                addToCart({
                  id: 1,
                  name: 'Écouteurs Sans Fil Bluetooth Pro 5 - ANC',
                  price: 4800,
                  image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80',
                  supplier: { id: 1, shop_name: 'Tech DZ Pro' },
                }, 1);
              }}
              className="btn btn-secondary"
            >
              ⚡ Ajouter un article test (Écouteurs ANC)
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Multi-Supplier Warning Banner */}
          {supplierCount > 1 && (
            <div className="card" style={{ background: 'var(--warning-bg)', borderColor: 'var(--warning)', marginBottom: '2rem', display: 'flex', alignItems: 'flex-start', gap: '0.8rem' }}>
              <AlertCircle size={22} color="var(--warning)" style={{ shrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={{ fontWeight: 700, color: 'var(--warning)' }}>Panier multi-fournisseurs</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginTop: '0.2rem' }}>
                  Votre panier contient des articles de <strong>{supplierCount} fournisseurs différents</strong>. Lors de la validation, votre panier sera divisé en <strong>{supplierCount} commandes séparées</strong> pour faciliter le suivi de chaque livraison.
                </p>
              </div>
            </div>
          )}

          {/* Items grouped by supplier */}
          {Object.entries(groupedCart).map(([suppId, group]) => (
            <div key={suppId} className="card" style={{ marginBottom: '1.5rem' }}>
              <div style={{ paddingBottom: '0.8rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1rem', fontWeight: 700, fontSize: '1.1rem', color: 'var(--primary)' }}>
                Boutique : {group.supplierName}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {group.items.map((item) => (
                  <div key={item.product.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img src={item.product.image_url} alt={item.product.name} style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                      <div>
                        <h4 style={{ fontWeight: 600, fontSize: '1rem' }}>{item.product.name}</h4>
                        <div style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 700 }}>
                          {parseFloat(item.product.price).toLocaleString()} DZD
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
                        <button onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)} style={{ padding: '0.3rem 0.75rem', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 700 }}>-</button>
                        <span style={{ padding: '0.3rem 0.75rem', fontWeight: 700 }}>{item.quantity}</span>
                        <button onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)} style={{ padding: '0.3rem 0.75rem', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 700 }}>+</button>
                      </div>

                      <div style={{ fontWeight: 700, minWidth: '100px', textAlign: 'right' }}>
                        {(item.product.price * item.quantity).toLocaleString()} DZD
                      </div>

                      <button onClick={() => removeFromCart(item.product.id)} className="btn btn-outline btn-sm" style={{ borderColor: 'var(--error)', color: 'var(--error)' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Total & Checkout button */}
          <div className="card" style={{ background: 'var(--bg-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
            <div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Montant Total Estimé</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>{grandTotal.toLocaleString()} DZD</div>
            </div>

            <button onClick={() => navigate('/checkout')} className="btn btn-primary" style={{ padding: '0.85rem 2rem' }}>
              Passer la commande <ArrowRight size={18} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};
