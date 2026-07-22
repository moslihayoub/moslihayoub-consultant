import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useLanguage } from '../contexts/LanguageContext';

// API Key (Note: In production, this should be an environment variable!)
const API_KEY = "AIzaSyCJ4x4FEe_KPnsqsULXGXrNkQgxP9HwZhw";
const genAI = new GoogleGenerativeAI(API_KEY);

const SYSTEM_INSTRUCTION = `Tu es Moslih84 Assistant AI, un assistant IA exclusif pour le portfolio d'Ayoub MOSLIH. 
Ton rôle est de répondre poliment aux questions des visiteurs concernant les expériences, les projets, et les compétences d'Ayoub.
Ayoub est un Lead Product Designer & AI Product Strategy Manager. Ses meilleurs clients/projets incluent: autocash.ma, CGI, OCP, CDM Bank.
Sois concis, professionnel et poli. Ne réponds à aucune question hors sujet.`;

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', text: "Bonjour ! Je suis Moslih84 Assistant AI. Comment puis-je vous aider à découvrir le portfolio d'Ayoub ?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { t } = useLanguage();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: SYSTEM_INSTRUCTION
      });

      // Prepare history for chat
      const history = messages.slice(1).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

      const chat = model.startChat({ history });
      const result = await chat.sendMessage(userMsg);
      const responseText = result.response.text();

      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'model', text: 'Désolé, je rencontre un problème de connexion. Veuillez réessayer plus tard.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={styles.chatWindow}
            className="glass-panel"
          >
            <div style={styles.chatHeader}>
              <div style={styles.chatHeaderTitle}>
                <div style={styles.avatar}>
                  <Bot size={18} color="var(--color-electric-green)" />
                </div>
                <div>
                  <h4 style={styles.botName}>Moslih84 Assistant AI</h4>
                  <span style={styles.botStatus}>{t('chat_online')}</span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} style={styles.closeBtn} className="hover-trigger">
                <X size={18} />
              </button>
            </div>

            <div style={styles.chatBody}>
              {messages.map((msg, idx) => (
                <div key={idx} style={{
                  ...styles.messageWrapper,
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                }}>
                  {msg.role === 'model' && (
                    <div style={styles.smallAvatar}>
                      <Bot size={12} color="var(--color-electric-green)" />
                    </div>
                  )}
                  <div style={{
                    ...styles.messageBubble,
                    backgroundColor: msg.role === 'user' ? 'var(--color-electric-green)' : 'var(--color-bg)',
                    color: msg.role === 'user' ? '#FFFFFF' : 'var(--color-text-primary)',
                    borderRadius: msg.role === 'user' ? '16px 16px 0px 16px' : '16px 16px 16px 0px',
                  }}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div style={{...styles.messageWrapper, justifyContent: 'flex-start'}}>
                  <div style={styles.smallAvatar}>
                    <Bot size={12} color="var(--color-electric-green)" />
                  </div>
                  <div style={{...styles.messageBubble, backgroundColor: 'var(--color-bg)'}}>
                    <motion.div
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      ...
                    </motion.div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} style={styles.chatFooter}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('chat_placeholder')}
                style={styles.input}
              />
              <button type="submit" disabled={isLoading || !input.trim()} style={styles.sendBtn} className="hover-trigger">
                <Send size={18} color={input.trim() ? "var(--color-electric-green)" : "#ccc"} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        style={styles.fab}
        className="hover-trigger"
      >
        {isOpen ? <X size={24} color="#FFF" /> : <Bot size={24} color="#FFF" />}
      </motion.button>
    </>
  );
};

const styles = {
  fab: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-electric-green)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'var(--shadow-lg)',
    zIndex: 9999,
    cursor: 'none',
  },
  chatWindow: {
    position: 'fixed',
    bottom: '100px',
    right: '24px',
    width: '350px',
    height: '500px',
    maxHeight: 'calc(100vh - 120px)',
    maxWidth: 'calc(100vw - 48px)',
    backgroundColor: 'var(--color-surface)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-lg)',
    zIndex: 9998,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  chatHeader: {
    padding: '16px',
    borderBottom: '1px solid var(--color-border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'var(--color-surface)',
  },
  chatHeaderTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: 'rgba(57, 255, 20, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  botName: {
    fontSize: '0.95rem',
    margin: 0,
    fontWeight: 600,
  },
  botStatus: {
    fontSize: '0.75rem',
    color: 'var(--color-electric-green)',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--color-text-secondary)',
    padding: '4px',
    cursor: 'none',
  },
  chatBody: {
    flex: 1,
    padding: '16px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  messageWrapper: {
    display: 'flex',
    gap: '8px',
    alignItems: 'flex-end',
  },
  smallAvatar: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: 'rgba(57, 255, 20, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  messageBubble: {
    padding: '10px 14px',
    fontSize: '0.9rem',
    maxWidth: '85%',
    lineHeight: 1.4,
  },
  chatFooter: {
    padding: '12px 16px',
    borderTop: '1px solid var(--color-border)',
    display: 'flex',
    gap: '8px',
    backgroundColor: 'var(--color-surface)',
  },
  input: {
    flex: 1,
    border: 'none',
    backgroundColor: 'var(--color-bg)',
    padding: '10px 14px',
    borderRadius: 'var(--radius-full)',
    fontSize: '0.9rem',
    outline: 'none',
    fontFamily: 'var(--font-family)',
    cursor: 'none',
    color: 'var(--color-text-primary)'
  },
  sendBtn: {
    background: 'none',
    border: 'none',
    padding: '8px',
    cursor: 'none',
  }
};

export default ChatWidget;
