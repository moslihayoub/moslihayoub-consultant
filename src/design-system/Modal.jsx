import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = '550px',
  showCloseButton = true
}) => {
  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.55)',
              backdropFilter: 'blur(6px)'
            }}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth,
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              background: 'var(--m84-surface)',
              borderRadius: 'var(--m84-radius-xl)',
              border: '1.5px solid var(--m84-border-subtle)',
              boxShadow: 'var(--m84-shadow-xl)',
              overflow: 'hidden',
              fontFamily: 'var(--m84-font-family)',
              zIndex: 10
            }}
          >
            {/* Modal Header */}
            {(title || showCloseButton) && (
              <div
                style={{
                  padding: '20px 24px',
                  borderBottom: '1px solid var(--m84-border-subtle)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '16px'
                }}
              >
                <div>
                  {title && (
                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: 'var(--m84-text-primary)' }}>
                      {title}
                    </h3>
                  )}
                  {subtitle && (
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--m84-text-secondary)' }}>
                      {subtitle}
                    </p>
                  )}
                </div>

                {showCloseButton && (
                  <button
                    onClick={onClose}
                    aria-label="Fermer"
                    style={{
                      background: 'var(--m84-surface-subtle)',
                      border: 'none',
                      borderRadius: 'var(--m84-radius-sm)',
                      padding: '6px',
                      color: 'var(--m84-text-secondary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.15s'
                    }}
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            )}

            {/* Modal Body */}
            <div
              style={{
                padding: '24px',
                overflowY: 'auto',
                flex: 1
              }}
              className="m84-scrollbar"
            >
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const Drawer = ({
  isOpen,
  onClose,
  title,
  children
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1100, display: 'flex', justifyContent: 'flex-end' }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.5)',
              backdropFilter: 'blur(4px)'
            }}
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '480px',
              height: '100%',
              background: 'var(--m84-surface)',
              borderLeft: '1.5px solid var(--m84-border-subtle)',
              boxShadow: 'var(--m84-shadow-xl)',
              display: 'flex',
              flexDirection: 'column',
              fontFamily: 'var(--m84-font-family)',
              zIndex: 10
            }}
          >
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid var(--m84-border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: 'var(--m84-text-primary)' }}>
                {title}
              </h3>
              <button
                onClick={onClose}
                aria-label="Fermer"
                style={{
                  background: 'var(--m84-surface-subtle)',
                  border: 'none',
                  borderRadius: 'var(--m84-radius-sm)',
                  padding: '6px',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }} className="m84-scrollbar">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
