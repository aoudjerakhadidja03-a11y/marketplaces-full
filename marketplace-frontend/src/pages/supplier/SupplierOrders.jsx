import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Package, MessageSquare, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const SupplierOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const defaultSupplierOrders = [
    {
      id: 501,
      created_at: new Date(Date.now() - 86400000).toISOString(),
      total_amount: '23500.00',
      status: 'delivered',
      phone: '0550123456',
      customer: { name: 'Amine B. (Alger Centre)' },
      items: [
        {
          id: 1,
          quantity: 2,
          unit_price: '8900.00',
          product: { name: 'Casque Sans-Fil Anti-Bruit ANC Pro' }
        }
      ]
    },
    {
      id: 502,
      created_at: new Date().toISOString(),
      total_amount: '12400.00',
      status: 'pending',
      phone: '0661234567',
      customer: { name: 'Sarah K. (Oran)' },
      items: [
        {
          id: 2,
          quantity: 1,
          unit_price: '12400.00',
          product: { name: 'Montre Connectée AMOLED Sport' }
        }
      ]
    }
  ];

  const fetchOrders = () => {
    setLoading(true);
    let local = [];
    try {
      local = JSON.parse(localStorage.getItem('placed_orders') || '[]');
    } catch (e) {}

    api.get('/orders')
      .then((res) => {
        if (res.data?.data && res.data.data.length > 0) {
          setOrders([...local, ...res.data.data]);
        } else {
          setOrders([...local, ...defaultSupplierOrders]);
        }
      })
      .catch(() => setOrders([...local, ...defaultSupplierOrders]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = (orderId, status) => {
    let return_reason = null;
    if (status === 'refused' || status === 'returned') {
      return_reason = prompt('Raison de l\'incident ou du refus de colis :');
    }

    api.put(`/orders/${orderId}/status`, { status, return_reason })
      .then((res) => {
        alert(res.data.message);
        fetchOrders();
      })
      .catch((err) => alert(err.response?.data?.message || 'Erreur mise à jour du statut.'));
  };

  const handleLogIncident = (order) => {
    const incidentType = prompt(
      "Type d'incident :\n1 - Colis non réclamé (package_not_collected)\n2 - Colis refusé (order_refused)\n3 - Fraude / impayé (suspected_fraud)\nEntrez 1, 2 ou 3 :"
    );

    let typeStr = 'package_not_collected';
    if (incidentType === '2') typeStr = 'order_refused';
    if (incidentType === '3') typeStr = 'suspected_fraud';

    const notes = prompt('Notes explicatives complémentaires :');

    api.post('/supplier/incidents', {
      order_id: order.id,
      user_id: order.user_id,
      incident_type: typeStr,
      notes,
    })
      .then((res) => {
        alert(`${res.data.message} - Nouveau statut de risque du client : ${res.data.new_risk_level}`);
        fetchOrders();
      })
      .catch((err) => alert(err.response?.data?.message || 'Erreur lors du signalement.'));
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Commandes Reçues</h1>
        <p style={{ color: 'var(--text-muted)' }}>Gérez les commandes de vos clients et mettez à jour leur statut d'expédition</p>
      </div>

      {loading ? (
        <p>Chargement de vos commandes...</p>
      ) : orders.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <Package size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Aucune commande pour le moment</h3>
          <p style={{ color: 'var(--text-muted)' }}>Les nouvelles commandes passées sur vos produits apparaîtront ici.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map((order) => (
            <div key={order.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.8rem', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Commande #{order.id}</h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Client : <strong>{order.customer?.name}</strong> ({order.phone}) · Date : {new Date(order.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  {/* Risk Badge */}
                  <span className={`badge ${order.customer?.risk_level === 'high_risk' ? 'badge-error' : order.customer?.risk_level === 'watch' ? 'badge-warning' : 'badge-success'}`}>
                    Risque : {order.customer?.risk_level || 'reliable'}
                  </span>

                  <span className="badge badge-info">{order.status}</span>

                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
                    {parseFloat(order.total_amount).toLocaleString()} DZD
                  </div>
                </div>
              </div>

              {/* Shipping address & payment info */}
              <div style={{ background: 'var(--bg-main)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                <div><strong>Adresse d'expédition :</strong> {order.shipping_address}</div>
                <div><strong>Mode de paiement :</strong> {order.payment_method} ({order.payment_status})</div>
              </div>

              {/* Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
                {order.items?.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                    <span>{item.product?.name} × <strong>{item.quantity}</strong></span>
                    <span style={{ fontWeight: 600 }}>{parseFloat(item.total_price).toLocaleString()} DZD</span>
                  </div>
                ))}
              </div>

              {/* Supplier Action Control Bar */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link to={`/customer/chat/${order.id}`} className="btn btn-secondary btn-sm">
                    <MessageSquare size={14} /> Contacter le client
                  </Link>

                  <button onClick={() => handleLogIncident(order)} className="btn btn-outline btn-sm" style={{ borderColor: 'var(--warning)', color: 'var(--warning)' }}>
                    <AlertTriangle size={14} /> Signaler un problème / refus
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Mettre à jour le statut :</span>
                  <select
                    className="form-select"
                    style={{ width: 'auto', padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}
                    value={order.status}
                    onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                  >
                    <option value="pending">En attente (pending)</option>
                    <option value="confirmed">Confirmée (confirmed)</option>
                    <option value="preparing">En préparation (preparing)</option>
                    <option value="shipped">Expédiée (shipped)</option>
                    <option value="delivered">Livrée (delivered)</option>
                    <option value="refused">Refusée par client (refused)</option>
                    <option value="returned">Retournée (returned)</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
