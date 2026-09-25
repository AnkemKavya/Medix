import React from 'react';
import { useHospital } from '../../../context/HospitalContext';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiAlertTriangle, FiX } from 'react-icons/fi';

export const ToastContainer = () => {
  const { toasts, removeToast } = useHospital();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 2000,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '380px',
        width: '100%',
        pointerEvents: 'none'
      }}
    >
      {toasts.map((toast) => {
        let icon = <FiCheckCircle size={18} color="var(--success)" />;
        let borderColor = 'var(--success-border)';
        let bgColor = 'var(--surface)';

        if (toast.type === 'danger' || toast.type === 'error') {
          icon = <FiAlertCircle size={18} color="var(--danger)" />;
          borderColor = 'var(--danger-border)';
        } else if (toast.type === 'warning') {
          icon = <FiAlertTriangle size={18} color="var(--warning)" />;
          borderColor = 'var(--warning-border)';
        } else if (toast.type === 'info') {
          icon = <FiInfo size={18} color="var(--info)" />;
          borderColor = 'var(--info-border)';
        }

        return (
          <div
            key={toast.id}
            style={{
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              padding: '12px 16px',
              backgroundColor: bgColor,
              border: `1px solid ${borderColor}`,
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              color: 'var(--text-primary)',
              fontSize: '13.5px',
              fontWeight: '500',
              animation: 'slideInRight 0.2s ease-out'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {icon}
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                color: 'var(--text-muted)',
                padding: '4px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              aria-label="Dismiss notification"
            >
              <FiX size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
