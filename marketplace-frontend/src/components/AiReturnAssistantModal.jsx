import React, { useState } from 'react';
import { Bot, X, Sparkles, Send, CheckCircle2, ShieldCheck, ArrowRight, Lightbulb } from 'lucide-react';

export const AiReturnAssistantModal = ({ isOpen, onClose, role = 'supplier', productData = null }) => {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: role === 'supplier'
        ? "Bonjour ! Je suis votre Agent d'IA Anti-Retour & Optimisation Ventes. Je peux analyser vos pics de retours, suggérer des conseils marketing, ou vous guider sur les réglages de pénalité."
        : "Bonjour ! Je suis l'assistant IA de prévention des retours. Un problème avec votre article ? Je peux vous aider à trouver une solution ou régler un souci de taille/montage avant d'initier un retour.",
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = () => {
    if (!input.trim()) return;

    const userText = input;
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      let aiResponse = "";
      const lower = userText.toLowerCase();

      if (role === 'supplier') {
        if (lower.includes('taille') || lower.includes('size')) {
          aiResponse = "💡 **Recommandation IA (Taille)** : 65% des retours sur la catégorie textile sont dus à des erreurs d'essayage. Nous vous conseillons d'ajouter une grille des tailles interactive en cm et de programmer un SMS de confirmation systématique avant expédition.";
        } else if (lower.includes('qualité') || lower.includes('défaut')) {
          aiResponse = "🛠️ **Conseil Logistique & Qualité** : Activez l'option d'inspection packaging renforcée et ajoutez un sceau de contrôle de conformité. Vos clients seront 80% moins enclins à demander un retour.";
        } else if (lower.includes('pénalité') || lower.includes('client')) {
          aiResponse = "⚖️ **Stratégie de Pénalité Intelligente** : Configurez le seuil de tolérance à 15%. Pour tout client dépassant ce taux avec au moins 2 retours récents, le système exigera automatiquement un acompte de 30% ou désactivera le paiement à la livraison (COD).";
        } else {
          aiResponse = "🚀 **Stratégie Anti-Retour IA** : 1) Envoyez des photos HD sous tous les angles. 2) Proposez un appel vidéo rapide de confirmation pour les pièces sensibles. 3) Proposez des échanges d'articles gratuits au lieu de remboursements.";
        }
      } else {
        if (lower.includes('taille') || lower.includes('petit') || lower.includes('grand')) {
          aiResponse = "👕 **Solution Échange Express** : Ne renvoyez pas le produit tout de suite ! Le fournisseur propose un échange de taille gratuit livré directement chez vous sous 48h sans frais de retour.";
        } else if (lower.includes('panne') || lower.includes('marche pas') || lower.includes('notice')) {
          aiResponse = "🔧 **Assistance Technique IA** : Assurez-vous d'avoir retiré le film de protection de la batterie et appuyé 3 secondes sur le bouton principal. Si le problème persiste, cliquez sur 'Demander un Échange Rapide'.";
        } else {
          aiResponse = "✅ **Conseil IA Client** : Si vous décidez malgré tout d'initier un retour, veillez à conserver l'emballage d'origine intact afin de préserver votre Score de Fiabilité Client et garder le paiement à la livraison actif !";
        }
      }

      setMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
      setLoading(false);
    }, 800);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '1rem',
    }}>
      <div style={{
        background: '#0f172a',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '550px',
        height: '600px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '1.2rem',
          background: 'linear-gradient(135deg, #1e1b4b 0%, #311b92 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ background: 'rgba(139, 92, 246, 0.2)', padding: '0.5rem', borderRadius: '10px', display: 'flex' }}>
              <Bot style={{ color: '#a78bfa', width: '22px', height: '22px' }} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                Agent IA Anti-Retour & Conseils <Sparkles style={{ color: '#f59e0b', width: '16px', height: '16px' }} />
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
                {role === 'supplier' ? 'Supervision & Recommandations Fournisseur' : 'Assistant Résolution Client'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.3rem' }}
          >
            <X style={{ width: '22px', height: '22px' }} />
          </button>
        </div>

        {/* Messages Body */}
        <div style={{
          flex: 1,
          padding: '1.2rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          background: 'rgba(15, 23, 42, 0.9)',
        }}>
          {messages.map((m, idx) => (
            <div
              key={idx}
              style={{
                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                background: m.sender === 'user' ? '#6366f1' : 'rgba(30, 41, 59, 0.8)',
                color: '#fff',
                border: m.sender === 'ai' ? '1px solid rgba(255,255,255,0.08)' : 'none',
                borderRadius: m.sender === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                padding: '0.9rem 1.1rem',
                fontSize: '0.9rem',
                lineHeight: '1.5',
              }}
            >
              {m.text}
            </div>
          ))}

          {loading && (
            <div style={{ alignSelf: 'flex-start', background: 'rgba(30, 41, 59, 0.8)', padding: '0.8rem 1.2rem', borderRadius: '16px', color: '#a78bfa', fontSize: '0.85rem' }}>
              L'Agent IA génère une recommandation...
            </div>
          )}
        </div>

        {/* Suggestions Shortcuts */}
        <div style={{ padding: '0.6rem 1rem', background: '#0f172a', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
          {role === 'supplier' ? (
            <>
              <button
                onClick={() => setInput("Comment réduire les retours sur mes vêtements ?")}
                style={{ background: 'rgba(139, 92, 246, 0.15)', border: '1px solid rgba(139, 92, 246, 0.3)', color: '#c084fc', padding: '0.3rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                👕 Problème de Taille
              </button>
              <button
                onClick={() => setInput("Comment pénaliser les clients abusifs ?")}
                style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', padding: '0.3rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                ⚖️ Pénalités Clients
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setInput("Problème de taille de vêtement")}
                style={{ background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)', color: '#93c5fd', padding: '0.3rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                📏 Échange de Taille
              </button>
              <button
                onClick={() => setInput("Comment garder mon statut client fiable ?")}
                style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#6ee7b7', padding: '0.3rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                🛡️ Mon Statut Fiabilité
              </button>
            </>
          )}
        </div>

        {/* Input Bar */}
        <div style={{ padding: '1rem', background: '#0f172a', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            placeholder="Posez votre question à l'Agent IA..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            style={{
              flex: 1,
              background: 'rgba(30, 41, 59, 0.7)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '10px',
              padding: '0.7rem 1rem',
              color: '#fff',
              fontSize: '0.9rem',
              outline: 'none',
            }}
          />
          <button
            onClick={handleSend}
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              border: 'none',
              color: '#fff',
              padding: '0.7rem 1.2rem',
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Send style={{ width: '18px', height: '18px' }} />
          </button>
        </div>
      </div>
    </div>
  );
};
