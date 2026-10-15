import React, { useState } from 'react';
import { Bot, X, Send, Sparkles, MessageCircle, RotateCcw, Truck, ShieldCheck, HelpCircle, ArrowRight } from 'lucide-react';

export const FloatingAiChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Bonjour ! 👋 Je suis l'Assistant IA Marketeria.\n\nJe suis entraîné pour répondre à vos questions sur :\n• ↩️ Le suivi et la prévention des retours (Codes RET-XXXX)\n• 📦 La livraison dans les 58 Wilayas (Yalidine, ZR, EMS)\n• 💳 Les modes de paiement (COD, Acompte 30%, CIB/Edahabia)\n• 📐 Les fiches techniques & mensurations pré-expédiées\n• 🏪 L'agrément Vendeur Pro et le Label Startup",
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const knowledgeAnswers = [
    {
      keywords: ['retour', 'rembours', 'échange', 'ticket', 'rétractation', 'annulation'],
      reply: "↩️ **Suivi & Prévention des Retours** :\nSur Marketeria, chaque produit possède un *Score de Risque de Retour* calculé par notre algorithme IA. Vous pouvez suivre ou créer un ticket manuel (ex: RET-774812) dans votre Espace Client > Suivi Retours pour un traitement sous 24 à 48h.",
    },
    {
      keywords: ['livraison', 'wilaya', 'yalidine', 'transport', 'délai', 'expédition', 'frais'],
      reply: "📦 **Réseau Logistique 58 Wilayas** :\nMarketeria est interconnecté avec les meilleurs transporteurs :\n• **Zone 1 (Alger & Centre)** : 24h à domicile (500 DZD) / Bureau (350 DZD)\n• **Zone 2 (Nord & Littoral)** : 24h à 48h (700 DZD / 450 DZD)\n• **Zone 3 (Hauts Plateaux)** : 48h à 72h (850 DZD / 550 DZD)\n• **Zone 4 (Grand Sud)** : 3 à 5 jours (1200 DZD / 800 DZD)",
    },
    {
      keywords: ['paiement', 'acompte', 'cod', 'cash', 'livraison', 'argent', 'prix', 'edahabia', 'cib'],
      reply: "💳 **Modes de Règlement & Sécurité** :\nNous proposons 3 modes de règlement :\n1. **Paiement à la Livraison (COD)** : Espèces à la remise du colis.\n2. **Acompte Préventif (30%)** : Requis par certains vendeurs pour les comptes à risque d'annulation.\n3. **Carte CIB / EDAHABIA** : Paiement immédiat sécurisé en ligne.",
    },
    {
      keywords: ['taille', 'dimension', 'pointure', 'guide', 'fiche technique', 'spécification', 'mesure'],
      reply: "📐 **Fiches Techniques Détaillées & Mensurations** :\nPour éviter 95% des retours dus aux erreurs de taille, consultez la section **'Fiche Technique'** sur chaque produit. Au checkout, cochez la case de confirmation pré-expédition pour valider vos critères avec le vendeur.",
    },
    {
      keywords: ['vendeur', 'fournisseur', 'inscription', 'boutique', 'pro', 'grossiste', 'label', 'startup', 'agrément'],
      reply: "🏪 **Espace Vendeurs & Label Startup Marketeria** :\nMarketeria est la marketplace labellisée pionnière de l'e-commerce sécurisé en Algérie. Les vendeurs certifiés bénéficient :\n• Du tableau de bord de prévention des retours\n• De règles d'acompte paramétrables pour sécuriser les commandes\n• De l'automatisation n8n Webhooks par SMS/WhatsApp.",
    },
    {
      keywords: ['garantie', 'panne', 'sav', 'neuf', 'authentique', 'qualité', 'pièce'],
      reply: "🛡️ **Garantie Constructeur 12/24 Mois** :\nTous nos équipements high-tech et appareils ménagers vendus par des fournisseurs certifiés incluent une garantie de 12 à 24 mois avec pièces de rechange disponibles.",
    },
    {
      keywords: ['contact', 'téléphone', 'adresse', 'support', 'aide', 'email', 'siège'],
      reply: "📞 **Contact Support & Porteur Marketeria DZ** :\nNotre équipe est joignable directement par téléphone au **0774159472** ou par e-mail à **contact@marketeria.dz**. Vous pouvez aussi envoyer un message depuis la page Contact ou chatter avec le vendeur.",
    },
    {
      keywords: ['marketeria', 'nom', 'site', 'plateforme', 'innovation'],
      reply: "🌟 **À Propos de Marketeria DZ** :\nMarketeria est la 1ère marketplace B2B/B2C en Algérie combinant fiches techniques exhaustives, validation pré-expédition et algorithme prédictif anti-retour.",
    }
  ];

  const handleSend = (customText = null) => {
    const textToSend = customText || input;
    if (!textToSend.trim()) return;

    setMessages(prev => [...prev, { sender: 'user', text: textToSend }]);
    if (!customText) setInput('');
    setLoading(true);

    setTimeout(() => {
      let aiReply = "";
      const lower = textToSend.toLowerCase();

      const matched = knowledgeAnswers.find(item =>
        item.keywords.some(kw => lower.includes(kw))
      );

      if (matched) {
        aiReply = matched.reply;
      } else {
        aiReply = "💡 **Assistant IA Marketeria** :\nJe suis à votre disposition ! Voici les sujets sur lesquels je peux vous aider immédiatement :\n1. ↩️ Suivi des tickets de retour (RET-XXXX)\n2. 📦 Tarifs & délais de livraison par Wilaya\n3. 📐 Fiches techniques & mensurations\n4. 🏪 Inscription Vendeur Pro Certifié Marketeria";
      }

      setMessages(prev => [...prev, { sender: 'ai', text: aiReply }]);
      setLoading(false);
    }, 500);
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, fontFamily: 'sans-serif' }}>

      {/* Floating Trigger Button when Closed */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '50px',
            padding: '0.85rem 1.4rem',
            fontSize: '0.95rem',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 10px 30px rgba(139, 92, 246, 0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            transition: 'all 0.3s ease',
          }}
        >
          <div style={{ position: 'relative', display: 'flex' }}>
            <Bot size={24} />
            <span style={{
              position: 'absolute', top: '-4px', right: '-4px',
              width: '10px', height: '10px', background: '#10b981',
              borderRadius: '50%', border: '2px solid #fff'
            }} />
          </div>
          <span>Marketeria AI Agent</span>
        </button>
      )}

      {/* Expanded Floating Chat Box */}
      {isOpen && (
        <div style={{
          width: '410px',
          maxWidth: 'calc(100vw - 32px)',
          height: '570px',
          maxHeight: 'calc(100vh - 100px)',
          background: 'var(--card-bg, #0f172a)',
          border: '1px solid rgba(139, 92, 246, 0.4)',
          borderRadius: '20px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #1e1b4b 0%, #311b92 100%)',
            padding: '1rem 1.2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <img
                src="/logo.png"
                alt="Marketeria AI"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '9px',
                  objectFit: 'contain',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  display: 'block'
                }}
              />
              <div>
                <h4 style={{ margin: 0, color: '#fff', fontSize: '1rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  Marketeria AI Agent <Sparkles size={14} style={{ color: '#f59e0b' }} />
                </h4>
                <span style={{ fontSize: '0.75rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  ● Assistant IA Anti-Retour & E-Commerce
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.2rem' }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Chat Stream */}
          <div style={{
            flex: 1,
            padding: '1rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.8rem',
            background: 'rgba(15, 23, 42, 0.95)',
          }}>
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '88%',
                  background: m.sender === 'user' ? '#6366f1' : 'rgba(30, 41, 59, 0.9)',
                  color: '#fff',
                  border: m.sender === 'ai' ? '1px solid rgba(255,255,255,0.1)' : 'none',
                  borderRadius: m.sender === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                  padding: '0.8rem 1rem',
                  fontSize: '0.88rem',
                  lineHeight: '1.5',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {m.text}
              </div>
            ))}

            {loading && (
              <div style={{ alignSelf: 'flex-start', background: 'rgba(30, 41, 59, 0.8)', padding: '0.6rem 1rem', borderRadius: '14px', color: '#a78bfa', fontSize: '0.8rem' }}>
                Marketeria AI recherche la meilleure réponse...
              </div>
            )}
          </div>

          {/* Shortcut Pills */}
          <div style={{ padding: '0.6rem 0.8rem', background: '#0f172a', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '0.4rem', overflowX: 'auto' }}>
            <button
              onClick={() => handleSend("Comment fonctionne la prévention des retours ?")}
              style={{ background: 'rgba(139, 92, 246, 0.2)', border: '1px solid rgba(139, 92, 246, 0.4)', color: '#c084fc', padding: '0.3rem 0.7rem', borderRadius: '15px', fontSize: '0.74rem', cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: 700 }}
            >
              ↩️ Prévention retours
            </button>
            <button
              onClick={() => handleSend("Quels sont les tarifs et délais 58 Wilayas ?")}
              style={{ background: 'rgba(59, 130, 246, 0.2)', border: '1px solid rgba(59, 130, 246, 0.4)', color: '#93c5fd', padding: '0.3rem 0.7rem', borderRadius: '15px', fontSize: '0.74rem', cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: 700 }}
            >
              📦 Délais 58 Wilayas
            </button>
            <button
              onClick={() => handleSend("Comment devenir Vendeur Pro sur Marketeria ?")}
              style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#34d399', padding: '0.3rem 0.7rem', borderRadius: '15px', fontSize: '0.74rem', cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: 700 }}
            >
              🏪 Vendeur Pro
            </button>
          </div>

          {/* Input Bar */}
          <div style={{ padding: '0.8rem', background: '#0f172a', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              placeholder="Posez votre question à l'assistant Marketeria..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              style={{
                flex: 1,
                background: 'rgba(30, 41, 59, 0.9)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '10px',
                padding: '0.65rem 0.9rem',
                color: '#fff',
                fontSize: '0.88rem',
                outline: 'none',
              }}
            />
            <button
              onClick={() => handleSend()}
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                border: 'none',
                color: '#fff',
                padding: '0.65rem 1rem',
                borderRadius: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
