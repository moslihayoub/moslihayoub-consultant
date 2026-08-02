import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../utils/firebaseConfig';
import { Mail, Clock, CheckCircle2, Trash2, Search, MoreVertical, ChevronLeft, ChevronRight, X, User, Phone, Briefcase, MessageSquare } from 'lucide-react';
import ExportButton from './ExportButton';
import { fallbackLeads } from '../../data/fallbackLeads';

const CrmLeadsManager = () => {
  const [leads, setLeads] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  
  // Filters
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState(''); 
  const [filterStartMonth, setFilterStartMonth] = useState('');
  const [filterEndMonth, setFilterEndMonth] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    if (!db) {
      console.error("Firestore non initialisé");
      setLoading(false);
      return;
    }

    const q = collection(db, 'leads');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const leadsData = [];
      snapshot.forEach((doc) => {
        leadsData.push({ id: doc.id, ...doc.data() });
      });
      // Sort by date descending
      leadsData.sort((a, b) => {
        const dateA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (new Date(a.createdAt).getTime() || 0);
        const dateB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (new Date(b.createdAt).getTime() || 0);
        return dateB - dateA;
      });
      if (leadsData.length === 0) {
        setLeads(fallbackLeads);
      } else {
        setLeads(leadsData);
      }
      setLoading(false);
    }, (error) => {
      console.error("Erreur lecture leads:", error);
      // Fallback CSV Data if Firestore is locked
      setLeads(fallbackLeads);
      setLoading(false);
    });

    return unsubscribe;
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

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterStatus, filterStartMonth, filterEndMonth]);

  const updateLeadStatus = async (leadId, newStatus) => {
    try {
      const leadRef = doc(db, 'leads', leadId);
      await updateDoc(leadRef, {
        status: newStatus
      });
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead({...selectedLead, status: newStatus});
      }
    } catch (error) {
      console.error("Erreur de mise à jour:", error);
      // Fallback update in state if Firebase throws permission error
      setLeads(prev => prev.map(l => l.id === leadId ? {...l, status: newStatus} : l));
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead({...selectedLead, status: newStatus});
      }
    }
  };

  const deleteLead = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce message ?")) {
      try {
        await deleteDoc(doc(db, 'leads', id));
        if (selectedLead && selectedLead.id === id) setSelectedLead(null);
      } catch (error) {
        console.error("Erreur de suppression:", error);
        // Fallback delete
        setLeads(prev => prev.filter(l => l.id !== id));
        if (selectedLead && selectedLead.id === id) setSelectedLead(null);
      }
    }
  };

  const filteredLeads = leads.filter(l => {
    const matchesSearch = l.name?.toLowerCase().includes(search.toLowerCase()) || 
                          l.email?.toLowerCase().includes(search.toLowerCase()) ||
                          l.message?.toLowerCase().includes(search.toLowerCase());
    
    let matchesStatus = true;
    if (filterStatus) {
      matchesStatus = l.status === filterStatus || (filterStatus === 'nouveau' && (!l.status || l.status === 'unread'));
    }
    
    let matchesDate = true;
    if (l.createdAt) {
      const d = l.createdAt?.toMillis ? new Date(l.createdAt.toMillis()) : new Date(l.createdAt);
      if (!isNaN(d.getTime())) {
        if (filterStartMonth) {
          const start = new Date(filterStartMonth + '-01T00:00:00');
          if (d < start) matchesDate = false;
        }
        if (filterEndMonth) {
          const end = new Date(filterEndMonth + '-01T00:00:00');
          end.setMonth(end.getMonth() + 1); // Jusqu'à la fin du mois
          if (d >= end) matchesDate = false;
        }
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const currentLeads = filteredLeads.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Date inconnue';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('fr-FR', { 
      day: '2-digit', month: 'short', year: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
    }).format(date);
  };

  const getStatusBadge = (status) => {
    const s = status || 'nouveau';
    if (s === 'unread' || s === 'nouveau') return <span style={{ padding: '4px 10px', background: '#e0f2fe', color: '#0284c7', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>Nouveau</span>;
    if (s === 'qualifier') return <span style={{ padding: '4px 10px', background: '#dcfce7', color: '#16a34a', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>Qualifié</span>;
    if (s === 'non_aboutie') return <span style={{ padding: '4px 10px', background: '#fee2e2', color: '#dc2626', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>Non abouti</span>;
    return <span style={{ padding: '4px 10px', background: '#f1f5f9', color: '#64748b', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>{s}</span>;
  };

  const renderMessageContent = (messageStr) => {
    if (!messageStr) return null;
    if (messageStr.includes('--- Historique ---')) {
      const parts = messageStr.split('--- Historique ---');
      const intro = parts[0].trim();
      const historyStr = parts[1].trim();
      const lines = historyStr.split('\n');
      
      const bubbles = [];
      let currentRole = null;
      let currentText = [];

      lines.forEach(line => {
        if (line.startsWith('Agent:') || line.startsWith('Visiteur:')) {
          if (currentRole) {
            bubbles.push({ role: currentRole, text: currentText.join('\n') });
          }
          currentRole = line.startsWith('Agent:') ? 'model' : 'user';
          currentText = [line.replace(/^(Agent|Visiteur):\s*/, '')];
        } else {
          if (currentRole) {
            currentText.push(line);
          }
        }
      });
      if (currentRole) {
        bubbles.push({ role: currentRole, text: currentText.join('\n') });
      }

      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {intro && (
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', color: '#334155', fontSize: '14px', fontWeight: '500' }}>
              {intro}
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            {bubbles.map((msg, idx) => (
              <div key={idx} style={{ 
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', 
                background: msg.role === 'user' ? '#006253' : 'white', 
                color: msg.role === 'user' ? 'white' : '#334155', 
                padding: '12px 16px', 
                borderRadius: msg.role === 'user' ? '16px 16px 0 16px' : '16px 16px 16px 0', 
                maxWidth: '85%', 
                fontSize: '14px', 
                lineHeight: '1.5',
                border: msg.role === 'user' ? 'none' : '1px solid #e2e8f0',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}>
                <div style={{ fontSize: '11px', fontWeight: '600', marginBottom: '4px', color: msg.role === 'user' ? '#a7f3d0' : '#94a3b8' }}>
                  {msg.role === 'user' ? 'Visiteur' : 'Agent M84'}
                </div>
                <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', color: '#334155', fontSize: '14px', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
        {messageStr}
      </div>
    );
  };

  return (
    <div className="manager-container" style={{ background: 'white', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        .animated-backdrop { animation: fadeIn 0.3s ease-out; }
        .animated-drawer-right { animation: slideInRight 0.3s ease-out; }
        
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }

        .desktop-table-view { display: block; }
        .mobile-cards-view { display: none; }
        
        .crm-table { width: 100%; border-collapse: collapse; }
        .crm-table th { text-align: left; padding: 16px; border-bottom: 2px solid #f1f5f9; color: #64748b; font-weight: 600; font-size: 13px; text-transform: uppercase; }
        .crm-table td { padding: 16px; border-bottom: 1px solid #f1f5f9; color: #334155; font-size: 14px; vertical-align: middle; }
        .crm-table tr:hover td { background: #f8fafc; cursor: pointer; }
        
        .status-select { padding: 6px 12px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 13px; outline: none; cursor: pointer; background: white; }

        @media (max-width: 768px) {
          .manager-container { padding: 14px !important; margin-bottom: 0 !important; }
          .crm-header-wrapper { gap: 8px !important; }
          .desktop-table-view { display: none; }
          .mobile-cards-view { display: block; }
          
          .filter-drawer { width: 100% !important; animation: slideUp 0.3s ease-out !important; border-radius: 20px 20px 0 0 !important; height: auto !important; position: fixed !important; bottom: 0; top: auto !important; }
          .filter-btn-main { padding: 10px !important; justify-content: center !important; width: 40px; }
          .filter-btn-text { display: none !important; }
          
          .lead-card { flex-direction: column !important; padding: 16px !important; }
          .lead-actions { border-left: none !important; border-top: 1px solid #e2e8f0 !important; padding-left: 0 !important; padding-top: 16px !important; margin-top: 16px !important; width: 100% !important; justify-content: space-between !important; flex-direction: row !important; }
          .lead-header { flex-direction: column !important; align-items: flex-start !important; gap: 8px !important; }
        }
      `}</style>
      
      <div className="crm-header-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: '0 0 4px 0', fontSize: '20px', color: '#006253' }}>CRM Leads</h2>
            <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>Gestion des contacts et prospects.</p>
          </div>
        </div>
        
        <div className="search-filter-row" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              type="text" 
              placeholder="Rechercher..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', padding: '8px 10px 8px 40px', border: '1px solid #e2e8f0', borderRadius: '8px', boxSizing: 'border-box', outline: 'none', fontSize: '14px', height: '40px' }}
            />
          </div>
          <button className="filter-btn-main" onClick={() => setIsMobileFilterOpen(true)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '8px 16px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#0f172a', cursor: 'pointer', fontWeight: '500', height: '40px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
            <span className="filter-btn-text">Filtres</span>
          </button>
          <div className="crm-export-wrapper">
            <ExportButton 
              data={filteredLeads} 
              filename="M84_Leads_CRM" 
              columns={[
                { header: 'Date', key: 'createdAt.seconds' },
                { header: 'Nom', key: 'name' },
                { header: 'Email/Tél', key: 'email' },
                { header: 'Message', key: 'message' },
                { header: 'Statut', key: 'status' }
              ]} 
            />
          </div>
        </div>
      </div>

      {isMobileFilterOpen && (
        <div className="animated-backdrop" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 120, display: 'flex', justifyContent: 'flex-end' }} onClick={() => setIsMobileFilterOpen(false)}>
          <div className="filter-drawer animated-drawer-right" style={{ background: 'white', width: '320px', height: '100%', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '-4px 0 15px rgba(0,0,0,0.1)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
              <h3 style={{ margin: 0, color: '#006253', fontSize: '16px' }}>Filtres</h3>
              <button onClick={() => setIsMobileFilterOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#64748b' }}>Statut du lead</label>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ padding: '10px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', background: 'white', height: '40px', outline: 'none' }}>
                <option value="">Tous les statuts</option>
                <option value="nouveau">Nouveau</option>
                <option value="qualifier">Qualifié</option>
                <option value="non_aboutie">Non abouti</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#64748b' }}>Du (Année-Mois)</label>
              <input 
                type="month" 
                value={filterStartMonth}
                onChange={e => setFilterStartMonth(e.target.value)}
                style={{ padding: '10px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', background: 'white', height: '40px', outline: 'none', fontFamily: 'inherit' }}
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#64748b' }}>Au (Année-Mois)</label>
              <input 
                type="month" 
                value={filterEndMonth}
                onChange={e => setFilterEndMonth(e.target.value)}
                style={{ padding: '10px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', background: 'white', height: '40px', outline: 'none', fontFamily: 'inherit' }}
              />
            </div>
            
            <button 
              onClick={() => {
                setFilterStatus('');
                setFilterStartMonth('');
                setFilterEndMonth('');
              }} 
              style={{ padding: '10px', background: 'transparent', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '8px', fontWeight: '500', cursor: 'pointer', marginTop: '8px' }}
            >
              Réinitialiser les filtres
            </button>

            <button onClick={() => setIsMobileFilterOpen(false)} style={{ marginTop: 'auto', padding: '12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Appliquer</button>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Chargement des leads...</div>
      ) : filteredLeads.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', background: '#f8fafc', borderRadius: '8px', color: '#64748b' }}>
          <Mail size={48} style={{ margin: '0 auto 16px auto', opacity: 0.5 }} />
          <p>Aucun lead trouvé.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          
          {/* Desktop Table View */}
          <div className="desktop-table-view">
            <table className="crm-table">
              <thead>
                <tr>
                  <th style={{ width: '120px' }}>Date</th>
                  <th style={{ width: '180px' }}>Nom</th>
                  <th style={{ width: '180px' }}>Contact</th>
                  <th>Source / Aperçu</th>
                  <th style={{ width: '150px' }}>Statut</th>
                  <th style={{ width: '50px' }}></th>
                </tr>
              </thead>
              <tbody>
                {currentLeads.map((lead) => (
                  <tr key={lead.id} onClick={() => setSelectedLead(lead)}>
                    <td>{formatDate(lead.createdAt).split(',')[0]}</td>
                    <td style={{ fontWeight: '500', color: '#0f172a' }}>{lead.name || 'Anonyme'}</td>
                    <td><span style={{ fontSize: '13px', background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px' }}>{lead.email}</span></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {lead.source === 'chatbot' ? (
                          <span style={{ fontSize: '11px', padding: '2px 8px', background: '#ede9fe', color: '#8b5cf6', borderRadius: '12px', fontWeight: '600' }}>Chatbot</span>
                        ) : (
                          <span style={{ fontSize: '11px', padding: '2px 8px', background: '#e0f2fe', color: '#0284c7', borderRadius: '12px', fontWeight: '600' }}>Form</span>
                        )}
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px', fontSize: '13px', color: '#64748b' }}>
                          {lead.message}
                        </span>
                      </div>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <select 
                        className="status-select"
                        value={lead.status === 'unread' ? 'nouveau' : (lead.status || 'nouveau')}
                        onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                      >
                        <option value="nouveau">Nouveau</option>
                        <option value="qualifier">Qualifié</option>
                        <option value="non_aboutie">Non abouti</option>
                      </select>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => deleteLead(lead.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }} title="Supprimer">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View */}
          <div className="mobile-cards-view">
            <div style={{ display: 'grid', gap: '16px' }}>
              {currentLeads.map((lead) => (
                <div key={lead.id} className="lead-card" onClick={() => setSelectedLead(lead)} style={{ display: 'flex', gap: '20px', padding: '24px', border: '1px solid #e2e8f0', borderRadius: '12px', background: 'white', transition: 'all 0.2s', position: 'relative', overflow: 'hidden', cursor: 'pointer' }}>
                  {(!lead.status || lead.status === 'unread' || lead.status === 'nouveau') && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: '#38bdf8' }}></div>}
                  {lead.status === 'qualifier' && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: '#22c55e' }}></div>}
                  {lead.status === 'non_aboutie' && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: '#ef4444' }}></div>}
                  
                  <div style={{ flex: 1 }}>
                    <div className="lead-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          {lead.name || 'Anonyme'}
                        </h3>
                        <a href={`mailto:${lead.email}`} style={{ color: '#64748b', fontSize: '14px', textDecoration: 'none' }} onClick={e => e.stopPropagation()}>{lead.email}</a>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '12px' }}>
                        <Clock size={14} /> {formatDate(lead.createdAt).split(',')[0]}
                      </div>
                    </div>
                    <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', color: '#334155', fontSize: '13px', lineHeight: '1.5', marginBottom: '12px' }}>
                      <span style={{ fontWeight: '600' }}>Aperçu:</span> {lead.message.substring(0, 60)}...
                    </div>
                    <div className="lead-actions">
                      <select 
                        className="status-select"
                        value={lead.status === 'unread' ? 'nouveau' : (lead.status || 'nouveau')}
                        onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="nouveau">Nouveau</option>
                        <option value="qualifier">Qualifié</option>
                        <option value="non_aboutie">Non abouti</option>
                      </select>
                      <button onClick={(e) => { e.stopPropagation(); deleteLead(lead.id); }} style={{ background: '#fef2f2', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '8px', borderRadius: '8px' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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

      {/* Lead Detail Modal / Slide-over */}
      {selectedLead && (
        <div className="animated-backdrop" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 999, display: 'flex', justifyContent: 'flex-end' }} onClick={() => setSelectedLead(null)}>
          <div className="animated-drawer-right" style={{ background: 'white', width: '100%', maxWidth: '450px', height: '100%', padding: '0', display: 'flex', flexDirection: 'column', boxShadow: '-4px 0 25px rgba(0,0,0,0.1)' }} onClick={e => e.stopPropagation()}>
            
            {/* Header */}
            <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: '#f8fafc' }}>
              <div>
                <h2 style={{ margin: '0 0 8px 0', fontSize: '20px', color: '#0f172a' }}>Détails du Lead</h2>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {getStatusBadge(selectedLead.status)}
                  <span style={{ padding: '4px 10px', background: 'white', border: '1px solid #e2e8f0', color: '#64748b', borderRadius: '12px', fontSize: '12px', fontWeight: '500' }}>
                    {formatDate(selectedLead.createdAt)}
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedLead(null)} style={{ background: 'white', border: '1px solid #e2e8f0', padding: '6px', borderRadius: '8px', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
            </div>
            
            {/* Content */}
            <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Infos */}
              <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Informations</h4>
                <div style={{ display: 'grid', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}><User size={16} /></div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>Nom complet</div>
                      <div style={{ fontSize: '14px', color: '#0f172a', fontWeight: '500' }}>{selectedLead.name || 'Non renseigné'}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}><Phone size={16} /></div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>Contact (Tél/Email)</div>
                      <div style={{ fontSize: '14px', color: '#0f172a', fontWeight: '500' }}>{selectedLead.email || 'Non renseigné'}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}><Briefcase size={16} /></div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>Source</div>
                      <div style={{ fontSize: '14px', color: '#0f172a', fontWeight: '500', textTransform: 'capitalize' }}>{selectedLead.source || 'Formulaire'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message History */}
              <div>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MessageSquare size={16} /> Historique / Message
                </h4>
                
                {renderMessageContent(selectedLead.message)}
              </div>

            </div>

            {/* Footer Actions */}
            <div style={{ padding: '24px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '12px', background: 'white' }}>
              <select 
                value={selectedLead.status === 'unread' ? 'nouveau' : (selectedLead.status || 'nouveau')}
                onChange={(e) => updateLeadStatus(selectedLead.id, e.target.value)}
                style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none', background: '#f8fafc', fontWeight: '500', color: '#0f172a' }}
              >
                <option value="nouveau">Mettre en Nouveau</option>
                <option value="qualifier">Marquer Qualifié</option>
                <option value="non_aboutie">Marquer Non abouti</option>
              </select>
              <button onClick={() => { deleteLead(selectedLead.id); }} style={{ padding: '12px', background: '#fef2f2', color: '#ef4444', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px' }}>
                <Trash2 size={20} />
              </button>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
};

export default CrmLeadsManager;
