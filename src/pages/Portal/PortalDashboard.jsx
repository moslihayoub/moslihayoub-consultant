import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { 
  Clock, FolderKanban, Mail, MessageSquare, 
  Phone, Building, CheckCircle2, ChevronRight, ArrowRight,
  TrendingUp, PieChart as PieIcon, BarChart2
} from 'lucide-react';
import { 
  getTimesheetsByMission, getReportsByMission, 
  getProjectsByMission, CONSULTANT_PROFILE 
} from '../../services/clientPortalService';
import { 
  ResponsiveContainer, BarChart, Bar, LineChart, Line, 
  PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, CartesianGrid 
} from 'recharts';

export default function PortalDashboard() {
  const context = useOutletContext() || {};
  const mission = context.mission;
  const navigate = useNavigate();

  const missionId = mission?.id || 'mission-cam-2026';
  const timesheets = getTimesheetsByMission(missionId) || [];
  const reports = getReportsByMission(missionId) || [];
  const projects = getProjectsByMission(missionId) || [];

  const pendingTimesheet = timesheets.find(t => t.status === 'submitted') || timesheets[0] || {};
  const pastTimesheets = timesheets.filter(t => t.id !== pendingTimesheet.id);

  // Freelance TJM working days for the ongoing month
  const currentMonthWorkingDays = pendingTimesheet?.totalWorkingDays || 22;
  const currentMonthImputedDays = pendingTimesheet?.daysImputed || 21.5;
  const monthProgressPercent = Math.min(100, Math.round((currentMonthImputedDays / currentMonthWorkingDays) * 100));
  const remainingDaysThisMonth = Math.max(0, +(currentMonthWorkingDays - currentMonthImputedDays).toFixed(1));

  // CRA Visas for past months
  const pastApprovedCount = pastTimesheets.filter(t => t.status === 'approved').length;
  const pastPendingCount = pastTimesheets.filter(t => t.status !== 'approved').length;

  // Project status breakdown
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.status === 'Terminé').length;
  const deliveredProjects = projects.filter(p => p.status === 'Livré').length;
  const inProgressProjects = projects.filter(p => p.status === 'En cours').length;
  const standbyProjects = projects.filter(p => p.status === 'Stand-by').length;

  // 1. Data Bar Chart (Rythme mensuel facturé TJM)
  const barChartData = (timesheets.length > 0 ? timesheets : [
    { month: 'Octobre 2026', daysImputed: 21.5, totalWorkingDays: 22 },
    { month: 'Septembre 2026', daysImputed: 20, totalWorkingDays: 20 },
    { month: 'Août 2026', daysImputed: 21, totalWorkingDays: 21 }
  ]).map(t => ({
    month: (t.monthLabel || t.month).replace(' 2026', ''),
    imputed: t.daysImputed
  })).reverse();

  // 2. Data Multi-Bar (Jours Travaillés vs Jours Ouvrés)
  const multiBarData = (timesheets.length > 0 ? timesheets : [
    { month: 'Août 2026', daysImputed: 21, totalWorkingDays: 21 },
    { month: 'Septembre 2026', daysImputed: 20, totalWorkingDays: 20 },
    { month: 'Octobre 2026', daysImputed: 21.5, totalWorkingDays: 22 }
  ]).map(t => ({
    month: (t.monthLabel || t.month).replace(' 2026', ''),
    travailles: t.daysImputed,
    ouvres: t.totalWorkingDays
  })).reverse();

  // 3. Data Line Chart (Vélocité & Jalons livrés par semaine)
  const lineChartData = [
    { sem: 'Sem 1', velocite: 82, livrables: 1 },
    { sem: 'Sem 2', velocite: 89, livrables: 3 },
    { sem: 'Sem 3', velocite: 94, livrables: 6 },
    { sem: 'Sem 4', velocite: 98, livrables: 9 }
  ];

  // 4. Data Pie Chart (Répartition de la charge par projet)
  const pieData = [
    { name: 'Octroi Crédit', value: 35, color: '#006253' },
    { name: 'Design System', value: 25, color: '#10b981' },
    { name: 'Assistant IA', value: 20, color: '#6366f1' },
    { name: 'Audit UX', value: 12, color: '#f59e0b' },
    { name: 'Trésorerie', value: 8, color: '#94a3b8' }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Livré':
        return { bg: '#dcfce7', text: '#166534', border: '#86efac' };
      case 'Validé':
        return { bg: '#e0f2fe', text: '#0369a1', border: '#7dd3fc' };
      case 'Terminé':
        return { bg: '#f1f5f9', text: '#334155', border: '#cbd5e1' };
      case 'En cours':
        return { bg: '#fef3c7', text: '#92400e', border: '#fde68a' };
      case 'Stand-by':
        return { bg: '#f3f4f6', text: '#6b7280', border: '#e5e7eb' };
      default:
        return { bg: '#dcfce7', text: '#166534', border: '#86efac' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1240px', margin: '0 auto' }}>
      
      {/* 1. CARTE HERO : Consultant Référent Ayoub MOSLIH */}
      <div style={{
        background: 'linear-gradient(135deg, #005548 0%, #003d33 100%)',
        borderRadius: '20px',
        padding: '28px 32px',
        color: '#ffffff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '24px',
        boxShadow: '0 10px 25px rgba(0, 85, 72, 0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '22px', flexWrap: 'wrap' }}>
          <img
            src={CONSULTANT_PROFILE.avatar}
            alt={CONSULTANT_PROFILE.name}
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid #10b981',
              boxShadow: '0 4px 14px rgba(0,0,0,0.25)'
            }}
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />

          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 4px 0', letterSpacing: '-0.01em', color: '#ffffff' }}>
              {CONSULTANT_PROFILE.name}
            </h1>
            <div style={{ fontSize: '0.92rem', color: '#a7f3d0', fontWeight: 600, marginBottom: '6px' }}>
              {CONSULTANT_PROFILE.role} • {CONSULTANT_PROFILE.title}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', fontSize: '0.84rem', color: '#e2e8f0' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <Building size={14} color="#a7f3d0" />
                Cabinet : <strong>{mission?.cabinetConseil?.name || "Devoteam Consulting"}</strong>
              </span>
              <span style={{ color: '#34d399' }}>•</span>
              <span>Portage : <strong>{mission?.cabinetPortage?.name || "Ad'Missions Portage"}</strong></span>
              <span style={{ color: '#34d399' }}>•</span>
              <span>Mission : <strong>{mission?.companyName || "CAM (Crédit Agricole du Maroc)"}</strong></span>
            </div>
          </div>
        </div>

        {/* Contact direct pills */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <a
            href={`https://wa.me/${CONSULTANT_PROFILE.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 14px',
              borderRadius: '10px',
              background: '#25D366',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.82rem',
              textDecoration: 'none',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
            }}
          >
            <MessageSquare size={15} /> WhatsApp
          </a>

          <a
            href={`tel:${CONSULTANT_PROFILE.phone}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 14px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.12)',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '0.82rem',
              textDecoration: 'none',
              border: '1px solid rgba(255, 255, 255, 0.25)'
            }}
          >
            <Phone size={15} /> {CONSULTANT_PROFILE.phone}
          </a>

          <a
            href={`mailto:${CONSULTANT_PROFILE.email}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 14px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.12)',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '0.82rem',
              textDecoration: 'none',
              border: '1px solid rgba(255, 255, 255, 0.25)'
            }}
          >
            <Mail size={15} /> Email
          </a>
        </div>
      </div>

      {/* 2. LES 3 KPIS RESTRUCTURÉS (Sans Quota consommé) */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        gap: '20px' 
      }}>
        
        {/* KPI 1 : Jours Imputés (Mois) avec Progress Bar des jours ouvrés */}
        <div style={{ background: '#ffffff', padding: '22px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Jours Imputés (Mois)
            </span>
            <span style={{ padding: '3px 8px', borderRadius: '6px', background: 'rgba(0, 98, 83, 0.08)', color: '#006253', fontSize: '0.74rem', fontWeight: 700 }}>
              {pendingTimesheet?.monthLabel || 'Mois en cours'}
            </span>
          </div>

          <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0f172a', margin: '10px 0 6px' }}>
            {currentMonthImputedDays}j <span style={{ fontSize: '1rem', fontWeight: 500, color: '#94a3b8' }}>/ {currentMonthWorkingDays}j ouvrés</span>
          </div>

          {/* Progress Bar mois en cours */}
          <div style={{ width: '100%', height: '7px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden', margin: '8px 0 6px' }}>
            <div style={{ width: `${monthProgressPercent}%`, height: '100%', background: '#006253', borderRadius: '4px', transition: 'width 0.4s ease' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
            <span>{monthProgressPercent}% du mois écoulé</span>
            <span style={{ color: remainingDaysThisMonth > 0 ? '#b45309' : '#166534' }}>
              {remainingDaysThisMonth > 0 ? `${remainingDaysThisMonth}j restant(s)` : 'Mois complété'}
            </span>
          </div>
        </div>

        {/* KPI 2 : Statut Visa CRA (Mois Précédents) */}
        <div style={{ background: '#ffffff', padding: '22px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Statut Visa CRA (Mois Précédents)
            </span>
            <Clock size={18} color="#006253" />
          </div>

          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#006253', margin: '10px 0 6px' }}>
            {pastApprovedCount} Validé{pastApprovedCount > 1 ? 's' : ''}
            {pastPendingCount > 0 && (
              <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#d97706', marginLeft: '8px' }}>
                • {pastPendingCount} en cours
              </span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
            {pastTimesheets.map(t => (
              <span 
                key={t.id} 
                style={{
                  padding: '3px 9px',
                  borderRadius: '6px',
                  background: t.status === 'approved' ? '#dcfce7' : '#fef3c7',
                  color: t.status === 'approved' ? '#166534' : '#92400e',
                  fontSize: '0.74rem',
                  fontWeight: 700
                }}
              >
                {t.monthLabel} : {t.status === 'approved' ? '✓ Validé' : '⏳ En attente'}
              </span>
            ))}
          </div>
        </div>

        {/* KPI 3 : Projets & Statuts (Terminé, Livré, En cours, Stand-by) */}
        <div style={{ background: '#ffffff', padding: '22px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Projets de Mission
            </span>
            <FolderKanban size={18} color="#006253" />
          </div>

          <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0f172a', margin: '8px 0 8px' }}>
            {totalProjects} <span style={{ fontSize: '1rem', fontWeight: 500, color: '#64748b' }}>projets actifs</span>
          </div>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ padding: '3px 8px', borderRadius: '6px', background: '#f1f5f9', color: '#334155', fontSize: '0.74rem', fontWeight: 700 }}>
              {completedProjects} Terminé
            </span>
            <span style={{ padding: '3px 8px', borderRadius: '6px', background: '#dcfce7', color: '#166534', fontSize: '0.74rem', fontWeight: 700 }}>
              {deliveredProjects} Livré
            </span>
            <span style={{ padding: '3px 8px', borderRadius: '6px', background: '#fef3c7', color: '#92400e', fontSize: '0.74rem', fontWeight: 700 }}>
              {inProgressProjects} En cours
            </span>
            <span style={{ padding: '3px 8px', borderRadius: '6px', background: '#f3f4f6', color: '#6b7280', fontSize: '0.74rem', fontWeight: 700 }}>
              {standbyProjects} Stand-by
            </span>
          </div>
        </div>

      </div>

      {/* 3. GRAPHIQUES MULTIPLES (Bar Chart, Multi-bar, Line Chart, Pie Chart) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(560px, 1fr))', gap: '20px' }}>
        
        {/* GRAPH 1 : Bar Chart (Rythme d'Imputation Mensuel) */}
        <div style={{ background: '#ffffff', padding: '24px 26px', borderRadius: '18px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                Rythme d'Imputation (Jours Facturés TJM)
              </h3>
              <p style={{ margin: '3px 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                Jours prestés par mois pour Crédit Agricole du Maroc
              </p>
            </div>
            <BarChart2 size={18} color="#006253" />
          </div>

          <div style={{ height: '210px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 25]} />
                <Tooltip 
                  contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="imputed" name="Jours Facturés" fill="#006253" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GRAPH 2 : Multi-Bar (Jours Travaillés vs Jours Ouvrés) */}
        <div style={{ background: '#ffffff', padding: '24px 26px', borderRadius: '18px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                Jours Travaillés vs Jours Ouvrés du Mois
              </h3>
              <p style={{ margin: '3px 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                Taux d'occupation effectif (hors week-ends & fériés)
              </p>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: 'rgba(0, 98, 83, 0.08)', color: '#006253' }}>
              Multi-bar
            </span>
          </div>

          <div style={{ height: '210px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={multiBarData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 25]} />
                <Tooltip 
                  contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                <Bar dataKey="travailles" name="Jours Prestés" fill="#006253" radius={[4, 4, 0, 0]} />
                <Bar dataKey="ouvres" name="Total Ouvrés" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GRAPH 3 : Line Chart (Vélocité Hebdomadaire & Livrables) */}
        <div style={{ background: '#ffffff', padding: '24px 26px', borderRadius: '18px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                Vélocité Hebdomadaire & Livrables Actés
              </h3>
              <p style={{ margin: '3px 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                Indice de progression continue et jalons clôturés
              </p>
            </div>
            <TrendingUp size={18} color="#10b981" />
          </div>

          <div style={{ height: '210px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="sem" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[70, 100]} />
                <Tooltip 
                  contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                <Line type="monotone" dataKey="velocite" name="Vélocité (%)" stroke="#006253" strokeWidth={3} dot={{ r: 4, fill: '#006253' }} />
                <Line type="monotone" dataKey="livrables" name="Jalons Livrés" stroke="#10b981" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 4, fill: '#10b981' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GRAPH 4 : Pie / Donut Chart (Répartition de la charge par projet) */}
        <div style={{ background: '#ffffff', padding: '24px 26px', borderRadius: '18px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                Répartition de la Charge par Projet (%)
              </h3>
              <p style={{ margin: '3px 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                Ventilation de l'effort Product Design & IA
              </p>
            </div>
            <PieIcon size={18} color="#6366f1" />
          </div>

          <div style={{ height: '210px', display: 'flex', alignItems: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={78}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  formatter={(val, name) => [`${val}%`, name]}
                />
                <Legend 
                  layout="vertical" 
                  align="right" 
                  verticalAlign="middle"
                  iconType="circle"
                  wrapperStyle={{ fontSize: '11px', lineHeight: '18px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 4. COMPTES RENDUS HEBDO : FORMAT TABLEAU OPTIMISÉ (ID, Sujet élargi max 2 lignes, Statut short) */}
      <div style={{ background: '#ffffff', borderRadius: '18px', border: '1px solid #e2e8f0', padding: '26px 30px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
              Comptes Rendus Hebdo
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#64748b' }}>
              Synthèses hebdomadaires Product Design & IA partagées avec les managers
            </p>
          </div>

          <button
            onClick={() => navigate('/portal/reports')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: '#006253',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            Accéder aux Rapports <ArrowRight size={14} />
          </button>
        </div>

        {/* Tableau structuré */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1.5px solid #e2e8f0', background: '#f8fafc' }}>
                <th style={{ padding: '12px 14px', color: '#475569', fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', width: '80px' }}>ID</th>
                <th style={{ padding: '12px 14px', color: '#475569', fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', width: '110px' }}>Cadence</th>
                <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', minWidth: '360px' }}>Sujet</th>
                <th style={{ padding: '12px 14px', color: '#475569', fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', width: '110px' }}>Date</th>
                <th style={{ padding: '12px 14px', color: '#475569', fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', width: '110px' }}>Statut</th>
                <th style={{ padding: '12px 14px', color: '#475569', fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', textAlign: 'right', width: '110px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((rep, idx) => {
                const reportCode = rep.code || `CR-0${reports.length - idx}`;
                const reportStatus = rep.status || 'Livré';
                const badge = getStatusBadge(reportStatus);

                return (
                  <tr 
                    key={rep.id || idx}
                    style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    onClick={() => navigate('/portal/reports')}
                  >
                    {/* ID */}
                    <td style={{ padding: '12px 14px', fontWeight: 800, color: '#006253', fontSize: '0.82rem' }}>
                      <span style={{ padding: '3px 7px', borderRadius: '5px', background: 'rgba(0, 98, 83, 0.08)' }}>
                        {reportCode}
                      </span>
                    </td>

                    {/* Cadence */}
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: '#334155', fontSize: '0.82rem' }}>
                      {rep.weekLabel || `Semaine ${rep.weekNumber || idx + 1}`}
                    </td>

                    {/* Sujet élargi (max 2 lignes avec ...) */}
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ 
                        fontWeight: 700, 
                        color: '#0f172a',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        lineHeight: 1.35
                      }}>
                        {rep.title}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '3px' }}>
                        {rep.project}
                      </div>
                    </td>

                    {/* Date */}
                    <td style={{ padding: '12px 14px', color: '#475569', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                      {rep.date}
                    </td>

                    {/* Statut short wording */}
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: badge.bg,
                        color: badge.text,
                        border: `1px solid ${badge.border}`,
                        fontSize: '0.74rem',
                        fontWeight: 700
                      }}>
                        <CheckCircle2 size={12} /> {reportStatus}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/portal/reports');
                        }}
                        style={{
                          padding: '5px 10px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          background: '#ffffff',
                          color: '#0f172a',
                          fontWeight: 600,
                          fontSize: '0.76rem',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}
                      >
                        Consulter <ChevronRight size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
