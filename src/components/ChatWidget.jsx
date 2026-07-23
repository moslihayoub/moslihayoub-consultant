import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, ExternalLink, ArrowRight, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { findBestMatch } from '../utils/chatbotEngine';

const AVATAR_URL = '/assets/m84-avatar.jpg';

// URL Google Apps Script Webhook de collecte
const DEFAULT_WEBHOOK_URL = import.meta.env.VITE_GOOGLE_SHEET_WEBHOOK_URL || 'https://script.google.com/macros/s/AKfycbwmTBJNJpOTMdAtVqaPo1qE3vvxoQ9xSI39sRac8J9kYcyPf-zK4tIP4qs4gn6FFWYPpg/exec';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 768);
  const [isHovered, setIsHovered] = useState(false);
  const [showProactivePrompt, setShowProactivePrompt] = useState(false);
  const [proactiveDismissed, setProactiveDismissed] = useState(false);

  const { lang, t } = useLanguage();
  const navigate = useNavigate();

  const getInitialMessage = (currentLang) => ({
    role: 'model',
    text: currentLang === 'en'
      ? "Hello! I am M84, Ayoub MOSLIH's virtual assistant. How can I help you?"
      : "Bonjour ! Je suis M84, l'assistant d'Ayoub MOSLIH. Comment puis-je vous aider ?",
    quickReplies: currentLang === 'en'
      ? ["Services offered", "Recent projects"]
      : ["Quels sont tes services ?", "Voir les projets"]
  });

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('m84_chat_session');
    if (saved) {
      try {
        const { messages: savedMessages, timestamp } = JSON.parse(saved);
        // Expiration de session: 1 heure (3600000 ms)
        if (new Date().getTime() - timestamp < 3600000) {
          return savedMessages;
        }
      } catch (e) {
        console.error("Erreur lecture session M84", e);
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

  // Timer 5 secondes pour le message proactif
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

  // Envoi asynchrone des données vers Google Sheets
  const logInteractionToSheet = (userQueryText, botAnswerText, category) => {
    if (!DEFAULT_WEBHOOK_URL) return;

    try {
      fetch(DEFAULT_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          timestamp: new Date().toLocaleString(),
          type: 'Chatbot M84',
          userMessage: userQueryText,
          botAnswer: botAnswerText,
          category: category || 'general',
          language: lang || 'fr'
        }),
        mode: 'no-cors'
      }).catch(err => console.debug('Sheet logging skipped:', err));
    } catch (e) {
      // Ignorer l'erreur pour ne pas impacter l'expérience utilisateur
    }
  };

  const startLeadCapture = () => {
    setLeadState('asking_type');
    setMessages(prev => [...prev, {
      role: 'model',
      text: lang === 'en' ? "Great! Are you a Professional or an Individual?" : "Super ! Êtes-vous un Professionnel ou un Particulier ?",
      quickReplies: lang === 'en' ? ["Professional", "Individual"] : ["Professionnel", "Particulier"]
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
        text: successText
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
      
      setLeadData({ type: '', name: '', contact: '' });
    }
  };

  const processQuery = (userQueryText) => {
    if (!userQueryText || !userQueryText.trim()) return;
    const query = userQueryText.trim();
    
    setMessages(prev => [...prev, { role: 'user', text: query }]);
    setInput('');

    setTimeout(() => {
      // Si nous sommes dans le flux de capture de leads, on dérive la logique
      if (leadState !== 'idle') {
        handleLeadCaptureFlow(query);
        return;
      }

      // Recherche locale instantanée via chatbotEngine
      const match = findBestMatch(query, lang);
      
      if (match.action === "START_LEAD_CAPTURE") {
        startLeadCapture();
        return;
      }

      setMessages(prev => [
        ...prev,
        {
          role: 'model',
          text: match.text,
          quickReplies: (match.quickReplies || []).slice(0, 2),
          cta: match.cta || null,
          category: match.category
        }
      ]);

      // Collecte discrète en arrière-plan vers Google Sheet
      logInteractionToSheet(query, match.text, match.category);

    }, 120);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    processQuery(input);
  };

  const handleQuickReplyClick = (replyText) => {
    processQuery(replyText);
  };

  const handleCtaClick = (cta) => {
    if (!cta) return;

    logInteractionToSheet(`[Clic CTA] ${cta.text}`, `Navigation/Lien vers ${cta.target}`, 'cta_click');

    if (cta.action === 'external' && cta.target) {
      window.open(cta.target, '_blank', 'noopener,noreferrer');
    } else if (cta.action === 'navigate' && cta.target) {
      const [path, hash] = cta.target.split('#');
      navigate(path || '/');
      if (hash) {
        setTimeout(() => {
          const el = document.getElementById(hash);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={isMobile ? { ...styles.chatWindow, ...styles.chatWindowMobile } : styles.chatWindow}
            className="glass-panel"
          >
            {/* Header Chat */}
            <div style={styles.chatHeader}>
              <div style={styles.chatHeaderTitle}>
                <div style={styles.avatarWrapper}>
                  <img src={AVATAR_URL} alt="M84 Avatar" style={styles.avatarImg} />
                </div>
                <div>
                  <h4 style={styles.botName}>M84</h4>
                  <span style={styles.botStatus}>
                    {lang === 'en' ? 'Consultant Assistant' : 'Assistant Consultant'} • 7/24
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={resetChat} style={styles.closeBtn} aria-label="Nouveau chat" title="Nouveau chat">
                  <RotateCcw size={16} />
                </button>
                <button onClick={() => setIsOpen(false)} style={styles.closeBtn} aria-label="Fermer le chat">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Corps de conversation */}
            <div style={styles.chatBody}>
              {messages.map((msg, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <div
                    style={{
                      ...styles.messageWrapper,
                      justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                    }}
                  >
                    {msg.role === 'model' && (
                      <img src={AVATAR_URL} alt="M84" style={styles.smallAvatarImg} />
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
                      {msg.text.split('\n').map((line, lIdx) => (
                        <p
                          key={lIdx}
                          style={{
                            margin: lIdx > 0 ? '3px 0 0 0' : 0,
                            color: msg.role === 'user' ? '#FFFFFF' : 'inherit',
                            fontWeight: msg.role === 'user' ? 500 : 400
                          }}
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Grouped CTA and Quick Replies for proper wrapping */}
                  {msg.role === 'model' && (msg.cta || (idx === messages.length - 1 && msg.quickReplies?.length > 0)) && (
                    <div style={styles.quickRepliesContainer}>
                      {msg.cta && (
                        <button
                          onClick={() => handleCtaClick(msg.cta)}
                          style={styles.ctaBtn}
                        >
                          <span>{msg.cta.text}</span>
                          {msg.cta.action === 'external' ? (
                            <ExternalLink size={13} color="var(--color-electric-green, #006253)" />
                          ) : (
                            <ArrowRight size={13} color="var(--color-electric-green, #006253)" />
                          )}
                        </button>
                      )}
                      
                      {idx === messages.length - 1 && msg.quickReplies && msg.quickReplies.length > 0 && (
                        msg.quickReplies.slice(0, 3).map((qr, qIdx) => (
                          <button
                            key={qIdx}
                            onClick={() => handleQuickReplyClick(qr)}
                            style={styles.quickReplyChip}
                          >
                            {qr}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Pied de chat / Formulaire */}
            <form onSubmit={handleSubmit} style={styles.chatFooter}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={lang === 'en' ? 'Ask a question...' : 'Posez votre question...'}
                style={styles.input}
              />
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
                Bonjour ! Je suis votre <strong style={{ color: 'var(--color-electric-green, #006253)' }}>M84</strong>. Comment puis-je vous aider ?
              </span>
            </div>
            <button onClick={handleDismissProactive} style={styles.proactiveCloseBtn} aria-label="Fermer">
              <X size={13} color="#666666" />
            </button>
            <div style={styles.proactiveArrow} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bouton Flottant FAB avec Tooltip au survol */}
      <div style={isMobile ? { ...styles.fabContainer, ...styles.fabContainerMobile } : styles.fabContainer}>
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
                {lang === 'en' ? 'Need help ?' : "Besoin d'aide ?"}
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
          aria-label="Ouvrir le chatbot M84"
        >
          {isOpen ? (
            <X size={24} color="#FFF" />
          ) : (
            <div style={styles.fabAvatarWrapper}>
              <img src={AVATAR_URL} alt="M84" style={styles.fabAvatarImg} />
            </div>
          )}
        </motion.button>
      </div>
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

  /* Pop-up proactif 5s */
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

  /* Fenêtre du chat (Compacte: 330px x 460px) */
  chatWindow: {
    position: 'fixed',
    bottom: '90px',
    right: '24px',
    width: '330px',
    height: '460px',
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
    border: 'none',
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
  botStatus: {
    fontSize: '0.85rem',
    color: 'var(--color-electric-green, #006253)',
    fontWeight: 500,
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
    border: '1px solid var(--color-electric-green, #006253)',
    flexShrink: 0,
  },
  messageBubble: {
    padding: '8px 12px',
    fontSize: '0.65rem',
    maxWidth: '84%',
    lineHeight: 1.4,
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.03)',
  },

  /* Style du CTA : Background vert clair, Bordure vert émeraude, Texte vert émeraude */
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
    gap: '5px',
    marginLeft: '32px',
    marginTop: '1px',
  },
  quickReplyChip: {
    backgroundColor: 'var(--color-surface, #FFFFFF)',
    border: '1px solid var(--color-electric-green, #006253)',
    color: 'var(--color-electric-green, #006253)',
    borderRadius: '20px',
    padding: '6px 12px',
    fontSize: '0.76rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
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
    fontSize: '0.96rem',
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
