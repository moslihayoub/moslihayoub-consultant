import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../utils/firebaseConfig';
import { Save, Bot, RefreshCcw } from 'lucide-react';

const AiConfigManager = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  const fetchPrompt = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'config', 'agent');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPrompt(docSnap.data().systemPrompt || '');
      } else {
        // Default fallback if document doesn't exist
        setPrompt("Tu es l'assistant IA de Ayoub MOSLIH, un UX/UI Designer. Tu dois répondre de manière professionnelle et créative.");
      }
    } catch (error) {
      console.error("Erreur lecture prompt:", error);
      alert("Erreur lors de la récupération de la configuration.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (db) {
      fetchPrompt();
    } else {
      setLoading(false);
    }
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const docRef = doc(db, 'config', 'agent');
      await setDoc(docRef, { 
        systemPrompt: prompt,
        updatedAt: new Date()
      }, { merge: true });
      
      setLastSaved(new Date());
      // Show temporary success feedback
      setTimeout(() => setLastSaved(null), 3000);
    } catch (error) {
      console.error("Erreur sauvegarde prompt:", error);
      alert("Impossible de sauvegarder la configuration.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ background: 'white', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', color: '#8b5cf6' }}>
            <Bot size={24} />
          </div>
          <div>
            <h2 style={{ margin: '0 0 4px 0', fontSize: '20px' }}>Configuration Agent IA</h2>
            <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Personnalisez le comportement du Chatbot M84 sur le site.</p>
          </div>
        </div>
        <button 
          onClick={fetchPrompt}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'transparent', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}
        >
          <RefreshCcw size={16} /> Recharger
        </button>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>
          Prompt Système Principal (Instructions)
        </label>
        <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#64748b' }}>
          Ces instructions seront injectées dans le contexte du Chatbot à chaque interaction. Décrivez précisément le ton, le rôle et les connaissances de l'assistant.
        </p>
        
        {loading ? (
          <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
            <span style={{ color: '#94a3b8' }}>Chargement du prompt...</span>
          </div>
        ) : (
          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Écrivez les consignes de l'assistant ici..."
            style={{ 
              width: '100%', 
              height: '300px', 
              padding: '16px', 
              border: '1px solid #cbd5e1', 
              borderRadius: '12px', 
              fontSize: '14px', 
              lineHeight: '1.6',
              fontFamily: 'monospace',
              background: '#f8fafc',
              color: '#334155',
              boxSizing: 'border-box',
              resize: 'vertical',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
            onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
          />
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px' }}>
        {lastSaved && (
          <span style={{ color: '#10b981', fontSize: '14px', fontWeight: '500', animation: 'fadeIn 0.3s' }}>
            ✓ Configuration sauvegardée avec succès !
          </span>
        )}
        <button 
          onClick={handleSave}
          disabled={loading || saving}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', 
            padding: '12px 24px', 
            background: '#10b981', color: 'white', 
            border: 'none', borderRadius: '8px', 
            cursor: (loading || saving) ? 'not-allowed' : 'pointer', 
            fontWeight: '600',
            opacity: (loading || saving) ? 0.7 : 1,
            transition: 'opacity 0.2s'
          }}
        >
          <Save size={18} /> {saving ? 'Enregistrement...' : 'Enregistrer la configuration'}
        </button>
      </div>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
};

export default AiConfigManager;
