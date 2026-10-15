import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('UI Rendering Error:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('user_data');
      localStorage.removeItem('app_cart');
    } catch (e) {}
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '4rem 1.5rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <div className="card" style={{ padding: '2.5rem' }}>
            <AlertTriangle size={48} color="var(--warning)" style={{ marginBottom: '1rem' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Réinitialisation de la Session</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              Une anomalie est survenue lors de l'affichage. Cliquez ci-dessous pour recharger proprement la plateforme Marketeria.
            </p>
            <button onClick={this.handleReset} className="btn btn-primary" style={{ padding: '0.8rem 1.5rem', fontWeight: 700 }}>
              <RefreshCw size={16} /> Recharger la Plateforme
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
