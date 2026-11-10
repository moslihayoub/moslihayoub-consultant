import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, FileText, FolderKanban, Clock,
  User, LogOut, ChevronDown, ChevronLeft, ChevronRight, X, Send, Bot
} from 'lucide-react';
import { 
  getPortalSession, portalLogout, getMissionById, 
  CONSULTANT_PROFILE, queryMissionAi, devLoginAsCollaborator 
} from '../../services/clientPortalService';

export default function PortalLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [session, setSession] = useState(() => {
    return getPortalSession() || devLoginAsCollaborator();
  });
  const [mission, setMission] = useState(() => {
    const s = getPortalSession() || devLoginAsCollaborator();
    return s?.missionId ? getMissionById(s.missionId) : getMissionById('mission-cam-2026');
  });
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isToasterVisible, setIsToasterVisible] = useState(true);
  
  // Floating AI Assistant state
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessages, setAiMessages] = useState([
    {
      role: 'assistant',
      text: "Bonjour ! Je suis l'Agent M84 dédié à votre mission avec Ayoub MOSLIH. Comment puis-je vous aider aujourd'hui ? (CRA, livrables, calendrier, absences...)"
    }
  ]);

  useEffect(() => {
    let currentSession = getPortalSession();
    if (!currentSession) {
      currentSession = devLoginAsCollaborator();
      setSession(currentSession);
    }
    if (currentSession?.missionId) {
      const m = getMissionById(currentSession.missionId);
      setMission(m);
    }
  }, []);

  const handleLogout = () => {
    portalLogout();
    navigate('/portal/login');
  };

  const handleSendAi = async (e) => {
    e?.preventDefault();
    if (!aiInput.trim() || aiLoading) return;

    const userText = aiInput.trim();
    setAiInput('');
    setAiMessages(prev => [...prev, { role: 'user', text: userText }]);
    setAiLoading(true);

    try {
      const answer = await queryMissionAi(session?.missionId || 'mission-cam-2026', userText, aiMessages);
      setAiMessages(prev => [...prev, { role: 'assistant', text: answer }]);
    } catch {
      setAiMessages(prev => [...prev, { 
        role: 'assistant', 
        text: "Une erreur est survenue. N'hésitez pas à contacter directement Ayoub MOSLIH au +212 6 63 03 19 84." 
      }]);
    } finally {
      setAiLoading(false);
    }
  };

  const navItems = [
    { path: '/portal', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/portal/reports', label: 'Comptes Rendus', icon: <FileText size={20} /> },
    { path: '/portal/projects', label: 'Projets & Chantiers', icon: <FolderKanban size={20} /> },
    { path: '/portal/timesheet', label: 'Timesheet & Activité', icon: <Clock size={20} /> },
  ];

  const currentPath = location.pathname;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f8fafc', color: '#0f172a', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* 1. TOP HEADER (Logo Bank-e autonome sans carte ni fond) */}
      <header style={{
        height: '72px',
        background: '#ffffff',
        borderBottom: '1.5px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
      }}>
        {/* Left: Standalone Logo Bank-e (sans fond ni carte) */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img 
            src="/assets/clients/bank-e.png" 
            alt="Bank-e Crédit Agricole du Maroc" 
            style={{ height: '38px', width: 'auto', objectFit: 'contain' }}
          />
        </div>

        {/* Right: Collaborator User with dropdown (No "Avatar - Profile" label) */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '6px 10px',
              borderRadius: '10px',
              transition: 'background 0.2s'
            }}
          >
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #006253 0%, #10b981 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.95rem',
              boxShadow: '0 2px 5px rgba(0, 98, 83, 0.25)'
            }}>
              {(session?.managerName || 'Karim Tazi').charAt(0).toUpperCase()}
            </div>
            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
                {session?.managerName || 'Karim Tazi'}
              </span>
              <span style={{ fontSize: '0.72rem', color: '#006253', fontWeight: 600 }}>
                {session?.username ? `@${session.username}` : (session?.email || 'collab.cam')}
              </span>
            </div>
            <ChevronDown size={16} color="#64748b" />
          </button>

          {/* Dropdown Menu (Mon profil, Se deconnecter) */}
          {isProfileDropdownOpen && (
            <div 
              style={{
                position: 'absolute',
                top: '52px',
                right: 0,
                width: '200px',
                background: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                padding: '6px',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}
            >
              <button
                onClick={() => {
                  setIsProfileDropdownOpen(false);
                  setIsProfileModalOpen(true);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'transparent',
                  color: '#334155',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <User size={16} color="#006253" />
                Mon profil
              </button>

              <div style={{ height: '1px', background: '#e2e8f0', margin: '2px 0' }} />

              <button
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'transparent',
                  color: '#dc2626',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <LogOut size={16} color="#dc2626" />
                Se déconnecter
              </button>
            </div>
          )}
        </div>
      </header>

      {/* 2. BODY : SIDEBAR + MAIN CONTENT */}
      <div style={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - 72px)' }}>
        
        {/* Left Sidebar (Expand / Collapse: Toolbar 76px vs Sidebar 260px) */}
        <aside style={{
          width: isCollapsed ? '76px' : '260px',
          background: '#ffffff',
          borderRight: '1.5px solid #e2e8f0',
          padding: isCollapsed ? '16px 10px' : '16px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          flexShrink: 0,
          transition: 'width 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden'
        }}>
          {/* Collapse/Expand Toggle Button INSIDE the Sidebar (Conforme PJ 2) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'flex-end',
            paddingBottom: '10px',
            marginBottom: '6px',
            borderBottom: '1px solid #f1f5f9'
          }}>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              title={isCollapsed ? "Déployer la barre latérale" : "Réduire en barre d'outils"}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                background: '#f8fafc',
                color: '#475569',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
              onMouseLeave={e => e.currentTarget.style.background = '#f8fafc'}
            >
              {isCollapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
            </button>
          </div>

          {navItems.map(item => {
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                title={isCollapsed ? item.label : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  gap: isCollapsed ? '0' : '14px',
                  padding: isCollapsed ? '14px 0' : '12px 16px',
                  borderRadius: '12px',
                  border: 'none',
                  background: isActive ? 'rgba(0, 98, 83, 0.08)' : 'transparent',
                  color: isActive ? '#006253' : '#64748b',
                  fontSize: '0.92rem',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  width: '100%',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={e => {
                  if (!isActive) e.currentTarget.style.background = '#f8fafc';
                }}
                onMouseLeave={e => {
                  if (!isActive) e.currentTarget.style.background = 'transparent';
                }}
              >
                <span style={{ color: isActive ? '#006253' : '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {item.icon}
                </span>
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </aside>

        {/* Main Content View */}
        <main style={{ flex: 1, padding: '32px 40px', overflowY: 'auto' }}>
          <Outlet context={{ mission, session }} />
        </main>
      </div>

      {/* 3. FLOATING AI ASSISTANT WIDGET (Style ChatWidget avec Avatar & Toaster) */}
      <div style={{ position: 'fixed', bottom: '26px', right: '28px', zIndex: 1000, display: 'flex', alignItems: 'center', gap: '14px' }}>
        {!isAiOpen ? (
          <>
            {/* Toaster Proactive Bubble */}
            {isToasterVisible && (
              <div 
                onClick={() => setIsAiOpen(true)}
                style={{
                  position: 'relative',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #EAEAEA',
                  borderRadius: '14px',
                  padding: '12px 34px 12px 14px',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                  maxWidth: '280px',
                  cursor: 'pointer',
                  lineHeight: '1.4'
                }}
              >
                <span style={{ fontSize: '0.82rem', color: '#111111', fontWeight: 500 }}>
                  Bonjour ! Je suis votre <strong style={{ color: '#006253' }}>Agent M84</strong>. Comment puis-je vous guider sur la mission ?
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsToasterVisible(false);
                  }}
                  style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '3px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#666666'
                  }}
                  aria-label="Fermer"
                >
                  <X size={13} />
                </button>
                {/* Flèche pointant vers l'avatar */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  right: '-7px',
                  transform: 'translateY(-50%)',
                  width: 0,
                  height: 0,
                  borderTop: '7px solid transparent',
                  borderBottom: '7px solid transparent',
                  borderLeft: '7px solid #FFFFFF'
                }} />
              </div>
            )}

            {/* Circular Avatar FAB */}
            <button
              onClick={() => setIsAiOpen(true)}
              style={{
                width: '58px',
                height: '58px',
                borderRadius: '50%',
                background: '#ffffff',
                border: '2.5px solid #006253',
                padding: 0,
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(0, 98, 83, 0.28)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.2s ease',
                flexShrink: 0
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              title="Agent IA M84"
            >
              <img
                src="/assets/m84-avatar.webp"
                alt="Agent M84"
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                onError={(e) => {
                  e.currentTarget.src = CONSULTANT_PROFILE.avatar;
                }}
              />
              {/* Online Green Badge */}
              <span style={{
                position: 'absolute',
                bottom: '1px',
                right: '1px',
                width: '13px',
                height: '13px',
                borderRadius: '50%',
                background: '#22c55e',
                border: '2px solid #ffffff',
                boxShadow: '0 0 6px rgba(34, 197, 94, 0.7)'
              }} />
            </button>
          </>
        ) : (
          /* Opened Chat Modal */
          <div style={{
            width: '380px',
            height: '520px',
            background: '#ffffff',
            borderRadius: '20px',
            border: '1.5px solid #006253',
            boxShadow: '0 20px 45px rgba(0,0,0,0.18)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Header Chat with Avatar */}
            <div style={{
              background: '#006253',
              color: '#ffffff',
              padding: '14px 18px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ position: 'relative', width: '38px', height: '38px', borderRadius: '50%', overflow: 'hidden', border: '1.5px solid #ffffff' }}>
                  <img src="/assets/m84-avatar.webp" alt="Agent M84" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.94rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    Agent IA M84
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#a7f3d0' }}>Mission Bank-e • Ayoub MOSLIH</div>
                </div>
              </div>
              <button
                onClick={() => setIsAiOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Body */}
            <div style={{
              flex: 1,
              padding: '16px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              background: '#fafbfc'
            }}>
              {aiMessages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '82%',
                    background: msg.role === 'user' ? '#006253' : '#ffffff',
                    color: msg.role === 'user' ? '#ffffff' : '#1e293b',
                    padding: '12px 14px',
                    borderRadius: '14px',
                    fontSize: '0.85rem',
                    lineHeight: 1.45,
                    border: msg.role === 'user' ? 'none' : '1px solid #e2e8f0',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                  }}
                >
                  {msg.text}
                </div>
              ))}
              {aiLoading && (
                <div style={{ alignSelf: 'flex-start', background: '#ffffff', padding: '10px 14px', borderRadius: '12px', fontSize: '0.8rem', color: '#64748b', border: '1px solid #e2e8f0' }}>
                  L'Agent IA consulte les données de votre mission...
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendAi} style={{ padding: '12px 16px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '8px', background: '#ffffff' }}>
              <input
                type="text"
                placeholder="Posez une question sur le CRA, les livrables..."
                value={aiInput}
                onChange={e => setAiInput(e.target.value)}
                style={{ flex: 1, padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
              />
              <button
                type="submit"
                disabled={aiLoading || !aiInput.trim()}
                style={{
                  background: '#006253',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  width: '42px',
                  height: '42px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: aiLoading || !aiInput.trim() ? 'not-allowed' : 'pointer',
                  opacity: aiLoading || !aiInput.trim() ? 0.6 : 1
                }}
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* 4. MODALE MON PROFIL */}
      {isProfileModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '16px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '480px',
            padding: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                Mon Profil Collaborateur
              </h3>
              <button onClick={() => setIsProfileModalOpen(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.2rem', color: '#94a3b8' }}>
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.88rem', color: '#334155' }}>
              <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div><strong>Société :</strong> {mission?.companyName}</div>
                <div><strong>Responsable :</strong> {session?.managerName}</div>
                <div><strong>Email :</strong> {session?.email}</div>
                <div><strong>Téléphone :</strong> {mission?.phone}</div>
              </div>

              <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div><strong>Mode de mission :</strong> {mission?.workMode} ({mission?.remoteMode})</div>
                <div><strong>Forfait contractuel :</strong> {mission?.totalDaysQuota} jours</div>
                {mission?.cabinetPortage?.name && <div><strong>Cabinet Portage :</strong> {mission.cabinetPortage.name}</div>}
                {mission?.cabinetConseil?.name && <div><strong>Cabinet Conseil :</strong> {mission.cabinetConseil.name}</div>}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button
                  onClick={() => setIsProfileModalOpen(false)}
                  style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', background: '#006253', color: '#ffffff', fontWeight: 700, cursor: 'pointer' }}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
