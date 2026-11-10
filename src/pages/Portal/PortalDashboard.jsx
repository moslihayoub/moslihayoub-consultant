import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { 
  Clock, TrendingUp, FolderKanban, Mail, MessageSquare, 
  Phone, Building, CheckCircle2, ChevronRight, ArrowRight
} from 'lucide-react';
import { 
  getTimesheetsByMission, getReportsByMission, 
  getProjectsByMission, CONSULTANT_PROFILE 
} from '../../services/clientPortalService';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function PortalDashboard() {
  const context = useOutletContext() || {};
  const mission = context.mission;
  const navigate = useNavigate();

  const missionId = mission?.id || 'mission-cam-2026';
  const timesheets = getTimesheetsByMission(missionId) || [];
  const reports = getReportsByMission(missionId) || [];
  const projects = getProjectsByMission(missionId) || [];

  const pendingTimesheet = timesheets.find(t => t.status === 'submitted') || timesheets[0] || {};
  const activeProjectsCount = projects.length || 3;

  // Freelance TJM working days for the latest month (weekends & holidays excluded)
  const currentMonthWorkingDays = pendingTimesheet?.totalWorkingDays || 22;
  const currentMonthImputedDays = pendingTimesheet?.daysImputed || 21.5;

  // Quota & consumption calculations
  const totalDaysQuota = mission?.totalDaysQuota || 65;
  const daysConsumed = timesheets.reduce((acc, t) => acc + (t.daysImputed || 0), 0);
  const daysRemaining = Math.max(0, totalDaysQuota - daysConsumed);
  const consumptionPercentage = Math.round((daysConsumed / totalDaysQuota) * 100);

  // Chart data (Full width row)
  const chartData = (timesheets.length > 0 ? timesheets : [
    { month: 'Octobre 2026', daysImputed: 21.5, totalWorkingDays: 22 },
    { month: 'Septembre 2026', daysImputed: 20, totalWorkingDays: 22 }
  ]).map(t => ({
    month: t.monthLabel || t.month,
    imputed: t.daysImputed,
    working: t.totalWorkingDays
  })).reverse();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* 1. CARTE HERO : Consultant Référent Ayoub MOSLIH & Cabinets Partenaires (Conforme PJ 1) */}
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

        {/* Contact direct pills : WhatsApp, Tel, Email */}
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

      {/* 2. LES 4 KPIS PERTINENTS DE LA SOLUTION B2B (Suivi Opérationnel Mission) */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: '20px' 
      }}>
        
        {/* KPI 1 : Jours Imputés par mois (TJM Freelance : WE & Fériés exclus) */}
        <div style={{ background: '#ffffff', padding: '22px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Jours Imputés (Mois)
            </span>
            <span style={{ padding: '3px 8px', borderRadius: '6px', background: 'rgba(0, 98, 83, 0.08)', color: '#006253', fontSize: '0.74rem', fontWeight: 700 }}>
              Régie TJM
            </span>
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0f172a', margin: '10px 0 2px' }}>
            {currentMonthImputedDays}j <span style={{ fontSize: '1rem', fontWeight: 500, color: '#94a3b8' }}>/ {currentMonthWorkingDays}j ouvrés</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
            Week-ends & jours fériés non facturés
          </div>
        </div>

        {/* KPI 2 : Consommation Quota Bon de Commande */}
        <div style={{ background: '#ffffff', padding: '22px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Quota Consommé
            </span>
            <span style={{ padding: '3px 8px', borderRadius: '6px', background: 'rgba(0, 98, 83, 0.08)', color: '#006253', fontSize: '0.74rem', fontWeight: 700 }}>
              {consumptionPercentage}% BDC
            </span>
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#006253', margin: '10px 0 2px' }}>
            {daysConsumed}j <span style={{ fontSize: '1rem', fontWeight: 500, color: '#94a3b8' }}>/ {totalDaysQuota}j</span>
          </div>
          {/* Progress Bar */}
          <div style={{ width: '100%', height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden', marginTop: '6px' }}>
            <div style={{ width: `${Math.min(100, consumptionPercentage)}%`, height: '100%', background: '#006253', borderRadius: '3px' }} />
          </div>
          <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '6px' }}>
            {daysRemaining} jours restants sur le bon de commande
          </div>
        </div>

        {/* KPI 3 : Statut Visa CRA du mois */}
        <div style={{ background: '#ffffff', padding: '22px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Statut Visa CRA
            </span>
            <Clock size={18} color={pendingTimesheet?.status === 'approved' ? '#166534' : '#f59e0b'} />
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: pendingTimesheet?.status === 'approved' ? '#166534' : '#b45309', margin: '12px 0 2px' }}>
            {pendingTimesheet?.status === 'approved' ? '✓ Validé par le client' : '⏳ En attente de signature'}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
            {pendingTimesheet?.attachment ? `Pièce jointe : ${pendingTimesheet.attachment.name}` : 'Pièce jointe requise avant visa'}
          </div>
        </div>

        {/* KPI 4 : Chantiers & Projets Actifs */}
        <div style={{ background: '#ffffff', padding: '22px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Chantiers Actifs
            </span>
            <FolderKanban size={18} color="#006253" />
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0f172a', margin: '10px 0 2px' }}>
            {activeProjectsCount} <span style={{ fontSize: '1rem', fontWeight: 500, color: '#64748b' }}>chantiers</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#006253', fontWeight: 600 }}>
            Product Design, Design System & IA
          </div>
        </div>

      </div>

      {/* 3. GRAPH BAR CHART : UN SEUL DANS LA LIGNE (PLEINE LARGEUR) */}
      <div style={{ background: '#ffffff', padding: '26px 30px', borderRadius: '18px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
              Rythme d'Imputation Mensuel (Jours Facturables en Régie TJM)
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#64748b' }}>
              Historique des jours d'intervention prestés pour le compte de la mission Bank-e CAM
            </p>
          </div>
          <button
            onClick={() => navigate('/portal/timesheet')}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid #006253',
              background: 'rgba(0, 98, 83, 0.05)',
              color: '#006253',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer'
            }}
          >
            Gérer le CRA →
          </button>
        </div>

        <div style={{ height: '240px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip 
                contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
              />
              <Bar dataKey="imputed" name="Jours Travaillés (TJM)" fill="#006253" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. COMPTES RENDUS HEBDOMADAIRES : FORMAT TABLEAU (4 PAR MOIS / 1 PAR SEMAINE) */}
      <div style={{ background: '#ffffff', borderRadius: '18px', border: '1px solid #e2e8f0', padding: '26px 30px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
              Comptes Rendus Hebdomadaires de Mission (4 par mois)
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#64748b' }}>
              Synthèses hebdomadaires d'avancement Product Design & IA envoyées directement par email aux managers
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
            Accéder aux Rapports Détaillés <ArrowRight size={14} />
          </button>
        </div>

        {/* Tableau structuré des comptes rendus hebdomadaires */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1.5px solid #e2e8f0', background: '#f8fafc' }}>
                <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' }}>Cadence</th>
                <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' }}>Sujet & Chantier Product Design</th>
                <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' }}>Date d'Envoi</th>
                <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' }}>Statut Transmission</th>
                <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((rep, idx) => (
                <tr 
                  key={rep.id || idx}
                  style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  onClick={() => navigate('/portal/reports')}
                >
                  <td style={{ padding: '14px 16px', fontWeight: 800, color: '#006253' }}>
                    <span style={{ padding: '4px 8px', borderRadius: '6px', background: 'rgba(0, 98, 83, 0.08)' }}>
                      {rep.weekLabel || `Semaine ${idx + 1}`}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{rep.title}</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>{rep.project}</div>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#475569' }}>
                    {rep.date}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      background: '#dcfce7',
                      color: '#166534',
                      fontSize: '0.75rem',
                      fontWeight: 700
                    }}>
                      <CheckCircle2 size={13} /> Transmis aux Managers
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/portal/reports');
                      }}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        background: '#ffffff',
                        color: '#0f172a',
                        fontWeight: 600,
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      Consulter <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}