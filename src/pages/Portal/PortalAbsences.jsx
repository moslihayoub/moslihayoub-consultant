import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { CalendarX2, CheckCircle2, Paperclip, Download } from 'lucide-react';
import { getAbsencesByMission } from '../../services/clientPortalService';

export default function PortalAbsences() {
  const { mission } = useOutletContext();
  const absences = mission ? getAbsencesByMission(mission.id) : [];

  const totalAbsenceDays = absences.reduce((acc, a) => acc + (a.durationDays || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Title */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
          Absences & Congés Justifiés du Consultant ({absences.length})
        </h1>
        <p style={{ margin: '4px 0 0', fontSize: '0.88rem', color: '#64748b' }}>
          Transparence opérationnelle : relevé des indisponibilités avec motifs et pièces justificatives (PJ)
        </p>
      </div>

      {/* Summary Banner */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        padding: '20px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(0, 98, 83, 0.1)', color: '#006253', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CalendarX2 size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
              Total des Absences : {totalAbsenceDays} jour(s)
            </div>
            <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Déduits du calendrier effectif d'intervention de la mission
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#166534', fontWeight: 700, background: '#dcfce7', padding: '6px 14px', borderRadius: '20px' }}>
          <CheckCircle2 size={16} /> 100% justifiées et transmises au portage
        </div>
      </div>

      {/* Absences List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {absences.map(abs => (
          <div
            key={abs.id}
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: '20px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '750px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                  {abs.type}
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: '10px', background: '#e0f2fe', color: '#0369a1' }}>
                  {abs.durationDays} jour(s)
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: '10px', background: '#dcfce7', color: '#166534' }}>
                  {abs.status.toUpperCase()}
                </span>
              </div>

              <div style={{ fontSize: '0.84rem', color: '#64748b' }}>
                <strong>Période :</strong> Du {abs.dateStart} au {abs.dateEnd}
              </div>

              <div style={{ fontSize: '0.9rem', color: '#1e293b', background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', lineHeight: 1.5, marginTop: '4px' }}>
                <strong>Motif & Justification :</strong> {abs.content}
              </div>
            </div>

            {/* Attachment Box */}
            {abs.attachment && (
              <div style={{
                background: '#f0fdf4',
                border: '1px solid #86efac',
                borderRadius: '12px',
                padding: '14px 18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                minWidth: '240px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', fontWeight: 700, color: '#166534' }}>
                  <Paperclip size={16} /> Pièce Jointe Justificative
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>
                  {abs.attachment.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Taille : {abs.attachment.size}
                </div>
                <button
                  onClick={() => alert(`Téléchargement de la pièce jointe : ${abs.attachment.name}`)}
                  style={{
                    marginTop: '4px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid #166534',
                    background: '#ffffff',
                    color: '#166534',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Download size={13} /> Consulter le Justificatif
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}
