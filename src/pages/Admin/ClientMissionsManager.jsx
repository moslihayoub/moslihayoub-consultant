import React, { useState, useEffect, useCallback } from 'react';
import { 
  Building2, Plus, 
  MessageSquare, Mail, Trash2, 
  ChevronDown, ChevronUp, Paperclip, Eye, CheckCircle2
} from 'lucide-react';
import { 
  getAllMissions, createMission,
  getTimesheetsByMission, saveTimesheet,
  getAbsencesByMission, saveAbsence, deleteAbsence,
  getReportsByMission, saveReport,
  devLoginAsCollaborator, formatWhatsAppShare, formatEmailShare
} from '../../services/clientPortalService';

export default function ClientMissionsManager() {
  const [missions, setMissions] = useState([]);
  const [selectedMissionId, setSelectedMissionId] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState('timesheets'); // timesheets | absences | reports | settings
  
  // Modals state
  const [isNewMissionModalOpen, setIsNewMissionModalOpen] = useState(false);
  const [isAddTimesheetModalOpen, setIsAddTimesheetModalOpen] = useState(false);
  const [isAddAbsenceModalOpen, setIsAddAbsenceModalOpen] = useState(false);
  const [isAddReportModalOpen, setIsAddReportModalOpen] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState(null);

  // New Mission Form State
  const [newMissionForm, setNewMissionForm] = useState({
    // Obligatoires
    companyName: '',
    managerName: '',
    phone: '',
    email: '',
    // Optionnels
    cabinetConseilName: '',
    cabinetConseilManager: '',
    cabinetConseilEmail: '',
    cabinetPortageName: '',
    cabinetPortageManager: '',
    cabinetPortageEmail: '',
    dateStart: '',
    dateEnd: '',
    totalDaysQuota: 60,
    workMode: 'Régie',
    remoteMode: 'Hybride (3j présentiel / 2j remote)',
    morningStart: '09:00',
    morningEnd: '12:30',
    lunchBreakStart: '12:30',
    lunchBreakEnd: '13:30',
    afternoonStart: '13:30',
    afternoonEnd: '18:00',
    collaboratorPassword: ''
  });

  const [showOptionalSections, setShowOptionalSections] = useState({
    intermediaries: false,
    contract: false,
    schedule: false
  });

  // Timesheet Form State
  const [timesheetForm, setTimesheetForm] = useState({
    month: new Date().toISOString().slice(0, 7),
    monthLabel: 'Novembre 2026',
    daysImputed: 20,
    totalWorkingDays: 21,
    totalHours: 160,
    status: 'submitted',
    content: '',
    attachmentFile: null,
    attachmentName: ''
  });

  // Absence Form State
  const [absenceForm, setAbsenceForm] = useState({
    type: 'Congé',
    dateStart: new Date().toISOString().slice(0, 10),
    dateEnd: new Date().toISOString().slice(0, 10),
    durationDays: 1,
    status: 'justifiée',
    content: '',
    attachmentName: ''
  });

  // Report Form State
  const [reportForm, setReportForm] = useState({
    title: '',
    date: new Date().toISOString().slice(0, 10),
    project: '',
    summary: '',
    decisions: '',
    nextSteps: '',
    attachmentName: ''
  });

  const refreshData = useCallback(() => {
    const list = getAllMissions();
    setMissions(list);
    if (list.length > 0 && !selectedMissionId) {
      setSelectedMissionId(list[0].id);
    }
  }, [selectedMissionId]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const selectedMission = missions.find(m => m.id === selectedMissionId) || missions[0];
  const currentTimesheets = selectedMission ? getTimesheetsByMission(selectedMission.id) : [];
  const currentAbsences = selectedMission ? getAbsencesByMission(selectedMission.id) : [];
  const currentReports = selectedMission ? getReportsByMission(selectedMission.id) : [];

  // Hours calculation
  const calcTotalHours = () => {
    const morningHours = 3.5; // 09:00 - 12:30
    const afternoonHours = 4.5; // 13:30 - 18:00
    return morningHours + afternoonHours;
  };

  const handleCreateMission = (e) => {
    e.preventDefault();
    if (!newMissionForm.companyName || !newMissionForm.managerName || !newMissionForm.phone || !newMissionForm.email) {
      alert("Veuillez remplir les 4 champs obligatoires : Société, Responsable, Téléphone et Email.");
      return;
    }

    const payload = {
      companyName: newMissionForm.companyName,
      managerName: newMissionForm.managerName,
      phone: newMissionForm.phone,
      email: newMissionForm.email,
      cabinetConseil: {
        name: newMissionForm.cabinetConseilName,
        manager: newMissionForm.cabinetConseilManager,
        email: newMissionForm.cabinetConseilEmail
      },
      cabinetPortage: {
        name: newMissionForm.cabinetPortageName,
        manager: newMissionForm.cabinetPortageManager,
        email: newMissionForm.cabinetPortageEmail
      },
      dateStart: newMissionForm.dateStart,
      dateEnd: newMissionForm.dateEnd,
      totalDaysQuota: Number(newMissionForm.totalDaysQuota) || 60,
      workMode: newMissionForm.workMode,
      remoteMode: newMissionForm.remoteMode,
      schedule: {
        morningStart: newMissionForm.morningStart,
        morningEnd: newMissionForm.morningEnd,
        lunchBreakStart: newMissionForm.lunchBreakStart,
        lunchBreakEnd: newMissionForm.lunchBreakEnd,
        afternoonStart: newMissionForm.afternoonStart,
        afternoonEnd: newMissionForm.afternoonEnd,
        hoursPerDay: calcTotalHours()
      },
      collaboratorPassword: newMissionForm.collaboratorPassword
    };

    const res = createMission(payload);
    refreshData();
    setSelectedMissionId(res.mission.id);
    setCreatedCredentials({
      companyName: res.mission.companyName,
      managerName: res.mission.managerName,
      email: res.mission.email,
      phone: res.mission.phone,
      password: res.generatedPassword
    });
    setIsNewMissionModalOpen(false);
  };

  const handleSaveTimesheet = (e) => {
    e.preventDefault();
    if (!selectedMission) return;
    saveTimesheet(selectedMission.id, {
      ...timesheetForm,
      attachment: timesheetForm.attachmentName ? {
        name: timesheetForm.attachmentName,
        size: "312 KB",
        uploadedAt: new Date().toISOString()
      } : null
    });
    setIsAddTimesheetModalOpen(false);
    refreshData();
  };

  const handleSaveAbsence = (e) => {
    e.preventDefault();
    if (!selectedMission) return;
    saveAbsence(selectedMission.id, {
      ...absenceForm,
      attachment: absenceForm.attachmentName ? {
        name: absenceForm.attachmentName,
        size: "185 KB",
        uploadedAt: new Date().toISOString()
      } : null
    });
    setIsAddAbsenceModalOpen(false);
    refreshData();
  };

  const handleSaveReport = (e) => {
    e.preventDefault();
    if (!selectedMission) return;
    saveReport(selectedMission.id, {
      ...reportForm,
      decisions: reportForm.decisions.split('\n').filter(d => d.trim()),
      nextSteps: reportForm.nextSteps.split('\n').filter(s => s.trim()),
      attachment: reportForm.attachmentName ? {
        name: reportForm.attachmentName,
        size: "450 KB",
        uploadedAt: new Date().toISOString()
      } : null
    });
    setIsAddReportModalOpen(false);
    refreshData();
  };

  const handleOpenClientSimulation = (missionId) => {
    devLoginAsCollaborator(missionId);
    window.open('/portal', '_blank');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: 'inherit' }}>
      
      {/* Top Banner & Quick Actions */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        gap: '16px',
        padding: '20px 24px',
        background: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '10px', 
              background: 'rgba(0, 98, 83, 0.1)', 
              color: '#006253', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <Building2 size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                Portail Collaborateur & Missions Clients
              </h2>
              <p style={{ margin: '2px 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                Pilotage des comptes clients, relevés d'activités (CRA en régie), absences justifiées et comptes rendus
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {selectedMission && (
            <button
              onClick={() => handleOpenClientSimulation(selectedMission.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '10px',
                border: '1px solid #006253',
                background: '#ffffff',
                color: '#006253',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              title="Ouvre l'Espace Client exactement comme le voit votre collaborateur"
            >
              <Eye size={16} />
              Simuler Espace Client
            </button>
          )}

          <button
            onClick={() => setIsNewMissionModalOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '10px',
              border: 'none',
              background: '#006253',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0, 98, 83, 0.25)'
            }}
          >
            <Plus size={18} />
            Nouveau Client / Mission
          </button>
        </div>
      </div>

      {/* Credentials Banner (When a new client is created) */}
      {createdCredentials && (
        <div style={{
          background: 'linear-gradient(135deg, #f0fdf4 0%, #e6f7f2 100%)',
          border: '1px solid #86efac',
          borderRadius: '14px',
          padding: '18px 22px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', fontWeight: 700, fontSize: '0.95rem' }}>
              <CheckCircle2 size={18} />
              Compte Client créé avec succès pour {createdCredentials.companyName} !
            </div>
            <div style={{ fontSize: '0.85rem', color: '#334155', marginTop: '6px' }}>
              <strong>Identifiant (Email) :</strong> <code>{createdCredentials.email}</code> &nbsp;|&nbsp; 
              <strong>Mot de passe :</strong> <code>{createdCredentials.password}</code> &nbsp;|&nbsp; 
              <strong>Lien d'accès :</strong> <code>{window.location.origin}/portal</code>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => {
                const text = `Bonjour ${createdCredentials.managerName},\nVotre espace de suivi de mission avec Ayoub MOSLIH est ouvert.\n\nAccès : ${window.location.origin}/portal\nIdentifiant : ${createdCredentials.email}\nMot de passe : ${createdCredentials.password}\n\nVous y retrouverez les CRA, comptes rendus et livrables.`;
                const phone = createdCredentials.phone.replace(/[^0-9]/g, '');
                window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                border: 'none',
                background: '#25D366',
                color: '#fff',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <MessageSquare size={15} />
              Envoyer par WhatsApp
            </button>

            <button
              onClick={() => {
                const text = `Bonjour ${createdCredentials.managerName},\n\nVotre espace collaborateur dédié pour la mission avec Ayoub MOSLIH est prêt.\n\nLien de connexion : ${window.location.origin}/portal\nIdentifiant : ${createdCredentials.email}\nMot de passe : ${createdCredentials.password}\n\nBien cordialement,\nAyoub MOSLIH`;
                window.open(`mailto:${createdCredentials.email}?subject=Vos accès à votre espace mission&body=${encodeURIComponent(text)}`, '_blank');
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#1e293b',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Mail size={15} />
              Envoyer par Email
            </button>

            <button
              onClick={() => setCreatedCredentials(null)}
              style={{
                border: 'none',
                background: 'transparent',
                color: '#64748b',
                fontSize: '0.8rem',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* Main Layout : Missions Selector + Details */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px', alignItems: 'start' }}>
        
        {/* Left Column: Missions List */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Missions & Clients ({missions.length})
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {missions.map(m => {
              const isSelected = m.id === selectedMission?.id;
              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMissionId(m.id)}
                  style={{
                    padding: '14px',
                    borderRadius: '12px',
                    border: isSelected ? '2px solid #006253' : '1px solid #e2e8f0',
                    background: isSelected ? 'rgba(0, 98, 83, 0.04)' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: isSelected ? '#006253' : '#0f172a' }}>
                      {m.companyName}
                    </span>
                    <span style={{ 
                      fontSize: '0.72rem', 
                      padding: '2px 8px', 
                      borderRadius: '12px', 
                      background: m.status === 'active' ? '#dcfce7' : '#f1f5f9',
                      color: m.status === 'active' ? '#166534' : '#64748b',
                      fontWeight: 600
                    }}>
                      {m.workMode || 'Régie'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
                    Resp : {m.managerName}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
                    Quota : {m.totalDaysQuota}j • {m.remoteMode}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Mission Details & Sub-tabs */}
        {selectedMission ? (
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
          }}>
            {/* Mission Header */}
            <div style={{ 
              padding: '20px 24px', 
              borderBottom: '1px solid #e2e8f0', 
              background: '#fafbfc',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                  {selectedMission.companyName}
                </h3>
                <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '6px', fontSize: '0.82rem', color: '#64748b' }}>
                  <span>👤 <strong>{selectedMission.managerName}</strong></span>
                  <span>📧 {selectedMission.email}</span>
                  <span>📞 {selectedMission.phone}</span>
                  {selectedMission.cabinetPortage?.name && (
                    <span>🏢 Portage : {selectedMission.cabinetPortage.name}</span>
                  )}
                  {selectedMission.cabinetConseil?.name && (
                    <span>🤝 ESN : {selectedMission.cabinetConseil.name}</span>
                  )}
                </div>
              </div>

              {/* Sub-tabs switch */}
              <div style={{ display: 'flex', gap: '6px', background: '#f1f5f9', padding: '4px', borderRadius: '10px' }}>
                <button
                  onClick={() => setActiveSubTab('timesheets')}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    background: activeSubTab === 'timesheets' ? '#ffffff' : 'transparent',
                    color: activeSubTab === 'timesheets' ? '#006253' : '#64748b',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    boxShadow: activeSubTab === 'timesheets' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
                  }}
                >
                  Timesheet & CRA ({currentTimesheets.length})
                </button>

                <button
                  onClick={() => setActiveSubTab('absences')}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    background: activeSubTab === 'absences' ? '#ffffff' : 'transparent',
                    color: activeSubTab === 'absences' ? '#006253' : '#64748b',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    boxShadow: activeSubTab === 'absences' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
                  }}
                >
                  Absences ({currentAbsences.length})
                </button>

                <button
                  onClick={() => setActiveSubTab('reports')}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    background: activeSubTab === 'reports' ? '#ffffff' : 'transparent',
                    color: activeSubTab === 'reports' ? '#006253' : '#64748b',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    boxShadow: activeSubTab === 'reports' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
                  }}
                >
                  Comptes Rendus ({currentReports.length})
                </button>
              </div>
            </div>

            {/* Sub-tab 1: Timesheets / CRA */}
            {activeSubTab === 'timesheets' && (
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>
                      Relevés d'Activité Mensuels (CRA en Régie)
                    </h4>
                    <p style={{ margin: '2px 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                      Imputations des jours, livrables associés, pièces jointes de validation et statuts
                    </p>
                  </div>
                  <button
                    onClick={() => setIsAddTimesheetModalOpen(true)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      background: '#006253',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    <Plus size={16} />
                    Imputer un Mois (CRA)
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {currentTimesheets.map(ts => (
                    <div 
                      key={ts.id}
                      style={{
                        padding: '18px',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        background: '#f8fafc'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                            {ts.monthLabel || ts.month}
                          </span>
                          <span style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '3px 10px',
                            borderRadius: '12px',
                            background: ts.status === 'approved' ? '#dcfce7' : (ts.status === 'submitted' ? '#fef3c7' : '#f1f5f9'),
                            color: ts.status === 'approved' ? '#166534' : (ts.status === 'submitted' ? '#92400e' : '#475569')
                          }}>
                            {ts.status === 'approved' ? 'VALIDÉ PAR CLIENT' : (ts.status === 'submitted' ? 'SOUMIS (EN ATTENTE)' : 'BROUILLON')}
                          </span>
                        </div>

                        <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: '#334155' }}>
                          <span><strong>Jours imputés :</strong> {ts.daysImputed} / {ts.totalWorkingDays}j</span>
                          <span><strong>Total Heures :</strong> {ts.totalHours}h</span>
                        </div>
                      </div>

                      <div style={{ marginTop: '12px', fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
                        {ts.content || "Aucun descriptif de livrable renseigné."}
                      </div>

                      {ts.attachment && (
                        <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#006253' }}>
                          <Paperclip size={14} />
                          <span>PJ de validation : <strong>{ts.attachment.name}</strong> ({ts.attachment.size})</span>
                        </div>
                      )}

                      {/* Client remarks if any */}
                      {ts.remarks && ts.remarks.length > 0 && (
                        <div style={{ marginTop: '14px', padding: '12px 14px', background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
                            Remarque du Collaborateur Client :
                          </div>
                          {ts.remarks.map((r, i) => (
                            <div key={i} style={{ fontSize: '0.85rem', color: '#1e293b' }}>
                              <p style={{ margin: 0 }}>« {r.enhancedText || r.text} »</p>
                              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Par {r.author} le {r.date.slice(0, 10)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-tab 2: Absences */}
            {activeSubTab === 'absences' && (
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>
                      Absences & Congés Justifiés du Consultant
                    </h4>
                    <p style={{ margin: '2px 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                      Transparence vis-à-vis du client, motifs et pièces justificatives (PJ)
                    </p>
                  </div>
                  <button
                    onClick={() => setIsAddAbsenceModalOpen(true)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      background: '#006253',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    <Plus size={16} />
                    Déclarer une Absence
                  </button>
                </div>

                {currentAbsences.length === 0 ? (
                  <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8', fontSize: '0.88rem' }}>
                    Aucune absence déclarée sur cette mission.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {currentAbsences.map(abs => (
                      <div 
                        key={abs.id}
                        style={{
                          padding: '16px',
                          borderRadius: '12px',
                          border: '1px solid #e2e8f0',
                          background: '#f8fafc',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '12px'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontWeight: 700, color: '#0f172a' }}>{abs.type}</span>
                            <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '10px', background: '#e0f2fe', color: '#0369a1', fontWeight: 600 }}>
                              {abs.durationDays} jour(s)
                            </span>
                            <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '10px', background: '#dcfce7', color: '#166534', fontWeight: 600 }}>
                              {abs.status}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.82rem', color: '#475569', marginTop: '4px' }}>
                            Période : Du {abs.dateStart} au {abs.dateEnd}
                          </div>
                          <div style={{ fontSize: '0.85rem', color: '#334155', marginTop: '6px' }}>
                            Motif : {abs.content}
                          </div>
                          {abs.attachment && (
                            <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#006253' }}>
                              <Paperclip size={13} />
                              <span>Justificatif joint : <strong>{abs.attachment.name}</strong></span>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => {
                            if (window.confirm("Supprimer cette absence ?")) {
                              deleteAbsence(selectedMission.id, abs.id);
                              refreshData();
                            }
                          }}
                          style={{
                            border: 'none',
                            background: '#fee2e2',
                            color: '#dc2626',
                            padding: '6px 10px',
                            borderRadius: '8px',
                            cursor: 'pointer'
                          }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Sub-tab 3: Reports */}
            {activeSubTab === 'reports' && (
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>
                      Comptes Rendus de Réunion & Comités
                    </h4>
                    <p style={{ margin: '2px 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                      Partage d'avancement, décisions actées, prochaines actions et exports multi-formats
                    </p>
                  </div>
                  <button
                    onClick={() => setIsAddReportModalOpen(true)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      background: '#006253',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    <Plus size={16} />
                    Créer un Compte Rendu
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {currentReports.map(rep => (
                    <div 
                      key={rep.id}
                      style={{
                        padding: '18px',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        background: '#f8fafc'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                        <div>
                          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                            {rep.title}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                            Date : {rep.date} • Projet : {rep.project}
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => {
                              const url = formatWhatsAppShare(rep, selectedMission, 'report');
                              window.open(url, '_blank');
                            }}
                            style={{
                              border: '1px solid #cbd5e1',
                              background: '#fff',
                              color: '#166534',
                              padding: '6px 10px',
                              borderRadius: '8px',
                              fontSize: '0.78rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <MessageSquare size={14} /> WhatsApp
                          </button>
                          <button
                            onClick={() => {
                              const url = formatEmailShare(rep, selectedMission, 'report');
                              window.open(url, '_blank');
                            }}
                            style={{
                              border: '1px solid #cbd5e1',
                              background: '#fff',
                              color: '#1e293b',
                              padding: '6px 10px',
                              borderRadius: '8px',
                              fontSize: '0.78rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <Mail size={14} /> Email
                          </button>
                        </div>
                      </div>

                      <div style={{ marginTop: '10px', fontSize: '0.85rem', color: '#334155' }}>
                        <strong>Synthèse :</strong> {rep.summary}
                      </div>

                      {rep.decisions && rep.decisions.length > 0 && (
                        <div style={{ marginTop: '10px' }}>
                          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#006253', textTransform: 'uppercase' }}>
                            Décisions actées :
                          </div>
                          <ul style={{ margin: '4px 0 0', paddingLeft: '20px', fontSize: '0.82rem', color: '#475569' }}>
                            {rep.decisions.map((d, i) => <li key={i}>{d}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            Aucune mission sélectionnée. Créez votre première mission pour commencer.
          </div>
        )}
      </div>

      {/* MODAL 1: Création Mission / Client */}
      {isNewMissionModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.6)',
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
            maxWidth: '640px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '28px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                  Créer un Compte Client & Mission
                </h3>
                <p style={{ margin: '3px 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                  Les 4 premiers champs sont obligatoires. Les autres paramètres sont optionnels.
                </p>
              </div>
              <button
                onClick={() => setIsNewMissionModalOpen(false)}
                style={{ border: 'none', background: 'transparent', fontSize: '1.3rem', cursor: 'pointer', color: '#94a3b8' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMission} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* OBLIGATOIRE BLOCK */}
              <div style={{ 
                background: '#f8fafc', 
                border: '1.5px solid #006253', 
                borderRadius: '12px', 
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#006253', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  ⭐ Champs Obligatoires (Strict Minimum)
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                      Nom de la société / Client *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: CAM, OCP, Carrefour..."
                      value={newMissionForm.companyName}
                      onChange={e => setNewMissionForm({ ...newMissionForm, companyName: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                      Nom du responsable client *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Karim Tazi"
                      value={newMissionForm.managerName}
                      onChange={e => setNewMissionForm({ ...newMissionForm, managerName: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                      Numéro de téléphone *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+212 6 00 00 00 00"
                      value={newMissionForm.phone}
                      onChange={e => setNewMissionForm({ ...newMissionForm, phone: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                      Adresse Email (Login Client) *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="client@entreprise.com"
                      value={newMissionForm.email}
                      onChange={e => setNewMissionForm({ ...newMissionForm, email: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                    />
                  </div>
                </div>
              </div>

              {/* OPTIONNEL 1: Intermédiaires (ESN & Portage) */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                <div 
                  onClick={() => setShowOptionalSections({ ...showOptionalSections, intermediaries: !showOptionalSections.intermediaries })}
                  style={{ padding: '12px 16px', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                >
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                    + Intermédiaires : Cabinet de Conseil & Société de Portage (Optionnel)
                  </span>
                  {showOptionalSections.intermediaries ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>

                {showOptionalSections.intermediaries && (
                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <input
                        type="text"
                        placeholder="Nom Cabinet Conseil / ESN"
                        value={newMissionForm.cabinetConseilName}
                        onChange={e => setNewMissionForm({ ...newMissionForm, cabinetConseilName: e.target.value })}
                        style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                      />
                      <input
                        type="text"
                        placeholder="Responsable ESN"
                        value={newMissionForm.cabinetConseilManager}
                        onChange={e => setNewMissionForm({ ...newMissionForm, cabinetConseilManager: e.target.value })}
                        style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <input
                        type="text"
                        placeholder="Nom Société de Portage Salarial"
                        value={newMissionForm.cabinetPortageName}
                        onChange={e => setNewMissionForm({ ...newMissionForm, cabinetPortageName: e.target.value })}
                        style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                      />
                      <input
                        type="text"
                        placeholder="Gestionnaire Portage"
                        value={newMissionForm.cabinetPortageManager}
                        onChange={e => setNewMissionForm({ ...newMissionForm, cabinetPortageManager: e.target.value })}
                        style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* OPTIONNEL 2: Forfait jours & Mode */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                <div 
                  onClick={() => setShowOptionalSections({ ...showOptionalSections, contract: !showOptionalSections.contract })}
                  style={{ padding: '12px 16px', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                >
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                    + Dates, Forfait Jours & Modalités de Régie (Optionnel)
                  </span>
                  {showOptionalSections.contract ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>

                {showOptionalSections.contract && (
                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ fontSize: '0.75rem', color: '#64748b' }}>Date début</label>
                        <input
                          type="date"
                          value={newMissionForm.dateStart}
                          onChange={e => setNewMissionForm({ ...newMissionForm, dateStart: e.target.value })}
                          style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.75rem', color: '#64748b' }}>Date fin</label>
                        <input
                          type="date"
                          value={newMissionForm.dateEnd}
                          onChange={e => setNewMissionForm({ ...newMissionForm, dateEnd: e.target.value })}
                          style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.75rem', color: '#64748b' }}>Nombre de jours vendus</label>
                        <input
                          type="number"
                          value={newMissionForm.totalDaysQuota}
                          onChange={e => setNewMissionForm({ ...newMissionForm, totalDaysQuota: e.target.value })}
                          style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ fontSize: '0.75rem', color: '#64748b' }}>Type de mode</label>
                        <select
                          value={newMissionForm.workMode}
                          onChange={e => setNewMissionForm({ ...newMissionForm, workMode: e.target.value })}
                          style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                        >
                          <option value="Régie">Régie (Temps passé)</option>
                          <option value="Forfait">Forfait (Engagement livrables)</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.75rem', color: '#64748b' }}>Rythme d'intervention</label>
                        <select
                          value={newMissionForm.remoteMode}
                          onChange={e => setNewMissionForm({ ...newMissionForm, remoteMode: e.target.value })}
                          style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                        >
                          <option value="Hybride (3j présentiel / 2j remote)">Hybride</option>
                          <option value="Présentiel">100% Présentiel</option>
                          <option value="Full Remote">100% Full Remote</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* OPTIONNEL 3: Horaires & Mot de passe personnalisé */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                <div 
                  onClick={() => setShowOptionalSections({ ...showOptionalSections, schedule: !showOptionalSections.schedule })}
                  style={{ padding: '12px 16px', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                >
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                    + Horaires types (Matin, Aprèm, Pause déj) & Mot de passe (Optionnel)
                  </span>
                  {showOptionalSections.schedule ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>

                {showOptionalSections.schedule && (
                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', fontSize: '0.8rem' }}>
                      <div>
                        <label style={{ color: '#64748b', display: 'block', marginBottom: '4px' }}>Matin</label>
                        <input 
                          type="text" 
                          value="09:00 - 12:30" 
                          disabled 
                          style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#f1f5f9' }} 
                        />
                      </div>
                      <div>
                        <label style={{ color: '#64748b', display: 'block', marginBottom: '4px' }}>Pause déj</label>
                        <input 
                          type="text" 
                          value="12:30 - 13:30" 
                          disabled 
                          style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#f1f5f9' }} 
                        />
                      </div>
                      <div>
                        <label style={{ color: '#64748b', display: 'block', marginBottom: '4px' }}>Après-midi</label>
                        <input 
                          type="text" 
                          value="13:30 - 18:00" 
                          disabled 
                          style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#f1f5f9' }} 
                        />
                      </div>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#006253', fontWeight: 600 }}>
                      ✓ Total calculé : 8.0 heures / jour
                    </div>

                    <div>
                      <label style={{ fontSize: '0.78rem', color: '#64748b', display: 'block', marginBottom: '4px' }}>
                        Mot de passe collaborateur (laisser vide pour auto-générer)
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Client@2026"
                        value={newMissionForm.collaboratorPassword}
                        onChange={e => setNewMissionForm({ ...newMissionForm, collaboratorPassword: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsNewMissionModalOpen(false)}
                  style={{ padding: '10px 18px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', color: '#475569', fontWeight: 600, cursor: 'pointer' }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  style={{ padding: '10px 22px', borderRadius: '8px', border: 'none', background: '#006253', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
                >
                  Valider et Créer le Compte Client
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Imputation Timesheet / CRA */}
      {isAddTimesheetModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.6)',
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
            maxWidth: '540px',
            padding: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
          }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
              Imputer un Relevé d'Activité (CRA)
            </h3>

            <form onSubmit={handleSaveTimesheet} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>Mois (YYYY-MM)</label>
                  <input
                    type="month"
                    required
                    value={timesheetForm.month}
                    onChange={e => setTimesheetForm({ ...timesheetForm, month: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>Libellé Affiché</label>
                  <input
                    type="text"
                    value={timesheetForm.monthLabel}
                    onChange={e => setTimesheetForm({ ...timesheetForm, monthLabel: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#64748b' }}>Jours Imputés</label>
                  <input
                    type="number"
                    step="0.5"
                    value={timesheetForm.daysImputed}
                    onChange={e => setTimesheetForm({ ...timesheetForm, daysImputed: e.target.value, totalHours: e.target.value * 8 })}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#64748b' }}>Jours Ouvrés</label>
                  <input
                    type="number"
                    value={timesheetForm.totalWorkingDays}
                    onChange={e => setTimesheetForm({ ...timesheetForm, totalWorkingDays: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#64748b' }}>Total Heures</label>
                  <input
                    type="number"
                    value={timesheetForm.totalHours}
                    onChange={e => setTimesheetForm({ ...timesheetForm, totalHours: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>
                  Contenu / Descriptif des livrables et activités réalisés
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Détail des ateliers, spécifications rédigées, fonctionnalités livrées..."
                  value={timesheetForm.content}
                  onChange={e => setTimesheetForm({ ...timesheetForm, content: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              {/* PJ de validation */}
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Paperclip size={14} /> Pièce Jointe pour Validation (Feuille signée, bon de commande, PDF)
                </label>
                <input
                  type="text"
                  placeholder="Nom du document joint (ex: CRA_Signe_Novembre.pdf)"
                  value={timesheetForm.attachmentName}
                  onChange={e => setTimesheetForm({ ...timesheetForm, attachmentName: e.target.value })}
                  style={{ width: '100%', marginTop: '6px', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddTimesheetModalOpen(false)}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: '#006253', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
                >
                  Enregistrer et Soumettre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Déclarer Absence */}
      {isAddAbsenceModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.6)',
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
            maxWidth: '520px',
            padding: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
          }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
              Déclarer une Absence Justifiée
            </h3>

            <form onSubmit={handleSaveAbsence} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>Type d'absence</label>
                  <select
                    value={absenceForm.type}
                    onChange={e => setAbsenceForm({ ...absenceForm, type: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  >
                    <option value="Congé Payé">Congé Payé</option>
                    <option value="Congé Exceptionnel">Congé Exceptionnel</option>
                    <option value="Conférence / Formation">Conférence / Formation</option>
                    <option value="Maladie">Maladie</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>Durée (en jours)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={absenceForm.durationDays}
                    onChange={e => setAbsenceForm({ ...absenceForm, durationDays: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#64748b' }}>Date début</label>
                  <input
                    type="date"
                    value={absenceForm.dateStart}
                    onChange={e => setAbsenceForm({ ...absenceForm, dateStart: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#64748b' }}>Date fin</label>
                  <input
                    type="date"
                    value={absenceForm.dateEnd}
                    onChange={e => setAbsenceForm({ ...absenceForm, dateEnd: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>
                  Motif & Contenu de la justification
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Ex: Intervention au Sommet IA, certificat médical, congés validés..."
                  value={absenceForm.content}
                  onChange={e => setAbsenceForm({ ...absenceForm, content: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              {/* Justificatif Pièce Jointe */}
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Paperclip size={14} /> Pièce Jointe Justificative (Attestation, Certificat)
                </label>
                <input
                  type="text"
                  placeholder="Nom de la PJ (ex: Attestation_Medicale.pdf)"
                  value={absenceForm.attachmentName}
                  onChange={e => setAbsenceForm({ ...absenceForm, attachmentName: e.target.value })}
                  style={{ width: '100%', marginTop: '6px', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddAbsenceModalOpen(false)}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: '#006253', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
                >
                  Enregistrer l'Absence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Nouveau Compte Rendu */}
      {isAddReportModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.6)',
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
            maxWidth: '560px',
            padding: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
          }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
              Créer un Compte Rendu de Suivi
            </h3>

            <form onSubmit={handleSaveReport} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>Titre de la séance</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Copil Sprint 6 & Revue d'Architecture IA"
                  value={reportForm.title}
                  onChange={e => setReportForm({ ...reportForm, title: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#64748b' }}>Date</label>
                  <input
                    type="date"
                    value={reportForm.date}
                    onChange={e => setReportForm({ ...reportForm, date: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#64748b' }}>Projet concerné</label>
                  <input
                    type="text"
                    placeholder="Ex: Module Crédit IA"
                    value={reportForm.project}
                    onChange={e => setReportForm({ ...reportForm, project: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>Synthèse des échanges</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Points clés abordés lors de la réunion..."
                  value={reportForm.summary}
                  onChange={e => setReportForm({ ...reportForm, summary: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>
                  Décisions Actées (1 par ligne)
                </label>
                <textarea
                  rows={2}
                  placeholder="Validation du prototype...&#10;Arbitrage sur la date de mise en prod..."
                  value={reportForm.decisions}
                  onChange={e => setReportForm({ ...reportForm, decisions: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>
                  Prochaines Actions (1 par ligne)
                </label>
                <textarea
                  rows={2}
                  placeholder="Finaliser les tests...&#10;Transmettre le rapport technique..."
                  value={reportForm.nextSteps}
                  onChange={e => setReportForm({ ...reportForm, nextSteps: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddReportModalOpen(false)}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: '#006253', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
                >
                  Publier le Compte Rendu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
