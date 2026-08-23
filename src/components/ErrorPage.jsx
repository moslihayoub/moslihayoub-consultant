import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Home, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const ErrorPage = ({ 
  code, 
  title, // Fallback if no translation
  description, // Fallback if no translation
  lottieUrl, 
  ctaText, // Fallback if no translation
  ctaAction, 
  ctaIcon = 'home' 
}) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  // Traductions automatiques basées sur le code d'erreur
  const displayTitle = t(`error_${code === 'OFFLINE' ? 'offline' : code}_title`) !== `error_${code === 'OFFLINE' ? 'offline' : code}_title` ? t(`error_${code === 'OFFLINE' ? 'offline' : code}_title`) : title;
  const displayDesc = t(`error_${code === 'OFFLINE' ? 'offline' : code}_desc`) !== `error_${code === 'OFFLINE' ? 'offline' : code}_desc` ? t(`error_${code === 'OFFLINE' ? 'offline' : code}_desc`) : description;
  const displayCta = t(`error_${code === 'OFFLINE' ? 'offline' : code}_cta`) !== `error_${code === 'OFFLINE' ? 'offline' : code}_cta` ? t(`error_${code === 'OFFLINE' ? 'offline' : code}_cta`) : ctaText;

  const [animationData, setAnimationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const showLottie = false; // "desactiver la partie animation la hider"

  useEffect(() => {
    if (!showLottie) return;
    // Tentative de chargement du fichier JSON Lottie depuis le dossier public
    if (lottieUrl) {
      fetch(lottieUrl)
        .then(response => {
          if (!response.ok) throw new Error("Fichier introuvable");
          return response.json();
        })
        .then(data => {
          setAnimationData(data);
          setLoading(false);
        })
        .catch(err => {
          console.warn(`Animation Lottie non trouvée : ${lottieUrl}`);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [lottieUrl, showLottie]);

  const handleAction = () => {
    if (ctaAction === 'back') {
      navigate(-1);
    } else if (ctaAction === 'home') {
      navigate('/');
    } else if (ctaAction === 'reload') {
      window.location.reload();
    } else if (ctaAction === 'dashboard') {
      navigate('/admin/dashboard');
    } else if (typeof ctaAction === 'function') {
      ctaAction();
    }
  };

  const getIcon = () => {
    switch (ctaIcon) {
      case 'back': return <ArrowLeft size={18} />;
      case 'reload': return <RefreshCw size={18} />;
      case 'dashboard': return <ShieldAlert size={18} />;
      case 'home':
      default: return <Home size={18} />;
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh', 
      background: '#ffffff',
      padding: '24px',
      textAlign: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      
      {/* Container Lottie (Caché temporairement selon la demande) */}
      {showLottie && (
        <div style={{ width: '100%', maxWidth: '400px', height: '350px', marginBottom: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {animationData ? (
            <Lottie animationData={animationData} loop={true} style={{ width: '100%', height: '100%' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', background: '#f8fafc', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '14px', border: '2px dashed #cbd5e1', padding: '24px' }}>
              <span style={{ fontSize: '32px', fontWeight: '800', color: '#cbd5e1', marginBottom: '8px' }}>{code}</span>
              <span>Animation Lottie requise</span>
              <span style={{ fontSize: '11px', marginTop: '8px', opacity: 0.7 }}>
                Téléchargez le fichier JSON et placez-le dans :<br/>
                <code>public{lottieUrl}</code>
              </span>
            </div>
          )}
        </div>
      )}

      {/* Ajout du code d'erreur textuel en haut quand Lottie est caché */}
      {!showLottie && code && (
        <div style={{ 
          fontSize: '5.5rem', 
          fontWeight: '900', 
          color: 'rgba(0, 98, 83, 0.18)', 
          marginBottom: '16px',
          letterSpacing: '-2px',
          lineHeight: '1',
          textShadow: '0 4px 20px rgba(0, 98, 83, 0.08)'
        }}>
          {code}
        </div>
      )}

      <h1 style={{ 
        fontSize: '2rem', 
        fontWeight: '700', 
        color: '#0f172a', 
        marginBottom: '16px',
        letterSpacing: '-0.5px'
      }}>
        {displayTitle}
      </h1>

      <p style={{ 
        fontSize: '1rem', 
        color: '#64748b', 
        maxWidth: '500px', 
        marginBottom: '32px',
        lineHeight: '1.6'
      }}>
        {displayDesc}
      </p>

      <button 
        onClick={handleAction}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 24px',
          background: '#006253', // Vert OCP par défaut
          color: 'white',
          border: 'none',
          borderRadius: '50px',
          fontSize: '15px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: '0 4px 6px -1px rgba(0, 98, 83, 0.2)'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = '#004f42';
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 12px -2px rgba(0, 98, 83, 0.3)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = '#006253';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 98, 83, 0.2)';
        }}
      >
        {getIcon()}
        {displayCta}
      </button>

    </div>
  );
};

export default ErrorPage;
