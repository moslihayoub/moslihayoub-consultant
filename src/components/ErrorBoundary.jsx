import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // If it's a chunk loading error (common after new deployments)
    if (
      error.name === 'ChunkLoadError' ||
      (error.message && error.message.toLowerCase().includes('chunk')) ||
      (error.message && error.message.toLowerCase().includes('failed to fetch dynamically imported module'))
    ) {
      window.location.reload();
    }
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px', textAlign: 'center', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          <h2>Oups ! Une erreur inattendue s'est produite.</h2>
          <p style={{ color: '#666', marginBottom: '24px' }}>La page a peut-être été mise à jour ou un problème de connexion est survenu.</p>
          <button 
            onClick={() => window.location.reload()}
            style={{ padding: '12px 24px', background: '#000', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
          >
            Recharger la page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
