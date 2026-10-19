import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Send, MessageSquare, ShieldCheck, Clock } from 'lucide-react';

export const OrderChatPage = () => {
  const { orderId } = useParams();
  const { user } = useAuth();

  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchConversation = () => {
    setError('');
    api.get(`/conversations/order/${orderId}`)
      .then((res) => {
        setConversation(res.data);
        setMessages(res.data.messages || []);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Erreur lors du chargement de la discussion.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchConversation();
  }, [orderId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversation) return;

    api.post(`/conversations/${conversation.id}/messages`, { body: newMessage })
      .then((res) => {
        setMessages((prev) => [...prev, res.data.data]);
        setNewMessage('');
      })
      .catch((err) => alert(err.response?.data?.message || 'Erreur envoi message.'));
  };

  const handlePresetClick = (presetText) => {
    setNewMessage(presetText);
  };

  if (loading) return <div className="container" style={{ padding: '3rem' }}>Chargement de la messagerie...</div>;

  if (error) {
    return (
      <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '800px' }}>
        <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
          <MessageSquare size={44} color="var(--primary)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Discussion Non Disponible</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{error}</p>
          <button onClick={() => window.history.back()} className="btn btn-primary btn-sm">Retour aux commandes</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', maxWidth: '800px' }}>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ background: 'var(--primary)', color: '#fff', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Dialogue Commande #{orderId}</h3>
            <p style={{ fontSize: '0.85rem', color: '#DDEFFC' }}>
              Messagerie sécurisée liée à la commande
            </p>
          </div>
          <span className="badge badge-success" style={{ background: '#fff', color: 'var(--success)' }}>
            <ShieldCheck size={14} /> Protection Active
          </span>
        </div>

        {/* Quick Presets Bar */}
        <div style={{ background: 'var(--bg-subtle)', padding: '0.75rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
          <button onClick={() => handlePresetClick("Bonjour, pouvez-vous confirmer le délai d'expédition ?")} className="btn btn-secondary btn-sm" style={{ whiteSpace: 'nowrap' }}>
            📅 Délai d'expédition
          </button>
          <button onClick={() => handlePresetClick("Bonjour, merci de confirmer la prise en compte de mon adresse de livraison.")} className="btn btn-secondary btn-sm" style={{ whiteSpace: 'nowrap' }}>
            📍 Confirmation d'adresse
          </button>
          <button onClick={() => handlePresetClick("J'ai une question concernant les spécifications du produit.")} className="btn btn-secondary btn-sm" style={{ whiteSpace: 'nowrap' }}>
            📦 Spécifications du produit
          </button>
        </div>

        {/* Message Trail */}
        <div style={{ padding: '1.5rem', minHeight: '320px', maxHeight: '480px', overflowY: 'auto', background: 'var(--bg-main)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {messages.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', margin: 'auto' }}>
              Aucun message échangé pour l'instant. Utilisez les suggestions ci-dessus pour entamer le dialogue.
            </p>
          ) : (
            messages.map((msg) => {
              const isMe = msg.sender_id === user?.id;
              return (
                <div
                  key={msg.id}
                  style={{
                    alignSelf: isMe ? 'flex-end' : 'flex-start',
                    maxWidth: '75%',
                    background: isMe ? 'var(--primary)' : 'var(--bg-surface)',
                    color: isMe ? '#fff' : 'var(--text-main)',
                    border: isMe ? 'none' : '1px solid var(--border-color)',
                    padding: '0.85rem 1.15rem',
                    borderRadius: isMe ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div style={{ fontSize: '0.75rem', opacity: 0.8, marginBottom: '0.25rem', fontWeight: 600 }}>
                    {msg.sender?.name || (isMe ? 'Vous' : 'Interlocuteur')}
                  </div>
                  <div style={{ fontSize: '0.95rem', lineHeight: 1.5 }}>{msg.body}</div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.7, textAlign: 'right', marginTop: '0.3rem' }}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendMessage} style={{ padding: '1rem 1.5rem', background: 'var(--bg-surface)', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.75rem' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Écrivez votre message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn btn-primary">
            <Send size={18} /> Envoyer
          </button>
        </form>
      </div>
    </div>
  );
};
