import React, { forwardRef, useState } from 'react';

export const Input = forwardRef(({
  label,
  error,
  helperText,
  icon = null,
  iconPosition = 'left',
  className = '',
  style = {},
  id,
  type = 'text',
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputId = id || (label ? `m84-input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', fontFamily: 'var(--m84-font-family)' }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            color: error ? 'var(--m84-danger)' : 'var(--m84-text-primary)'
          }}
        >
          {label}
        </label>
      )}

      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          borderRadius: 'var(--m84-radius-md)',
          background: 'var(--m84-surface)',
          border: `1.5px solid ${error ? 'var(--m84-danger)' : isFocused ? 'var(--m84-primary)' : 'var(--m84-border-subtle)'}`,
          boxShadow: isFocused ? '0 0 0 3px rgba(0, 98, 83, 0.12)' : 'var(--m84-shadow-sm)',
          transition: 'all var(--m84-transition-base)'
        }}
      >
        {icon && iconPosition === 'left' && (
          <div style={{ paddingLeft: '12px', color: 'var(--m84-text-muted)', display: 'flex', alignItems: 'center' }}>
            {icon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{
            width: '100%',
            padding: icon && iconPosition === 'left' ? '10px 14px 10px 8px' : '10px 14px',
            fontSize: '0.9rem',
            fontFamily: 'var(--m84-font-family)',
            color: 'var(--m84-text-primary)',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            borderRadius: 'var(--m84-radius-md)',
            ...style
          }}
          className={`m84-input ${className}`}
          {...props}
        />

        {icon && iconPosition === 'right' && (
          <div style={{ paddingRight: '12px', color: 'var(--m84-text-muted)', display: 'flex', alignItems: 'center' }}>
            {icon}
          </div>
        )}
      </div>

      {error ? (
        <span style={{ fontSize: '0.75rem', color: 'var(--m84-danger)', fontWeight: 500 }}>
          {error}
        </span>
      ) : helperText ? (
        <span style={{ fontSize: '0.75rem', color: 'var(--m84-text-muted)' }}>
          {helperText}
        </span>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';

export const Textarea = forwardRef(({
  label,
  error,
  helperText,
  rows = 4,
  className = '',
  style = {},
  id,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputId = id || (label ? `m84-textarea-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', fontFamily: 'var(--m84-font-family)' }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            color: error ? 'var(--m84-danger)' : 'var(--m84-text-primary)'
          }}
        >
          {label}
        </label>
      )}

      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          width: '100%',
          padding: '12px 14px',
          fontSize: '0.9rem',
          fontFamily: 'var(--m84-font-family)',
          color: 'var(--m84-text-primary)',
          background: 'var(--m84-surface)',
          border: `1.5px solid ${error ? 'var(--m84-danger)' : isFocused ? 'var(--m84-primary)' : 'var(--m84-border-subtle)'}`,
          borderRadius: 'var(--m84-radius-md)',
          boxShadow: isFocused ? '0 0 0 3px rgba(0, 98, 83, 0.12)' : 'var(--m84-shadow-sm)',
          outline: 'none',
          resize: 'vertical',
          transition: 'all var(--m84-transition-base)',
          ...style
        }}
        className={`m84-textarea ${className}`}
        {...props}
      />

      {error ? (
        <span style={{ fontSize: '0.75rem', color: 'var(--m84-danger)', fontWeight: 500 }}>
          {error}
        </span>
      ) : helperText ? (
        <span style={{ fontSize: '0.75rem', color: 'var(--m84-text-muted)' }}>
          {helperText}
        </span>
      ) : null}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export const Select = forwardRef(({
  label,
  error,
  options = [],
  children,
  className = '',
  style = {},
  id,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputId = id || (label ? `m84-select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', fontFamily: 'var(--m84-font-family)' }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            color: error ? 'var(--m84-danger)' : 'var(--m84-text-primary)'
          }}
        >
          {label}
        </label>
      )}

      <select
        ref={ref}
        id={inputId}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          width: '100%',
          padding: '10px 14px',
          fontSize: '0.9rem',
          fontFamily: 'var(--m84-font-family)',
          color: 'var(--m84-text-primary)',
          background: 'var(--m84-surface)',
          border: `1.5px solid ${error ? 'var(--m84-danger)' : isFocused ? 'var(--m84-primary)' : 'var(--m84-border-subtle)'}`,
          borderRadius: 'var(--m84-radius-md)',
          boxShadow: isFocused ? '0 0 0 3px rgba(0, 98, 83, 0.12)' : 'var(--m84-shadow-sm)',
          outline: 'none',
          cursor: 'pointer',
          transition: 'all var(--m84-transition-base)',
          ...style
        }}
        className={`m84-select ${className}`}
        {...props}
      >
        {children || options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
});

Select.displayName = 'Select';
