import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  FolderKanban, CheckCircle2, Clock, 
  ChevronDown, ChevronUp, Layers, CheckSquare,
  LayoutList, Columns, FileText
} from 'lucide-react';
import { getProjectsByMission } from '../../services/clientPortalService';

export default function PortalProjects() {
  const { mission } = useOutletContext();
  const missionId = mission?.id || 'mission-cam-2026';
  const projects = getProjectsByMission(missionId) || [];
  
  // View mode: 'table' | 'kanban'
  const [viewMode, setViewMode] = useState('table');
  
  // Accordion state: by default first project is open, others collapsed
  const [expandedProjects, setExpandedProjects] = useState(() => ({
    [projects[0]?.id || 'proj-1']: true
  }));

  const toggleExpand = (id) => {
    setExpandedProjects(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Compute 4 Rich KPIs
  const totalProjects = projects.length;
  const avgProgress = totalProjects > 0 ? Math.round(projects.reduce((acc, p) => acc + (p.progress || 0), 0) / totalProjects) : 0;
  
  const allTasks = projects.flatMap(p => (p.tasks || []).map(t => ({
    ...t,
    projectTag: p.tag || 'PROJET',
    projectTitle: p.title
  })));
  const completedTasks = allTasks.filter(t => t.status === 'Terminé').length;
  const inProgressTasks = allTasks.filter(t => t.status === 'En cours' || t.status === 'En revue').length;
  const totalDeliverables = allTasks.filter(t => t.deliverable).length;

  // Kanban columns mapping
  const kanbanColumns = [
    { id: 'todo', label: 'À faire', count: allTasks.filter(t => t.status === 'À faire').length, tasks: allTasks.filter(t => t.status === 'À faire'), color: '#64748b' },
    { id: 'in_progress', label: 'En cours', count: allTasks.filter(t => t.status === 'En cours').length, tasks: allTasks.filter(t => t.status === 'En cours'), color: '#006253' },
    { id: 'review', label: 'En revue / QA', count: allTasks.filter(t => t.status === 'En revue').length, tasks: allTasks.filter(t => t.status === 'En revue'), color: '#d97706' },
    { id: 'done', label: 'Terminé / Livré', count: allTasks.filter(t => t.status === 'Terminé').length, tasks: allTasks.filter(t => t.status === 'Terminé'), color: '#166534' }
  ];

  const getTagColor = (tag) => {
    switch (tag) {
      case 'OCTROI': return { bg: '#e0f2fe', text: '#0369a1' };
      case 'DESIGN': return { bg: '#fdf4ff', text: '#a21caf' };
      case 'IA': return { bg: '#eef2ff', text: '#4338ca' };
      case 'TRÉSORERIE': return { bg: '#fef3c7', text: '#92400e' };
      case 'AUDIT': return { bg: '#dcfce7', text: '#166534' };
      default: return { bg: 'rgba(0, 98, 83, 0.08)', text: '#006253' };
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Livré': return { bg: '#dcfce7', text: '#166534', border: '#86efac' };
      case 'Terminé': return { bg: '#f1f5f9', text: '#334155', border: '#cbd5e1' };
      case 'En cours': return { bg: '#fef3c7', text: '#92400e', border: '#fde68a' };
      case 'Stand-by': return { bg: '#f3f4f6', text: '#6b7280', border: '#e5e7eb' };
      default: return { bg: '#e0f2fe', text: '#0369a1', border: '#7dd3fc' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px', maxWidth: '1240px', margin: '0 auto' }}>
      
      {/* 1. Header with View Toggle (Vue Tableau vs Vue Kanban Jira) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
            Projets ({totalProjects})
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '0.88rem', color: '#64748b' }}>
            Suivi opérationnel des chantiers Product Design, Design System & IA pour Crédit Agricole du Maroc (Bank-e)
          </p>
        </div>

        {/* View Switcher Button Group */}
        <div style={{
          display: 'inline-flex',
          background: '#e2e8f0',
          padding: '3px',
          borderRadius: '10px'
        }}>
          <button
            onClick={() => setViewMode('table')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '8px',
              border: 'none',
              background: viewMode === 'table' ? '#ffffff' : 'transparent',
              color: viewMode === 'table' ? '#006253' : '#64748b',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              boxShadow: viewMode === 'table' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <LayoutList size={16} /> Vue Tableau
          </button>

          <button
            onClick={() => setViewMode('kanban')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '8px',
              border: 'none',
              background: viewMode === 'kanban' ? '#ffffff' : 'transparent',
              color: viewMode === 'kanban' ? '#006253' : '#64748b',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              boxShadow: viewMode === 'kanban' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Columns size={16} /> Vue Kanban (Jira)
          </button>
        </div>
      </div>

      {/* 2. Top 4 KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        
        {/* KPI 1 : Projets */}
        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Projets de Mission
            </span>
            <FolderKanban size={18} color="#006253" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: '8px 0 2px' }}>
            {totalProjects} <span style={{ fontSize: '1rem', fontWeight: 500, color: '#94a3b8' }}>initiatives</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#006253', fontWeight: 600 }}>
            Banque digitale & IA
          </div>
        </div>

        {/* KPI 2 : Avancement Global */}
        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Avancement Global
            </span>
            <span style={{ padding: '3px 8px', borderRadius: '6px', background: 'rgba(0, 98, 83, 0.1)', color: '#006253', fontSize: '0.74rem', fontWeight: 700 }}>
              Moyenne
            </span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#006253', margin: '8px 0 2px' }}>
            {avgProgress}%
          </div>
          <div style={{ width: '100%', height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden', marginTop: '6px' }}>
            <div style={{ width: `${avgProgress}%`, height: '100%', background: '#006253', borderRadius: '3px' }} />
          </div>
        </div>

        {/* KPI 3 : Tâches Clôturées */}
        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Tâches Clôturées
            </span>
            <CheckSquare size={18} color="#166534" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: '8px 0 2px' }}>
            {completedTasks} <span style={{ fontSize: '1rem', fontWeight: 500, color: '#94a3b8' }}>/ {allTasks.length}</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#166534', fontWeight: 600 }}>
            {inProgressTasks} tâche(s) en cours
          </div>
        </div>

        {/* KPI 4 : Livrables Design */}
        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Livrables Figma & Specs
            </span>
            <Layers size={18} color="#6366f1" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: '8px 0 2px' }}>
            {totalDeliverables} <span style={{ fontSize: '1rem', fontWeight: 500, color: '#94a3b8' }}>actifs</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#475569' }}>
            Figma Tokens & User Flows
          </div>
        </div>

      </div>

      {/* 3. VUE PRINCIPALE : TABLEAU (ACCORDÉON AVEC DÉTAIL AU CLIC) OU KANBAN (JIRA) */}
      {viewMode === 'table' ? (
        
        /* --- MODE VUE TABLEAU (ACCORDÉONS ALIGNÉS) --- */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {projects.map((proj) => {
            const isExpanded = !!expandedProjects[proj.id];
            const tasks = proj.tasks || [];
            const tagStyle = getTagColor(proj.tag);
            const statusBadge = getStatusBadge(proj.status);

            return (
              <div 
                key={proj.id}
                style={{
                  borderRadius: '14px',
                  border: '1px solid #e2e8f0',
                  background: '#ffffff',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.02)',
                  overflow: 'hidden',
                  transition: 'border-color 0.15s ease'
                }}
              >
                {/* Entête de bloc projet (alignement parfait des éléments) */}
                <div 
                  onClick={() => toggleExpand(proj.id)}
                  style={{
                    padding: '16px 20px',
                    background: isExpanded ? '#f8fafc' : '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    borderBottom: isExpanded ? '1px solid #e2e8f0' : 'none'
                  }}
                >
                  {/* Left: Chevron + Tag + Titre */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '320px' }}>
                    <div style={{ color: '#64748b', display: 'flex', alignItems: 'center' }}>
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>

                    {/* Tag short 1 word */}
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: '6px',
                      background: tagStyle.bg,
                      color: tagStyle.text,
                      letterSpacing: '0.04em'
                    }}>
                      [{proj.tag || 'PROJET'}]
                    </span>

                    {/* Titre */}
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>
                        {proj.title}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                        {proj.category}
                      </div>
                    </div>
                  </div>

                  {/* Right: Progress bar + Statut badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    {/* Progress bar */}
                    <div style={{ width: '120px', textAlign: 'right' }}>
                      <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#006253', marginBottom: '3px' }}>
                        {proj.progress}%
                      </div>
                      <div style={{ width: '100%', height: '5px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${proj.progress}%`, height: '100%', background: '#006253', borderRadius: '3px' }} />
                      </div>
                    </div>

                    {/* Statut badge */}
                    <span style={{
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: '6px',
                      background: statusBadge.bg,
                      color: statusBadge.text,
                      border: `1px solid ${statusBadge.border}`,
                      minWidth: '70px',
                      textAlign: 'center'
                    }}>
                      {proj.status}
                    </span>
                  </div>
                </div>

                {/* Détail affiché UNIQUEMENT lorsque le bloc est ouvert */}
                {isExpanded && (
                  <div style={{ padding: '16px 20px 20px', background: '#ffffff' }}>
                    <p style={{ margin: '0 0 16px', fontSize: '0.84rem', color: '#475569', lineHeight: 1.5 }}>
                      {proj.desc}
                    </p>

                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                            <th style={{ padding: '8px 12px', color: '#64748b', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase' }}>Tâche / Étape</th>
                            <th style={{ padding: '8px 12px', color: '#64748b', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase' }}>Priorité</th>
                            <th style={{ padding: '8px 12px', color: '#64748b', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase' }}>Livrable Product Design</th>
                            <th style={{ padding: '8px 12px', color: '#64748b', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', textAlign: 'right' }}>Statut</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tasks.map(task => {
                            const isDone = task.status === 'Terminé';
                            const isProgress = task.status === 'En cours' || task.status === 'En revue';
                            return (
                              <tr key={task.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '10px 12px', fontWeight: 600, color: '#1e293b' }}>
                                  {task.title}
                                </td>
                                <td style={{ padding: '10px 12px' }}>
                                  <span style={{
                                    fontSize: '0.72rem',
                                    fontWeight: 700,
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
                                    padding: '3px 7px',
                                    borderRadius: '5px',
                                    fontSize: '0.72rem',
                                    fontWeight: 700,
                                    background: isDone ? '#dcfce7' : (isProgress ? '#fef3c7' : '#f1f5f9'),
                                    color: isDone ? '#166534' : (isProgress ? '#92400e' : '#475569')
                                  }}>
                                    {isDone && <CheckCircle2 size={11} />}
                                    {isProgress && <Clock size={11} />}
                                    {task.status}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      ) : (
        
        /* --- MODE VUE KANBAN (STYLE JIRA AVEC TAGS 1 MOT) --- */
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          alignItems: 'start'
        }}>
          {kanbanColumns.map(col => (
            <div 
              key={col.id}
              style={{
                background: '#f8fafc',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                minHeight: '480px'
              }}
            >
              {/* Kanban Column Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', borderBottom: '2px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {col.label}
                </span>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '2px 7px',
                  borderRadius: '10px',
                  background: '#e2e8f0',
                  color: '#475569'
                }}>
                  {col.count}
                </span>
              </div>

              {/* Kanban Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {col.tasks.map(task => {
                  const tagStyle = getTagColor(task.projectTag);
                  return (
                    <div
                      key={task.id}
                      style={{
                        background: '#ffffff',
                        borderRadius: '10px',
                        border: '1px solid #cbd5e1',
                        padding: '12px 14px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}
                    >
                      {/* Top: 1-word Project Tag + Priority */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: tagStyle.bg,
                          color: tagStyle.text,
                          letterSpacing: '0.04em'
                        }}>
                          [{task.projectTag}]
                        </span>

                        <span style={{
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          color: task.priority === 'Haute' ? '#b91c1c' : '#64748b'
                        }}>
                          {task.priority === 'Haute' ? '🔴 Haute' : '🟡 Moyenne'}
                        </span>
                      </div>

                      {/* Task title */}
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.35 }}>
                        {task.title}
                      </div>

                      {/* Deliverable badge */}
                      {task.deliverable && (
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.7rem',
                          color: '#006253',
                          fontWeight: 600,
                          background: 'rgba(0, 98, 83, 0.05)',
                          padding: '3px 6px',
                          borderRadius: '4px',
                          marginTop: '2px'
                        }}>
                          <FileText size={11} /> {task.deliverable}
                        </div>
                      )}
                    </div>
                  );
                })}

                {col.tasks.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '24px 10px', color: '#94a3b8', fontSize: '0.78rem' }}>
                    Aucune tâche
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      )}

    </div>
  );
}
