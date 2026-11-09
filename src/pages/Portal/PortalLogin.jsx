import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, ArrowRight, UserCheck } from 'lucide-react';
import { portalLogin, devLoginAsCollaborator, CONSULTANT_PROFILE } from '../../services/clientPortalService';

export default function PortalLogin() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      portalLogin(identifier, password);
      navigate('/portal');
    } catch (err) {
      setError(err.message || "Identifiants incorrects.");
    } finally {
      setLoading(false);
    }
  };

  const handleDevLogin = () => {
    devLoginAsCollaborator('mission-cam-2026');
    navigate('/portal');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '24px',
        padding: '40px',
        width: '100%',
        maxWidth: '460px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)'
      }}>
        
        {/* Header avec Logo Bank-e CAM */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            padding: '10px 22px',
            background: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
            border: '1px solid #e2e8f0'
          }}>
            <img 
              src="/assets/clients/bank-e.png" 
              alt="Bank-e Crédit Agricole du Maroc" 
              style={{ height: '42px', width: 'auto', objectFit: 'contain' }}
            />
          </div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
            Portail Collaborateur Client
          </h1>
          <p style={{ fontSize: '0.86rem', color: '#64748b', margin: 0 }}>
            Espace de suivi de mission & CRA • {CONSULTANT_PROFILE.name}
          </p>
        </div>

        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            borderRadius: '10px',
            padding: '12px 14px',
            fontSize: '0.85rem',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
              Identifiant
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                required
                placeholder="collab.cam"
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                style={{ width: '100%', padding: '12px 14px 12px 40px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
              />
              <User size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
              Mot de Passe
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ width: '100%', padding: '12px 44px 12px 40px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
              />
              <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  color: '#64748b'
                }}
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '13px',
              borderRadius: '10px',
              border: 'none',
              background: '#006253',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: loading ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '8px',
              boxShadow: '0 4px 12px rgba(0, 98, 83, 0.25)'
            }}
          >
            Se Connecter à mon Espace <ArrowRight size={18} />
          </button>
        </form>

        {/* Localhost 1-Click Fast Dev Test */}
        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.78rem', color: '#64748b', textAlign: 'center', marginBottom: '10px' }}>
            🧪 Test Localhost / Démo immédiate :
          </div>
          <button
            type="button"
            onClick={handleDevLogin}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '10px',
              border: '1px solid #006253',
              background: 'rgba(0, 98, 83, 0.05)',
              color: '#006253',
              fontWeight: 700,
              fontSize: '0.84rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <UserCheck size={16} /> Connexion 1-Clic Démo CAM (collab.cam)
          </button>
        </div>

      </div>
    </div>
  );
}