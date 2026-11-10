import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, Database, Users, Settings, X, ChevronLeft, ChevronRight, Briefcase, Eye, Menu } from 'lucide-react';
import ProjectsManager from './ProjectsManager';
import CrmLeadsManager from './CrmLeadsManager';
import AiConfigManager from './AiConfigManager';
import ClientMissionsManager from './ClientMissionsManager';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../utils/firebaseConfig';
import { fallbackLeads } from '../../data/fallbackLeads';
import { supabase, isSupabaseConfigured } from '../../utils/supabaseClient';
import { StatCard } from '../../design-system';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // For Mobile
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // For Desktop
  const [trafficData, setTrafficData] = useState([]);
  const [leadsData, setLeadsData] = useState([]);
  const [totalLeads, setTotalLeads] = useState(0);
  const [activeMissionsCount, setActiveMissionsCount] = useState(1);
  const [loadingTraffic, setLoadingTraffic] = useState(true);

  useEffect(() => {
    if (activeTab === 'overview') {
      fetchData();
    }
  }, [activeTab]);

  const [filterStartMonth, setFilterStartMonth] = useState('');
  const [filterEndMonth, setFilterEndMonth] = useState('');
  const [allLeadsList, setAllLeadsList] = useState([]);
  const [allTrafficList, setAllTrafficList] = useState([]);

  const fetchData = async () => {
    setLoadingTraffic(true);
    let leadsList = [];

    // 1. Essai Supabase First pour les leads
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: sbLeads, error: sbErr } = await supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false });
        if (!sbErr && sbLeads && sbLeads.length > 0) {
          leadsList = sbLeads.map(l => ({
            ...l,
            createdAt: l.created_at
          }));
        }
      } catch (err) {
        console.warn("Supabase fetch leads notice:", err);
      }

      // Nombre de missions
      try {
        const { count } = await supabase.from('missions').select('*', { count: 'exact', head: true });
        if (count) setActiveMissionsCount(count);
      } catch (err) {
        console.warn("Supabase count missions notice:", err);
      }
    }

    try {
      // 2. Fetch Traffic Firestore
      if (db) {
        const trafficQ = query(collection(db, 'analytics'), orderBy('date', 'desc'), limit(30));
        const trafficSnap = await getDocs(trafficQ);
        const tData = [];
        trafficSnap.forEach(doc => tData.push(doc.data()));
        tData.reverse(); // Chronological
        setAllTrafficList(tData);

        // Fallback Leads Firestore si Supabase était vide
        if (leadsList.length === 0) {
          const leadsSnap = await getDocs(collection(db, 'leads'));
          leadsSnap.forEach(doc => leadsList.push(doc.data()));
        }
      }
      
      if (leadsList.length === 0) {
        leadsList = fallbackLeads;
      }
      setAllLeadsList(leadsList);
    } catch (error) {
      console.error('Erreur data fetch admin :', error);
      setAllLeadsList(leadsList.length > 0 ? leadsList : fallbackLeads);
      setAllTrafficList([{ name: 'Récents', visites: 15, date: '2026-07-24' }]);
    } finally {
      setLoadingTraffic(false);
    }
  };

  // Recalculer les données quand les filtres changent
  useEffect(() => {
    // Filtrage des leads
    let filteredLeads = [...allLeadsList];
    let filteredTraffic = [...allTrafficList];

    if (filterStartMonth) {
      const start = new Date(filterStartMonth + '-01T00:00:00');
      filteredLeads = filteredLeads.filter(l => {
        const d = l.createdAt?.toMillis ? new Date(l.createdAt.toMillis()) : new Date(l.createdAt);
        return d >= start;
      });
      filteredTraffic = filteredTraffic.filter(t => new Date(t.date) >= start);
    }
    if (filterEndMonth) {
      const end = new Date(filterEndMonth + '-01T00:00:00');
      end.setMonth(end.getMonth() + 1); // Jusqu'à la fin du mois
      filteredLeads = filteredLeads.filter(l => {
        const d = l.createdAt?.toMillis ? new Date(l.createdAt.toMillis()) : new Date(l.createdAt);
        return d < end;
      });
      filteredTraffic = filteredTraffic.filter(t => new Date(t.date) < end);
    }

    setTotalLeads(filteredLeads.length);

    // Group leads by month
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    const leadsCountByMonth = {};
    filteredLeads.forEach(data => {
      let m = 'Récents';
      if (data.createdAt) {
         const d = data.createdAt?.toMillis ? new Date(data.createdAt.toMillis()) : new Date(data.createdAt);
         if (!isNaN(d)) m = months[d.getMonth()];
      }
      leadsCountByMonth[m] = (leadsCountByMonth[m] || 0) + 1;
    });
    const lData = Object.keys(leadsCountByMonth).map(k => ({ name: k, leads: leadsCountByMonth[k] }));
    setLeadsData(lData.length > 0 ? lData : [{ name: 'Aucun', leads: 0 }]);

    // Set Traffic
    setTrafficData(filteredTraffic.length > 0 ? filteredTraffic : [{ name: 'Aucune', visites: 0 }]);

  }, [allLeadsList, allTrafficList, filterStartMonth, filterEndMonth]);

  const handleLogout = async () => {
    try {
      const { auth } = await import('../../utils/firebaseConfig');
      const { signOut } = await import('firebase/auth');
      if (auth) await signOut(auth);
    } catch (e) {
      console.warn("Erreur déconnexion Firebase:", e);
    }
    try {
      const { supabase } = await import('../../utils/supabaseClient');
      if (supabase) await supabase.auth.signOut();
    } catch (e) {
      console.warn("Erreur déconnexion Supabase:", e);
    }
    localStorage.removeItem('m84_admin_token');
    localStorage.removeItem('m84_admin_email');
    navigate('/admin/login');
  };

  const navButton = (id, icon, label) => {
    const isActive = activeTab === id;
    return (
      <button 
        onClick={() => { setActiveTab(id); setIsSidebarOpen(false); }}
        title={isSidebarCollapsed ? label : ""}
        style={{ 
          width: '100%', 
          textAlign: 'left', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: isSidebarCollapsed ? 'center' : 'flex-start', 
          gap: isSidebarCollapsed ? '0' : '12px', 
          padding: '12px 14px', 
          background: isActive ? 'rgba(0, 98, 83, 0.18)' : 'transparent', 
          color: isActive ? '#006253' : '#64748b', 
          border: isActive ? '1px solid rgba(0, 98, 83, 0.25)' : '1px solid transparent', 
          borderRadius: 'var(--m84-radius-md)', 
          cursor: 'pointer', 
          fontWeight: isActive ? '700' : '500', 
          transition: 'all var(--m84-transition-fast)',
          fontFamily: 'var(--m84-font-family)'
        }}
      >
        <span style={{ color: isActive ? '#006253' : '#94a3b8', display: 'flex', alignItems: 'center' }}>{icon}</span> 
        {!isSidebarCollapsed && <span className="nav-btn-text" style={{ fontSize: '0.9rem' }}>{label}</span>}
      </button>
    );
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--m84-bg)', color: 'var(--m84-text-primary)', fontFamily: 'var(--m84-font-family)' }}>
      
      {/* Responsive Styles */}
      <style>{`
        .admin-sidebar {
          width: ${isSidebarCollapsed ? '80px' : '280px'};
          background: #ffffff;
          border-right: 1.5px solid var(--m84-border-subtle);
          color: var(--m84-text-primary);
          display: flex;
          flex-direction: column;
          transition: width 0.3s ease, transform 0.3s ease;
          z-index: 50;
          overflow-x: hidden;
        }
        .admin-main {
          flex: 1;
          padding: 28px 36px;
          overflow-y: auto;
          width: 100%;
        }
        .admin-sidebar.open {
          transform: translateX(0);
        }
        .desktop-toggle-btn {
          background: var(--m84-surface-subtle);
          border: 1px solid var(--m84-border-subtle);
          color: var(--m84-text-secondary);
          padding: 6px;
          border-radius: var(--m84-radius-sm);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .desktop-toggle-btn:hover {
          background: var(--m84-primary-light);
          color: var(--m84-primary);
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
            padding: 14px 14px 100px 14px;
          }
          .desktop-toggle-btn {
            display: none;
          }
          .mobile-bottom-nav {
            display: flex !important;
          }
          .nav-btn-text {
            font-size: 1.1rem !important;
          }
        }
        .mobile-bottom-nav {
          display: none;
          position: fixed;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          width: calc(100vw - 32px);
          max-width: 440px;
          height: 65px;
          background: #ffffff;
          border: 1.5px solid var(--m84-border-subtle);
          z-index: 100;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          padding: 0 16px;
          box-shadow: var(--m84-shadow-lg);
          border-radius: 100px;
        }
        .mobile-nav-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: var(--m84-text-muted);
          background: transparent;
          border: none;
          gap: 4px;
          font-size: 10px;
          padding: 8px;
          border-radius: 8px;
        }
        .mobile-nav-btn.active {
          color: var(--m84-primary);
          font-weight: 700;
        }
      `}</style>

      {/* Sidebar Desktop */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--m84-border-subtle)', display: 'flex', flexDirection: isSidebarCollapsed ? 'column' : 'row', justifyContent: isSidebarCollapsed ? 'center' : 'space-between', alignItems: 'center', gap: isSidebarCollapsed ? '16px' : '0' }}>
          
          {!isSidebarCollapsed && (
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, display: 'flex', alignItems: 'center', gap: '10px', whiteSpace: 'nowrap', color: 'var(--m84-text-primary)' }}>
              <img src="/favicon.svg" alt="M84 Logo" style={{ width: '28px', height: '28px' }} />
              <span>M84 Backoffice</span>
            </h2>
          )}
          {isSidebarCollapsed && <img src="/favicon.svg" alt="M84 Logo" style={{ width: '28px', height: '28px', flexShrink: 0 }} />}

          <button className="desktop-toggle-btn" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} title="Réduire/Agrandir">
            {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>

          <button className="mobile-close-btn" onClick={() => setIsSidebarOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--m84-text-primary)', display: 'none' }}>
            <X size={24} />
          </button>
          <style>{`@media (max-width: 768px) { .mobile-close-btn { display: block !important; } }`}</style>
        </div>
        <nav style={{ flex: 1, padding: '20px 14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {navButton('overview', <LayoutDashboard size={20} />, "Vue d'ensemble")}
          {navButton('missions', <Briefcase size={20} />, "Missions Clients (CRA)")}
          {navButton('projects', <Database size={20} />, "Projets (CRUD)")}
          {navButton('leads', <Users size={20} />, "CRM Leads")}
          {navButton('settings', <Settings size={20} />, "Configuration IA")}
        </nav>
        <div style={{ padding: '20px 14px', borderTop: '1px solid var(--m84-border-subtle)' }}>
          <button 
            onClick={handleLogout}
            title={isSidebarCollapsed ? "Se déconnecter" : ""}
            style={{ 
              width: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: isSidebarCollapsed ? '0' : '8px', 
              padding: '10px', 
              background: 'transparent', 
              border: '1.5px solid var(--m84-border-subtle)', 
              color: 'var(--m84-text-secondary)', 
              borderRadius: 'var(--m84-radius-md)', 
              cursor: 'pointer', 
              fontWeight: '600', 
              transition: 'all 0.2s',
              fontFamily: 'var(--m84-font-family)'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--m84-danger-bg)'; e.currentTarget.style.color = 'var(--m84-danger)'; e.currentTarget.style.borderColor = 'var(--m84-danger-border)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--m84-text-secondary)'; e.currentTarget.style.borderColor = 'var(--m84-border-subtle)'; }}
          >
            <LogOut size={16} /> {!isSidebarCollapsed && "Se déconnecter"}
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
            
            {activeTab === 'overview' && (
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', padding: '6px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>Du</span>
                  <input 
                    type="month" 
                    value={filterStartMonth}
                    onChange={e => setFilterStartMonth(e.target.value)}
                    style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '14px', color: '#0f172a', fontFamily: 'inherit' }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', padding: '6px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>Au</span>
                  <input 
                    type="month" 
                    value={filterEndMonth}
                    onChange={e => setFilterEndMonth(e.target.value)}
                    style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '14px', color: '#0f172a', fontFamily: 'inherit' }}
                  />
                </div>
                {(filterStartMonth || filterEndMonth) && (
                  <button 
                    onClick={() => { setFilterStartMonth(''); setFilterEndMonth(''); }}
                    style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}
                    title="Réinitialiser"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            )}
          </header>

          {activeTab === 'overview' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                <StatCard 
                  title="Missions Régie Actives"
                  value={activeMissionsCount}
                  subvalue="CAM (Crédit Agricole)"
                  icon={<Briefcase size={18} />}
                  progress={{ current: 41.5, total: 65, label: '41.5j / 65j consommés' }}
                />
                <StatCard 
                  title="Leads Capturés"
                  value={totalLeads}
                  subvalue="Supabase & CRM"
                  icon={<Users size={18} />}
                  trend={{ value: 'Actif', isPositive: true, label: 'Temps réel' }}
                />
                <StatCard 
                  title="Agent IA M84"
                  value="En ligne"
                  subvalue="Gemini Flash Cascading"
                  icon={<Eye size={18} />}
                  trend={{ value: '100%', isPositive: true, label: 'Disponibilité' }}
                />
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

          {activeTab === 'missions' && <ClientMissionsManager />}
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
