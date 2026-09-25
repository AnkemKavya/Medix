import React from 'react';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendDirection = 'up', // 'up' | 'down'
  color = 'primary', // 'primary' | 'secondary' | 'warning' | 'danger' | 'success'
  onClick,
  className = ''
}) => {
  const isClickable = Boolean(onClick);

  return (
    <div
      className={`card stat-card ${isClickable ? 'clickable' : ''} ${className}`.trim()}
      onClick={onClick}
      style={{
        cursor: isClickable ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div>
          <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)' }}>
            {title}
          </span>
          <h3 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', marginTop: '4px' }}>
            {value}
          </h3>
        </div>
        {Icon && (
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: `var(--${color}-light, var(--primary-light))`,
              color: `var(--${color}, var(--primary))`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Icon size={22} />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px' }}>
        {trend && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              fontWeight: '600',
              color: trendDirection === 'up' ? 'var(--success)' : 'var(--danger)'
            }}
          >
            {trendDirection === 'up' ? <FiTrendingUp size={14} /> : <FiTrendingDown size={14} />}
            {trend}
          </span>
        )}
        {subtitle && <span style={{ color: 'var(--text-muted)' }}>{subtitle}</span>}
      </div>
    </div>
  );
};
