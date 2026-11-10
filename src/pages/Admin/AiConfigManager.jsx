import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../utils/firebaseConfig';
import { invalidateAgentPromptCache } from '../../utils/firebaseAi';
import { Save, RefreshCcw, Sparkles } from 'lucide-react';
import { Button, Badge } from '../../design-system';

const AiConfigManager = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  const fetchPrompt = async () => {
    setLoading(true);
    // 1. Tenter Supabase
    try {
      const { supabase, isSupabaseConfigured } = await import('../../utils/supabaseClient');
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.from('config').select('system_prompt').eq('id', 'agent').maybeSingle();
        if (!error && data?.system_prompt) {
          setPrompt(data.system_prompt);
          setLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn("Supabase fetch prompt warning:", e);
    }

    // 2. Fallback Firestore
    try {
      if (db) {
        const docRef = doc(db, 'config', 'agent');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPrompt(docSnap.data().systemPrompt || '');
          setLoading(false);
          return;
        }
      }
      setPrompt("Tu es l'assistant IA de Ayoub MOSLIH, un UX/UI Designer. Tu dois répondre de manière professionnelle et créative.");
    } catch (error) {
      console.error("Erreur lecture prompt:", error);
      alert("Erreur lors de la récupération de la configuration.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrompt();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    // 1. Sauvegarder dans Supabase
    try {
      const { supabase, isSupabaseConfigured } = await import('../../utils/supabaseClient');
      if (isSupabaseConfigured && supabase) {
        await supabase.from('config').upsert({
          id: 'agent',
          system_prompt: prompt,
          updated_at: new Date().toISOString()
        });
      }
    } catch (e) {
      console.warn("Supabase save prompt warning:", e);
    }

    // 2. Sauvegarder dans Firestore
    try {
      if (db) {
        const docRef = doc(db, 'config', 'agent');
        await setDoc(docRef, { 
          systemPrompt: prompt,
          updatedAt: new Date()
        }, { merge: true });
      }
      
      invalidateAgentPromptCache();
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
    <div className="ai-container manager-container" style={{ background: 'white', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
      <style>{`
        @media (max-width: 768px) {
          .ai-container { padding: 14px !important; }
          .ai-header-container { flex-wrap: wrap; gap: 12px; }
          .ai-reload-btn span { display: none; }
          .ai-reload-btn { padding: 8px !important; }
          .ai-title-group { flex: 1; }
        }
      `}</style>
      <div className="ai-header-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div className="ai-title-group" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <h2 style={{ margin: 0, fontSize: '20px', color: 'var(--m84-primary)', fontWeight: 700 }}>Configuration Agent IA</h2>
              <Badge variant="ai" icon={<Sparkles size={12} />}>Supabase Sync</Badge>
            </div>
            <p style={{ margin: 0, color: 'var(--m84-text-secondary)', fontSize: '14px' }}>Ces instructions sont injectées dans le contexte du Chatbot M84 (Supabase `config`). Décrivez le rôle, le ton et les priorités de conversion.</p>
          </div>
        </div>
        <Button 
          variant="outline"
          size="sm"
          onClick={fetchPrompt}
          icon={<RefreshCcw size={15} />}
        >
          Recharger
        </Button>
      </div>

      <div style={{ marginBottom: '24px' }}>
        {loading ? (
          <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--m84-surface-subtle)', border: '1px solid var(--m84-border-subtle)', borderRadius: 'var(--m84-radius-md)' }}>
            <span style={{ color: 'var(--m84-text-muted)' }}>Chargement du prompt depuis Supabase...</span>
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
              border: '1.5px solid var(--m84-border-subtle)', 
              borderRadius: 'var(--m84-radius-md)', 
              fontSize: '14px', 
              lineHeight: '1.6',
              fontFamily: 'var(--m84-font-mono, monospace)',
              background: 'var(--m84-surface)',
              color: 'var(--m84-text-primary)',
              boxSizing: 'border-box',
              resize: 'vertical',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => { e.target.style.borderColor = 'var(--m84-primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(0, 98, 83, 0.1)'; }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--m84-border-subtle)'; e.target.style.boxShadow = 'none'; }}
          />
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px' }}>
        {lastSaved && (
          <Badge variant="success">
            ✓ Sauvegardé dans Supabase & Firestore
          </Badge>
        )}
        <Button 
          variant="primary"
          onClick={handleSave}
          disabled={loading || saving}
          isLoading={saving}
          icon={<Save size={18} />}
        >
          Enregistrer la configuration
        </Button>
      </div>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
};

export default AiConfigManager;
