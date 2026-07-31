import React, { useState, useEffect } from 'react';
import { projectsData as initialData } from '../../data/projects';
import { Edit2, Trash2, Plus, Save, X, Upload, Search, Folder, Tag, Calendar, Lock, Globe, Image as ImageIcon, Eye, MoreVertical, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../utils/firebaseConfig';
import ExportButton from './ExportButton';

const CATEGORIES = ["UX/UI", "MVP Ai", "Motion Graphics", "AI Filmmaking"];

const ProjectsManager = () => {
  const [projects, setProjects] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    const local = localStorage.getItem('m84_projects_mock');
    if (local) {
      setProjects(JSON.parse(local));
    } else {
      setProjects(initialData);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container') && !event.target.closest('.mobile-drawer')) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterCategory, filterYear, filterStatus]);

  const handleSave = () => {
    let updated;
    if (editingId === 'new') {
      updated = [formData, ...projects];
    } else {
      updated = projects.map(p => p.id === formData.id ? formData : p);
    }
    setProjects(updated);
    localStorage.setItem('m84_projects_mock', JSON.stringify(updated));
    setEditingId(null);
    setFormData(null);
    alert('Projet sauvegardé avec succès ! (Mock LocalStorage, prêt pour Firestore)');
  };

  const handleDelete = (id) => {
    if(window.confirm('Voulez-vous vraiment supprimer ce projet ?')) {
      const updated = projects.filter(p => p.id !== id);
      setProjects(updated);
      localStorage.setItem('m84_projects_mock', JSON.stringify(updated));
    }
  };

  const startEdit = (project) => {
    setEditingId(project.id);
    setFormData({ ...project });
  };

  const startNew = () => {
    setEditingId('new');
    setFormData({
      id: 'nouveau-' + Date.now(),
      title: '',
      client: '',
      category: 'UX/UI',
      year: new Date().getFullYear().toString(),
      shortDesc: { fr: '', en: '' },
      techDesc: { fr: '', en: '' },
      image: '',
      isProtected: false,
      url: ''
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!storage) {
      alert("Erreur: Firebase Storage n'est pas initialisé (vérifiez les clés .env.local).");
      return;
    }

    setUploading(true);
    try {
      const storageRef = ref(storage, `projects/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setFormData({ ...formData, image: downloadURL });
    } catch (error) {
      console.error("Erreur d'upload :", error);
      alert("Erreur lors de l'upload de l'image.");
    } finally {
      setUploading(false);
    }
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.client?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory ? p.category === filterCategory : true;
    const matchesYear = filterYear ? p.year === filterYear : true;
    const matchesStatus = filterStatus === 'private' ? p.isProtected : filterStatus === 'public' ? !p.isProtected : true;
    
    return matchesSearch && matchesCategory && matchesYear && matchesStatus;
  });

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const currentProjects = filteredProjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const yearsAvailable = Array.from(new Set(projects.map(p => p.year))).sort().reverse();

  if (editingId) {
    return (
      <div className="manager-container" style={{ background: 'white', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#10b981' }}>{editingId === 'new' ? 'Nouveau Projet' : 'Éditer Projet'}</h2>
          <button onClick={() => setEditingId(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}><X /></button>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: '#64748b' }}>Titre</label>
            <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: '#64748b' }}>Client</label>
            <input type="text" value={formData.client} onChange={e => setFormData({...formData, client: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: '#64748b' }}>Catégorie</label>
            <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', background: 'white' }}>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: '#64748b' }}>Année</label>
            <input type="text" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px' }} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: '#64748b' }}>Image du projet</label>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <input type="text" value={formData.image} disabled placeholder="L'URL de l'image s'affichera ici..." style={{ flex: 1, padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', background: '#f8fafc', color: '#94a3b8' }} />
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: '#10b981', color: 'white', borderRadius: '8px', cursor: uploading ? 'not-allowed' : 'pointer', fontWeight: '500', opacity: uploading ? 0.7 : 1 }}>
                <Upload size={18} /> {uploading ? 'Envoi...' : 'Uploader'}
                <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} style={{ display: 'none' }} />
              </label>
            </div>
            {formData.image && (
               <div style={{ marginTop: '12px', width: '150px', height: '100px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                 <img src={formData.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
               </div>
            )}
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: '#64748b' }}>Lien du projet (URL)</label>
            <input type="text" value={formData.url || ''} onChange={e => setFormData({...formData, url: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px' }} placeholder="https://..." />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: '#64748b' }}>Description courte (FR)</label>
            <textarea value={formData.shortDesc?.fr || ''} onChange={e => setFormData({...formData, shortDesc: {...formData.shortDesc, fr: e.target.value}})} style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', minHeight: '80px' }} />
          </div>
          <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input type="checkbox" id="protected" checked={formData.isProtected} onChange={e => setFormData({...formData, isProtected: e.target.checked})} />
            <label htmlFor="protected" style={{ fontSize: '14px', color: '#0f172a', fontWeight: '500' }}>Projet confidentiel (protégé par mot de passe)</label>
          </div>
        </div>

        <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button onClick={() => setEditingId(null)} style={{ padding: '10px 20px', border: '1px solid #cbd5e1', background: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>Annuler</button>
          <button onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>
            <Save size={18} /> Sauvegarder
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="manager-container" style={{ background: 'white', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
      <div className="projects-header-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '20px', color: '#006253' }}>Gestion des Projets</h2>
          <div className="desktop-export-add" style={{ display: 'flex', gap: '12px' }}>
            <button className="add-btn-desktop" onClick={startNew} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>
              <Plus size={16} /> Ajouter
            </button>
          </div>
        </div>
        
        <div className="search-filter-row" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              type="text" 
              placeholder="Rechercher..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '8px 10px 8px 40px', border: '1px solid #e2e8f0', borderRadius: '8px', outline: 'none', width: '100%', boxSizing: 'border-box', fontSize: '14px', height: '40px' }}
            />
          </div>
          <button className="filter-btn-main" onClick={() => setIsMobileFilterOpen(true)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '8px 16px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#0f172a', cursor: 'pointer', fontWeight: '500', height: '40px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
            <span className="filter-btn-text">Filtres</span>
          </button>
          <div className="projects-export-wrapper">
            <ExportButton 
              data={filteredProjects} 
              filename="M84_Projets" 
              columns={[
                { header: 'Titre', key: 'title' },
                { header: 'Catégorie', key: 'category' },
                { header: 'Client', key: 'client' },
                { header: 'Année', key: 'year' },
                { header: 'Lien', key: 'link' }
              ]} 
            />
          </div>
        </div>
      </div>

      <button className="add-fab-mobile" onClick={startNew} style={{ display: 'none', position: 'fixed', bottom: '24px', right: '24px', width: '56px', height: '56px', borderRadius: '50%', background: '#10b981', color: 'white', border: 'none', boxShadow: '0 4px 12px rgba(16,185,129,0.4)', zIndex: 90, alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
        <Plus size={24} />
      </button>

      {isMobileFilterOpen && (
        <div className="animated-backdrop" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 120, display: 'flex', justifyContent: 'flex-end' }} onClick={() => setIsMobileFilterOpen(false)}>
          <div className="filter-drawer animated-drawer-right" style={{ background: 'white', width: '320px', height: '100%', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '-4px 0 15px rgba(0,0,0,0.1)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
              <h3 style={{ margin: 0, color: '#006253', fontSize: '16px' }}>Filtres</h3>
              <button onClick={() => setIsMobileFilterOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#64748b' }}>Catégorie</label>
            <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} style={{ padding: '10px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', background: 'white', height: '40px' }}>
              <option value="">Toutes catégories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#64748b' }}>Année</label>
            <select value={filterYear} onChange={e => setFilterYear(e.target.value)} style={{ padding: '10px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', background: 'white', height: '40px' }}>
              <option value="">Toutes années</option>
              {yearsAvailable.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#64748b' }}>Statut</label>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ padding: '10px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', background: 'white', height: '40px' }}>
              <option value="">Tous statuts</option>
              <option value="public">Public</option>
              <option value="private">Privé</option>
            </select>
            <button onClick={() => setIsMobileFilterOpen(false)} style={{ marginTop: 'auto', padding: '12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Appliquer</button>
          </div>
        </div>
      )}

      <style>{`
        .table-scroll-container { overflow-x: auto; border: 1px solid #f1f5f9; border-radius: 8px; }
        
        .animated-backdrop { animation: fadeIn 0.3s ease-out; }
        .animated-drawer-right { animation: slideInRight 0.3s ease-out; }
        
        .custom-tooltip {
          visibility: hidden;
          background-color: #334155;
          color: #fff;
          text-align: left;
          border-radius: 6px;
          padding: 8px 12px;
          position: absolute;
          z-index: 10;
          bottom: 125%;
          left: -10px;
          transform: none;
          opacity: 0;
          transition: opacity 0.2s;
          white-space: normal;
          width: max-content;
          max-width: 200px;
          font-size: 12px;
          font-weight: 500;
          pointer-events: none;
        }
        .custom-tooltip::after {
          content: "";
          position: absolute;
          top: 100%;
          left: 17px;
          border-width: 5px;
          border-style: solid;
          border-color: #334155 transparent transparent transparent;
        }
        .tooltip-container:hover .custom-tooltip {
          visibility: visible;
          opacity: 1;
        }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }

        @media (max-width: 768px) {
          .manager-container { padding: 14px !important; margin-bottom: 0 !important; }
          .filter-drawer { width: 100% !important; animation: slideUp 0.3s ease-out !important; border-radius: 20px 20px 0 0 !important; height: auto !important; position: fixed !important; bottom: 0; top: auto !important; }
          .desktop-export-add { width: auto; margin-top: 0; }
          .desktop-export-add .add-btn-desktop { display: none !important; }
          .add-fab-mobile { display: flex !important; }
          .projects-header-wrapper { gap: 8px !important; }
          .table-scroll-container { max-height: none !important; border: none !important; padding-bottom: 80px; }
          
          .filter-btn-main { padding: 10px !important; }
          .filter-btn-text { display: none !important; }
          
          .responsive-table thead { display: none; }
          .responsive-table, .responsive-table tbody, .responsive-table tr, .responsive-table td { display: block; width: 100%; box-sizing: border-box; }
          .responsive-table tr { margin-bottom: 16px; border: 1px solid #e2e8f0 !important; border-radius: 8px; padding: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); position: relative; background: white; }
          .responsive-table td { display: flex; justify-content: space-between; align-items: center; padding: 8px 0 !important; border: none !important; }
          .responsive-table td::before { content: attr(data-label); font-weight: 600; color: #64748b; font-size: 13px; margin-right: 16px; }
          
          .action-dropdown-menu {
            position: fixed !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            top: auto !important;
            width: 100% !important;
            border-radius: 20px 20px 0 0 !important;
            padding: 24px 16px !important;
            box-shadow: 0 -4px 15px rgba(0,0,0,0.1) !important;
            z-index: 100 !important;
            transform: translateY(0) !important;
            animation: slideUp 0.3s ease-out !important;
          }
          .action-dropdown-backdrop {
            display: block !important;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.5);
            z-index: 99;
            animation: fadeIn 0.3s ease-out;
          }
        }
      `}</style>
      <div className="table-scroll-container">
        <table className="responsive-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', position: 'relative' }}>
          <thead style={{ position: 'sticky', top: 0, background: 'white', zIndex: 5, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
              <th style={{ padding: '16px 8px', color: '#64748b', fontSize: '14px', fontWeight: '600' }}>Projet</th>
              <th style={{ padding: '16px 8px', color: '#64748b', fontSize: '14px', fontWeight: '600' }}>Visuel</th>
              <th style={{ padding: '16px 8px', color: '#64748b', fontSize: '14px', fontWeight: '600' }}>Catégorie</th>
              <th style={{ padding: '16px 8px', color: '#64748b', fontSize: '14px', fontWeight: '600' }}>Année</th>
              <th style={{ padding: '16px 8px', color: '#64748b', fontSize: '14px', fontWeight: '600' }}>Statut</th>
              <th style={{ padding: '16px 8px', textAlign: 'right', color: '#64748b', fontSize: '14px', fontWeight: '600' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentProjects.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td data-label="Projet" style={{ padding: '16px 8px', fontWeight: '500', color: '#0f172a' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Folder size={16} color="#94a3b8" style={{ flexShrink: 0 }} />
                    <div style={{ maxWidth: '120px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {p.title}
                    </div>
                    <div className="tooltip-container" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <Info size={14} color="#10b981" style={{ cursor: 'pointer', flexShrink: 0 }} />
                      <span className="custom-tooltip">{p.title}</span>
                    </div>
                  </div>
                </td>
                <td data-label="Visuel" style={{ padding: '16px 8px' }}>
                  {p.image ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <img src={p.image} alt={p.title} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #e2e8f0' }} />
                    </div>
                  ) : (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#94a3b8', fontSize: '12px' }}><ImageIcon size={14} /> Aucune</span>
                  )}
                </td>
                <td data-label="Catégorie" style={{ padding: '16px 8px', color: '#64748b' }}>
                  <span style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Tag size={12} /> {p.category}
                  </span>
                </td>
                <td data-label="Année" style={{ padding: '16px 8px', color: '#64748b' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} /> {p.year}
                  </div>
                </td>
                <td data-label="Statut" style={{ padding: '16px 8px' }}>
                  {p.isProtected 
                    ? <span style={{ color: '#ef4444', fontSize: '12px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}><Lock size={14} /> Privé</span>
                    : <span style={{ color: '#22c55e', fontSize: '12px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}><Globe size={14} /> Public</span>
                  }
                </td>
                <td className="dropdown-container" data-label="Actions" style={{ padding: '16px 8px', textAlign: 'right', position: 'relative' }}>
                  <button 
                    onClick={() => setOpenDropdownId(openDropdownId === p.id ? null : p.id)}
                    style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}
                  >
                    <MoreVertical size={18} />
                  </button>
                  {openDropdownId === p.id && (
                    <>
                      <div className="action-dropdown-backdrop" onClick={(e) => { e.stopPropagation(); setOpenDropdownId(null); }} style={{ display: 'none' }}></div>
                      <div className="action-dropdown-menu" style={{ position: 'absolute', right: '30px', top: '16px', background: 'white', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', zIndex: 110, minWidth: '120px', padding: '4px', textAlign: 'left' }}>
                        {p.url && (
                          <a href={p.url} target="_blank" rel="noreferrer" onClick={() => setOpenDropdownId(null)} style={{ width: '100%', padding: '12px', background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', color: '#0f172a', textDecoration: 'none', boxSizing: 'border-box' }}>
                            <Eye size={18} /> Voir
                          </a>
                        )}
                        <button onClick={() => { startEdit(p); setOpenDropdownId(null); }} style={{ width: '100%', padding: '12px', background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', color: '#0f172a', boxSizing: 'border-box' }}>
                          <Edit2 size={18} /> Modifier
                        </button>
                        <button onClick={() => { handleDelete(p.id); setOpenDropdownId(null); }} style={{ width: '100%', padding: '12px', background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', color: '#ef4444', boxSizing: 'border-box' }}>
                          <Trash2 size={18} /> Supprimer
                        </button>
                      </div>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {currentProjects.length === 0 && (
              <tr>
                <td colSpan="6" style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>Aucun projet trouvé.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px', marginTop: '24px' }}>
          <span style={{ fontSize: '14px', color: '#64748b' }}>Page {currentPage} sur {totalPages}</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', color: currentPage === 1 ? '#cbd5e1' : '#0f172a' }}
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', color: currentPage === totalPages ? '#cbd5e1' : '#0f172a' }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProjectsManager;
