import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useHospital } from '../../context/HospitalContext';
import { NotificationPanel } from './NotificationPanel';
import { GlobalSearchModal } from './GlobalSearchModal';
import {
  FiMenu,
  FiSearch,
  FiBell,
  FiMoon,
  FiSun,
  FiChevronRight,
  FiLogOut
} from 'react-icons/fi';

export const Navbar = ({ onMobileMenuToggle }) => {
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { notifications } = useHospital();
  const location = useLocation();
  const navigate = useNavigate();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Breadcrumb generator
  const getPageDetails = () => {
    const path = location.pathname;
    if (path === '/' || path === '/dashboard') return { title: 'Clinical Dashboard', parent: 'Overview' };
    if (path.startsWith('/patients/new')) return { title: 'Register Patient', parent: 'Patients' };
    if (path.startsWith('/patients/')) return { title: 'Patient Profile & Journey', parent: 'Patients' };
    if (path.startsWith('/patients')) return { title: 'Patient Management', parent: 'Patients' };
    if (path.startsWith('/doctors')) return { title: 'Doctors & Medical Staff', parent: 'Directory' };
    if (path.startsWith('/staff')) return { title: 'Hospital Staff Directory', parent: 'Directory' };
    if (path.startsWith('/appointments')) return { title: 'Appointments & Scheduling', parent: 'Clinical' };
    if (path.startsWith('/admissions')) return { title: 'Inpatient Admissions & Beds', parent: 'Inpatient' };
    if (path.startsWith('/billing')) return { title: 'Billing, Invoices & Claims', parent: 'Finance' };
    if (path.startsWith('/pharmacy')) return { title: 'Pharmacy & Drug Dispensary', parent: 'Pharmacy' };
    if (path.startsWith('/laboratory')) return { title: 'Laboratory Diagnostics', parent: 'Diagnostics' };
    if (path.startsWith('/reports')) return { title: 'Clinical & Operational Reports', parent: 'Analytics' };
    if (path.startsWith('/settings')) return { title: 'System & Hospital Settings', parent: 'Configuration' };
    return { title: 'Hospital Management', parent: 'Medix HMS' };
  };

  const { title, parent } = getPageDetails();

  return (
    <>
      <header
        style={{
          height: 'var(--navbar-height)',
          backgroundColor: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 28px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        {/* Left: Mobile Toggle & Page Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={onMobileMenuToggle}
            className="mobile-menu-btn"
            style={{
              display: 'none',
              padding: '8px',
              borderRadius: '8px',
              color: 'var(--text-primary)',
              cursor: 'pointer'
            }}
            aria-label="Toggle navigation drawer"
          >
            <FiMenu size={22} />
          </button>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
              <span>{parent}</span>
              <FiChevronRight size={12} />
              <span style={{ color: 'var(--secondary)', fontWeight: '500' }}>{title}</span>
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginTop: '1px' }}>
              {title}
            </h2>
          </div>
        </div>

        {/* Right: Search, Notifications, Theme, User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Quick Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--surface-hover)',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'var(--transition)'
            }}
          >
            <FiSearch size={15} color="var(--primary)" />
            <span className="search-hint-text">Search records...</span>
            <span
              style={{
                fontSize: '10.5px',
                padding: '2px 5px',
                borderRadius: '4px',
                backgroundColor: 'var(--border)',
                color: 'var(--text-secondary)'
              }}
            >
              ⌘K
            </span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--surface)',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'var(--transition)'
            }}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <FiSun size={17} color="#f59e0b" /> : <FiMoon size={17} />}
          </button>

          {/* Notifications Button */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--surface)',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative'
              }}
              title="Notifications"
            >
              <FiBell size={17} />
              {unreadCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--danger)',
                    color: '#ffffff',
                    fontSize: '10px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </button>

            <NotificationPanel
              isOpen={isNotificationsOpen}
              onClose={() => setIsNotificationsOpen(false)}
            />
          </div>

          <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border)', margin: '0 4px' }} />

          {/* User Profile Info */}
          <div style={{ position: 'relative' }}>
            <div
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '4px 8px',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--surface-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={currentUser?.name}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid var(--secondary)'
                }}
              />
              <div className="user-profile-meta" style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', lineHeight: 1.2 }}>
                  {currentUser?.name || 'Administrator'}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {currentUser?.role || 'Hospital Admin'}
                </span>
              </div>
            </div>

            {/* Profile Dropdown */}
            {isProfileMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '48px',
                  right: 0,
                  width: '200px',
                  backgroundColor: 'var(--surface)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid var(--border)',
                  overflow: 'hidden',
                  zIndex: 1100
                }}
              >
                <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--surface-hover)' }}>
                  <p style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--text-primary)' }}>
                    {currentUser?.name}
                  </p>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{currentUser?.email}</p>
                </div>
                <div style={{ padding: '6px' }}>
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      navigate('/settings');
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 10px',
                      fontSize: '13px',
                      color: 'var(--text-primary)',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    Hospital Settings
                  </button>
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      logout();
                      navigate('/login');
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 10px',
                      fontSize: '13px',
                      color: 'var(--danger)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <FiLogOut size={14} /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Search Dialog */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
