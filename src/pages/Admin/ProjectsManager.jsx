import React, { useState, useEffect } from 'react';
import { projectsData as initialData } from '../../data/projects';
import { Edit2, Trash2, Plus, Save, X, Upload, Search, Folder, Tag, Calendar, Lock, Globe, Image as ImageIcon, Eye, MoreVertical } from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');

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
      if (!event.target.closest('.dropdown-container')) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.client?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (editingId) {
    return (
      <div style={{ background: 'white', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#10b981' }}>{editingId === 'new' ? 'Nouveau Projet' : 'Éditer Projet'}</h2>
          <button onClick={() => setEditingId(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}><X /></button>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
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
    <div style={{ background: 'white', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontSize: '20px' }}>Gestion des Projets</h2>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              type="text" 
              placeholder="Filtrer les projets..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '10px 10px 10px 40px', border: '1px solid #e2e8f0', borderRadius: '8px', outline: 'none', width: '250px' }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
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
            <button onClick={startNew} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
              <Plus size={18} /> Ajouter
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .responsive-table thead { display: none; }
          .responsive-table, .responsive-table tbody, .responsive-table tr, .responsive-table td { display: block; width: 100%; box-sizing: border-box; }
          .responsive-table tr { margin-bottom: 16px; border: 1px solid #e2e8f0 !important; border-radius: 8px; padding: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
          .responsive-table td { display: flex; justify-content: space-between; align-items: center; padding: 8px 0 !important; border: none !important; }
          .responsive-table td::before { content: attr(data-label); font-weight: 600; color: #64748b; font-size: 13px; margin-right: 16px; }
        }
      `}</style>
      <div style={{ overflowX: 'auto' }}>
        <table className="responsive-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
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
            {filteredProjects.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td data-label="Projet" style={{ padding: '16px 8px', fontWeight: '500', color: '#0f172a' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Folder size={16} color="#94a3b8" />
                    {p.title}
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
                    <div style={{ position: 'absolute', right: '30px', top: '16px', background: 'white', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', zIndex: 10, minWidth: '120px', padding: '4px', textAlign: 'left' }}>
                      {p.url && (
                        <a href={p.url} target="_blank" rel="noreferrer" onClick={() => setOpenDropdownId(null)} style={{ width: '100%', padding: '8px 12px', background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#0f172a', textDecoration: 'none', boxSizing: 'border-box' }}>
                          <Eye size={16} /> Voir
                        </a>
                      )}
                      <button onClick={() => { startEdit(p); setOpenDropdownId(null); }} style={{ width: '100%', padding: '8px 12px', background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#0f172a', boxSizing: 'border-box' }}>
                        <Edit2 size={16} /> Modifier
                      </button>
                      <button onClick={() => { handleDelete(p.id); setOpenDropdownId(null); }} style={{ width: '100%', padding: '8px 12px', background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#ef4444', boxSizing: 'border-box' }}>
                        <Trash2 size={16} /> Supprimer
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {filteredProjects.length === 0 && (
              <tr>
                <td colSpan="6" style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>Aucun projet trouvé.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectsManager;
