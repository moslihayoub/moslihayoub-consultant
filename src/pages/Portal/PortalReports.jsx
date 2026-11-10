import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Download, Share2, Sparkles, Wand2, MessageSquare, 
  Mail, Send, CheckCircle2, Copy, ChevronDown, Check
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
            Comptes Rendus ({reports.length})
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '0.88rem', color: '#64748b' }}>
            Synthèses hebdomadaires Product Design & IA, décisions actées et livrables de mission
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

      {/* Main Layout : Compact Shortcuts List (240px) + Wide Detail Viewer (flex: 1) */}
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '22px', alignItems: 'start' }}>
        
        {/* Left List : Cartes listing compactes avec contenu court */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {reports.map((rep, idx) => {
            const isSelected = rep.id === selectedReport?.id;
            const code = rep.code || `CR-0${reports.length - idx}`;
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
                  padding: '10px 12px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isSelected ? '0 2px 8px rgba(0, 98, 83, 0.1)' : 'none'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: '#64748b' }}>
                  <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                    <span style={{
                      fontWeight: 800,
                      color: isSelected ? '#ffffff' : '#006253',
                      background: isSelected ? '#006253' : 'rgba(0, 98, 83, 0.1)',
                      padding: '2px 5px',
                      borderRadius: '4px',
                      fontSize: '0.7rem'
                    }}>
                      {code}
                    </span>
                    <span style={{ fontWeight: 600 }}>
                      {rep.weekLabel || `Sem ${rep.weekNumber || idx + 1}`}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.7rem' }}>{rep.date}</span>
                </div>

                <div style={{ 
                  fontWeight: 700, 
                  fontSize: '0.82rem', 
                  color: isSelected ? '#006253' : '#0f172a', 
                  marginTop: '6px', 
                  lineHeight: 1.3,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {rep.title}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', fontSize: '0.7rem' }}>
                  <span style={{ color: '#64748b' }}>{rep.status || 'Livré'}</span>
                  {rep.remarks?.length > 0 && (
                    <span style={{ color: '#006253', fontWeight: 700 }}>
                      💬 {rep.remarks.length}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Detail Viewer */}
        {selectedReport ? (
          <div style={{ background: '#ffffff', borderRadius: '18px', border: '1px solid #e2e8f0', padding: '30px 34px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            
            {/* Header & 2 Dropdown Action Buttons (Partager & Exporter) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', paddingBottom: '18px', borderBottom: '1px solid #e2e8f0' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ padding: '3px 8px', borderRadius: '6px', background: '#006253', color: '#ffffff', fontSize: '0.75rem', fontWeight: 800 }}>
                    {selectedReport.code || 'CR'}
                  </span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>
                    {selectedReport.weekLabel} • {selectedReport.date}
                  </span>
                </div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  {selectedReport.title}
                </h2>
              </div>

              {/* Toolbar : Partager & Exporter */}
              <div style={{ display: 'flex', gap: '10px', position: 'relative' }}>
                
                {/* 1. BOUTON DROPDOWN PARTAGER */}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => {
                      setIsShareOpen(!isShareOpen);
                      setIsExportOpen(false);
                    }}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      background: '#ffffff',
                      color: '#0f172a',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '7px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                    }}
                  >
                    <Share2 size={15} color="#006253" /> Partager <ChevronDown size={13} color="#64748b" />
                  </button>

                  {isShareOpen && (
                    <div style={{
                      position: 'absolute',
                      top: '42px',
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
                          padding: '9px 12px',
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
                        <MessageSquare size={15} color="#25D366" />
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
                          padding: '9px 12px',
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
                        <Mail size={15} color="#006253" />
                        Envoyer par Email au Manager
                      </button>

                      <button
                        onClick={handleCopyLink}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '9px 12px',
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
                        <Copy size={15} color="#64748b" />
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
                      padding: '8px 14px',
                      borderRadius: '10px',
                      border: 'none',
                      background: '#006253',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '7px',
                      boxShadow: '0 2px 8px rgba(0, 98, 83, 0.25)'
                    }}
                  >
                    <Download size={15} /> Exporter <ChevronDown size={13} />
                  </button>

                  {isExportOpen && (
                    <div style={{
                      position: 'absolute',
                      top: '42px',
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
                          padding: '9px 12px',
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
                          padding: '9px 12px',
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
                          padding: '9px 12px',
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

            {/* Sections Content : 1. Synthèse, 2. Décisions, 3. Prochains Jalons (SANS Livrable joint à télécharger) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', marginTop: '22px' }}>
              
              {/* 1. Synthèse de la séance */}
              <div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '0.84rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  1. Synthèse des Travaux Product Design & IA
                </h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#1e293b', lineHeight: 1.6, background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  {selectedReport.summary}
                </p>
              </div>

              {/* 2. Décisions Actées */}
              <div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '0.84rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  2. Décisions & Arbitrages Ergonomiques Actés
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {(selectedReport.decisions || []).map((d, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.88rem', color: '#1e293b' }}>
                      <CheckCircle2 size={16} color="#006253" style={{ flexShrink: 0, marginTop: '3px' }} />
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Prochaines Étapes */}
              <div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '0.84rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  3. Prochains Jalons & Livrables
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {(selectedReport.nextSteps || []).map((s, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.88rem', color: '#1e293b' }}>
                      <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#006253', marginTop: '6px', flexShrink: 0 }} />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            Aucun compte rendu disponible pour cette mission.
          </div>
        )}

      </div>

      {/* BLOC STANDALONE SÉPARÉ EN BAS : Observations & Retours Métier sur la Séance (Inclus dans l'export PDF) */}
      {selectedReport && (
        <div style={{
          background: '#ffffff',
          borderRadius: '18px',
          border: '1px solid #e2e8f0',
          padding: '28px 32px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
        }}>
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
              Observations & Retours Métier sur la Séance
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#64748b' }}>
              Remarques et retours de la direction cliente — systématiquement consolidés dans les procès-verbaux et exports PDF
            </p>
          </div>

          {/* Liste des remarques existantes (SANS la mention "Formulation enrichie par l'IA") */}
          {selectedReport.remarks && selectedReport.remarks.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
              {selectedReport.remarks.map((rem, i) => (
                <div key={i} style={{ background: '#f8fafc', padding: '14px 16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b' }}>
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>{rem.author}</span>
                    <span>{rem.date ? rem.date.slice(0, 10) : ''}</span>
                  </div>
                  <p style={{ margin: '6px 0 0', fontSize: '0.88rem', color: '#334155', lineHeight: 1.5 }}>
                    « {rem.enhancedText || rem.text} »
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Formulaire de saisie avec icône baguette magique À L'INTÉRIEUR du champ texte (SANS texte) */}
          <form onSubmit={handlePostRemark} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ position: 'relative' }}>
              <textarea
                rows={3}
                placeholder="Saisissez une observation ou un arbitrage sur ce compte rendu..."
                value={remarkInput}
                onChange={e => setRemarkInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 48px 12px 14px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.88rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  resize: 'vertical'
                }}
              />

              {/* Icône seule baguette magique intégrée dans le champ texte */}
              <button
                type="button"
                onClick={handleEnhanceRemark}
                disabled={isEnhancing || !remarkInput.trim()}
                title="Rehausser avec l'IA"
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  background: isEnhancing ? '#f1f5f9' : '#ffffff',
                  color: '#006253',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: isEnhancing || !remarkInput.trim() ? 'not-allowed' : 'pointer',
                  opacity: !remarkInput.trim() ? 0.45 : 1,
                  transition: 'all 0.15s ease'
                }}
              >
                <Wand2 size={16} color="#006253" />
              </button>
            </div>

            {enhancedRemark && (
              <div style={{
                background: 'linear-gradient(135deg, #f0fdf4 0%, #e6f7f2 100%)',
                border: '1px solid #86efac',
                borderRadius: '12px',
                padding: '12px 16px',
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

            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <button
                type="submit"
                disabled={!remarkInput.trim() && !enhancedRemark.trim()}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 18px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#006253',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  cursor: !remarkInput.trim() && !enhancedRemark.trim() ? 'not-allowed' : 'pointer',
                  opacity: !remarkInput.trim() && !enhancedRemark.trim() ? 0.6 : 1
                }}
              >
                <Send size={15} /> Publier l'observation
              </button>
            </div>
          </form>

        </div>
      )}

    </div>
  );
}
