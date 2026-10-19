import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../../services/api';
import { Package, MessageSquare, CheckCircle2, AlertTriangle, Star, RotateCcw, X, Send, Bot } from 'lucide-react';
import { ReturnCounterWidget } from '../../components/ReturnCounterWidget';

export const CustomerOrders = () => {
  const location = useLocation();
  const placedSuccessId = location.state?.orderId;
  const [successBanner, setSuccessBanner] = useState(!!placedSuccessId);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewOrder, setReviewOrder] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  // Return ticket modal state
  const [returnOrder, setReturnOrder] = useState(null);
  const [reasonCategory, setReasonCategory] = useState('size_issue');
  const [reasonDetails, setReasonDetails] = useState('');
  const [submittingReturn, setSubmittingReturn] = useState(false);
  const [refreshCounterSignal, setRefreshCounterSignal] = useState(0);

  const defaultSampleOrders = [
    {
      id: 1042,
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      total_amount: '8900.00',
      status: 'delivered',
      delivery_confirmation: 'confirmed',
      supplier: { shop_name: 'Tech DZ Pro' },
      shipment: { tracking_number: 'YAL-884210', status: 'Livré & Remis en main propre' },
      items: [
        {
          id: 1,
          quantity: 1,
          unit_price: '8900.00',
          total_price: '8900.00',
          product: {
            id: 1,
            name: 'Casque Sans-Fil Anti-Bruit ANC Pro',
            image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60',
          }
        }
      ]
    },
    {
      id: 1043,
      created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
      total_amount: '5400.00',
      status: 'en_cours',
      delivery_confirmation: null,
      supplier: { shop_name: 'Élégance Couture Alger' },
      shipment: { tracking_number: 'YAL-992314', status: 'En acheminement vers le centre de tri' },
      items: [
        {
          id: 2,
          quantity: 1,
          unit_price: '5400.00',
          total_price: '5400.00',
          product: {
            id: 3,
            name: 'Veste Blazer Tailleur Élégante Femme',
            image_url: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=500&auto=format&fit=crop&q=60',
          }
        }
      ]
    }
  ];

  const fetchOrders = () => {
    setLoading(true);

    api.get('/orders')
      .then((res) => {
        if (res.data?.data && Array.isArray(res.data.data)) {
          setOrders(res.data.data);
        } else {
          setOrders([]);
        }
      })
      .catch(() => {
        setOrders([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleConfirmDelivery = (orderId, confirmation) => {
    const notes = prompt(
      confirmation === 'confirmed'
        ? 'Remarque facultative sur la livraison :'
        : 'Indiquez la raison du problème de livraison :'
    );

    api.post(`/shipments/${orderId}/confirm`, { confirmation, notes })
      .then((res) => {
        alert(res.data.message);
        fetchOrders();
      })
      .catch((err) => alert(err.response?.data?.message || 'Erreur lors de la confirmation.'));
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewOrder || !reviewOrder.items?.[0]) return;

    api.post('/reviews', {
      order_id: reviewOrder.id,
      product_id: reviewOrder.items[0].product_id,
      rating,
      comment,
    })
      .then((res) => {
        alert(res.data.message);
        setReviewOrder(null);
      })
      .catch((err) => alert(err.response?.data?.message || 'Erreur lors du dépôt de l\'avis.'));
  };

  const handleCreateReturnTicket = (e) => {
    e.preventDefault();
    if (!returnOrder) return;
    setSubmittingReturn(true);

    const firstProductId = returnOrder.items?.[0]?.product_id || null;

    api.post('/returns', {
      order_id: returnOrder.id,
      product_id: firstProductId,
      reason_category: reasonCategory,
      reason_details: reasonDetails,
    })
      .then((res) => {
        alert(res.data.message || 'Ticket de retour créé et synchronisé avec le fournisseur.');
        setReturnOrder(null);
        setReasonDetails('');
        fetchOrders();
        setRefreshCounterSignal(prev => prev + 1);
      })
      .catch((err) => alert(err.response?.data?.message || 'Erreur lors de la déclaration du retour.'))
      .finally(() => setSubmittingReturn(false));
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>

      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>Mes Commandes & Suivi des Retours</h1>
          <p style={{ color: 'var(--text-muted)', margin: '0.3rem 0 0 0' }}>Consultez vos commandes, confirmez vos réceptions et gérez vos retours en temps réel</p>
        </div>
        <Link to="/returns" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', borderColor: 'var(--primary)', color: 'var(--primary)', fontWeight: 700 }}>
          <RotateCcw size={16} /> Ouvrir le Centre de Suivi des Retours
        </Link>
      </div>

      {successBanner && (
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', borderRadius: '14px', padding: '1.25rem 1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <CheckCircle2 color="#10b981" size={28} />
            <div>
              <h4 style={{ margin: 0, color: '#10b981', fontWeight: 800, fontSize: '1.1rem' }}>🎉 Commande #{placedSuccessId} enregistrée avec succès !</h4>
              <p style={{ margin: '0.25rem 0 0 0', color: '#cbd5e1', fontSize: '0.9rem' }}>
                Votre colis est en cours de préparation par le fournisseur et sera pris en charge par le réseau express Yalidine.
              </p>
            </div>
          </div>
          <button onClick={() => setSuccessBanner(false)} className="btn btn-sm btn-outline" style={{ color: '#10b981', borderColor: '#10b981' }}>OK</button>
        </div>
      )}

      {/* Return Counter Widget */}
      <ReturnCounterWidget key={refreshCounterSignal} userRole="customer" />

      {loading ? (
        <p>Chargement de vos commandes...</p>
      ) : orders.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem', background: 'rgba(30, 41, 59, 0.7)', borderRadius: '16px' }}>
          <Package size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Aucune commande trouvée</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Vous n'avez pas encore effectué de commande.</p>
          <Link to="/products" className="btn btn-primary">Faire des achats</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map((order) => (
            <div key={order.id} className="card" style={{ background: 'rgba(30, 41, 59, 0.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '0.8rem', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: '#38bdf8' }}>Commande #{order.id}</h3>
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                    Boutique : <strong style={{ color: '#fff' }}>{order.supplier?.shop_name || 'Fournisseur'}</strong> · Date : {new Date(order.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <span className={`badge ${order.status === 'delivered' || order.status === 'confirmed_by_customer' ? 'badge-success' : order.status === 'returned' ? 'badge-warning' : 'badge-info'}`}>
                    {order.status === 'returned' ? '↩️ En Procédure de Retour' : order.status}
                  </span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
                    {parseFloat(order.total_amount).toLocaleString()} DZD
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.25rem' }}>
                {order.items?.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.95rem', color: '#e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      {item.product?.image_url && <img src={item.product?.image_url} alt={item.product?.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }} />}
                      <span>{item.product?.name} × <strong>{item.quantity}</strong></span>
                    </div>
                    <span style={{ fontWeight: 600 }}>{parseFloat(item.total_price).toLocaleString()} DZD</span>
                  </div>
                ))}
              </div>

              {/* Action Bar */}
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                  Statut Livraison : <strong style={{ color: '#cbd5e1' }}>{order.shipment?.status || 'En préparation'}</strong>
                </div>

                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <Link to={`/customer/chat/${order.id}`} className="btn btn-secondary btn-sm">
                    <MessageSquare size={16} /> Dialogue Fournisseur
                  </Link>

                  {/* Return Button */}
                  {order.status !== 'returned' && order.status !== 'cancelled' && (
                    <button
                      onClick={() => setReturnOrder(order)}
                      className="btn btn-outline btn-sm"
                      style={{ borderColor: 'rgba(239, 68, 68, 0.5)', color: '#fca5a5', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                      <RotateCcw size={15} /> Déclarer un Retour
                    </button>
                  )}

                  {/* Customer confirmation buttons */}
                  {(order.status === 'shipped' || order.status === 'delivered') && (
                    <>
                      <button onClick={() => handleConfirmDelivery(order.id, 'confirmed')} className="btn btn-primary btn-sm">
                        <CheckCircle2 size={16} /> J'ai reçu ma commande
                      </button>
                      <button onClick={() => handleConfirmDelivery(order.id, 'not_received')} className="btn btn-outline btn-sm" style={{ borderColor: 'var(--error)', color: 'var(--error)' }}>
                        <AlertTriangle size={16} /> Colis non reçu
                      </button>
                    </>
                  )}

                  {order.status === 'confirmed_by_customer' && (
                    <button onClick={() => setReviewOrder(order)} className="btn btn-primary btn-sm">
                      <Star size={16} /> Avis
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Return Declaration Modal */}
      {returnOrder && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999, padding: '1rem'
        }}>
          <div style={{
            background: '#0f172a', border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '20px', maxWidth: '500px', width: '100%', padding: '1.8rem',
            color: '#fff', boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <RotateCcw style={{ color: '#ef4444' }} /> Déclaration de Retour - Commande #{returnOrder.id}
              </h3>
              <button onClick={() => setReturnOrder(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleCreateReturnTicket} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.4rem', fontWeight: 600 }}>Motif Principal du Retour</label>
                <select
                  value={reasonCategory}
                  onChange={(e) => setReasonCategory(e.target.value)}
                  style={{
                    width: '100%', background: 'rgba(30, 41, 59, 0.9)',
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px',
                    padding: '0.8rem', color: '#fff', outline: 'none'
                  }}
                >
                  <option value="size_issue">Problème de Taille / Dimension</option>
                  <option value="defective">Produit Défectueux / Endommagé</option>
                  <option value="not_as_described">Non Conforme à la Description</option>
                  <option value="wrong_item">Mauvais Article Reçu</option>
                  <option value="delivery_delay">Retard de Livraison Abusif</option>
                  <option value="mind_changed">Changement d'Avis</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.4rem', fontWeight: 600 }}>Explications & Détails</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Décrivez précisément l'anomalie ou la raison du retour..."
                  value={reasonDetails}
                  onChange={(e) => setReasonDetails(e.target.value)}
                  style={{
                    width: '100%', background: 'rgba(30, 41, 59, 0.9)',
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px',
                    padding: '0.8rem', color: '#fff', outline: 'none'
                  }}
                />
              </div>

              <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '0.8rem', borderRadius: '10px', fontSize: '0.8rem', color: '#c084fc' }}>
                💡 En soumettant cette demande, le Compteur de Retours sera mis à jour en direct côté fournisseur.
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem' }}>
                <button type="button" onClick={() => setReturnOrder(null)} className="btn btn-secondary btn-sm">Annuler</button>
                <button type="submit" disabled={submittingReturn} className="btn btn-primary btn-sm">
                  {submittingReturn ? 'Envoi...' : 'Valider le Retour'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
