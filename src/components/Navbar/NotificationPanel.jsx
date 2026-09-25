import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHospital } from '../../context/HospitalContext';
import { FiCheckCircle, FiAlertTriangle, FiAlertCircle, FiInfo, FiCheck } from 'react-icons/fi';

export const NotificationPanel = ({ isOpen, onClose }) => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useHospital();
  const navigate = useNavigate();
  const panelRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleNotificationClick = (item) => {
    markNotificationRead(item.id);
    onClose();
    if (item.link) {
      navigate(item.link);
    }
  };

  return (
    <div
      ref={panelRef}
      style={{
        position: 'absolute',
        top: '60px',
        right: '16px',
        width: '360px',
        maxWidth: '90vw',
        backgroundColor: 'var(--surface)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-xl)',
        border: '1px solid var(--border)',
        zIndex: 1100,
        overflow: 'hidden',
        animation: 'slideDown 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <div
        style={{
          padding: '14px 18px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--surface-hover)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h4 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)' }}>
            Notifications
          </h4>
          <span
            style={{
              padding: '2px 7px',
              fontSize: '11px',
              fontWeight: '700',
              borderRadius: '999px',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)'
            }}
          >
            {notifications.filter((n) => !n.read).length}
          </span>
        </div>
        <button
          onClick={markAllNotificationsRead}
          style={{
            fontSize: '12px',
            color: 'var(--secondary)',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer'
          }}
        >
          <FiCheck size={14} /> Mark all read
        </button>
      </div>

      <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
        {notifications.length === 0 ? (
          <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No new notifications
          </div>
        ) : (
          notifications.map((n) => {
            let icon = <FiInfo color="var(--info)" size={16} />;
            if (n.type === 'critical') icon = <FiAlertCircle color="var(--danger)" size={16} />;
            if (n.type === 'warning') icon = <FiAlertTriangle color="var(--warning)" size={16} />;

            return (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  cursor: 'pointer',
                  backgroundColor: n.read ? 'transparent' : 'var(--primary-light)',
                  transition: 'background-color 0.15s ease'
                }}
              >
                <div style={{ marginTop: '2px' }}>{icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h5 style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
                      {n.title}
                    </h5>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{n.time}</span>
                  </div>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '3px', lineHeight: 1.4 }}>
                    {n.message}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
