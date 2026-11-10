import React from 'react';

export const Table = ({ children, className = '', style = {}, ...props }) => (
  <div style={{ width: '100%', overflowX: 'auto', borderRadius: 'var(--m84-radius-lg)', border: '1.5px solid var(--m84-border-subtle)', background: 'var(--m84-surface)', ...style }}>
    <table
      style={{
        width: '100%',
        borderCollapse: 'collapse',
        textAlign: 'left',
        fontFamily: 'var(--m84-font-family)',
        fontSize: '0.88rem'
      }}
      className={`m84-table ${className}`}
      {...props}
    >
      {children}
    </table>
  </div>
);

export const TableHeader = ({ children, ...props }) => (
  <thead style={{ background: 'var(--m84-surface-subtle)', borderBottom: '1.5px solid var(--m84-border-subtle)' }} {...props}>
    {children}
  </thead>
);

export const TableBody = ({ children, ...props }) => (
  <tbody {...props}>
    {children}
  </tbody>
);

export const TableRow = ({ children, isClickable = false, onClick, style = {}, ...props }) => (
  <tr
    onClick={onClick}
    style={{
      borderBottom: '1px solid var(--m84-border-subtle)',
      cursor: isClickable ? 'pointer' : 'default',
      transition: 'background var(--m84-transition-fast)',
      ...style
    }}
    onMouseEnter={(e) => {
      if (isClickable) e.currentTarget.style.background = 'var(--m84-surface-subtle)';
    }}
    onMouseLeave={(e) => {
      if (isClickable) e.currentTarget.style.background = 'transparent';
    }}
    {...props}
  >
    {children}
  </tr>
);

export const TableHead = ({ children, style = {}, ...props }) => (
  <th
    style={{
      padding: '14px 18px',
      fontWeight: 700,
      color: 'var(--m84-text-secondary)',
      fontSize: '0.78rem',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      ...style
    }}
    {...props}
  >
    {children}
  </th>
);

export const TableCell = ({ children, style = {}, ...props }) => (
  <td
    style={{
      padding: '14px 18px',
      color: 'var(--m84-text-primary)',
      verticalAlign: 'middle',
      ...style
    }}
    {...props}
  >
    {children}
  </td>
);

export const TableEmpty = ({ message = "Aucune donnée disponible", icon = null }) => (
  <tr>
    <td colSpan={100} style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--m84-text-muted)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        {icon && <div style={{ color: 'var(--m84-text-muted)', marginBottom: '4px' }}>{icon}</div>}
        <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{message}</span>
      </div>
    </td>
  </tr>
);
