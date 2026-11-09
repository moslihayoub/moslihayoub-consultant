import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Download, Share2, Sparkles, MessageSquare, 
  Mail, Paperclip, Send, CheckCircle2, Copy, ChevronDown, Check
} from 'lucide-react';
import { 
  getReportsByMission, addReportRemark, enhanceRemarkWithAi, 
  exportReportToPdf, exportReportToDocx, openGoogleDocExport,
  formatWhatsAppShare, formatEmailShare 
} from '../../services/clientPortalService';

export default function PortalReports() {
  const { mission } = useOutletContext();
  const missionId = mission?.id || 'mission-cam-2026';
  const [reports, setReports] = useState(() => getReportsByMission(missionId));
  const [selectedReportId, setSelectedReportId] = useState(() => getReportsByMission(missionId)[0]?.id || null);

  // Dropdown states for actions
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  // Remark state
  const [remarkInput, setRemarkInput] = useState('');
  const [enhancedRemark, setEnhancedRemark] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);

  const selectedReport = reports.find(r => r.id === selectedReportId) || reports[0];

  const handleEnhanceRemark = async () => {
    if (!remarkInput.trim() || isEnhancing) return;
    setIsEnhancing(true);
    try {
      const enhanced = await enhanceRemarkWithAi(remarkInput, 'compte_rendu');
      setEnhancedRemark(enhanced);
    } catch {
      setEnhancedRemark(remarkInput);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handlePostRemark = (e) => {
    e.preventDefault();
    if (!selectedReport || (!remarkInput.trim() && !enhancedRemark.trim())) return;

    const finalText = enhancedRemark.trim() || remarkInput.trim();
    addReportRemark(mission.id, selectedReport.id, remarkInput, finalText);

    // Refresh local list
    const updated = getReportsByMission(mission.id);
    setReports(updated);
    setRemarkInput('');
    setEnhancedRemark('');
  };

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2500);
      setIsShareOpen(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1240px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
            Comptes Rendus Hebdomadaires ({reports.length})
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '0.88rem', color: '#64748b' }}>
            Synthèses hebdomadaires Product Design & IA transmises aux managers, décisions actées et exports multi-formats
          </p>
        </div>

        {linkCopied && (
          <div style={{
            background: '#dcfce7',
            border: '1px solid #86efac',
            color: '#166534',
            padding: '6px 14px',
            borderRadius: '8px',
            fontSize: '0.82rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Check size={15} /> Lien du compte rendu copié dans le presse-papier !
          </div>
        )}
      </div>

      {/* Main Layout : Compact Shortcuts List (250px) + Wide Detail Viewer (flex: 1) */}
      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '22px', alignItems: 'start' }}>
        
        {/* Left List (Minimisée) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {reports.map((rep, idx) => {
            const isSelected = rep.id === selectedReport?.id;
            return (
              <div
                key={rep.id || idx}
                onClick={() => {
                  setSelectedReportId(rep.id);
                  setRemarkInput('');
                  setEnhancedRemark('');
                  setIsShareOpen(false);
                  setIsExportOpen(false);
                }}
                style={{
                  background: isSelected ? 'rgba(0, 98, 83, 0.06)' : '#ffffff',
                  border: isSelected ? '2px solid #006253' : '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '12px 14px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isSelected ? '0 2px 8px rgba(0, 98, 83, 0.1)' : 'none'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: '#64748b' }}>
                  <span style={{
                    fontWeight: 800,
                    color: isSelected ? '#006253' : '#475569',
                    background: isSelected ? 'rgba(0, 98, 83, 0.12)' : '#f1f5f9',
                    padding: '2px 6px',
                    borderRadius: '4px'
                  }}>
                    {rep.weekLabel || `Semaine ${rep.weekNumber || idx + 1}`}
                  </span>
                  <span>{rep.date}</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.86rem', color: isSelected ? '#006253' : '#0f172a', marginTop: '6px', lineHeight: 1.3 }}>
                  {rep.title}
                </div>
                {rep.remarks?.length > 0 && (
                  <div style={{ marginTop: '6px', fontSize: '0.7rem', color: '#006253', fontWeight: 600 }}>
                    💬 {rep.remarks.length} remarque(s)
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Detail Viewer (Élargie) */}
        {selectedReport ? (
          <div style={{ background: '#ffffff', borderRadius: '18px', border: '1px solid #e2e8f0', padding: '32px 36px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            
            {/* Header & 2 Dropdown Action Buttons (Partager & Exporter) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', paddingBottom: '20px', borderBottom: '1px solid #e2e8f0' }}>
              <div>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  {selectedReport.title}
                </h2>
              </div>

              {/* Toolbar : 2 Actions avec Dropdowns (Partager & Exporter) */}
              <div style={{ display: 'flex', gap: '10px', position: 'relative' }}>
                
                {/* 1. BOUTON DROPDOWN PARTAGER */}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => {
                      setIsShareOpen(!isShareOpen);
                      setIsExportOpen(false);
                    }}
                    style={{
                      padding: '9px 16px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      background: '#ffffff',
                      color: '#0f172a',
                      fontWeight: 700,
                      fontSize: '0.84rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                    }}
                  >
                    <Share2 size={16} color="#006253" /> Partager <ChevronDown size={14} color="#64748b" />
                  </button>

                  {isShareOpen && (
                    <div style={{
                      position: 'absolute',
                      top: '44px',
                      right: 0,
                      width: '240px',
                      background: '#ffffff',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 12px 28px rgba(0,0,0,0.12)',
                      padding: '6px',
                      zIndex: 80,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}>
                      <button
                        onClick={() => {
                          const url = formatWhatsAppShare(selectedReport, mission, 'report');
                          window.open(url, '_blank');
                          setIsShareOpen(false);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: 'none',
                          background: 'transparent',
                          color: '#166534',
                          fontWeight: 600,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f0fdf4'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <MessageSquare size={16} color="#25D366" />
                        Partager via WhatsApp
                      </button>

                      <button
                        onClick={() => {
                          const url = formatEmailShare(selectedReport, mission, 'report');
                          window.open(url, '_blank');
                          setIsShareOpen(false);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: 'none',
                          background: 'transparent',
                          color: '#334155',
                          fontWeight: 600,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <Mail size={16} color="#006253" />
                        Envoyer par Email au Manager
                      </button>

                      <button
                        onClick={handleCopyLink}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: 'none',
                          background: 'transparent',
                          color: '#334155',
                          fontWeight: 600,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <Copy size={16} color="#64748b" />
                        Copier le lien sécurisé
                      </button>
                    </div>
                  )}
                </div>

                {/* 2. BOUTON DROPDOWN EXPORTER */}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => {
                      setIsExportOpen(!isExportOpen);
                      setIsShareOpen(false);
                    }}
                    style={{
                      padding: '9px 16px',
                      borderRadius: '10px',
                      border: 'none',
                      background: '#006253',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.84rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 2px 8px rgba(0, 98, 83, 0.25)'
                    }}
                  >
                    <Download size={16} /> Exporter <ChevronDown size={14} />
                  </button>

                  {isExportOpen && (
                    <div style={{
                      position: 'absolute',
                      top: '44px',
                      right: 0,
                      width: '240px',
                      background: '#ffffff',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 12px 28px rgba(0,0,0,0.12)',
                      padding: '6px',
                      zIndex: 80,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}>
                      <button
                        onClick={() => {
                          exportReportToPdf(selectedReport, mission);
                          setIsExportOpen(false);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: 'none',
                          background: 'transparent',
                          color: '#006253',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(0, 98, 83, 0.06)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <Download size={15} color="#006253" />
                        Télécharger en PDF Officiel
                      </button>

                      <button
                        onClick={() => {
                          exportReportToDocx(selectedReport, mission);
                          setIsExportOpen(false);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: 'none',
                          background: 'transparent',
                          color: '#334155',
                          fontWeight: 600,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <Download size={15} color="#475569" />
                        Télécharger en Word (.doc)
                      </button>

                      <button
                        onClick={() => {
                          openGoogleDocExport(selectedReport, mission);
                          setIsExportOpen(false);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: 'none',
                          background: 'transparent',
                          color: '#334155',
                          fontWeight: 600,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <Download size={15} color="#475569" />
                        Ouvrir dans Google Docs
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Sections Content Spécifique Product Design & IA */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '24px' }}>
              
              {/* 1. Synthèse de la séance */}
              <div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '0.88rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  1. Synthèse des Travaux Product Design & IA
                </h4>
                <p style={{ margin: 0, fontSize: '0.92rem', color: '#1e293b', lineHeight: 1.6, background: '#f8fafc', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  {selectedReport.summary}
                </p>
              </div>

              {/* 2. Décisions Actées */}
              <div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '0.88rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  2. Décisions & Arbitrages Ergonomiques Actés
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {(selectedReport.decisions || []).map((d, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.88rem', color: '#1e293b' }}>
                      <CheckCircle2 size={18} color="#006253" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Prochaines Étapes */}
              <div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '0.88rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  3. Prochains Jalons & Livrables
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {(selectedReport.nextSteps || []).map((s, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.88rem', color: '#1e293b' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#006253', marginTop: '6px', flexShrink: 0 }} />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Document joint */}
              {selectedReport.attachment && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(0, 98, 83, 0.05)', borderRadius: '10px', border: '1px solid rgba(0, 98, 83, 0.15)', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Paperclip size={16} color="#006253" />
                    <span>Livrable joint : <strong>{selectedReport.attachment.name}</strong> ({selectedReport.attachment.size})</span>
                  </div>
                  <button
                    onClick={() => exportReportToPdf(selectedReport, mission)}
                    style={{
                      border: 'none',
                      background: '#006253',
                      color: '#ffffff',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Télécharger
                  </button>
                </div>
              )}

              {/* Remarques & Observations avec Rehausseur IA */}
              <div style={{ marginTop: '16px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                  Observations & Retours Métier sur la Séance
                </h4>

                {selectedReport.remarks && selectedReport.remarks.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
                    {selectedReport.remarks.map((rem, i) => (
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
                    rows={3}
                    placeholder="Saisissez une observation ou un arbitrage sur ce compte rendu..."
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
                      {isEnhancing ? "Amélioration IA en cours..." : "Rehausser avec l'IA ✨"}
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
                      <Send size={15} /> Publier l'observation
                    </button>
                  </div>
                </form>

              </div>

            </div>

          </div>
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            Aucun compte rendu disponible pour cette mission.
          </div>
        )}

      </div>

    </div>
  );
}