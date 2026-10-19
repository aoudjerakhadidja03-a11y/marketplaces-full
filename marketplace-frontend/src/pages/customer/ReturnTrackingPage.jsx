import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  RotateCcw,
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Printer,
  X,
  Plus,
  Bot,
  Sparkles,
  ShieldCheck,
  MessageSquare,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  QrCode,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
  Star,
  Check
} from 'lucide-react';
import { AiReturnAssistantModal } from '../../components/AiReturnAssistantModal';

export const ReturnTrackingPage = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Active view tab: 'all' | 'tickets' | 'orders'
  const [activeSectionTab, setActiveSectionTab] = useState('all');

  // Search & Direct Tracking state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedTicket, setSearchedTicket] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');

  // Main data states
  const [tickets, setTickets] = useState([]);
  const [orders, setOrders] = useState([]);
  const [expandedTicketIds, setExpandedTicketIds] = useState([1]); // First ticket expanded by default
  const [metrics, setMetrics] = useState({
    total_returns: 2,
    pending_returns: 1,
    approved_returns: 1,
    completed_returns: 1,
    return_rate_percent: 2.10,
    reliability_tier: 'trusted',
    payment_restriction: 'none',
  });
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  // Modals
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTicketForSlip, setSelectedTicketForSlip] = useState(null);

  // New Return Form state
  const [newReturnForm, setNewReturnForm] = useState({
    order_id: '',
    product_id: '',
    resolution_type: 'exchange', // exchange or refund
    reason_category: 'size_issue',
    reason_details: '',
    wilaya: '16 - Alger',
    dropoff_mode: 'stop_desk', // stop_desk or home_pickup
  });
  const [submittingReturn, setSubmittingReturn] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  // Default sample orders (matching the screenshot)
  const defaultSampleOrders = [
    {
      id: 1042,
      created_at: '2026-10-12T14:30:00Z',
      formatted_date: '12/10/2026',
      total_amount: '8900.00',
      status: 'delivered',
      delivery_confirmation: 'confirmed',
      supplier: { shop_name: 'Tech DZ Pro', phone: '0550000000', address: 'Boulevard Mohamed V, Alger Centre' },
      shipment: { tracking_number: 'YAL-884210', status: 'Livré & Remis en main propre' },
      items: [
        {
          id: 1,
          quantity: 1,
          unit_price: '8900.00',
          total_price: '8900.00',
          product_id: 1,
          product: {
            id: 1,
            name: 'Casque Sans-Fil Anti-Bruit ANC Pro',
            icon: '🎧',
            image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60',
          }
        }
      ]
    },
    {
      id: 1043,
      created_at: '2026-10-14T09:15:00Z',
      formatted_date: '14/10/2026',
      total_amount: '5400.00',
      status: 'shipped',
      delivery_confirmation: null,
      supplier: { shop_name: 'Élégance Couture Alger', phone: '0555112233', address: 'Oran & Alger' },
      shipment: { tracking_number: 'YAL-992314', status: 'En acheminement vers le centre de tri' },
      items: [
        {
          id: 2,
          quantity: 1,
          unit_price: '5400.00',
          total_price: '5400.00',
          product_id: 3,
          product: {
            id: 3,
            name: 'Veste Blazer Tailleur Élégante Femme',
            icon: '👗',
            image_url: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=500&auto=format&fit=crop&q=60',
          }
        }
      ]
    }
  ];

  // Default sample return tickets (matching the top card in the screenshot)
  const defaultSampleTickets = [
    {
      id: 1,
      ticket_number: 'RET-774812-20260901',
      order_id: 1043,
      reason_category: 'size_issue',
      reason_details: 'La veste était trop ajustée au niveau des épaules (Erreur de taille).',
      status: 'approved',
      status_display: '✓ Validé',
      resolution_type: 'exchange',
      refund_amount: 7900.00,
      created_at: '2026-09-01T10:00:00Z',
      formatted_date: '01/09/2026',
      updated_at: '2026-09-02T10:00:00Z',
      tracking_number_return: 'YAL-RET-992314',
      supplier: { shop_name: 'Élégance Couture Alger', phone: '0555112233', address: 'Oran & Alger' },
      product: {
        id: 3,
        name: 'Veste Blazer Tailleur Élégante Femme',
        image_url: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=500&auto=format&fit=crop&q=60',
        price: 7900
      },
      order: { id: 1043, total_amount: 7900 },
      ai_prevention_advice: 'Conseil IA : Guide de mensurations proposé. Le fournisseur a confirmé la préparation directe de la taille L sous 48h sans aucuns frais supplémentaires.',
      timeline: [
        { step: '1. Déclaré', desc: 'Demande acheteur', done: true },
        { step: '2. Accord Vendeur', desc: 'Validation fournisseur', done: true },
        { step: '3. En Transit', desc: 'Bordereau Yalidine prêt', done: true },
        { step: '4. Réceptionné', desc: 'Contrôle atelier', done: false },
        { step: '5. Finalisé', desc: 'Échange réexpédié', done: false },
      ]
    },
    {
      id: 2,
      ticket_number: 'RET-884210-20260902',
      order_id: 1042,
      reason_category: 'defective',
      reason_details: 'Le bouton gauche de réduction de bruit ANC présente un grésillement.',
      status: 'pending_approval',
      status_display: '⏳ En Attente',
      resolution_type: 'refund',
      refund_amount: 8900.00,
      created_at: '2026-09-02T11:30:00Z',
      formatted_date: '02/09/2026',
      updated_at: '2026-09-02T11:30:00Z',
      tracking_number_return: 'YAL-RET-884210',
      supplier: { shop_name: 'Tech DZ Pro', phone: '0550000000', address: 'Boulevard Mohamed V, Alger Centre' },
      product: {
        id: 1,
        name: 'Casque Sans-Fil Anti-Bruit ANC Pro',
        image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60',
        price: 8900
      },
      order: { id: 1042, total_amount: 8900 },
      ai_prevention_advice: 'Conseil IA : Assurez-vous d\'avoir réinitialisé le casque selon le guide constructeur avant renvoi physique pour préserver votre Score de Fiabilité Client.',
      timeline: [
        { step: '1. Déclaré', desc: 'Demande acheteur', done: true },
        { step: '2. Accord Vendeur', desc: 'Examen sous 24h', done: false },
        { step: '3. En Transit', desc: 'Réseau Yalidine', done: false },
        { step: '4. Réceptionné', desc: 'Inspection labo', done: false },
        { step: '5. Finalisé', desc: 'Remboursement CCP', done: false },
      ]
    }
  ];

  const fetchReturnsData = async () => {
    setLoading(true);

    // Retrieve locally placed orders if any
    let localOrders = [];
    try {
      localOrders = JSON.parse(localStorage.getItem('placed_orders') || '[]');
    } catch (e) {}

    try {
      const [ticketsRes, counterRes, ordersRes] = await Promise.all([
        api.get('/returns').catch(() => null),
        api.get('/returns/counter').catch(() => null),
        api.get('/orders').catch(() => null),
      ]);

      if (ticketsRes?.data?.data && Array.isArray(ticketsRes.data.data) && ticketsRes.data.data.length > 0) {
        setTickets(ticketsRes.data.data);
      } else {
        setTickets(defaultSampleTickets);
      }

      if (counterRes?.data?.data) {
        setMetrics(counterRes.data.data);
      }

      if (ordersRes?.data?.data && Array.isArray(ordersRes.data.data) && ordersRes.data.data.length > 0) {
        setOrders(ordersRes.data.data);
      } else {
        setOrders(defaultSampleOrders);
      }
    } catch (e) {
      setTickets(defaultSampleTickets);
      setOrders(defaultSampleOrders);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturnsData();
  }, []);

  // Toggle ticket expansion
  const toggleTicketExpand = (id) => {
    setExpandedTicketIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Quick Direct Search
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    setSearchError('');
    setSearchedTicket(null);

    try {
      const res = await api.get(`/returns/track/${encodeURIComponent(searchQuery.trim())}`);
      if (res.data?.data) {
        setSearchedTicket(res.data.data);
      } else {
        setSearchError(`Aucun dossier trouvé pour "${searchQuery}".`);
      }
    } catch (err) {
      // Look up locally
      const cleanQ = searchQuery.toLowerCase().trim().replace('#', '');
      const match = tickets.find(
        t => t.ticket_number?.toLowerCase().includes(cleanQ) ||
             String(t.order_id).includes(cleanQ)
      );
      if (match) {
        setSearchedTicket(match);
      } else {
        setSearchError(`Aucun dossier de retour correspondant à la référence "${searchQuery}".`);
      }
    } finally {
      setSearchLoading(false);
    }
  };

  // Open Return Declaration pre-filled for an order
  const openReturnForOrder = (order) => {
    const firstProd = order.items?.[0]?.product_id || order.items?.[0]?.product?.id || '';
    setNewReturnForm({
      order_id: String(order.id),
      product_id: String(firstProd),
      resolution_type: 'exchange',
      reason_category: 'size_issue',
      reason_details: '',
      wilaya: '16 - Alger',
      dropoff_mode: 'stop_desk',
    });
    setShowCreateModal(true);
  };

  // Confirm order delivery or mark non-receipt
  const handleConfirmDelivery = (orderId, confirmation) => {
    const isReceived = confirmation === 'confirmed';
    const notes = prompt(
      isReceived
        ? 'Remarque facultative sur la réception du colis :'
        : 'Indiquez la raison du signalement (colis en retard, non présenté, etc.) :'
    );

    api.post(`/shipments/${orderId}/confirm`, { confirmation, notes })
      .then((res) => {
        setActionSuccessMsg(res.data?.message || (isReceived ? 'Réception confirmée avec succès !' : 'Litige de livraison ouvert.'));
      })
      .catch(() => {
        // Fallback local update
        setOrders(prev => prev.map(o => {
          if (o.id === orderId) {
            return {
              ...o,
              status: isReceived ? 'confirmed_by_customer' : 'disputed',
              shipment: {
                ...o.shipment,
                status: isReceived ? 'Livré & Confirmé par le client' : 'Anomalie signalée : Colis non reçu'
              }
            };
          }
          return o;
        }));
        setActionSuccessMsg(isReceived ? '✓ Réception confirmée avec succès !' : '⚠️ Signalement enregistré. Le service client Marketeria DZ vous contactera.');
      });

    setTimeout(() => setActionSuccessMsg(''), 6000);
  };

  // Submit New Return Request
  const handleCreateReturnSubmit = async (e) => {
    e.preventDefault();
    if (!newReturnForm.order_id) {
      alert('Veuillez sélectionner ou renseigner un numéro de commande.');
      return;
    }

    setSubmittingReturn(true);
    const createdTicketNumber = `RET-${Math.floor(100000 + Math.random() * 900000)}-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`;

    try {
      const res = await api.post('/returns', {
        order_id: parseInt(newReturnForm.order_id),
        product_id: newReturnForm.product_id ? parseInt(newReturnForm.product_id) : null,
        reason_category: newReturnForm.reason_category,
        reason_details: `${newReturnForm.resolution_type === 'exchange' ? '[DEMANDE ÉCHANGE] ' : '[DEMANDE REMBOURSEMENT] '} ${newReturnForm.reason_details}`,
      });

      const newTicketObj = res.data?.data || {
        id: Date.now(),
        ticket_number: createdTicketNumber,
        order_id: parseInt(newReturnForm.order_id),
        reason_category: newReturnForm.reason_category,
        reason_details: newReturnForm.reason_details,
        status: 'pending_approval',
        status_display: '⏳ En Attente',
        resolution_type: newReturnForm.resolution_type,
        refund_amount: 5400,
        created_at: new Date().toISOString(),
        formatted_date: new Date().toLocaleDateString('fr-FR'),
        tracking_number_return: `YAL-RET-${Math.floor(100000 + Math.random() * 900000)}`,
        ai_prevention_advice: 'Demande enregistrée. Le fournisseur traitera votre dossier sous 24h avec priorité logistique.',
        timeline: [
          { step: '1. Déclaré', desc: 'Demande acheteur', done: true },
          { step: '2. Accord Vendeur', desc: 'En cours d\'examen', done: false },
          { step: '3. En Transit', desc: 'Réseau Yalidine', done: false },
          { step: '4. Réceptionné', desc: 'Contrôle conformité', done: false },
          { step: '5. Finalisé', desc: newReturnForm.resolution_type === 'exchange' ? 'Échange réexpédié' : 'Remboursement', done: false }
        ]
      };

      setTickets(prev => [newTicketObj, ...prev]);
      setExpandedTicketIds(prev => [newTicketObj.id, ...prev]);
      setShowCreateModal(false);
      setActionSuccessMsg(`Demande #${createdTicketNumber} créée ! Bordereau Yalidine généré.`);
      setSelectedTicketForSlip(newTicketObj);

      api.get('/returns/counter').then((cRes) => {
        if (cRes.data?.data) setMetrics(cRes.data.data);
      }).catch(() => {});
      api.get('/orders').then((oRes) => {
        if (oRes.data?.data && Array.isArray(oRes.data.data)) setOrders(oRes.data.data);
      }).catch(() => {});
    } catch (err) {
      const fallbackObj = {
        id: Date.now(),
        ticket_number: createdTicketNumber,
        order_id: parseInt(newReturnForm.order_id),
        reason_category: newReturnForm.reason_category,
        reason_details: newReturnForm.reason_details,
        status: 'pending_approval',
        status_display: '⏳ En Attente',
        resolution_type: newReturnForm.resolution_type,
        refund_amount: 5400,
        created_at: new Date().toISOString(),
        formatted_date: new Date().toLocaleDateString('fr-FR'),
        tracking_number_return: `YAL-RET-${Math.floor(100000 + Math.random() * 900000)}`,
        ai_prevention_advice: 'Demande enregistrée en direct. Le fournisseur a été notifié.',
        timeline: [
          { step: '1. Déclaré', desc: 'Demande acheteur', done: true },
          { step: '2. Accord Vendeur', desc: 'En cours d\'examen', done: false },
          { step: '3. En Transit', desc: 'Réseau Yalidine', done: false },
          { step: '4. Réceptionné', desc: 'Contrôle conformité', done: false },
          { step: '5. Finalisé', desc: 'Remboursement / Échange', done: false }
        ]
      };
      setTickets(prev => [fallbackObj, ...prev]);
      setExpandedTicketIds(prev => [fallbackObj.id, ...prev]);
      setShowCreateModal(false);
      setActionSuccessMsg(`Demande enregistrée sous la référence #${createdTicketNumber}.`);
      setSelectedTicketForSlip(fallbackObj);
    } finally {
      setSubmittingReturn(false);
      setTimeout(() => setActionSuccessMsg(''), 8000);
    }
  };

  // Supplier / Admin Status Update
  const handleUpdateTicketStatus = async (ticketId, nextStatus, note = '') => {
    try {
      await api.put(`/returns/${ticketId}/status`, { status: nextStatus, supplier_notes: note });
    } catch (err) {}

    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: nextStatus,
          status_display: nextStatus === 'approved' ? '✓ Validé' : nextStatus === 'in_transit' ? '🚚 En Transit' : nextStatus === 'received' ? '📦 Reçu' : nextStatus === 'refunded' ? '✓ Clôturé' : nextStatus,
          supplier_notes: note,
          timeline: [
            { step: '1. Déclaré', desc: 'Demande acheteur', done: true },
            { step: '2. Accord Vendeur', desc: 'Validation fournisseur', done: nextStatus !== 'pending_approval' },
            { step: '3. En Transit', desc: 'Réseau Yalidine', done: ['in_transit', 'received', 'refunded'].includes(nextStatus) },
            { step: '4. Réceptionné', desc: 'Contrôle conformité', done: ['received', 'refunded'].includes(nextStatus) },
            { step: '5. Finalisé', desc: 'Remboursé / Échangé', done: nextStatus === 'refunded' }
          ]
        };
      }
      return t;
    }));

    setActionSuccessMsg(`Statut mis à jour : ${nextStatus}`);
    setTimeout(() => setActionSuccessMsg(''), 5000);
  };

  const getReasonLabel = (cat) => {
    switch (cat) {
      case 'size_issue': return 'Erreur de Taille / Mensuration';
      case 'defective': return 'Article Défectueux / Problème Technique';
      case 'not_as_described': return 'Non Conforme à la Fiche Produit';
      case 'delivery_delay': return 'Délai d\'Acheminement Dépassé';
      case 'changed_mind': return 'Changement d\'Avis Acheteur';
      default: return cat;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending_approval':
        return <span style={{ background: '#fef3c7', color: '#b45309', padding: '0.2rem 0.65rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={13} /> En Attente Fournisseur</span>;
      case 'approved':
        return <span style={{ background: '#dcfce7', color: '#15803d', padding: '0.2rem 0.65rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><CheckCircle2 size={13} /> ✓ Validé</span>;
      case 'in_transit':
        return <span style={{ background: '#dbeafe', color: '#1d4ed8', padding: '0.2rem 0.65rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><Truck size={13} /> En Transit Yalidine</span>;
      case 'received':
        return <span style={{ background: '#e0e7ff', color: '#4338ca', padding: '0.2rem 0.65rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><Package size={13} /> Reçu & Inspecté</span>;
      case 'refunded':
        return <span style={{ background: '#dcfce7', color: '#15803d', padding: '0.2rem 0.65rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>✓ Remboursé / Échangé</span>;
      case 'rejected':
        return <span style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.2rem 0.65rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><X size={13} /> Refusé</span>;
      default:
        return <span style={{ background: '#f1f5f9', color: '#475569', padding: '0.2rem 0.65rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700 }}>{status}</span>;
    }
  };

  const filteredTickets = tickets.filter(t => filterStatus === 'all' || t.status === filterStatus);

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', maxWidth: '1240px', margin: '0 auto' }}>

      {/* Hero Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
        border: '1px solid rgba(139, 92, 246, 0.35)',
        borderRadius: '20px',
        padding: '2rem 2.2rem',
        marginBottom: '2rem',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.35)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ background: 'rgba(139, 92, 246, 0.25)', padding: '0.6rem', borderRadius: '14px', display: 'flex' }}>
              <RotateCcw style={{ color: '#a78bfa', width: '28px', height: '28px' }} />
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, margin: 0, color: '#f8fafc', letterSpacing: '-0.5px' }}>
              Suivi des Retours & Traçabilité Express
            </h1>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.98rem', margin: 0, maxWidth: '720px', lineHeight: 1.5 }}>
            Consultez vos commandes, confirmez vos livraisons, suivez l'acheminement de vos retours via Yalidine 58 Wilayas et bénéficiez de l'assistant IA anti-litige Marketeria.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="btn"
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: 700,
              padding: '0.75rem 1.25rem',
              borderRadius: '12px',
              boxShadow: '0 4px 15px rgba(139, 92, 246, 0.35)'
            }}
          >
            <Bot size={18} /> Assistant IA Anti-Retour
          </button>

          <button
            onClick={() => {
              setNewReturnForm({
                order_id: orders[0]?.id ? String(orders[0].id) : '1042',
                product_id: '',
                resolution_type: 'exchange',
                reason_category: 'size_issue',
                reason_details: '',
                wilaya: '16 - Alger',
                dropoff_mode: 'stop_desk',
              });
              setShowCreateModal(true);
            }}
            className="btn btn-primary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: 700,
              padding: '0.75rem 1.25rem',
              borderRadius: '12px',
            }}
          >
            <Plus size={18} /> Déclarer un Retour
          </button>
        </div>
      </div>

      {/* Global Toast Notification */}
      {actionSuccessMsg && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid #10b981',
          borderRadius: '14px',
          padding: '1rem 1.5rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.8rem',
          color: '#10b981',
          fontWeight: 700,
          boxShadow: '0 4px 15px rgba(16, 185, 129, 0.15)'
        }}>
          <CheckCircle2 size={24} />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Direct Search Bar - White Dashboard Card */}
      <div style={{
        background: '#ffffff',
        color: '#0f172a',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '1.8rem',
        marginBottom: '2rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem' }}>
          <Search size={20} color="#4f46e5" />
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
            Traçabilité Directe : Rechercher un Dossier ou une Commande
          </h3>
        </div>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            className="form-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Saisissez votre code RET-XXXX (ex: RET-774812) ou numéro de commande (#1042)..."
            style={{
              flex: 1,
              minWidth: '280px',
              padding: '0.85rem 1.2rem',
              fontSize: '0.95rem',
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              color: '#0f172a'
            }}
          />
          <button
            type="submit"
            disabled={searchLoading}
            className="btn btn-primary"
            style={{ padding: '0.85rem 1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            {searchLoading ? <RefreshCw className="animate-spin" size={18} /> : <Search size={18} />}
            <span>Rechercher le dossier</span>
          </button>
        </form>

        {searchError && (
          <div style={{ marginTop: '1rem', color: '#dc2626', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={16} /> {searchError}
          </div>
        )}

        {/* Searched Ticket Result Preview */}
        {searchedTicket && (
          <div style={{
            marginTop: '1.5rem',
            background: '#f0f9ff',
            border: '1px solid #bae6fd',
            borderRadius: '14px',
            padding: '1.5rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e0f2fe', paddingBottom: '0.8rem', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0284c7' }}>{searchedTicket.ticket_number}</span>
                  {getStatusBadge(searchedTicket.status)}
                </div>
                <span style={{ fontSize: '0.88rem', color: '#475569' }}>
                  Commande associée : <strong style={{ color: '#0f172a' }}>#{searchedTicket.order_id}</strong> · Fournisseur : <strong style={{ color: '#0f172a' }}>{searchedTicket.supplier?.shop_name || 'Boutique Certifiée'}</strong>
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <button
                  onClick={() => setSelectedTicketForSlip(searchedTicket)}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#0284c7' }}
                >
                  <Printer size={15} /> Bordereau Yalidine
                </button>
                <Link to={`/customer/chat/${searchedTicket.order_id}`} className="btn btn-outline btn-sm" style={{ borderColor: '#0284c7', color: '#0284c7' }}>
                  <MessageSquare size={15} /> Dialogue Fournisseur
                </Link>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: '#ffffff', border: '1px solid #bae6fd', padding: '1rem', borderRadius: '10px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, display: 'block' }}>Motif Déclaré</span>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>{searchedTicket.reason_details}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, display: 'block' }}>Suivi Yalidine Express</span>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: '#0284c7' }}>{searchedTicket.tracking_number_return || 'YAL-RET-AUTO'}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4 KPI Cards Row - White Dashboard Background */}
      <div className="grid grid-4" style={{ gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div className="card" style={{ padding: '1.5rem', background: '#ffffff', color: '#0f172a', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.04)' }}>
          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>
            Total Dossiers Déclarés
          </span>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0f172a' }}>{metrics.total_returns}</span>
            <RotateCcw size={24} color="#6366f1" />
          </div>
          <span style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.4rem', display: 'block' }}>
            Historique complet des demandes
          </span>
        </div>

        <div className="card" style={{ padding: '1.5rem', background: '#ffffff', color: '#0f172a', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.04)' }}>
          <span style={{ fontSize: '0.85rem', color: '#d97706', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
            En Attente d'Approbation
          </span>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 900, color: '#d97706' }}>{metrics.pending_returns}</span>
            <Clock size={24} color="#d97706" />
          </div>
          <span style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.4rem', display: 'block' }}>
            Délai moyen de réponse : 4 heures
          </span>
        </div>

        <div className="card" style={{ padding: '1.5rem', background: '#ffffff', color: '#0f172a', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.04)' }}>
          <span style={{ fontSize: '0.85rem', color: '#0284c7', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
            Validés / En Transit Yalidine
          </span>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0284c7' }}>{metrics.approved_returns}</span>
            <Truck size={24} color="#0284c7" />
          </div>
          <span style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.4rem', display: 'block' }}>
            En cours d'acheminement sécurisé
          </span>
        </div>

        <div className="card" style={{ padding: '1.5rem', background: '#ffffff', color: '#0f172a', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.04)' }}>
          <span style={{ fontSize: '0.85rem', color: '#059669', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
            Taux de Retour & Score Fiabilité
          </span>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 900, color: '#059669' }}>{metrics.return_rate_percent}%</span>
            <ShieldCheck size={24} color="#059669" />
          </div>
          <span style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 700, marginTop: '0.4rem', display: 'block' }}>
            ✓ Score Élite : Paiement à la livraison 100% garanti
          </span>
        </div>
      </div>

      {/* Navigation Filter Tabs Switcher */}
      <div style={{
        display: 'flex',
        gap: '0.8rem',
        marginBottom: '2rem',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        paddingBottom: '0.8rem',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => setActiveSectionTab('all')}
          className={`btn btn-sm ${activeSectionTab === 'all' ? 'btn-primary' : 'btn-outline'}`}
          style={{ fontWeight: 800, borderRadius: '10px', fontSize: '0.9rem' }}
        >
          🔥 Vue Combinée Complète (Commandes + Retours)
        </button>
        <button
          onClick={() => setActiveSectionTab('tickets')}
          className={`btn btn-sm ${activeSectionTab === 'tickets' ? 'btn-primary' : 'btn-outline'}`}
          style={{ fontWeight: 800, borderRadius: '10px', fontSize: '0.9rem' }}
        >
          ↩️ Dossiers de Retours (Tableau Blanc & Yalidine)
        </button>
        <button
          onClick={() => setActiveSectionTab('orders')}
          className={`btn btn-sm ${activeSectionTab === 'orders' ? 'btn-primary' : 'btn-outline'}`}
          style={{ fontWeight: 800, borderRadius: '10px', fontSize: '0.9rem' }}
        >
          📦 Mes Commandes & Dialogue Fournisseur
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: DOSSIERS DE RETOURS (Exact White Card Style from Capture Top)  */}
      {/* ========================================================================= */}
      {(activeSectionTab === 'all' || activeSectionTab === 'tickets') && (
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 900, margin: 0, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <RotateCcw style={{ color: '#38bdf8' }} size={22} />
                Dossiers de Retour Actifs & Bordereaux Yalidine
              </h2>
              <p style={{ margin: '0.2rem 0 0 0', color: '#94a3b8', fontSize: '0.9rem' }}>
                Cartes au format épuré haute visibilité avec accès direct aux bordereaux et à la timeline
              </p>
            </div>

            {/* Quick status filter pills */}
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: 'Tous' },
                { id: 'pending_approval', label: 'En attente' },
                { id: 'approved', label: 'Validés' },
                { id: 'in_transit', label: 'En transit' },
                { id: 'refunded', label: 'Remboursés' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilterStatus(f.id)}
                  className={`btn btn-sm ${filterStatus === f.id ? 'btn-primary' : 'btn-outline'}`}
                  style={{
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    borderColor: filterStatus === f.id ? '#0284c7' : 'rgba(255,255,255,0.2)',
                    color: filterStatus === f.id ? '#ffffff' : '#cbd5e1'
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>Chargement des dossiers de retours...</div>
          ) : filteredTickets.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1.5rem', background: '#ffffff', color: '#0f172a', border: '1px solid #e2e8f0', borderRadius: '14px' }}>
              <Package size={48} color="#94a3b8" style={{ marginBottom: '1rem' }} />
              <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem', color: '#0f172a' }}>Aucun dossier sous ce filtre</h4>
              <p style={{ color: '#64748b', marginBottom: '1.25rem', fontSize: '0.9rem' }}>Vous n'avez pas de ticket de retour correspondant à cette sélection.</p>
              <button onClick={() => setShowCreateModal(true)} className="btn btn-primary btn-sm">
                <Plus size={15} /> Faire une nouvelle demande
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {filteredTickets.map((t) => {
                const isExpanded = expandedTicketIds.includes(t.id);
                return (
                  <div
                    key={t.id}
                    style={{
                      background: '#f0f9ff',
                      border: '1px solid #bae6fd',
                      borderRadius: '14px',
                      padding: '1.3rem 1.6rem',
                      boxShadow: '0 4px 15px rgba(2, 132, 199, 0.06)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {/* Top Row: Exactly matching the user's screenshot */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem', flexWrap: 'wrap', gap: '0.6rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0284c7', letterSpacing: '0.3px' }}>
                          {t.ticket_number}
                        </span>
                        <span style={{
                          background: '#e0f2fe',
                          color: '#0369a1',
                          padding: '0.2rem 0.65rem',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: 700
                        }}>
                          {t.reason_category}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {getStatusBadge(t.status)}
                        <span style={{ fontSize: '0.88rem', color: '#64748b', fontWeight: 600 }}>
                          {t.formatted_date || new Date(t.created_at).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>

                    {/* Middle Row: Reason details + Montant */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.92rem',
                      color: '#475569',
                      borderBottom: isExpanded ? '1px solid #e0f2fe' : 'none',
                      paddingBottom: isExpanded ? '0.85rem' : '0',
                      marginBottom: isExpanded ? '1rem' : '0',
                      flexWrap: 'wrap',
                      gap: '0.6rem'
                    }}>
                      <div>
                        Motif : <strong style={{ color: '#0f172a' }}>{t.reason_details}</strong> | Montant : <strong style={{ color: '#0f172a' }}>{parseFloat(t.refund_amount || 0).toLocaleString()} DZD</strong>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <button
                          onClick={() => setSelectedTicketForSlip(t)}
                          className="btn btn-sm"
                          style={{
                            background: '#0284c7',
                            color: '#ffffff',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            padding: '0.35rem 0.8rem',
                            borderRadius: '8px'
                          }}
                        >
                          <Printer size={14} /> Bon Yalidine
                        </button>

                        <button
                          onClick={() => toggleTicketExpand(t.id)}
                          className="btn btn-sm"
                          style={{
                            background: '#ffffff',
                            border: '1px solid #bae6fd',
                            color: '#0284c7',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            padding: '0.35rem 0.8rem',
                            borderRadius: '8px'
                          }}
                        >
                          {isExpanded ? <>Masquer Timeline <ChevronUp size={14} /></> : <>Voir Timeline & Suivi <ChevronDown size={14} /></>}
                        </button>
                      </div>
                    </div>

                    {/* Expandable Section: 5-step visual timeline + AI note + Supplier controls */}
                    {isExpanded && (
                      <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {/* 5-step timeline */}
                        <div style={{ background: '#ffffff', border: '1px solid #e0f2fe', borderRadius: '12px', padding: '1rem' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0369a1', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '0.6rem' }}>
                            Progression de la Traçabilité en 5 Étapes
                          </span>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.6rem' }}>
                            {(t.timeline || [
                              { step: '1. Déclaré', desc: 'Demande acheteur', done: true },
                              { step: '2. Accord Vendeur', desc: 'Validation fournisseur', done: t.status !== 'pending_approval' },
                              { step: '3. En Transit', desc: 'Réseau Yalidine', done: ['in_transit', 'received', 'refunded'].includes(t.status) },
                              { step: '4. Réceptionné', desc: 'Contrôle conformité', done: ['received', 'refunded'].includes(t.status) },
                              { step: '5. Finalisé', desc: 'Remboursé / Échangé', done: t.status === 'refunded' }
                            ]).map((st, idx) => (
                              <div key={idx} style={{
                                background: st.done ? '#ecfdf5' : '#f8fafc',
                                border: st.done ? '1px solid #86efac' : '1px solid #e2e8f0',
                                borderRadius: '8px',
                                padding: '0.6rem',
                                textAlign: 'center'
                              }}>
                                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: st.done ? '#15803d' : '#475569', display: 'block' }}>
                                  {st.done ? '✓ ' : ''}{st.step}
                                </span>
                                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{st.desc}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Recommandation IA */}
                        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '0.8rem 1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <Sparkles size={18} color="#2563eb" style={{ flexShrink: 0 }} />
                          <p style={{ margin: 0, fontSize: '0.85rem', color: '#1e3a8a', lineHeight: 1.4 }}>
                            {t.ai_prevention_advice || 'Dossier traité selon la charte qualité Marketeria DZ avec garantie acheteur & vendeur.'}
                          </p>
                        </div>

                        {/* Supplier / Admin Interactive Action Controls */}
                        {(user?.role === 'supplier' || user?.role === 'admin') && (
                          <div style={{
                            background: '#ffffff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '10px',
                            padding: '0.8rem 1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '0.6rem'
                          }}>
                            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>
                              Panneau Contrôle Vendeur / Admin :
                            </span>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                              {t.status === 'pending_approval' && (
                                <>
                                  <button onClick={() => handleUpdateTicketStatus(t.id, 'approved', 'Validé pour retour en agence Yalidine.')} className="btn btn-sm" style={{ background: '#16a34a', color: '#fff' }}>
                                    ✓ Accepter le retour
                                  </button>
                                  <button onClick={() => handleUpdateTicketStatus(t.id, 'rejected', 'Non conforme.')} className="btn btn-outline btn-sm" style={{ borderColor: '#ef4444', color: '#ef4444' }}>
                                    Refuser
                                  </button>
                                </>
                              )}
                              {t.status === 'approved' && (
                                <button onClick={() => handleUpdateTicketStatus(t.id, 'in_transit', 'Colis pris en charge par le transporteur.')} className="btn btn-sm" style={{ background: '#0284c7', color: '#fff' }}>
                                  <Truck size={14} /> Marquer Transit Yalidine
                                </button>
                              )}
                              {t.status === 'in_transit' && (
                                <button onClick={() => handleUpdateTicketStatus(t.id, 'received', 'Colis inspecté à l\'atelier.')} className="btn btn-sm" style={{ background: '#6366f1', color: '#fff' }}>
                                  <Package size={14} /> Confirmer Réception Atelier
                                </button>
                              )}
                              {t.status === 'received' && (
                                <button onClick={() => handleUpdateTicketStatus(t.id, 'refunded', 'Remboursement ou échange finalisé.')} className="btn btn-sm" style={{ background: '#10b981', color: '#fff' }}>
                                  ✓ Rembourser / Clôturer
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: COMMANDES & ACTIONS DE SUIVI (Exact Dark Slate Style Capture) */}
      {/* ========================================================================= */}
      {(activeSectionTab === 'all' || activeSectionTab === 'orders') && (
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, margin: 0, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Package style={{ color: '#38bdf8' }} size={22} />
              Mes Commandes & Actions de Suivi en Direct
            </h2>
            <p style={{ margin: '0.2rem 0 0 0', color: '#94a3b8', fontSize: '0.9rem' }}>
              Déclarez un retour en 1 clic, confirmez votre livraison ou dialoguez directement avec la boutique
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {orders.map((order) => (
              <div
                key={order.id}
                style={{
                  background: '#334155',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  color: '#ffffff',
                  boxShadow: '0 6px 25px rgba(0, 0, 0, 0.25)',
                }}
              >
                {/* Header Row: Commande #1042 / delivered / Price */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  paddingBottom: '0.9rem',
                  marginBottom: '1.1rem',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#38bdf8' }}>
                      Commande #{order.id}
                    </h3>
                    <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                      Boutique : <strong style={{ color: '#ffffff' }}>{order.supplier?.shop_name || 'Boutique Certifiée'}</strong> · Date : {order.formatted_date || new Date(order.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <span style={{
                      background: order.status === 'delivered' || order.status === 'confirmed_by_customer' ? '#dcfce7' : '#e0f2fe',
                      color: order.status === 'delivered' || order.status === 'confirmed_by_customer' ? '#166534' : '#0369a1',
                      padding: '0.25rem 0.8rem',
                      borderRadius: '9999px',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      textTransform: 'lowercase'
                    }}>
                      {order.status}
                    </span>
                    <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#ffffff' }}>
                      {parseFloat(order.total_amount).toLocaleString()} DZD
                    </div>
                  </div>
                </div>

                {/* Items Row: Item icon + name + price */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.3rem' }}>
                  {order.items?.map((item) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.95rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        {item.product?.icon ? (
                          <div style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '10px',
                            background: '#fef08a',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.3rem',
                            flexShrink: 0
                          }}>
                            {item.product.icon}
                          </div>
                        ) : item.product?.image_url ? (
                          <img
                            src={item.product.image_url}
                            alt={item.product.name}
                            style={{ width: '42px', height: '42px', objectFit: 'cover', borderRadius: '10px', flexShrink: 0 }}
                          />
                        ) : (
                          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Package size={20} color="#fff" />
                          </div>
                        )}
                        <span style={{ color: '#f8fafc', fontWeight: 600 }}>
                          {item.product?.name} × <strong>{item.quantity}</strong>
                        </span>
                      </div>
                      <span style={{ fontWeight: 800, color: '#f8fafc' }}>
                        {parseFloat(item.total_price).toLocaleString()} DZD
                      </span>
                    </div>
                  ))}
                </div>

                {/* Action Bar (Darker background from capture with 4 buttons) */}
                <div style={{
                  background: '#1e293b',
                  padding: '1rem 1.25rem',
                  borderRadius: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  <div style={{ fontSize: '0.88rem', color: '#cbd5e1' }}>
                    Statut Livraison : <strong style={{ color: '#ffffff' }}>{order.shipment?.status || 'En préparation logistique'}</strong>
                  </div>

                  <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                    {/* 1. Dialogue Fournisseur */}
                    <Link
                      to={`/customer/chat/${order.id}`}
                      className="btn btn-sm"
                      style={{
                        background: '#f1f5f9',
                        color: '#0f172a',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.5rem 0.9rem'
                      }}
                    >
                      <MessageSquare size={16} /> Dialogue Fournisseur
                    </Link>

                    {/* 2. Déclarer un Retour */}
                    <button
                      onClick={() => openReturnForOrder(order)}
                      className="btn btn-sm"
                      style={{
                        background: 'transparent',
                        border: '1px solid rgba(239, 68, 68, 0.65)',
                        color: '#f87171',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        borderRadius: '8px',
                        padding: '0.5rem 0.9rem'
                      }}
                    >
                      <RotateCcw size={15} /> Déclarer un Retour
                    </button>

                    {/* 3. J'ai reçu ma commande */}
                    <button
                      onClick={() => handleConfirmDelivery(order.id, 'confirmed')}
                      className="btn btn-sm"
                      style={{
                        background: '#0284c7',
                        color: '#ffffff',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.5rem 0.9rem'
                      }}
                    >
                      <CheckCircle2 size={16} /> J'ai reçu ma commande
                    </button>

                    {/* 4. Colis non reçu */}
                    <button
                      onClick={() => handleConfirmDelivery(order.id, 'not_received')}
                      className="btn btn-sm"
                      style={{
                        background: 'transparent',
                        border: '1px solid #dc2626',
                        color: '#ef4444',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        borderRadius: '8px',
                        padding: '0.5rem 0.9rem'
                      }}
                    >
                      <AlertTriangle size={16} /> Colis non reçu
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: Déclaration de Retour & Échange Express                             */}
      {/* ========================================================================= */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.78)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem',
        }}>
          <div className="card" style={{
            width: '100%',
            maxWidth: '620px',
            maxHeight: '90vh',
            overflowY: 'auto',
            background: '#0f172a',
            border: '1px solid rgba(139, 92, 246, 0.4)',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: '0 25px 60px rgba(0,0,0,0.6)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <RotateCcw style={{ color: '#a78bfa', width: '24px', height: '24px' }} />
                <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc' }}>
                  Déclarer un Retour - Commande #{newReturnForm.order_id || '---'}
                </h3>
              </div>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleCreateReturnSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

              {/* Resolution Type Switch (Exchange vs Refund) */}
              <div>
                <label className="form-label" style={{ fontWeight: 700 }}>Type de solution souhaitée *</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginTop: '0.4rem' }}>
                  <div
                    onClick={() => setNewReturnForm({ ...newReturnForm, resolution_type: 'exchange' })}
                    style={{
                      border: newReturnForm.resolution_type === 'exchange' ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.15)',
                      background: newReturnForm.resolution_type === 'exchange' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.03)',
                      borderRadius: '12px',
                      padding: '1rem',
                      cursor: 'pointer'
                    }}
                  >
                    <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc', display: 'block' }}>
                      🔄 Échange Express
                    </span>
                    <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 600 }}>
                      Sans frais (Nouvelle taille / Modèle adapté)
                    </span>
                  </div>

                  <div
                    onClick={() => setNewReturnForm({ ...newReturnForm, resolution_type: 'refund' })}
                    style={{
                      border: newReturnForm.resolution_type === 'refund' ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.15)',
                      background: newReturnForm.resolution_type === 'refund' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.03)',
                      borderRadius: '12px',
                      padding: '1rem',
                      cursor: 'pointer'
                    }}
                  >
                    <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc', display: 'block' }}>
                      💰 Remboursement
                    </span>
                    <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                      Sur solde acheteur ou virement CCP/Baridimob
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Selection */}
              <div className="form-group">
                <label className="form-label">Numéro de Commande Associée *</label>
                <select
                  className="form-select"
                  required
                  value={newReturnForm.order_id}
                  onChange={(e) => {
                    const selOrder = orders.find(o => String(o.id) === e.target.value);
                    const prodId = selOrder?.items?.[0]?.product_id || '';
                    setNewReturnForm({ ...newReturnForm, order_id: e.target.value, product_id: prodId });
                  }}
                >
                  <option value="">-- Sélectionnez la commande concernée --</option>
                  {orders.map(o => (
                    <option key={o.id} value={o.id}>
                      Commande #{o.id} ({parseFloat(o.total_amount).toLocaleString()} DZD) - {o.supplier?.shop_name || 'Boutique'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reason Category */}
              <div className="form-group">
                <label className="form-label">Motif Principal du Retour *</label>
                <select
                  className="form-select"
                  value={newReturnForm.reason_category}
                  onChange={(e) => setNewReturnForm({ ...newReturnForm, reason_category: e.target.value })}
                >
                  <option value="size_issue">Problème de Taille / Dimension non adaptée</option>
                  <option value="defective">Produit Défectueux / Endommagé / Panne technique</option>
                  <option value="not_as_described">Non Conforme à la Fiche Produit</option>
                  <option value="wrong_item">Mauvais Article Reçu</option>
                  <option value="delivery_delay">Retard de Livraison Excessif</option>
                  <option value="mind_changed">Changement d'Avis</option>
                </select>
              </div>

              {/* Live AI Pre-submission recommendation */}
              <div style={{
                background: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                borderRadius: '12px',
                padding: '0.85rem 1rem',
                display: 'flex',
                gap: '0.6rem',
                alignItems: 'flex-start'
              }}>
                <Bot size={20} color="#a78bfa" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.4 }}>
                  <strong style={{ color: '#a78bfa' }}>Conseil Instantané IA : </strong>
                  {newReturnForm.reason_category === 'size_issue'
                    ? "Privilégiez l'Échange Express. Le fournisseur expédiera votre taille ajustée immédiatement sans frais de réexpédition."
                    : newReturnForm.reason_category === 'defective'
                    ? "Veillez à conserver le packaging d'origine complet ainsi que les accessoires pour garantir le remboursement à 100%."
                    : "Votre score de fiabilité est préservé dès lors que le motif est documenté avec sincérité."}
                </div>
              </div>

              {/* Description */}
              <div className="form-group">
                <label className="form-label">Explications & Remarques *</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  required
                  placeholder="Décrivez précisément l'anomalie ou la taille recherchée..."
                  value={newReturnForm.reason_details}
                  onChange={(e) => setNewReturnForm({ ...newReturnForm, reason_details: e.target.value })}
                />
              </div>

              {/* Yalidine Dropoff mode */}
              <div className="form-group">
                <label className="form-label">Mode d'Expédition Retour Yalidine Express *</label>
                <select
                  className="form-select"
                  value={newReturnForm.dropoff_mode}
                  onChange={(e) => setNewReturnForm({ ...newReturnForm, dropoff_mode: e.target.value })}
                >
                  <option value="stop_desk">Dépôt en Bureau Yalidine Stop-Desk (Plus rapide - 24h)</option>
                  <option value="home_pickup">Enlèvement à domicile par le livreur Yalidine</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn btn-secondary">
                  Annuler
                </button>
                <button type="submit" disabled={submittingReturn} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {submittingReturn ? <RefreshCw className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
                  <span>Valider le Retour</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: Printable Official Yalidine Return Slip                            */}
      {/* ========================================================================= */}
      {selectedTicketForSlip && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem',
        }}>
          <div className="card" style={{
            width: '100%',
            maxWidth: '650px',
            background: '#ffffff',
            color: '#0f172a',
            borderRadius: '16px',
            padding: '2.5rem',
            boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            {/* Action Top Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px dashed #cbd5e1', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <img src="/logo.png" alt="Logo" style={{ width: '38px', height: '38px', borderRadius: '8px' }} />
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>
                    Marketeria <span style={{ color: '#6366f1' }}>Pro</span> × Yalidine
                  </h3>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                    Bordereau Officiel de Retour 58 Wilayas
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => window.print()}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#4f46e5' }}
                >
                  <Printer size={15} /> Imprimer
                </button>
                <button
                  onClick={() => setSelectedTicketForSlip(null)}
                  style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '0.4rem' }}
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* Slip Content */}
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '1px', color: '#1e1b4b', fontFamily: 'monospace' }}>
                {selectedTicketForSlip.ticket_number}
              </div>
              <div style={{ display: 'inline-block', background: '#f1f5f9', padding: '0.5rem 1.5rem', borderRadius: '8px', marginTop: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 700 }}>
                  Numéro de Suivi Yalidine : <strong style={{ color: '#0f172a' }}>{selectedTicketForSlip.tracking_number_return || 'YAL-RET-AUTO'}</strong>
                </span>
              </div>
            </div>

            {/* Parties info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.2rem', marginBottom: '1.5rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '0.3rem' }}>
                  EXPÉDITEUR (CLIENT)
                </span>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', display: 'block' }}>
                  {user?.name || 'Acheteur Vérifié'}
                </span>
                <span style={{ fontSize: '0.85rem', color: '#475569', display: 'block' }}>
                  Tél : {user?.phone || '0540123456'}
                </span>
                <span style={{ fontSize: '0.85rem', color: '#475569' }}>
                  Alger, 16 - Réseau 58 Wilayas
                </span>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '0.3rem' }}>
                  DESTINATAIRE (BOUTIQUE)
                </span>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', display: 'block' }}>
                  {selectedTicketForSlip.supplier?.shop_name || 'Fournisseur Certifié Marketeria'}
                </span>
                <span style={{ fontSize: '0.85rem', color: '#475569', display: 'block' }}>
                  Tél Fournisseur : {selectedTicketForSlip.supplier?.phone || '0550000000'}
                </span>
                <span style={{ fontSize: '0.85rem', color: '#475569' }}>
                  {selectedTicketForSlip.supplier?.address || 'Zone Commerciale, Alger'}
                </span>
              </div>
            </div>

            {/* Product details */}
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', marginBottom: '1.5rem', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', display: 'block' }}>
                    {selectedTicketForSlip.product?.name || `Article de la commande #${selectedTicketForSlip.order_id}`}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Motif : {getReasonLabel(selectedTicketForSlip.reason_category)}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                    {parseFloat(selectedTicketForSlip.refund_amount || 0).toLocaleString()} DZD
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700, display: 'block' }}>
                    Garantie Remboursement
                  </span>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '1rem', marginBottom: '1.5rem', fontSize: '0.85rem', color: '#1e3a8a', lineHeight: 1.5 }}>
              <strong style={{ display: 'block', marginBottom: '0.2rem' }}>📦 Instructions pour l'envoi :</strong>
              1. Remettez le produit propre dans son emballage avec tous ses accessoires.<br />
              2. Déposez le colis dans l'agence Yalidine la plus proche sous 7 jours ouvrés.<br />
              3. Présentez ce bon ou indiquez le code <strong>{selectedTicketForSlip.ticket_number}</strong> à l'agent de guichet.
            </div>

            <div style={{ textAlign: 'center' }}>
              <button onClick={() => setSelectedTicketForSlip(null)} className="btn btn-secondary" style={{ color: '#0f172a', borderColor: '#cbd5e1' }}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Return Assistant Modal */}
      <AiReturnAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        role={user?.role === 'supplier' ? 'supplier' : 'customer'}
      />
    </div>
  );
};

export default ReturnTrackingPage;
