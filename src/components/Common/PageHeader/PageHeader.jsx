import React from 'react';

export const PageHeader = ({
  title,
  subtitle,
  children,
  badge,
  className = ''
}) => {
  return (
    <div className={`page-header ${className}`.trim()}>
      <div className="page-header-info">
        <h1>
          {title}
          {badge}
        </h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {children && <div className="page-header-actions">{children}</div>}
    </div>
  );
};
