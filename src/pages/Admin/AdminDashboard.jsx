import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, Database, Users, Settings, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
import ProjectsManager from './ProjectsManager';
import CrmLeadsManager from './CrmLeadsManager';
import AiConfigManager from './AiConfigManager';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { collection, getDocs, query, orderBy, limit, doc, setDoc, addDoc } from 'firebase/firestore';
import { app, db } from '../../utils/firebaseConfig';
import { fallbackLeads } from '../../data/fallbackLeads';


const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // For Mobile
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // For Desktop
  const [trafficData, setTrafficData] = useState([]);
  const [leadsData, setLeadsData] = useState([]);
  const [totalLeads, setTotalLeads] = useState(0);
  const [loadingTraffic, setLoadingTraffic] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);

  // Auto-import CSV data disabled to prevent duplicates

  useEffect(() => {
    if (activeTab === 'overview') {
      fetchData();
    }
  }, [activeTab]);

  const fetchData = async () => {
    setLoadingTraffic(true);
    try {
      if (!db) return;

      // 1. Fetch Traffic
      const trafficQ = query(collection(db, 'analytics'), orderBy('date', 'desc'), limit(7));
      const trafficSnap = await getDocs(trafficQ);
      const tData = [];
      trafficSnap.forEach(doc => tData.push(doc.data()));
      tData.reverse(); // Chronological
      if (tData.length > 0) {
        setTrafficData(tData);
      } else {
        setTrafficData([{ name: 'Aucune', visites: 0 }]);
      }

      // 2. Fetch Leads
      const leadsSnap = await getDocs(collection(db, 'leads'));
      
      let leadsList = [];
      leadsSnap.forEach(doc => leadsList.push(doc.data()));
      
      if (leadsList.length === 0) {
        setTotalLeads(fallbackLeads.length);
        leadsList = fallbackLeads;
      } else {
        setTotalLeads(leadsSnap.size);
      }
      
      const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
      const leadsCountByMonth = {};
      leadsList.forEach(data => {
        let m = 'Récents';
        if (data.createdAt) {
           const d = data.createdAt?.toMillis ? new Date(data.createdAt.toMillis()) : new Date(data.createdAt);
           if (!isNaN(d)) m = months[d.getMonth()];
        }
        leadsCountByMonth[m] = (leadsCountByMonth[m] || 0) + 1;
      });
      
      const lData = Object.keys(leadsCountByMonth).map(k => ({ name: k, leads: leadsCountByMonth[k] }));
      setLeadsData(lData.length > 0 ? lData : [{ name: 'Aucun', leads: 0 }]);

    } catch (error) {
      console.error('Erreur Firestore :', error);
      // Fallback CSV Data if Firestore is locked
      setTotalLeads(fallbackLeads.length);
      setLeadsData([{ name: 'Juil', leads: fallbackLeads.length }]);
      setTrafficData([{ name: 'Récents', visites: 15 }]);
      setLoadingTraffic(false);
    } finally {
      setLoadingTraffic(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('m84_admin_token');
    navigate('/admin/login');
  };

  const navButton = (id, icon, label) => (
    <button 
      onClick={() => { setActiveTab(id); setIsSidebarOpen(false); }}
      title={isSidebarCollapsed ? label : ""}
      style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: isSidebarCollapsed ? 'center' : 'flex-start', gap: isSidebarCollapsed ? '0' : '12px', padding: '12px', background: activeTab === id ? 'rgba(16, 185, 129, 0.1)' : 'transparent', color: activeTab === id ? '#10b981' : '#94a3b8', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', transition: 'all 0.2s' }}
    >
      {icon} {!isSidebarCollapsed && <span className="nav-btn-text">{label}</span>}
    </button>
  );

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f8fafc', color: '#0f172a', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* Responsive Styles */}
      <style>{`
        .admin-sidebar {
          width: ${isSidebarCollapsed ? '80px' : '280px'};
          background: #1e293b;
          color: #f8fafc;
          display: flex;
          flex-direction: column;
          transition: width 0.3s ease, transform 0.3s ease;
          z-index: 50;
          overflow-x: hidden;
        }
        .admin-main {
          flex: 1;
          padding: 24px;
          overflow-y: auto;
          width: 100%;
        }
          .admin-sidebar.open {
            transform: translateX(0);
          }
          .desktop-toggle-btn {
            background: #334155;
            border: none;
            color: white;
            padding: 6px;
            border-radius: 8px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
          }
          .desktop-toggle-btn:hover {
            background: #475569;
          }
        @media (max-width: 768px) {
          .admin-sidebar {
            display: none !important;
          }
          .admin-sidebar.open {
            display: flex !important;
            width: 100vw !important;
            height: 100vh !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            z-index: 1000 !important;
            transform: none !important;
          }
          .admin-main {
            padding: 14px 14px 100px 14px; /* padding for bottom nav */
          }
          .desktop-toggle-btn {
            display: none;
          }
          .mobile-bottom-nav {
            display: flex !important;
          }
          .nav-btn-text {
            font-size: 1.2rem !important;
          }
        }
        .mobile-bottom-nav {
          display: none;
          position: fixed;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          width: calc(100vw - 32px);
          max-width: 400px;
          height: 65px;
          background: #1e293b;
          z-index: 100;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          padding: 0 24px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          border-radius: 100px;
        }
        .mobile-nav-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
          background: transparent;
          border: none;
          gap: 4px;
          font-size: 10px;
          padding: 8px;
          border-radius: 8px;
        }
        .mobile-nav-btn.active {
          color: white;
        }
      `}</style>

      {/* Sidebar Desktop */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div style={{ padding: '24px 16px', borderBottom: '1px solid #334155', display: 'flex', flexDirection: isSidebarCollapsed ? 'column' : 'row', justifyContent: isSidebarCollapsed ? 'center' : 'space-between', alignItems: 'center', gap: isSidebarCollapsed ? '16px' : '0' }}>
          
          {!isSidebarCollapsed && (
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0, display: 'flex', alignItems: 'center', gap: '12px', whiteSpace: 'nowrap' }}>
              <img src="/favicon.svg" alt="M84 Logo" style={{ width: '32px', height: '32px' }} />
              M84 Admin
            </h2>
          )}
          {isSidebarCollapsed && <img src="/favicon.svg" alt="M84 Logo" style={{ width: '32px', height: '32px', flexShrink: 0 }} />}

          <button className="desktop-toggle-btn" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} title="Réduire/Agrandir">
            {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>

          <button className="mobile-close-btn" onClick={() => setIsSidebarOpen(false)} style={{ background: 'none', border: 'none', color: 'white', display: 'none' }}>
            <X size={24} />
          </button>
          <style>{`@media (max-width: 768px) { .mobile-close-btn { display: block !important; } }`}</style>
        </div>
        <nav style={{ flex: 1, padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {navButton('overview', <LayoutDashboard size={20} />, "Vue d'ensemble")}
          {navButton('projects', <Database size={20} />, "Projets (CRUD)")}
          {navButton('leads', <Users size={20} />, "CRM Leads")}
          {navButton('settings', <Settings size={20} />, "Configuration IA")}
        </nav>
        <div style={{ padding: '24px 16px', borderTop: '1px solid #334155' }}>
          <button 
            onClick={handleLogout}
            title={isSidebarCollapsed ? "Se déconnecter" : ""}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: isSidebarCollapsed ? '0' : '8px', padding: '12px', background: 'transparent', border: '1px solid #ffffff', color: '#ffffff', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
          >
            <LogOut size={18} /> {!isSidebarCollapsed && "Se déconnecter"}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', overflow: 'hidden' }}>

        <main className="admin-main">
          <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontSize: '32px', margin: '0 0 8px 0', fontWeight: 'bold', color: '#0f172a' }}>Bienvenue, Ayoub.</h1>
              <p style={{ margin: 0, color: '#64748b' }}>Gestion simplifiée de votre portfolio M84.</p>
            </div>
          </header>

          {activeTab === 'overview' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                <div className="manager-container" style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                  <h3 style={{ margin: '0 0 16px 0', color: '#64748b', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase' }}>Projets Actifs</h3>
                  <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#0f172a' }}>14</div>
                </div>
                <div className="manager-container" style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                  <h3 style={{ margin: '0 0 16px 0', color: '#64748b', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase' }}>Leads Générés</h3>
                  <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#0f172a' }}>{totalLeads}</div>
                </div>
                <div className="manager-container" style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                  <h3 style={{ margin: '0 0 16px 0', color: '#64748b', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase' }}>Agent M84</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 0 4px rgba(16, 185, 129, 0.2)' }}></div>
                    <span style={{ fontSize: '20px', fontWeight: '600', color: '#0f172a' }}>En ligne</span>
                  </div>
                </div>
              </div>

              <div className="dashboard-charts" style={{ display: 'grid', gap: '24px' }}>
                <style>{`
                  .dashboard-charts { grid-template-columns: 1fr 1fr; }
                  @media (max-width: 768px) { 
                    .dashboard-charts { grid-template-columns: 1fr; } 
                    .manager-container { padding: 14px !important; margin-bottom: 0 !important; }
                  }
                `}</style>
                <div className="manager-container" style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                  <h3 style={{ margin: '0 0 24px 0', color: '#006253', fontSize: '16px', fontWeight: '600' }}>Trafic (7 derniers jours)</h3>
                  <div style={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {loadingTraffic ? (
                      <span style={{ color: '#94a3b8' }}>Chargement des données Analytics...</span>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trafficData} margin={{ top: 5, right: 0, left: -25, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dx={-10} />
                          <Tooltip 
                            contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '8px', color: 'white' }}
                            itemStyle={{ color: '#10b981' }}
                          />
                          <Line type="monotone" dataKey="visites" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
                
                <div className="manager-container" style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                  <h3 style={{ margin: '0 0 24px 0', color: '#006253', fontSize: '16px', fontWeight: '600' }}>Acquisition de Leads (2026)</h3>
                  <div style={{ height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={leadsData} margin={{ top: 5, right: 0, left: -25, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dx={-10} />
                        <Tooltip 
                          cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }}
                          contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '8px', color: 'white' }}
                          itemStyle={{ color: '#8b5cf6' }}
                        />
                        <Bar dataKey="leads" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'projects' && <ProjectsManager />}
          {activeTab === 'leads' && <CrmLeadsManager />}
          {activeTab === 'settings' && <AiConfigManager />}
        </main>

        {/* Mobile Bottom Navbar */}
        <div className="mobile-bottom-nav">
          <img src="/admin-icon.svg" alt="M84 Logo" style={{ width: '32px', height: '32px', cursor: 'pointer' }} onClick={() => setIsSidebarOpen(true)} />
          <button onClick={() => setIsSidebarOpen(true)} style={{ background: 'none', border: 'none', color: '#10b981', display: 'flex', alignItems: 'center', padding: '8px' }}>
            <Menu size={32} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
