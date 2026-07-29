import React, { useState, useEffect } from 'react';
import { Download, FileText, FileSpreadsheet, ChevronDown } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ExportButton = ({ data, filename, columns }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.export-container')) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExportExcel = () => {
    // Transformer les données pour correspondre aux colonnes
    const formattedData = data.map(item => {
      const row = {};
      columns.forEach(col => {
        // Gérer les valeurs imbriquées (ex: item.status.label)
        const value = col.key.split('.').reduce((obj, key) => (obj && obj[key] !== 'undefined') ? obj[key] : '', item);
        row[col.header] = value || '';
      });
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Données");
    
    const dateStr = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `${filename}_${dateStr}.xlsx`);
    setIsOpen(false);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const dateStr = new Date().toISOString().split('T')[0];

    // Titre
    doc.setFontSize(18);
    doc.text(`Rapport - ${filename}`, 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Généré le : ${new Date().toLocaleDateString('fr-FR')}`, 14, 30);

    // Préparation des colonnes et lignes pour autotable
    const tableColumns = columns.map(col => col.header);
    const tableRows = data.map(item => {
      return columns.map(col => {
        const value = col.key.split('.').reduce((obj, key) => (obj && obj[key] !== 'undefined') ? obj[key] : '', item);
        return value || '';
      });
    });

    doc.autoTable({
      startY: 40,
      head: [tableColumns],
      body: tableRows,
      theme: 'striped',
      headStyles: { fillColor: [16, 185, 129] }, // Vert M84
      styles: { fontSize: 10, cellPadding: 3 },
    });

    doc.save(`${filename}_${dateStr}.pdf`);
    setIsOpen(false);
  };

  return (
    <div className="export-container" style={{ position: 'relative', display: 'inline-block' }}>
      <style>{`
        .export-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 8px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          border: 1px solid #e2e8f0;
          min-width: 200px;
          z-index: 10;
        }
        .export-backdrop { display: none; }
        
        @media (max-width: 768px) {
          .export-backdrop {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.5);
            z-index: 110;
          }
          .export-dropdown {
            position: fixed;
            top: auto;
            bottom: 0;
            left: 0;
            right: 0;
            margin: 0;
            border-radius: 20px 20px 0 0;
            padding: 24px 16px;
            box-shadow: 0 -4px 15px rgba(0,0,0,0.1);
            border: none;
            z-index: 120;
            animation: slideUp 0.3s ease-out;
          }
          .export-dropdown button {
            padding: 16px 12px !important;
            font-size: 16px !important;
            border-bottom: 1px solid #f1f5f9 !important;
          }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '10px 16px',
          background: 'white', color: '#0f172a',
          border: '1px solid #e2e8f0', borderRadius: '8px',
          cursor: 'pointer', fontWeight: '500', fontSize: '14px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          transition: 'all 0.2s',
          height: '40px'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#cbd5e1' }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0' }}
        className="export-btn-main"
      >
        <Download size={18} />
        <span className="export-btn-text">Exporter</span>
        <ChevronDown size={16} color="#64748b" className="export-btn-chevron" />
      </button>

      <style>{`
        @media (max-width: 768px) { 
          .mobile-drawer-handle { display: block !important; }
          .export-btn-main { padding: 10px !important; justify-content: center !important; width: 40px; }
          .export-btn-text { display: none !important; }
          .export-btn-chevron { display: none !important; }
        }
      `}</style>

      {isOpen && (
        <>
          <div className="export-backdrop" onClick={() => setIsOpen(false)}></div>
          <div className="export-dropdown">
            <div style={{ padding: '4px' }}>
              <div className="mobile-drawer-handle" style={{ width: '40px', height: '4px', background: '#e2e8f0', borderRadius: '2px', margin: '0 auto 16px auto', display: 'none' }}></div>
              
              <button 
                onClick={handleExportExcel}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '8px 12px', background: 'transparent', border: 'none',
                  color: '#0f172a', cursor: 'pointer', textAlign: 'left',
                  borderRadius: '4px', fontSize: '14px'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
              >
                <FileSpreadsheet size={16} color="#10b981" />
                Exporter en Excel (.xlsx)
              </button>
              <button 
                onClick={handleExportPDF}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '8px 12px', background: 'transparent', border: 'none',
                  color: '#0f172a', cursor: 'pointer', textAlign: 'left',
                  borderRadius: '4px', fontSize: '14px'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
              >
                <FileText size={16} color="#ef4444" />
                Exporter en PDF
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ExportButton;
