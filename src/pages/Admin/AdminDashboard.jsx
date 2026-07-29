import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../utils/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, Database, Settings } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/admin/login');
    } catch (error) {
      console.error("Erreur de déconnexion", error);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', color: '#0f172a', fontFamily: 'system-ui, sans-serif' }}>
      {/* Sidebar */}
      <aside style={{ width: '280px', background: '#1e293b', color: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid #334155' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '32px', height: '32px', background: '#38bdf8', borderRadius: '8px' }}></div>
            M84 Admin
          </h2>
        </div>
        <nav style={{ flex: 1, padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', borderRadius: '8px', textDecoration: 'none', fontWeight: '500' }}>
            <LayoutDashboard size={20} />
            Vue d'ensemble
          </a>
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', color: '#94a3b8', borderRadius: '8px', textDecoration: 'none', fontWeight: '500', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.color = '#f8fafc'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }} onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'transparent' }}>
            <Database size={20} />
            Projets (CRUD)
          </a>
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', color: '#94a3b8', borderRadius: '8px', textDecoration: 'none', fontWeight: '500', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.color = '#f8fafc'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }} onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'transparent' }}>
            <Settings size={20} />
            Configurations
          </a>
        </nav>
        <div style={{ padding: '24px 16px', borderTop: '1px solid #334155' }}>
          <button 
            onClick={handleLogout}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
          >
            <LogOut size={18} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '48px', overflowY: 'auto' }}>
        <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '32px', margin: '0 0 8px 0', fontWeight: 'bold' }}>Bienvenue, Ayoub.</h1>
            <p style={{ margin: 0, color: '#64748b' }}>Voici un aperçu de l'état de votre site.</p>
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {/* Mock Stats Cards */}
          <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)' }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#64748b', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase' }}>Projets Actifs</h3>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#0f172a' }}>12</div>
          </div>
          <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)' }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#64748b', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase' }}>Statut IA Gemini</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 0 4px rgba(34, 197, 94, 0.2)' }}></div>
              <span style={{ fontSize: '20px', fontWeight: '600', color: '#0f172a' }}>Opérationnel</span>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '48px', background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <h2 style={{ marginTop: 0, marginBottom: '16px', fontSize: '20px' }}>Prochaine étape : CRUD Firestore</h2>
          <p style={{ color: '#64748b', lineHeight: 1.6 }}>L'étape suivante consistera à lister ici les projets stockés dans Firestore afin de pouvoir les modifier dynamiquement sans toucher au code <code>projects.js</code>.</p>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
