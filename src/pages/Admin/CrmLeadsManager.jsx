import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../utils/firebaseConfig';
import { Mail, Clock, CheckCircle2, Trash2, Search, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import ExportButton from './ExportButton';

const CrmLeadsManager = () => {
  const [leads, setLeads] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState(''); // 'read' or 'unread'
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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
        const dateA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt || 0);
        const dateB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt || 0);
        return dateB - dateA;
      });
      setLeads(leadsData);
      setLoading(false);
    }, (error) => {
      console.error("Erreur lecture leads:", error);
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
  }, [search, filterStatus]);

  const toggleStatus = async (lead) => {
    try {
      const leadRef = doc(db, 'leads', lead.id);
      await updateDoc(leadRef, {
        status: lead.status === 'read' ? 'unread' : 'read'
      });
    } catch (error) {
      console.error("Erreur de mise à jour:", error);
      alert("Impossible de mettre à jour le statut.");
    }
  };

  const deleteLead = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce message ?")) {
      try {
        await deleteDoc(doc(db, 'leads', id));
      } catch (error) {
        console.error("Erreur de suppression:", error);
        alert("Impossible de supprimer le message.");
      }
    }
  };

  const filteredLeads = leads.filter(l => {
    const matchesSearch = l.name?.toLowerCase().includes(search.toLowerCase()) || 
                          l.email?.toLowerCase().includes(search.toLowerCase()) ||
                          l.message?.toLowerCase().includes(search.toLowerCase());
    
    let matchesStatus = true;
    if (filterStatus === 'read') matchesStatus = l.status === 'read';
    if (filterStatus === 'unread') matchesStatus = l.status !== 'read';

    return matchesSearch && matchesStatus;
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

  return (
    <div style={{ background: 'white', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
      <style>{`
        @media (max-width: 768px) {
          .lead-card { flex-direction: column !important; padding: 16px !important; }
          .lead-actions { border-left: none !important; border-top: 1px solid #e2e8f0 !important; padding-left: 0 !important; padding-top: 16px !important; margin-top: 16px !important; width: 100% !important; justify-content: flex-end !important; }
          .lead-header { flex-direction: column !important; align-items: flex-start !important; gap: 8px !important; }
        }
      `}</style>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ margin: '0 0 4px 0', fontSize: '20px' }}>CRM Leads</h2>
            <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>Messages du chatbot/formulaire.</p>
          </div>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              type="text" 
              placeholder="Rechercher..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '220px', padding: '8px 10px 8px 40px', border: '1px solid #e2e8f0', borderRadius: '8px', boxSizing: 'border-box', outline: 'none', fontSize: '14px' }}
            />
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ padding: '8px', border: '1px solid #e2e8f0', borderRadius: '8px', outline: 'none', background: 'white', color: '#64748b', fontSize: '14px' }}>
            <option value="">Tous les statuts</option>
            <option value="unread">Non lus</option>
            <option value="read">Lus</option>
          </select>

          <ExportButton 
            data={filteredLeads} 
            filename="M84_Leads_CRM" 
            columns={[
              { header: 'Date', key: 'createdAt.seconds' },
              { header: 'Nom', key: 'name' },
              { header: 'Email', key: 'email' },
              { header: 'Téléphone', key: 'phone' },
              { header: 'Message', key: 'message' },
              { header: 'Statut', key: 'status' }
            ]} 
          />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Chargement des messages...</div>
      ) : filteredLeads.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', background: '#f8fafc', borderRadius: '8px', color: '#64748b' }}>
          <Mail size={48} style={{ margin: '0 auto 16px auto', opacity: 0.5 }} />
          <p>Aucun message trouvé.</p>
        </div>
      ) : (
        <div style={{ maxHeight: '55vh', overflowY: 'auto', paddingRight: '8px' }}>
          <div style={{ display: 'grid', gap: '16px' }}>
            {currentLeads.map((lead) => (
              <div key={lead.id} className="lead-card" style={{ display: 'flex', gap: '20px', padding: '24px', border: '1px solid #e2e8f0', borderRadius: '12px', background: lead.status === 'read' ? '#f8fafc' : 'white', transition: 'all 0.2s', position: 'relative', overflow: 'hidden' }}>
                {lead.status !== 'read' && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: '#38bdf8' }}></div>}
                
                <div style={{ flex: 1 }}>
                  <div className="lead-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: lead.status === 'read' ? '500' : '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        {lead.name || 'Anonyme'}
                        {lead.source === 'chatbot' ? (
                          <span style={{ fontSize: '11px', padding: '2px 8px', background: '#ede9fe', color: '#8b5cf6', borderRadius: '12px', fontWeight: '600' }}>Chatbot</span>
                        ) : (
                          <span style={{ fontSize: '11px', padding: '2px 8px', background: '#e0f2fe', color: '#0284c7', borderRadius: '12px', fontWeight: '600' }}>Contact Form</span>
                        )}
                      </h3>
                      <a href={`mailto:${lead.email}`} style={{ color: '#64748b', fontSize: '14px', textDecoration: 'none' }}>{lead.email}</a>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '12px' }}>
                      <Clock size={14} /> {formatDate(lead.createdAt)}
                    </div>
                  </div>
                  <div style={{ background: lead.status === 'read' ? 'transparent' : '#f8fafc', padding: lead.status === 'read' ? '0' : '12px', borderRadius: '8px', color: '#334155', fontSize: '14px', lineHeight: '1.6' }}>
                    {lead.message}
                  </div>
                </div>
                
                <div className="dropdown-container lead-actions" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderLeft: '1px solid #e2e8f0', paddingLeft: '20px', minWidth: '60px' }}>
                  <button 
                    onClick={() => setOpenDropdownId(openDropdownId === lead.id ? null : lead.id)}
                    style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '8px', borderRadius: '50%', transition: 'background 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <MoreVertical size={20} />
                  </button>
                  {openDropdownId === lead.id && (
                    <div style={{ position: 'absolute', right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: '8px', background: 'white', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', zIndex: 10, minWidth: '180px', padding: '4px' }}>
                      <button onClick={() => { toggleStatus(lead); setOpenDropdownId(null); }} style={{ width: '100%', padding: '8px 12px', background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#0f172a', boxSizing: 'border-box', borderRadius: '4px' }} onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                        <CheckCircle2 size={16} /> {lead.status === 'read' ? 'Marquer non lu' : 'Marquer comme lu'}
                      </button>
                      <button onClick={() => { deleteLead(lead.id); setOpenDropdownId(null); }} style={{ width: '100%', padding: '8px 12px', background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#ef4444', boxSizing: 'border-box', borderRadius: '4px' }} onMouseEnter={(e) => e.currentTarget.style.background = '#fef2f2'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                        <Trash2 size={16} /> Supprimer
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
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

    </div>
  );
};

export default CrmLeadsManager;
