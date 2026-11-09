import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  CheckCircle2, Download, CalendarX2, Upload,
  Paperclip, Sparkles, Send, MessageSquare, AlertCircle, Clock
} from 'lucide-react';
import { 
  getTimesheetsByMission, updateTimesheetStatus, addTimesheetRemark, 
  enhanceRemarkWithAi, exportTimesheetToPdf, exportTimesheetToCsv,
  formatWhatsAppShare, getAbsencesByMission, saveTimesheet
} from '../../services/clientPortalService';

export default function PortalTimesheet() {
  const { mission } = useOutletContext();
  const missionId = mission?.id || 'mission-cam-2026';
  const [timesheets, setTimesheets] = useState(() => getTimesheetsByMission(missionId));
  const [selectedTsId, setSelectedTsId] = useState(() => getTimesheetsByMission(missionId)[0]?.id || null);
  const absences = getAbsencesByMission(missionId);

  // Remarks state
  const [remarkInput, setRemarkInput] = useState('');
  const [enhancedRemark, setEnhancedRemark] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [validationSuccess, setValidationSuccess] = useState(false);
  const [attachmentUploaded, setAttachmentUploaded] = useState(false);

  const selectedTs = timesheets.find(t => t.id === selectedTsId) || timesheets[0];

  // Global KPIs for this page
  const totalQuota = mission?.totalDaysQuota || 65;
  const currentImputed = selectedTs?.daysImputed || 21.5;
  const totalAbsences = absences.reduce((acc, a) => acc + (a.durationDays || 0), 0);
  const quotaRemaining = Math.max(0, totalQuota - timesheets.reduce((acc, t) => acc + (t.daysImputed || 0), 0));

  const handleApproveTimesheet = () => {
    if (!selectedTs || !selectedTs.attachment) return;
    updateTimesheetStatus(mission.id, selectedTs.id, 'approved');
    const updated = getTimesheetsByMission(mission.id);
    setTimesheets(updated);
    setValidationSuccess(true);
    setTimeout(() => setValidationSuccess(false), 3500);
  };

  const handleSimulateAttachmentUpload = () => {
    if (!selectedTs) return;
    const updated = {
      ...selectedTs,
      attachment: {
        name: `CRA_${selectedTs.monthLabel?.replace(/\s+/g, '_') || 'Mois'}_Signe_Ayoub_MOSLIH.pdf`,
        size: "245 KB",
        uploadedAt: new Date().toISOString(),
        url: "#"
      }
    };
    saveTimesheet(mission.id, updated);
    setTimesheets(getTimesheetsByMission(mission.id));
    setAttachmentUploaded(true);
    setTimeout(() => setAttachmentUploaded(false), 3000);
  };

  const handleEnhanceRemark = async () => {
    if (!remarkInput.trim() || isEnhancing) return;
    setIsEnhancing(true);
    try {
      const enhanced = await enhanceRemarkWithAi(remarkInput, 'timesheet');
      setEnhancedRemark(enhanced);
    } catch {
      setEnhancedRemark(remarkInput);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handlePostRemark = (e) => {
    e.preventDefault();
    if (!selectedTs || (!remarkInput.trim() && !enhancedRemark.trim())) return;

    const finalText = enhancedRemark.trim() || remarkInput.trim();
    addTimesheetRemark(mission.id, selectedTs.id, remarkInput, finalText);

    const updated = getTimesheetsByMission(mission.id);
    setTimesheets(updated);
    setRemarkInput('');
    setEnhancedRemark('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1240px', margin: '0 auto' }}>
      
      {/* Title */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
          Timesheet, Relevé d'Activité & Absences
        </h1>
        <p style={{ margin: '4px 0 0', fontSize: '0.88rem', color: '#64748b' }}>
          Imputation des jours en régie TJM (unités par jour ou demi-journée 0.5j), validation conditionnée par PJ et historique des congés
        </p>
      </div>

      {/* 4 TOP KPIS : FACTURABLE TJM, ABSENCES, STATUT VISA & QUOTA RESTANT */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        
        {/* KPI 1 : Jours Travaillés (TJM Mois) */}
        <div style={{ background: '#ffffff', padding: '22px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Jours Imputés ({selectedTs?.monthLabel || 'Mois'})
            </span>
            <span style={{ padding: '3px 8px', borderRadius: '6px', background: 'rgba(0, 98, 83, 0.08)', color: '#006253', fontSize: '0.74rem', fontWeight: 700 }}>
              1j / 0.5j
            </span>
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#006253', margin: '10px 0 2px' }}>
            {currentImputed}j <span style={{ fontSize: '1rem', fontWeight: 500, color: '#94a3b8' }}>/ {selectedTs?.totalWorkingDays || 22}j ouvrés</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
            Week-ends & jours fériés automatiquement exclus
          </div>
        </div>

        {/* KPI 2 : Absences Justifiées */}
        <div style={{ background: '#ffffff', padding: '22px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Absences Déclarées
            </span>
            <CalendarX2 size={18} color="#6366f1" />
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0f172a', margin: '10px 0 2px' }}>
            {totalAbsences} <span style={{ fontSize: '1rem', fontWeight: 500, color: '#94a3b8' }}>jour(s)</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#166534', fontWeight: 600 }}>
            Déduits de l'imputation TJM
          </div>
        </div>

        {/* KPI 3 : Statut Validation CRA */}
        <div style={{ background: '#ffffff', padding: '22px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Statut Visa CRA
            </span>
            <Clock size={18} color={selectedTs?.status === 'approved' ? '#166534' : '#f59e0b'} />
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: selectedTs?.status === 'approved' ? '#166534' : '#b45309', margin: '12px 0 2px' }}>
            {selectedTs?.status === 'approved' ? '✓ Validé par le client' : '⏳ En attente de signature'}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
            {selectedTs?.attachment ? '✓ Pièce jointe prête' : '⚠️ Pièce jointe requise'}
          </div>
        </div>

        {/* KPI 4 : Quota Restant Mission */}
        <div style={{ background: '#ffffff', padding: '22px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Quota Restant
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b' }}>
              / {totalQuota}j
            </span>
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0f172a', margin: '10px 0 2px' }}>
            {quotaRemaining} <span style={{ fontSize: '1rem', fontWeight: 500, color: '#64748b' }}>jours</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
            Sur le bon de commande en cours
          </div>
        </div>

      </div>

      {validationSuccess && (
        <div style={{
          background: '#dcfce7',
          border: '1px solid #86efac',
          borderRadius: '12px',
          padding: '14px 18px',
          color: '#166534',
          fontWeight: 700,
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <CheckCircle2 size={20} />
          Le relevé d'activité de {selectedTs?.monthLabel} a été approuvé avec succès par le client donneur d'ordre !
        </div>
      )}

      {attachmentUploaded && (
        <div style={{
          background: '#f0fdf4',
          border: '1px solid #86efac',
          borderRadius: '12px',
          padding: '14px 18px',
          color: '#166534',
          fontWeight: 700,
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <Paperclip size={20} />
          Pièce jointe de validation chargée avec succès ! Le bouton d'approbation client est désormais actif.
        </div>
      )}

      {/* SECTION 1 : RELEVÉ MENSUEL D'ACTIVITÉ */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '22px', alignItems: 'start' }}>
        
        {/* Months List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {timesheets.map(t => {
            const isSelected = t.id === selectedTs?.id;
            const isApproved = t.status === 'approved';
            return (
              <div
                key={t.id}
                onClick={() => {
                  setSelectedTsId(t.id);
                  setRemarkInput('');
                  setEnhancedRemark('');
                }}
                style={{
                  background: isSelected ? 'rgba(0, 98, 83, 0.06)' : '#ffffff',
                  border: isSelected ? '2px solid #006253' : '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.96rem', color: isSelected ? '#006253' : '#0f172a' }}>
                    {t.monthLabel || t.month}
                  </span>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: '6px',
                    background: isApproved ? '#dcfce7' : '#fef3c7',
                    color: isApproved ? '#166534' : '#92400e'
                  }}>
                    {isApproved ? 'VALIDÉ' : 'SOUMIS'}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '6px' }}>
                  {t.daysImputed}j imputés • Unité journalière (1j/0.5j)
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Timesheet Detail */}
        {selectedTs ? (
          <div style={{ background: '#ffffff', borderRadius: '18px', border: '1px solid #e2e8f0', padding: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            
            {/* Header Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', paddingBottom: '20px', borderBottom: '1px solid #e2e8f0' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#006253', fontWeight: 700, textTransform: 'uppercase' }}>
                  Relevé d'Activité • Régie Freelance TJM
                </span>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: '4px 0 0' }}>
                  {selectedTs.monthLabel || selectedTs.month}
                </h2>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {/* Bouton Approuver le CRA : Débloqué uniquement si pièce jointe présente */}
                {selectedTs.status !== 'approved' && (
                  <button
                    onClick={handleApproveTimesheet}
                    disabled={!selectedTs.attachment}
                    title={!selectedTs.attachment ? "Le CRA requiert la pièce jointe de validation avant visa" : "Valider le CRA"}
                    style={{
                      padding: '10px 18px',
                      borderRadius: '10px',
                      border: 'none',
                      background: selectedTs.attachment ? '#166534' : '#94a3b8',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: selectedTs.attachment ? 'pointer' : 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: selectedTs.attachment ? '0 2px 8px rgba(22, 101, 52, 0.25)' : 'none'
                    }}
                  >
                    <CheckCircle2 size={16} /> Approuver le CRA
                  </button>
                )}

                <button
                  onClick={() => exportTimesheetToPdf(selectedTs, mission)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #006253',
                    background: '#ffffff',
                    color: '#006253',
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Download size={14} /> PDF Officiel
                </button>

                <button
                  onClick={() => exportTimesheetToCsv(selectedTs, mission)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#1e293b',
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    cursor: 'pointer'
                  }}
                >
                  CSV
                </button>

                <button
                  onClick={() => {
                    const url = formatWhatsAppShare(selectedTs, mission, 'timesheet');
                    window.open(url, '_blank');
                  }}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: 'none',
                    background: '#25D366',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <MessageSquare size={14} /> WhatsApp
                </button>
              </div>
            </div>

            {/* Imputation Metrics Grid (Unité en jours / demi-journées, pas d'heures détaillées) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', margin: '22px 0' }}>
              <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Jours Facturés (Régie TJM)</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#006253', marginTop: '4px' }}>
                  {selectedTs.daysImputed} <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>/ {selectedTs.totalWorkingDays}j ouvrés</span>
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
                  Unité : Jour (1j) ou Demi-journée (0.5j)
                </div>
              </div>

              <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Statut Visa Client</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: selectedTs.status === 'approved' ? '#166534' : '#b45309', marginTop: '8px' }}>
                  {selectedTs.status === 'approved' ? '✓ Validé par le client' : '⏳ En attente de signature'}
                </div>
              </div>
            </div>

            {/* Pièce Jointe de Validation */}
            <div style={{ marginBottom: '26px' }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '0.92rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase' }}>
                Pièce Jointe de Validation & Bon de Commande
              </h4>

              {selectedTs.attachment ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #86efac' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Paperclip size={20} color="#166534" />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#166534' }}>
                        {selectedTs.attachment.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#475569' }}>
                        Document versé par le consultant / admin ({selectedTs.attachment.size})
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => exportTimesheetToPdf(selectedTs, mission)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '8px',
                        border: '1px solid #166534',
                        background: '#ffffff',
                        color: '#166534',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      Télécharger
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '16px', background: '#fefce8', borderRadius: '12px', border: '1px solid #fef08a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <AlertCircle size={20} color="#b45309" />
                    <div style={{ fontSize: '0.84rem', color: '#92400e' }}>
                      <strong>Aucune pièce jointe versée :</strong> La validation client nécessite le chargement préalable de la PJ signée par le consultant dans son espace admin.
                    </div>
                  </div>

                  {/* Bouton de simulation / chargement immédiat */}
                  <button
                    onClick={handleSimulateAttachmentUpload}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '8px',
                      border: '1px solid #b45309',
                      background: '#ffffff',
                      color: '#b45309',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Upload size={14} /> Verser la PJ (Mode Consultant)
                  </button>
                </div>
              )}
            </div>

            {/* REMARKS SECTION WITH AI ENHANCE */}
            <div style={{ paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                Remarques & Observations sur le Relevé d'Activité
              </h4>

              {selectedTs.remarks && selectedTs.remarks.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
                  {selectedTs.remarks.map((rem, i) => (
                    <div key={i} style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b' }}>
                        <span style={{ fontWeight: 700, color: '#0f172a' }}>{rem.author}</span>
                        <span>{rem.date.slice(0, 10)}</span>
                      </div>
                      <p style={{ margin: '6px 0 0', fontSize: '0.88rem', color: '#334155', lineHeight: 1.5 }}>
                        « {rem.enhancedText || rem.text} »
                      </p>
                      {rem.isAiEnhanced && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: '#006253', fontWeight: 700, marginTop: '4px' }}>
                          <Sparkles size={12} /> Formulation enrichie par l'IA
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <form onSubmit={handlePostRemark} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <textarea
                  rows={2}
                  placeholder="Laisser une remarque ou un visa particulier sur ce relevé..."
                  value={remarkInput}
                  onChange={e => setRemarkInput(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none' }}
                />

                {enhancedRemark && (
                  <div style={{
                    background: 'linear-gradient(135deg, #f0fdf4 0%, #e6f7f2 100%)',
                    border: '1px solid #86efac',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    fontSize: '0.85rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#166534', marginBottom: '4px' }}>
                      <Sparkles size={14} /> Suggestion de formulation consolidée :
                    </div>
                    <div style={{ color: '#1e293b', fontStyle: 'italic', lineHeight: 1.5 }}>
                      « {enhancedRemark} »
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={handleEnhanceRemark}
                    disabled={isEnhancing || !remarkInput.trim()}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      border: '1px solid #006253',
                      background: 'rgba(0, 98, 83, 0.08)',
                      color: '#006253',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      cursor: isEnhancing || !remarkInput.trim() ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <Sparkles size={15} />
                    {isEnhancing ? "Amélioration en cours..." : "Rehausser avec l'IA ✨"}
                  </button>

                  <button
                    type="submit"
                    disabled={!remarkInput.trim() && !enhancedRemark.trim()}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 18px',
                      borderRadius: '8px',
                      border: 'none',
                      background: '#006253',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: !remarkInput.trim() && !enhancedRemark.trim() ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <Send size={15} /> Enregistrer la remarque
                  </button>
                </div>
              </form>

            </div>

          </div>
        ) : null}
      </div>

      {/* SECTION 2 : RELEVÉ DES ABSENCES & CONGÉS JUSTIFIÉS (PAGE UNIQUE FUSIONNÉE) */}
      <div id="absences" style={{ background: '#ffffff', borderRadius: '18px', border: '1px solid #e2e8f0', padding: '28px 32px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
              Relevé des Absences & Congés Justifiés ({absences.length})
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#64748b' }}>
              Transparence contractuelle : indisponibilités décomptées du TJM avec pièces justificatives
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#166534', fontWeight: 700, background: '#dcfce7', padding: '5px 12px', borderRadius: '20px' }}>
            <CheckCircle2 size={15} /> 100% justifiées et déduites de la facturation
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {absences.map(abs => (
            <div
              key={abs.id}
              style={{
                background: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                padding: '18px 22px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.96rem', color: '#0f172a' }}>
                    {abs.type}
                  </span>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', background: '#e0f2fe', color: '#0369a1' }}>
                    {abs.durationDays} jour(s)
                  </span>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', background: '#dcfce7', color: '#166534' }}>
                    {abs.status.toUpperCase()}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Période : Du {abs.dateStart} au {abs.dateEnd} • Motif : {abs.content}
                </div>
              </div>

              {abs.attachment && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Paperclip size={15} color="#006253" />
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0f172a' }}>{abs.attachment.name}</span>
                  <button
                    onClick={() => alert(`Téléchargement : ${abs.attachment.name}`)}
                    style={{
                      padding: '5px 10px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      background: '#ffffff',
                      color: '#0f172a',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                  >
                    Consulter
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}