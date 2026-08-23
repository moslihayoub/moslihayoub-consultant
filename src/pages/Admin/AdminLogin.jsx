import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, LogIn, AlertCircle } from 'lucide-react';
import { auth, ADMIN_WHITELIST } from '../../utils/firebaseConfig';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, signOut } from 'firebase/auth';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      if (!auth) throw new Error("Firebase Auth non disponible");
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user && ADMIN_WHITELIST.includes(user.email)) {
        localStorage.setItem('m84_admin_token', 'authenticated_admin_moslih');
        localStorage.setItem('m84_admin_email', user.email);
        navigate('/admin/dashboard');
      } else {
        await signOut(auth);
        setError(`Accès refusé : L'adresse ${user?.email || 'utilisée'} n'est pas autorisée.`);
      }
    } catch (err) {
      console.error("Erreur Google Auth:", err);
      let msg = "Erreur de connexion Google ou fenêtre fermée.";
      if (err.code === 'auth/unauthorized-domain') {
        msg = "Ce domaine (ex: localhost) n'est pas autorisé dans Firebase Console > Authentication > Settings > Authorized domains.";
      } else if (err.code === 'auth/operation-not-allowed') {
        msg = "Google Sign-In n'est pas encore activé dans Firebase Console > Authentication > Sign-in method.";
      } else if (err.code === 'auth/popup-closed-by-user') {
        msg = "La fenêtre de connexion Google a été fermée.";
      } else if (err.message) {
        msg = `Erreur Firebase Auth (${err.code || 'inconnue'}) : ${err.message}`;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const emailOrUser = username.trim();
    const cleanPass = password.trim();

    // 1. Tenter la connexion avec Firebase Auth (Email/Password)
    if (auth && emailOrUser.includes('@')) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, emailOrUser, cleanPass);
        const user = userCredential.user;
        if (user && ADMIN_WHITELIST.includes(user.email)) {
          localStorage.setItem('m84_admin_token', 'authenticated_admin_moslih');
          localStorage.setItem('m84_admin_email', user.email);
          navigate('/admin/dashboard');
          return;
        } else {
          await signOut(auth);
          setError(`Accès refusé : L'adresse ${user?.email} n'est pas dans la liste blanche.`);
          setLoading(false);
          return;
        }
      } catch (fbErr) {
        console.warn("Connexion Firebase Email/Pass échouée, tentative fallback local:", fbErr.code);
      }
    }

    // 2. Fallback sécurisé direct (Email + Mot de passe ou Username classique)
    setTimeout(() => {
      const isEmailMatch = (emailOrUser.toLowerCase() === 'moslihayoub@gmail.com') && (cleanPass === 'M@slih031984' || cleanPass === '031984');
      const isLegacyMatch = (emailOrUser.toLowerCase() === 'moslih84') && (cleanPass === '031984' || cleanPass === 'M@slih031984');

      if (isEmailMatch || isLegacyMatch) {
        localStorage.setItem('m84_admin_token', 'authenticated_admin_moslih');
        localStorage.setItem('m84_admin_email', 'moslihayoub@gmail.com');
        navigate('/admin/dashboard');
      } else {
        setError("Email ou mot de passe incorrect.");
        setLoading(false);
      }
    }, 400);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', padding: '24px' }}>
      <div style={{ background: '#1e293b', padding: '40px', borderRadius: '16px', width: '100%', maxWidth: '420px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', marginBottom: '16px' }}>
            <Lock size={32} />
          </div>
          <h1 style={{ color: '#f8fafc', fontSize: '24px', margin: 0, fontWeight: '600' }}>Accès Sécurisé</h1>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '8px' }}>Espace d'administration M84</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid #ef4444', padding: '12px 16px', marginBottom: '24px', borderRadius: '4px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <AlertCircle size={20} color="#ef4444" style={{ flexShrink: 0 }} />
            <span style={{ color: '#ef4444', fontSize: '14px' }}>{error}</span>
          </div>
        )}

        {/* Bouton Google Sign-In Sécurisé */}
        <button 
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px 16px',
            background: '#ffffff',
            color: '#1e293b',
            border: 'none',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginBottom: '20px',
            transition: 'all 0.2s ease',
            opacity: loading ? 0.7 : 1
          }}
          onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
          onMouseOut={(e) => e.currentTarget.style.background = '#ffffff'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          Continuer avec Google
        </button>

        <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', gap: '12px' }}>
          <div style={{ flex: 1, height: '1px', background: '#334155' }}></div>
          <span style={{ color: '#64748b', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>ou mot de passe</span>
          <div style={{ flex: 1, height: '1px', background: '#334155' }}></div>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', color: '#cbd5e1', fontSize: '14px', marginBottom: '8px', fontWeight: '500' }}>Email ou Identifiant</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="moslihayoub@gmail.com"
              required
              style={{ width: '100%', padding: '12px 16px', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
              onFocus={(e) => e.target.style.borderColor = '#38bdf8'}
              onBlur={(e) => e.target.style.borderColor = '#334155'}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', color: '#cbd5e1', fontSize: '14px', marginBottom: '8px', fontWeight: '500' }}>Mot de passe</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{ width: '100%', padding: '12px 16px', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
              onFocus={(e) => e.target.style.borderColor = '#38bdf8'}
              onBlur={(e) => e.target.style.borderColor = '#334155'}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              marginTop: '8px', width: '100%', padding: '14px', background: '#38bdf8', color: '#0f172a', 
              border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', 
              cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px',
              opacity: loading ? 0.7 : 1, transition: 'background 0.2s' 
            }}
          >
            {loading ? 'Vérification...' : <><LogIn size={20} /> Se connecter</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
