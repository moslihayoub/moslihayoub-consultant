import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  FolderKanban, CheckCircle2, Clock, 
  ChevronDown, ChevronUp, Layers, CheckSquare
} from 'lucide-react';
import { getProjectsByMission } from '../../services/clientPortalService';

export default function PortalProjects() {
  const { mission } = useOutletContext();
  const missionId = mission?.id || 'mission-cam-2026';
  const projects = getProjectsByMission(missionId);
  const [expandedProjects, setExpandedProjects] = useState(projects.reduce((acc, p) => ({ ...acc, [p.id]: true }), {}));

  const toggleExpand = (id) => {
    setExpandedProjects(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Compute 4 Rich KPIs
  const totalProjects = projects.length;
  const avgProgress = totalProjects > 0 ? Math.round(projects.reduce((acc, p) => acc + (p.progress || 0), 0) / totalProjects) : 0;
  
  const allTasks = projects.flatMap(p => p.tasks || []);
  const completedTasks = allTasks.filter(t => t.status === 'Terminé').length;
  const inProgressTasks = allTasks.filter(t => t.status === 'En cours' || t.status === 'En revue').length;
  const totalDeliverables = allTasks.filter(t => t.deliverable).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1240px', margin: '0 auto' }}>
      
      {/* Title */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
          Chantiers & Projets de Mission ({totalProjects})
        </h1>
        <p style={{ margin: '4px 0 0', fontSize: '0.88rem', color: '#64748b' }}>
          Pilotage des chantiers Product Design, Design System et Intégration IA pour Crédit Agricole du Maroc (Bank-e)
        </p>
      </div>

      {/* 4 TOP KPIS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        
        {/* KPI 1 : Projets Actifs */}
        <div style={{ background: '#ffffff', padding: '22px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Chantiers Actifs
            </span>
            <FolderKanban size={18} color="#006253" />
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0f172a', margin: '10px 0 2px' }}>
            {totalProjects} <span style={{ fontSize: '1rem', fontWeight: 500, color: '#94a3b8' }}>chantiers</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#006253', fontWeight: 600 }}>
            100% en phase de réalisation active
          </div>
        </div>

        {/* KPI 2 : Avancement Global */}
        <div style={{ background: '#ffffff', padding: '22px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Avancement Global
            </span>
            <span style={{ padding: '3px 8px', borderRadius: '6px', background: 'rgba(0, 98, 83, 0.1)', color: '#006253', fontSize: '0.74rem', fontWeight: 700 }}>
              Moyenne
            </span>
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#006253', margin: '10px 0 2px' }}>
            {avgProgress}%
          </div>
          {/* Progress Bar */}
          <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden', marginTop: '8px' }}>
            <div style={{ width: `${avgProgress}%`, height: '100%', background: '#006253', borderRadius: '4px' }} />
          </div>
        </div>

        {/* KPI 3 : Tâches Clôturées */}
        <div style={{ background: '#ffffff', padding: '22px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Tâches Clôturées
            </span>
            <CheckSquare size={18} color="#166534" />
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0f172a', margin: '10px 0 2px' }}>
            {completedTasks} <span style={{ fontSize: '1rem', fontWeight: 500, color: '#94a3b8' }}>/ {allTasks.length} tâches</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#166534', fontWeight: 600 }}>
            {inProgressTasks} tâche(s) en cours de finalisation
          </div>
        </div>

        {/* KPI 4 : Livrables Design & Spécifications */}
        <div style={{ background: '#ffffff', padding: '22px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Livrables Design & IA
            </span>
            <Layers size={18} color="#6366f1" />
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0f172a', margin: '10px 0 2px' }}>
            {totalDeliverables} <span style={{ fontSize: '1rem', fontWeight: 500, color: '#94a3b8' }}>actifs</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#475569' }}>
            Figma Tokens, Specs Dev & User Journeys
          </div>
        </div>

      </div>

      {/* TABLEAU RICHE DES PROJETS ET LEURS TÂCHES ASSOCIÉES */}
      <div style={{ background: '#ffffff', borderRadius: '18px', border: '1px solid #e2e8f0', padding: '28px 32px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        <div style={{ marginBottom: '22px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Détail des Chantiers & Matrice des Tâches
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '0.84rem', color: '#64748b' }}>
            Avancement étape par étape, priorités et livrables opérationnels rattachés à chaque initiative
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {projects.map((proj) => {
            const isExpanded = !!expandedProjects[proj.id];
            const tasks = proj.tasks || [];

            return (
              <div 
                key={proj.id}
                style={{
                  borderRadius: '14px',
                  border: '1px solid #e2e8f0',
                  background: '#ffffff',
                  overflow: 'hidden'
                }}
              >
                {/* Project Header Row */}
                <div 
                  onClick={() => toggleExpand(proj.id)}
                  style={{
                    padding: '18px 22px',
                    background: '#f8fafc',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '14px',
                    borderBottom: isExpanded ? '1px solid #e2e8f0' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: '300px' }}>
                    <button
                      type="button"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        color: '#64748b'
                      }}
                    >
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                          {proj.title}
                        </h3>
                        <span style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: 'rgba(0, 98, 83, 0.08)',
                          color: '#006253'
                        }}>
                          {proj.category}
                        </span>
                      </div>
                      <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                        {proj.desc}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    {/* Progress */}
                    <div style={{ width: '130px', textAlign: 'right' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#006253', marginBottom: '4px' }}>
                        {proj.progress}% complété
                      </div>
                      <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${proj.progress}%`, height: '100%', background: '#006253', borderRadius: '3px' }} />
                      </div>
                    </div>

                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '8px',
                      background: proj.status === 'En test' ? '#dbeafe' : '#dcfce7',
                      color: proj.status === 'En test' ? '#1e40af' : '#166534'
                    }}>
                      {proj.status}
                    </span>
                  </div>
                </div>

                {/* Sub-table: Tasks of the Project */}
                {isExpanded && (
                  <div style={{ padding: '8px 22px 18px', overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <th style={{ padding: '10px 12px', color: '#64748b', fontWeight: 700, fontSize: '0.74rem', textTransform: 'uppercase' }}>Tâche / Étape</th>
                          <th style={{ padding: '10px 12px', color: '#64748b', fontWeight: 700, fontSize: '0.74rem', textTransform: 'uppercase' }}>Priorité</th>
                          <th style={{ padding: '10px 12px', color: '#64748b', fontWeight: 700, fontSize: '0.74rem', textTransform: 'uppercase' }}>Livrable Product Design</th>
                          <th style={{ padding: '10px 12px', color: '#64748b', fontWeight: 700, fontSize: '0.74rem', textTransform: 'uppercase', textAlign: 'right' }}>Statut</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tasks.map(task => {
                          const isDone = task.status === 'Terminé';
                          const isProgress = task.status === 'En cours' || task.status === 'En revue';
                          return (
                            <tr key={task.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                              <td style={{ padding: '10px 12px', fontWeight: 600, color: '#1e293b' }}>
                                {task.title}
                              </td>
                              <td style={{ padding: '10px 12px' }}>
                                <span style={{
                                  fontSize: '0.72rem',
                                  fontWeight: 600,
                                  color: task.priority === 'Haute' ? '#b91c1c' : '#475569'
                                }}>
                                  {task.priority === 'Haute' ? '🔴 Haute' : '🟡 Moyenne'}
                                </span>
                              </td>
                              <td style={{ padding: '10px 12px', color: '#006253', fontWeight: 600 }}>
                                📁 {task.deliverable || "Livrable Figma"}
                              </td>
                              <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                                <span style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  padding: '3px 8px',
                                  borderRadius: '6px',
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  background: isDone ? '#dcfce7' : (isProgress ? '#fef3c7' : '#f1f5f9'),
                                  color: isDone ? '#166534' : (isProgress ? '#92400e' : '#475569')
                                }}>
                                  {isDone && <CheckCircle2 size={12} />}
                                  {isProgress && <Clock size={12} />}
                                  {task.status}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}