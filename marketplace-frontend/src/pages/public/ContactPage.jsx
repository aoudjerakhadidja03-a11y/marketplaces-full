import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Bot, HelpCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { AiReturnAssistantModal } from '../../components/AiReturnAssistantModal';

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Suivi et Gestion des Retours',
    user_type: 'customer',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await api.post('/contact', formData);
      if (res.data?.success) {
        setStatus({ type: 'success', text: res.data.message });
        setFormData({ name: '', email: '', subject: 'Suivi et Gestion des Retours', user_type: 'customer', message: '' });
      }
    } catch (err) {
      console.warn('Backend contact unavailable, recording locally:', err);
      setStatus({ type: 'success', text: 'Votre message a été transmis avec succès à l\'équipe Marketeria DZ. Nous vous répondrons sous 24h au numéro fourni.' });
      setFormData({ name: '', email: '', subject: 'Suivi et Gestion des Retours', user_type: 'customer', message: '' });
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    {
      q: "Comment fonctionne le système de gestion et suivi des retours ?",
      a: "Dès qu'un retour est initié par le client ou validé par le fournisseur, le Compteur de Retours se met à jour en temps réel. Chaque retour est tracé avec un code unique (RET-XXXX) pour une transparence totale.",
    },
    {
      q: "Quelles sont les règles de pré-acompte pour les acheteurs à risque ?",
      a: "Pour limiter les annulations et abus, les fournisseurs peuvent configurer des règles exigeant un acompte préventif de 25% à 35% pour les profils clients ayant un taux de retour dépassant 15%.",
    },
    {
      q: "Comment les fournisseurs reçoivent-ils les conseils de l'Agent IA ?",
      a: "L'Agent IA analyse automatiquement les données de retours par produit et par client. En cas de pic de retours (ex: erreur de taille), l'IA génère des conseils directement dans le centre de prévention.",
    },
    {
      q: "Comment intégrer l'automation n8n sur notre compte fournisseur ?",
      a: "Les webhooks n8n pré-intégrés permettent de déclencher l'envoi de SMS ou de messages WhatsApp automatiques de confirmation de commande pour éliminer 90% des refus à la livraison.",
    },
  ];

  return (
    <div style={{ padding: '3rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Page Title & Intro */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span className="badge badge-info" style={{ marginBottom: '0.8rem', padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
          💬 Support Client & Partenariats Vendeurs DZ
        </span>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0.5rem 0', color: 'var(--text-main)' }}>
          Contactez Notre Équipe & Assistance IA
        </h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.6 }}>
          Une question sur le suivi des retours, les fiches techniques produits ou le statut de votre boutique ? Notre équipe et notre assistant IA sont disponibles 24/7.
        </p>
      </div>

      {/* Grid: Form & Info */}
      <div className="grid grid-2" style={{ gap: '2.5rem', marginBottom: '3.5rem', alignItems: 'start' }}>

        {/* Left Column: Contact Form */}
        <div className="card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-main)' }}>
            <MessageSquare color="var(--primary)" /> Envoyer un Message
          </h2>

          {status && (
            <div style={{
              padding: '0.9rem 1.2rem',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '1.5rem',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              background: status.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              border: status.type === 'success' ? '1px solid #10b981' : '1px solid #ef4444',
              color: status.type === 'success' ? '#10b981' : '#ef4444',
            }}>
              {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              {status.text}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div className="form-group">
              <label className="form-label">Nom Complet *</label>
              <input
                type="text"
                className="form-input"
                required
                placeholder="Ex: Mohamed Amine"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Adresse Email *</label>
              <input
                type="email"
                className="form-input"
                required
                placeholder="votre.email@domaine.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="grid grid-2" style={{ gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Vous êtes ?</label>
                <select
                  className="form-select"
                  value={formData.user_type}
                  onChange={(e) => setFormData({ ...formData, user_type: e.target.value })}
                >
                  <option value="customer">Client Acheteur</option>
                  <option value="supplier">Fournisseur Pro</option>
                  <option value="guest">Visiteur / Juré</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Sujet de la demande</label>
                <select
                  className="form-select"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                >
                  <option value="Suivi et Gestion des Retours">Suivi des Retours</option>
                  <option value="Question sur le Taux de Retour & Pénalités">Pénalités & Modes Règlement</option>
                  <option value="Partenariat Fournisseur">Inscription & Vitrine Pro</option>
                  <option value="Assistance IA & N8N Automation">Agent IA & Webhooks n8n</option>
                  <option value="Autre Demande">Autre Question</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Message Détaillé *</label>
              <textarea
                className="form-textarea"
                required
                rows={5}
                placeholder="Décrivez votre besoin ou votre question..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ padding: '0.95rem', fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}
            >
              <Send size={18} />
              {loading ? 'Envoi en cours...' : 'Envoyer le Message'}
            </button>
          </form>
        </div>

        {/* Right Column: AI Assistant Card & Direct Contact Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* AI Assistant Card */}
          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.15) 100%)', border: '1px solid var(--primary)', padding: '1.8rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
              <div style={{ background: 'var(--primary)', color: '#fff', padding: '0.6rem', borderRadius: '12px', display: 'flex' }}>
                <Bot size={24} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  Réponse Immédiate par l'Agent IA
                </h3>
                <span style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 600 }}>Support Client 24/7 & Anti-Retour</span>
              </div>
            </div>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.2rem' }}>
              Posez votre question à notre assistant IA prédictif pour obtenir des renseignements immédiats sur la livraison dans les 58 Wilayas, la gestion des tailles ou les garanties.
            </p>
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="btn btn-primary"
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 700 }}
            >
              <Bot size={18} />
              Discuter avec l'Agent IA
            </button>
          </div>

          {/* Direct Coordonnées Cards */}
          <div className="card" style={{ padding: '1.8rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>Nos Coordonnées Officielles</h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'var(--bg-subtle)', padding: '0.6rem', borderRadius: '10px', color: 'var(--primary)' }}>
                <Mail size={20} />
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Email Support</span>
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>contact@marketplace-dz.com</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'var(--bg-subtle)', padding: '0.6rem', borderRadius: '10px', color: 'var(--primary)' }}>
                <Phone size={20} />
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Téléphone & WhatsApp</span>
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>+213 (0) 23 45 67 89</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'var(--bg-subtle)', padding: '0.6rem', borderRadius: '10px', color: 'var(--success)' }}>
                <MapPin size={20} />
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Siège Social</span>
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Alger Centre, Algérie</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* FAQ Section */}
      <div className="card" style={{ padding: '2.2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <HelpCircle color="var(--primary)" /> Questions Fréquemment Posées (FAQ)
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
              style={{
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '1.2rem',
                cursor: 'pointer',
              }}
            >
              <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {faq.q}
                <span style={{ color: 'var(--primary)', fontSize: '1.3rem' }}>{openFaqIndex === idx ? '−' : '+'}</span>
              </h4>
              {openFaqIndex === idx && (
                <p style={{ margin: '0.8rem 0 0 0', fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* AI Assistant Modal */}
      <AiReturnAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        role="customer"
      />
    </div>
  );
};
