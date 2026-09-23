import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  FiHeart,
  FiHome,
  FiUsers,
  FiUser,
  FiCalendar,
  FiBriefcase,
  FiCreditCard,
  FiBox,
  FiClipboard,
  FiFileText,
  FiSettings,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiX
} from 'react-icons/fi';

export const Sidebar = ({ isMobileOpen, onMobileClose }) => {
  const { currentUser, logout } = useAuth();
  const { sidebarCollapsed, toggleSidebar } = useTheme();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', icon: FiHome, path: '/dashboard' },
    { label: 'Patients', icon: FiUsers, path: '/patients' },
    { label: 'Doctors & Staff', icon: FiUser, path: '/doctors' },
    { label: 'Appointments', icon: FiCalendar, path: '/appointments' },
    { label: 'Admissions', icon: FiBriefcase, path: '/admissions' },
    { label: 'Billing', icon: FiCreditCard, path: '/billing' },
    { label: 'Pharmacy', icon: FiBox, path: '/pharmacy' },
    { label: 'Laboratory', icon: FiClipboard, path: '/laboratory' },
    { label: 'Reports', icon: FiFileText, path: '/reports' },
    { label: 'Settings', icon: FiSettings, path: '/settings' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarWidth = sidebarCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)';

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            zIndex: 998,
            backdropFilter: 'blur(3px)'
          }}
          onClick={onMobileClose}
        />
      )}

      <aside
        className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`}
        style={{
          width: sidebarWidth,
          minWidth: sidebarWidth,
          backgroundColor: '#1E40AF', // Exact Deep Blue from spec
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 999,
          transition: 'width 0.25s ease, transform 0.25s ease',
          overflowX: 'hidden',
          boxShadow: '2px 0 10px rgba(0, 0, 0, 0.15)'
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            height: 'var(--navbar-height)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: sidebarCollapsed ? 'center' : 'space-between',
            padding: sidebarCollapsed ? '0' : '0 20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
            position: 'relative'
          }}
        >
          <div
            onClick={() => navigate('/dashboard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer'
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: '#0D9488', // Healing Teal
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(13, 148, 136, 0.4)'
              }}
            >
              <FiHeart size={22} color="#ffffff" />
            </div>

            {!sidebarCollapsed && (
              <div style={{ overflow: 'hidden' }}>
                <h1 style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff', letterSpacing: '-0.02em' }}>
                  Medix HMS
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.75)' }}>
                    Hospital System
                  </span>
                  <span
                    style={{
                      fontSize: '9.5px',
                      padding: '1px 5px',
                      borderRadius: '4px',
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      fontWeight: '600'
                    }}
                  >
                    v2.4.1
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Mobile close button */}
          <button
            onClick={onMobileClose}
            className="mobile-close-btn"
            style={{
              display: 'none',
              color: '#ffffff',
              padding: '6px',
              cursor: 'pointer'
            }}
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav
          style={{
            flex: 1,
            padding: '16px 10px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onMobileClose}
                title={sidebarCollapsed ? item.label : ''}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: sidebarCollapsed ? '12px 0' : '11px 14px',
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  borderRadius: '10px',
                  fontSize: '13.5px',
                  fontWeight: isActive ? '600' : '500',
                  color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.75)',
                  backgroundColor: isActive ? '#0D9488' : 'transparent', // Active Teal
                  boxShadow: isActive ? '0 4px 12px rgba(13, 148, 136, 0.35)' : 'none',
                  transition: 'all 0.18s ease',
                  position: 'relative'
                })}
              >
                <Icon size={19} style={{ flexShrink: 0 }} />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Collapse Toggle & User Profile */}
        <div
          style={{
            padding: '14px 10px',
            borderTop: '1px solid rgba(255, 255, 255, 0.12)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}
        >
          {/* Collapse Sidebar Button (Desktop only) */}
          <button
            onClick={toggleSidebar}
            className="collapse-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
              gap: '12px',
              padding: sidebarCollapsed ? '10px 0' : '8px 14px',
              borderRadius: '8px',
              color: 'rgba(255, 255, 255, 0.75)',
              fontSize: '12.5px',
              cursor: 'pointer',
              backgroundColor: 'rgba(255, 255, 255, 0.08)'
            }}
            title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {sidebarCollapsed ? <FiChevronRight size={17} /> : <FiChevronLeft size={17} />}
            {!sidebarCollapsed && <span>Collapse Sidebar</span>}
          </button>

          {/* User Profile Info & Logout */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: sidebarCollapsed ? 'center' : 'space-between',
              padding: sidebarCollapsed ? '8px 0' : '8px 12px',
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '10px'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                overflow: 'hidden'
              }}
            >
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={currentUser?.name}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '1.5px solid #0D9488'
                }}
              />
              {!sidebarCollapsed && (
                <div style={{ overflow: 'hidden' }}>
                  <p style={{ fontSize: '12.5px', fontWeight: '600', color: '#ffffff', whiteSpace: 'nowrap' }}>
                    {currentUser?.name || 'Administrator'}
                  </p>
                  <p style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.65)', whiteSpace: 'nowrap' }}>
                    Hospital Admin
                  </p>
                </div>
              )}
            </div>

            {!sidebarCollapsed && (
              <button
                onClick={handleLogout}
                style={{
                  padding: '6px',
                  borderRadius: '6px',
                  color: 'rgba(255, 255, 255, 0.75)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Logout from Medix HMS"
              >
                <FiLogOut size={16} />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
