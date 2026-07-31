import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, ExternalLink, ArrowRight, RotateCcw, Bot, Maximize2, Minimize2, Cpu, Award, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { queryM84Chatbot, getQuotaInfo, setDevModeOverride } from '../utils/firebaseAi';
import { findBestMatch } from '../utils/chatbotEngine';
import { db } from '../utils/firebaseConfig';

const AVATAR_URL = '/assets/m84-avatar.webp';
const MAX_CHAR_LIMIT = 200;

const CharacterCountRing = ({ length }) => {
  if (length === 0) return null;
  const radius = 8;
  const circumference = 2 * Math.PI * radius;
  const ratio = Math.min(length / MAX_CHAR_LIMIT, 1);
  const strokeDashoffset = circumference * (1 - ratio);

  let color = 'var(--color-electric-green, #006253)';
  if (ratio >= 0.9) {
    color = '#EF4444';
  } else if (ratio >= 0.75) {
    color = '#F59E0B';
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '4px', flexShrink: 0 }}>
      <svg width="20" height="20" viewBox="0 0 20 20">
        <circle
          cx="10"
          cy="10"
          r={radius}
          fill="none"
          stroke="#EAEAEA"
          strokeWidth="2.5"
        />
        <circle
          cx="10"
          cy="10"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 10 10)"
          style={{ transition: 'stroke-dashoffset 0.15s ease, stroke 0.2s ease' }}
        />
      </svg>
    </div>
  );
};

const DEFAULT_WEBHOOK_URL = import.meta.env.VITE_GOOGLE_SHEET_WEBHOOK_URL || 'https://script.google.com/macros/s/AKfycbwmTBJNJpOTMdAtVqaPo1qE3vvxoQ9xSI39sRac8J9kYcyPf-zK4tIP4qs4gn6FFWYPpg/exec';

const ChatWidget = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 768);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showProactivePrompt, setShowProactivePrompt] = useState(false);
  const [proactiveDismissed, setProactiveDismissed] = useState(false);
  const [dragConstraints, setDragConstraints] = useState({ left: -250, right: 0, top: -500, bottom: 0 });

  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [quotaState, setQuotaState] = useState(() => getQuotaInfo());

  useEffect(() => {
    const updateBounds = () => {
      if (typeof window !== 'undefined') {
        const fabWidth = 56;
        const marginX = 16;
        const marginY = 80;
        setDragConstraints({
          left: -(window.innerWidth - fabWidth - marginX * 2),
          right: 0,
          top: -(window.innerHeight - fabWidth - marginY - 40),
          bottom: 0,
        });
      }
    };
    updateBounds();
    window.addEventListener('resize', updateBounds);
    return () => window.removeEventListener('resize', updateBounds);
  }, []);

  const getInitialMessage = (currentLang) => ({
    role: 'model',
    text: currentLang === 'en'
      ? "Hello! I am Agent M84, your guide through Ayoub MOSLIH's portfolio. How may I help you explore his services, projects, or expertise?"
      : "Bonjour ! Je suis l'Agent M84, l'assistant virtuel d'Ayoub MOSLIH.\nComment puis-je vous aider aujourd'hui ?",
    ctas: [
      { text: currentLang === 'en' ? "Explore Services" : "Voir ses services", action: "navigate", target: "/about#expertise" },
      { text: currentLang === 'en' ? "View Projects" : "Voir ses projets", action: "navigate", target: "/work" },
      { text: currentLang === 'en' ? "Open CV" : "Ouvrir le CV", action: "external", target: "/cv-ayoub-moslih.pdf/moslihayoub-cv.pdf" }
    ]
  });

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('m84_chat_session');
    if (saved) {
      try {
        const { messages: savedMessages, timestamp } = JSON.parse(saved);
        if (new Date().getTime() - timestamp < 3600000) {
          return savedMessages;
        }
      } catch (e) {
        console.error("Erreur lecture session Agent M84", e);
      }
    }
    return [getInitialMessage(lang)];
  });

  const resetChat = () => {
    setMessages([getInitialMessage(lang)]);
    setLeadState('idle');
    setLeadData({ type: '', name: '', contact: '' });
    localStorage.setItem('m84_chat_session', JSON.stringify({
      messages: [getInitialMessage(lang)],
      timestamp: new Date().getTime()
    }));
  };

  const [input, setInput] = useState('');
  const [leadState, setLeadState] = useState('idle');
  const [leadData, setLeadData] = useState({ type: '', name: '', contact: '' });

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    localStorage.setItem('m84_chat_session', JSON.stringify({
      messages,
      timestamp: new Date().getTime()
    }));
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen && !proactiveDismissed) {
        setShowProactivePrompt(true);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [isOpen, proactiveDismissed]);

  const handleOpenChat = () => {
    setIsOpen(true);
    setShowProactivePrompt(false);
  };

  const handleDismissProactive = (e) => {
    e.stopPropagation();
    setShowProactivePrompt(false);
    setProactiveDismissed(true);
  };

  const logInteractionToSheet = (userQueryText, botAnswerText, category) => {
    if (!DEFAULT_WEBHOOK_URL) return;
    try {
      fetch(DEFAULT_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          timestamp: new Date().toLocaleString(),
          type: 'Agent M84',
          userMessage: userQueryText,
          botAnswer: botAnswerText,
          category: category || 'general',
          language: lang || 'fr'
        }),
        mode: 'no-cors'
      }).catch(err => console.debug('Sheet logging skipped:', err));
    } catch (e) {}
  };

  const startLeadCapture = () => {
    setLeadState('asking_type');
    setMessages(prev => [...prev, {
      role: 'model',
      text: lang === 'en' ? "Great! Are you a Professional or an Individual?" : "Super ! Êtes-vous un Professionnel ou un Particulier ?",
      ctas: [
        { text: lang === 'en' ? "Professional" : "Professionnel", action: "lead_reply", target: "Professionnel" },
        { text: lang === 'en' ? "Individual" : "Particulier", action: "lead_reply", target: "Particulier" }
      ]
    }]);
  };

  const handleLeadCaptureFlow = (answer) => {
    if (leadState === 'asking_type') {
      setLeadData(prev => ({ ...prev, type: answer }));
      setLeadState('asking_name');
      setMessages(prev => [...prev, {
        role: 'model',
        text: lang === 'en' ? "Thank you. What is your name?" : "Merci. Quel est votre nom ?"
      }]);
    } else if (leadState === 'asking_name') {
      setLeadData(prev => ({ ...prev, name: answer }));
      setLeadState('asking_contact');
      setMessages(prev => [...prev, {
        role: 'model',
        text: lang === 'en' ? "Nice to meet you! Please leave your email or phone number." : "Enchanté ! Veuillez laisser votre email ou numéro de téléphone."
      }]);
    } else if (leadState === 'asking_contact') {
      const finalContact = answer;
      setLeadState('idle');
      
      const successText = lang === 'en' 
        ? "Got it! Ayoub will contact you very soon. Have a great day!"
        : "C'est noté ! Ayoub vous recontactera très vite. Excellente journée !";

      setMessages(prev => [...prev, {
        role: 'model',
        text: successText,
        ctas: [
          { text: lang === 'en' ? "Explore Services" : "Voir ses services", action: "navigate", target: "/about#expertise" },
          { text: lang === 'en' ? "View Projects" : "Voir ses projets", action: "navigate", target: "/work" }
        ]
      }]);

      if (DEFAULT_WEBHOOK_URL) {
        try {
          fetch(DEFAULT_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({
              timestamp: new Date().toLocaleString(),
              type: 'LEAD M84',
              userMessage: '*** LEAD CAPTURÉ ***', 
              botAnswer: '*** DONNÉES ENREGISTRÉES ***', 
              category: 'Lead Capture',
              language: lang || 'fr',
              leadName: leadData.name || 'Inconnu',
              leadContact: finalContact,
              leadType: leadData.type || 'Non spécifié'
            }),
            mode: 'no-cors'
          }).catch(err => console.debug('Sheet logging skipped:', err));
        } catch (e) {}
      }

      // Enregistrement du lead dans Firestore
      try {
        if (db) {
          import('firebase/firestore').then(({ addDoc, collection }) => {
            addDoc(collection(db, 'leads'), {
              name: leadData.name || 'Inconnu',
              email: finalContact, // Utilise le contact comme email/tel
              message: `Lead capturé via Chatbot. Type: ${leadData.type || 'Non spécifié'}`,
              status: 'unread',
              createdAt: new Date(),
              source: 'chatbot'
            });
          });
        }
      } catch (firestoreErr) {
        console.error("Erreur Firestore leads:", firestoreErr);
      }

      setLeadData({ type: '', name: '', contact: '' });
    }
  };

  const processQuery = async (userQueryText) => {
    if (!userQueryText || !userQueryText.trim()) return;
    const query = userQueryText.trim();
    
    setMessages(prev => [...prev, { role: 'user', text: query }]);
    setInput('');
    setIsTyping(true);

    try {
      if (leadState !== 'idle') {
        handleLeadCaptureFlow(query);
        return;
      }

      const previousMode = quotaState.mode;
      const match = await queryM84Chatbot(query, messages, lang);
      if (match.quota) {
        setQuotaState(match.quota);
      }
      
      if (match.action === "START_LEAD_CAPTURE") {
        startLeadCapture();
        return;
      }

      const newMessages = [];

      if (previousMode === 'ai' && match.quota && match.quota.mode === 'local' && !match.isTechnicalFallback) {
        newMessages.push({
          role: 'model',
          text: lang === 'en'
            ? "💡 AI Agent credit is temporarily exhausted. It will reset in about 1 hour and full AI mode will automatically return. In the meantime, you are assisted by the Local Agent to continue your digital consultation, discuss your project, or explore collaboration opportunities."
            : "💡 Le crédit de l’agent IA est temporairement épuisé.\nIl se réinitialise dans environ 1 heure et le mode IA complet reviendra automatiquement.\nEn attendant, vous êtes accompagné par l’agent local pour continuer votre consultation digitale, parler de votre projet ou explorer des pistes de collaboration."
        });
      }

      newMessages.push({
        role: 'model',
        text: match.text || (lang === 'en' ? "Here is the requested information:" : "Voici les informations demandées :"),
        ctas: match.ctas || (match.cta ? [match.cta] : []),
        cards: match.cards || [],
        category: match.category
      });

      setMessages(prev => [...prev, ...newMessages]);
      logInteractionToSheet(query, match.text, match.category);
    } catch (error) {
      console.error("Erreur lors du traitement de la requête Agent M84:", error);
      const fallbackLocal = findBestMatch(query, lang);
      const techNotice = lang === 'en'
        ? "⚙️ A temporary technical issue occurred with the AI agent. You have been automatically switched to the Local Agent to continue your consultation.\n\n"
        : "⚙️ Un problème technique temporaire est survenu avec l'agent IA. Vous avez été automatiquement basculé vers l'Agent Local pour continuer votre consultation.\n\n";

      setMessages(prev => [...prev, {
        role: 'model',
        text: techNotice + (fallbackLocal.text || ''),
        ctas: fallbackLocal.ctas || [],
        cards: fallbackLocal.cards || [],
        category: 'local_agent'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    processQuery(input);
  };

  const handleCtaClick = (cta) => {
    if (!cta) return;

    if (cta.action === 'lead_reply') {
      processQuery(cta.target);
      return;
    }

    if (cta.action === 'start_lead_capture') {
      startLeadCapture();
      return;
    }

    logInteractionToSheet(`[Clic CTA] ${cta.text}`, `Action: ${cta.action} -> ${cta.target}`, 'cta_click');

    if (cta.action === 'external' && cta.target) {
      window.open(cta.target, '_blank', 'noopener,noreferrer');
    } else if (cta.action === 'navigate' && cta.target) {
      const [path, hash] = cta.target.split('#');
      navigate(path || '/');
      if (isMobile) setIsOpen(false);
      if (hash) {
        setTimeout(() => {
          const el = document.getElementById(hash);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }
    }
  };

  const toggleDevMode = () => {
    const nextMode = quotaState.mode === 'ai' ? 'local' : 'ai';
    setDevModeOverride(nextMode);
    setQuotaState(getQuotaInfo());
  };

  if (location.pathname.startsWith('/project/')) {
    return null;
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            layout
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{
              ...(isMobile ? { ...styles.chatWindow, ...styles.chatWindowMobile } : styles.chatWindow),
              ...(isMaximized && !isMobile ? { height: '80vh', width: '430px' } : {})
            }}
            className="glass-panel"
          >
            {/* Header Chat */}
            <div style={styles.chatHeader}>
              <div style={styles.chatHeaderTitle}>
                <div style={styles.avatarWrapper}>
                  <img src={AVATAR_URL} alt="Agent M84 Avatar" style={styles.avatarImg} />
                  <div style={styles.onlineBadge} />
                </div>
                <div>
                  <h4 style={styles.botName}>Agent M84</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.70rem',
                      fontWeight: 600,
                      padding: '2px 6px',
                      borderRadius: '10px',
                      backgroundColor: quotaState.mode === 'ai' ? 'var(--color-green-light, #e6efee)' : '#FEF3C7',
                      color: quotaState.mode === 'ai' ? 'var(--color-electric-green, #006253)' : '#D97706'
                    }}>
                      {quotaState.mode === 'ai' ? <Bot size={12} color="var(--color-electric-green, #006253)" /> : <Cpu size={12} color="#D97706" />}
                      {quotaState.mode === 'ai' ? 'Agent IA' : 'Agent Local'}
                    </span>

                    {/* Toggle Switch Visuel réservé aux tests en local (masqué en build prod) */}
                    {import.meta.env.DEV && (
                      <div
                        onClick={toggleDevMode}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          cursor: 'pointer',
                          marginLeft: '4px',
                          padding: '2px 6px',
                          borderRadius: '12px',
                          backgroundColor: '#F3F4F6',
                          border: '1px solid #E5E7EB'
                        }}
                        title="Basculer Mode IA / Mode Local (Dev Only)"
                      >
                        <span style={{ fontSize: '0.62rem', fontWeight: 700, color: quotaState.mode === 'ai' ? 'var(--color-electric-green, #006253)' : '#6B7280' }}>
                          IA
                        </span>
                        <div style={{
                          width: '28px',
                          height: '16px',
                          borderRadius: '10px',
                          backgroundColor: quotaState.mode === 'ai' ? 'var(--color-electric-green, #006253)' : '#9CA3AF',
                          display: 'flex',
                          alignItems: 'center',
                          padding: '2px',
                          transition: 'background-color 0.2s ease',
                          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.15)'
                        }}>
                          <div style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor: '#FFFFFF',
                            transform: quotaState.mode === 'ai' ? 'translateX(12px)' : 'translateX(0px)',
                            transition: 'transform 0.2s ease',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                          }} />
                        </div>
                        <span style={{ fontSize: '0.62rem', fontWeight: 700, color: quotaState.mode === 'local' ? '#D97706' : '#6B7280' }}>
                          Local
                        </span>
                      </div>
                    )}

                    {quotaState.mode === 'ai' && !quotaState.devOverride && (
                      <div style={{ width: '36px', height: '4px', backgroundColor: '#EAEAEA', borderRadius: '2px', overflow: 'hidden' }} title={`Crédits IA: ${quotaState.count}/${quotaState.max}`}>
                        <div style={{
                          width: `${(quotaState.count / quotaState.max) * 100}%`,
                          height: '100%',
                          backgroundColor: quotaState.count >= 4 ? '#F59E0B' : 'var(--color-electric-green, #006253)',
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={resetChat} style={styles.closeBtn} aria-label="Nouveau chat" title="Nouveau chat">
                  <RotateCcw size={16} />
                </button>
                {!isMobile && (
                  <button onClick={() => setIsMaximized(!isMaximized)} style={styles.closeBtn} aria-label="Agrandir/Réduire" title={isMaximized ? "Réduire" : "Agrandir"}>
                    {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                  </button>
                )}
              </div>
            </div>

            {/* Corps de conversation */}
            <div style={styles.chatBody}>
              {messages.map((msg, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div
                    style={{
                      ...styles.messageWrapper,
                      justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                    }}
                  >
                    {msg.role === 'model' && (
                      <img src={AVATAR_URL} alt="Agent M84" style={styles.smallAvatarImg} />
                    )}
                    <div
                      style={{
                        ...styles.messageBubble,
                        backgroundColor: msg.role === 'user' ? 'var(--color-electric-green, #006253)' : 'var(--color-surface, #FFFFFF)',
                        color: msg.role === 'user' ? '#FFFFFF' : 'var(--color-text-primary, #111111)',
                        borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                        border: msg.role === 'model' ? '1px solid var(--color-border, #EAEAEA)' : 'none'
                      }}
                    >
                      {msg.role === 'model' ? (
                        <div style={{ color: 'inherit', fontSize: '0.85rem', lineHeight: '1.6' }}>
                          <ReactMarkdown
                            components={{
                              strong: ({node, ...props}) => <strong style={{ color: 'var(--color-electric-green, #006253)', fontWeight: 600 }} {...props} />,
                              p: ({node, ...props}) => <p style={{ margin: '0 0 6px 0', fontSize: '0.85rem' }} {...props} />,
                              ul: ({node, ...props}) => <ul style={{ margin: '0 0 6px 0', paddingLeft: '18px', fontSize: '0.85rem' }} {...props} />,
                              ol: ({node, ...props}) => <ol style={{ margin: '0 0 6px 0', paddingLeft: '18px', fontSize: '0.85rem' }} {...props} />,
                              li: ({node, ...props}) => <li style={{ margin: '0 0 3px 0', fontSize: '0.85rem' }} {...props} />
                            }}
                          >
                            {msg.text}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        msg.text.split('\n').map((line, lIdx) => (
                          <p
                            key={lIdx}
                            style={{
                              margin: lIdx > 0 ? '3px 0 0 0' : 0,
                              color: msg.role === 'user' ? '#FFFFFF' : 'inherit',
                              fontWeight: msg.role === 'user' ? 500 : 400,
                              fontSize: '0.85rem',
                              lineHeight: '1.5'
                            }}
                          >
                            {line}
                          </p>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Affichage des cartes compactes avec miniature d'image sur la gauche */}
                  {msg.role === 'model' && msg.cards && msg.cards.length > 0 && (
                    <div style={styles.cardsContainer}>
                      {msg.cards.map((card, cIdx) => (
                        <div key={cIdx} style={styles.miniCard}>
                          {card.image ? (
                            <img src={card.image} alt={card.title} style={styles.miniCardThumb} />
                          ) : (
                            <div style={styles.miniCardIconFallback}>
                              {card.type === 'certif' ? <Award size={18} color="var(--color-electric-green, #006253)" /> : <Briefcase size={18} color="var(--color-electric-green, #006253)" />}
                            </div>
                          )}
                          <div style={styles.miniCardContent}>
                            <div style={styles.miniCardHeader}>
                              <span style={styles.miniCardTitle}>{card.title}</span>
                              {card.subtitle && <span style={styles.miniCardBadge}>{card.subtitle}</span>}
                            </div>
                            {card.desc && <p style={styles.miniCardDesc}>{card.desc}</p>}
                            {card.url && (
                              <button
                                onClick={() => handleCtaClick({ text: card.title, action: card.url.startsWith('http') ? 'external' : 'navigate', target: card.url })}
                                style={styles.miniCardAction}
                              >
                                <span>{lang === 'en' ? 'View project' : 'Voir le projet'}</span>
                                <ArrowRight size={12} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Affichage des boutons CTAs multiples */}
                  {msg.role === 'model' && msg.ctas && Array.isArray(msg.ctas) && msg.ctas.length > 0 && (
                    <div style={styles.quickRepliesContainer}>
                      {msg.ctas.map((cta, cIdx) => {
                        if (!cta) return null;
                        const ctaLabel = typeof cta.text === 'object' ? (cta.text[lang] || cta.text.fr || '') : (cta.text || '');
                        if (!ctaLabel) return null;
                        return (
                          <button
                            key={cIdx}
                            onClick={() => handleCtaClick(cta)}
                            style={styles.ctaBtn}
                          >
                            <span>{ctaLabel}</span>
                            {cta.action === 'external' ? (
                              <ExternalLink size={13} color="var(--color-electric-green, #006253)" />
                            ) : (
                              <ArrowRight size={13} color="var(--color-electric-green, #006253)" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <div style={{ ...styles.messageWrapper, justifyContent: 'flex-start' }}>
                    <img src={AVATAR_URL} alt="Agent M84" style={styles.smallAvatarImg} />
                    <div style={{ ...styles.messageBubble, backgroundColor: 'var(--color-surface, #FFFFFF)', color: 'var(--color-text-primary, #111111)', borderRadius: '16px 16px 16px 4px', border: '1px solid var(--color-border, #EAEAEA)', padding: '12px 16px' }}>
                      <motion.div style={{ display: 'flex', gap: '4px' }} initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.2 } } }}>
                        {[0, 1, 2].map((i) => (
                          <motion.div key={i} variants={{ hidden: { y: 0 }, visible: { y: [-2, 2, -2], transition: { repeat: Infinity, duration: 0.6 } } }} style={{ width: '6px', height: '6px', backgroundColor: '#999', borderRadius: '50%' }} />
                        ))}
                      </motion.div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Formulaire de saisie */}
            <form onSubmit={handleSubmit} style={styles.chatFooter}>
              <input
                type="text"
                maxLength={MAX_CHAR_LIMIT}
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, MAX_CHAR_LIMIT))}
                placeholder={lang === 'en' ? 'Ask Agent M84...' : "Posez votre question à l'Agent M84..."}
                style={styles.input}
              />
              <CharacterCountRing length={input.length} />
              <button
                type="submit"
                disabled={!input.trim()}
                style={{
                  ...styles.sendBtn,
                  opacity: input.trim() ? 1 : 0.4,
                  cursor: input.trim() ? 'pointer' : 'default'
                }}
              >
                <Send size={16} color="#FFFFFF" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pop-up proactif 5 sec */}
      <AnimatePresence>
        {!isOpen && showProactivePrompt && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            style={isMobile ? { ...styles.proactiveBubble, ...styles.proactiveBubbleMobile } : styles.proactiveBubble}
            onClick={handleOpenChat}
          >
            <div style={styles.proactiveContent}>
              <span style={{ fontSize: '0.82rem', lineHeight: '1.4', color: '#111111', fontWeight: 500 }}>
                Bonjour ! Je suis votre <strong style={{ color: 'var(--color-electric-green, #006253)' }}>Agent M84</strong>. Comment puis-je vous guider ?
              </span>
            </div>
            <button onClick={handleDismissProactive} style={styles.proactiveCloseBtn} aria-label="Fermer">
              <X size={13} color="#666666" />
            </button>
            <div style={styles.proactiveArrow} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bouton Flottant FAB avec Tooltip - Draggable */}
      <motion.div 
        drag 
        dragConstraints={dragConstraints}
        dragElastic={0.2}
        dragMomentum={true}
        style={isMobile ? { ...styles.fabContainer, ...styles.fabContainerMobile, touchAction: 'none', cursor: 'grab', zIndex: 999999 } : { ...styles.fabContainer, touchAction: 'none', cursor: 'grab', zIndex: 999999 }}
      >
        <AnimatePresence>
          {!isOpen && isHovered && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              style={styles.hoverTooltip}
            >
              <div style={styles.hoverTooltipIconWrapper}>
                <MessageCircle size={13} color="#FFFFFF" />
              </div>
              <span style={styles.hoverTooltipText}>
                {lang === 'en' ? 'Agent M84' : 'Agent M84'}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => {
            if (isOpen) {
              setIsOpen(false);
            } else {
              handleOpenChat();
            }
          }}
          style={styles.fabBtn}
          aria-label="Ouvrir l'Agent M84"
        >
          {isOpen ? (
            <X size={26} color="#FFFFFF" />
          ) : (
            <div style={styles.fabAvatarWrapper}>
              <img src={AVATAR_URL} alt="Agent M84" style={styles.fabAvatarImg} />
            </div>
          )}
        </motion.button>
      </motion.div>
    </>
  );
};

const styles = {
  fabContainer: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  fabContainerMobile: {
    bottom: '80px',
    right: '16px',
  },
  fabBtn: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-electric-green, #006253)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 6px 20px rgba(0, 98, 83, 0.35)',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    cursor: 'pointer',
    outline: 'none',
    transition: 'all 0.3s ease',
  },
  fabAvatarWrapper: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    overflow: 'hidden',
    border: '2px solid #FFFFFF',
  },
  fabAvatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  hoverTooltip: {
    backgroundColor: 'var(--color-electric-green, #006253)',
    color: '#FFFFFF',
    padding: '7px 14px',
    borderRadius: '20px',
    fontSize: '0.84rem',
    fontWeight: 600,
    boxShadow: '0 4px 14px rgba(0, 98, 83, 0.3)',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    whiteSpace: 'nowrap',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  hoverTooltipIconWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hoverTooltipText: {
    fontFamily: 'var(--font-family, sans-serif)',
    color: '#FFFFFF',
  },
  proactiveBubble: {
    position: 'fixed',
    bottom: '90px',
    right: '24px',
    zIndex: 9998,
    backgroundColor: '#FFFFFF',
    border: '1px solid #EAEAEA',
    borderRadius: '14px',
    padding: '12px 34px 12px 14px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
    maxWidth: '280px',
    cursor: 'pointer',
  },
  proactiveBubbleMobile: {
    bottom: '144px',
    right: '16px',
  },
  proactiveContent: {
    display: 'flex',
    alignItems: 'center',
  },
  proactiveCloseBtn: {
    position: 'absolute',
    top: '6px',
    right: '6px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '3px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  proactiveArrow: {
    position: 'absolute',
    bottom: '-7px',
    right: '22px',
    width: '0',
    height: '0',
    borderLeft: '7px solid transparent',
    borderRight: '7px solid transparent',
    borderTop: '7px solid #FFFFFF',
  },
  chatWindow: {
    position: 'fixed',
    bottom: '90px',
    right: '24px',
    width: '350px',
    height: '490px',
    maxHeight: 'calc(100vh - 110px)',
    maxWidth: 'calc(100vw - 32px)',
    backgroundColor: 'var(--color-surface, #FFFFFF)',
    borderRadius: '20px',
    boxShadow: '0 16px 40px rgba(0, 0, 0, 0.12)',
    zIndex: 9998,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    border: '1px solid var(--color-border, #EAEAEA)',
  },
  chatWindowMobile: {
    bottom: '0',
    right: '0',
    width: '100vw',
    height: '100vh',
    maxHeight: '100vh',
    maxWidth: '100vw',
    borderRadius: '0',
    border: 'none',
  },
  chatHeader: {
    padding: '12px 16px',
    borderBottom: '1px solid var(--color-border, #EAEAEA)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'var(--color-surface, #FFFFFF)',
  },
  chatHeaderTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  avatarWrapper: {
    position: 'relative',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    overflow: 'hidden',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: '1px',
    right: '1px',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#22C55E',
    border: '1.5px solid #FFFFFF',
  },
  botName: {
    fontSize: '0.92rem',
    margin: 0,
    fontWeight: 700,
    color: 'var(--color-text-primary, #111111)',
  },
  devToggleBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '3px',
    fontSize: '0.66rem',
    fontWeight: 700,
    padding: '2px 7px',
    borderRadius: '8px',
    backgroundColor: '#EFF6FF',
    border: '1px solid #93C5FD',
    color: '#1D4ED8',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--color-text-secondary, #666666)',
    padding: '4px',
    cursor: 'pointer',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatBody: {
    flex: 1,
    padding: '12px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    backgroundColor: 'var(--color-bg, #FAFAFA)',
  },
  messageWrapper: {
    display: 'flex',
    gap: '8px',
    alignItems: 'flex-start',
  },
  smallAvatarImg: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginTop: '2px',
    flexShrink: 0,
  },
  messageBubble: {
    padding: '8px 12px',
    fontSize: '0.85rem',
    maxWidth: '86%',
    lineHeight: 1.5,
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.03)',
  },
  cardsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginLeft: '32px',
    marginTop: '2px',
  },
  miniCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid var(--color-border, #EAEAEA)',
    borderRadius: '12px',
    padding: '10px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '10px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
  },
  miniCardThumb: {
    width: '56px',
    height: '56px',
    borderRadius: '8px',
    objectFit: 'cover',
    flexShrink: 0,
    border: '1px solid #EAEAEA'
  },
  miniCardIconFallback: {
    width: '56px',
    height: '56px',
    borderRadius: '8px',
    backgroundColor: 'var(--color-green-light, #e6efee)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  miniCardContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    minWidth: 0
  },
  miniCardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '4px',
    flexWrap: 'wrap'
  },
  miniCardTitle: {
    fontSize: '0.82rem',
    fontWeight: 700,
    color: 'var(--color-text-primary, #111111)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  miniCardBadge: {
    fontSize: '0.66rem',
    fontWeight: 600,
    backgroundColor: 'var(--color-green-light, #e6efee)',
    color: 'var(--color-electric-green, #006253)',
    padding: '2px 6px',
    borderRadius: '6px',
    whiteSpace: 'nowrap'
  },
  miniCardDesc: {
    fontSize: '0.74rem',
    color: 'var(--color-text-secondary, #666666)',
    margin: 0,
    lineHeight: 1.35,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  },
  miniCardAction: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    alignSelf: 'flex-start',
    marginTop: '3px',
    backgroundColor: 'transparent',
    border: 'none',
    color: 'var(--color-electric-green, #006253)',
    fontSize: '0.74rem',
    fontWeight: 600,
    cursor: 'pointer',
    padding: 0
  },
  ctaBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: '20px',
    backgroundColor: 'var(--color-green-light, #e6efee)',
    border: '1px solid var(--color-electric-green, #006253)',
    color: 'var(--color-electric-green, #006253)',
    fontSize: '0.76rem',
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0, 98, 83, 0.1)',
    transition: 'all 0.2s ease',
  },
  quickRepliesContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    marginLeft: '32px',
    marginTop: '2px',
  },
  chatFooter: {
    padding: '10px 12px',
    borderTop: '1px solid var(--color-border, #EAEAEA)',
    display: 'flex',
    gap: '8px',
    backgroundColor: 'var(--color-surface, #FFFFFF)',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    border: '1px solid var(--color-border, #EAEAEA)',
    backgroundColor: 'var(--color-bg, #FAFAFA)',
    padding: '8px 14px',
    borderRadius: '20px',
    fontSize: '0.88rem',
    outline: 'none',
    color: 'var(--color-text-primary, #111111)',
    fontFamily: 'inherit',
  },
  sendBtn: {
    backgroundColor: 'var(--color-electric-green, #006253)',
    border: 'none',
    borderRadius: '50%',
    width: '34px',
    height: '34px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  }
};

export default ChatWidget;
