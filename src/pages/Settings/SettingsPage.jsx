import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { PageHeader } from '../../components/Common/PageHeader/PageHeader';
import { Button } from '../../components/Common/Button/Button';
import { ConfirmDialog } from '../../components/Common/Modal/ConfirmDialog';
import {
  FiSettings,
  FiHome,
  FiUserCheck,
  FiBell,
  FiMoon,
  FiSun,
  FiShield,
  FiRefreshCw,
  FiSave,
  FiCheck
} from 'react-icons/fi';

export const SettingsPage = () => {
  const { hospitalInfo, setHospitalInfo, resetDemoData, addToast } = useHospital();
  const { theme, toggleTheme, sidebarCollapsed, toggleSidebar } = useTheme();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState('Hospital'); // Hospital, Appearance, Notifications, Security, System
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Hospital Info Form
  const [infoForm, setInfoForm] = useState(hospitalInfo || {});

  // Notification Toggles
  const [notifPreferences, setNotifPreferences] = useState({
    appointments: true,
    labResults: true,
    lowStock: true,
    billingDue: true,
    emailAlerts: false
  });

  // Security Form
  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
    sessionTimeout: '30'
  });

  const handleSaveHospitalInfo = (e) => {
    e.preventDefault();
    setHospitalInfo(infoForm);
  };

  const handleSaveSecurity = (e) => {
    e.preventDefault();
    addToast('Security preferences updated successfully.', 'success');
    setSecurityForm((prev) => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
  };

  const tabs = [
    { key: 'Hospital', label: 'Hospital Profile' },
    { key: 'Appearance', label: 'Appearance & UI' },
    { key: 'Notifications', label: 'Notification Rules' },
    { key: 'Security', label: 'Security & Auth' },
    { key: 'System', label: 'System & Demo Data' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1000px' }}>
      <PageHeader
        title="Settings & System Configuration"
        subtitle="Manage hospital institutional information, interface appearance, role security, and demo data."
      />

      {/* Tabs Switcher */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '4px', overflowX: 'auto' }}>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{
              padding: '8px 16px',
              fontSize: '13.5px',
              fontWeight: activeTab === t.key ? '600' : '500',
              color: activeTab === t.key ? 'var(--primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === t.key ? '2px solid var(--primary)' : '2px solid transparent',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'var(--transition)'
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Hospital Profile */}
      {activeTab === 'Hospital' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <FiHome color="var(--primary)" />
              <span>Hospital Institutional Information</span>
            </div>
          </div>

          <form onSubmit={handleSaveHospitalInfo} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Hospital Registered Name</label>
              <input
                type="text"
                className="form-control"
                value={infoForm.name || ''}
                onChange={(e) => setInfoForm({ ...infoForm, name: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Tagline / Mission</label>
              <input
                type="text"
                className="form-control"
                value={infoForm.tagline || ''}
                onChange={(e) => setInfoForm({ ...infoForm, tagline: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Clinical Registration No.</label>
              <input
                type="text"
                className="form-control"
                value={infoForm.regNumber || ''}
                onChange={(e) => setInfoForm({ ...infoForm, regNumber: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">GSTIN / Tax ID</label>
              <input
                type="text"
                className="form-control"
                value={infoForm.taxId || ''}
                onChange={(e) => setInfoForm({ ...infoForm, taxId: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Hospital Address</label>
              <input
                type="text"
                className="form-control"
                value={infoForm.address || ''}
                onChange={(e) => setInfoForm({ ...infoForm, address: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">City</label>
              <input
                type="text"
                className="form-control"
                value={infoForm.city || ''}
                onChange={(e) => setInfoForm({ ...infoForm, city: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">State</label>
              <input
                type="text"
                className="form-control"
                value={infoForm.state || ''}
                onChange={(e) => setInfoForm({ ...infoForm, state: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Reception Phone</label>
              <input
                type="text"
                className="form-control"
                value={infoForm.phone || ''}
                onChange={(e) => setInfoForm({ ...infoForm, phone: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">24/7 Emergency Line</label>
              <input
                type="text"
                className="form-control"
                value={infoForm.emergencyPhone || ''}
                onChange={(e) => setInfoForm({ ...infoForm, emergencyPhone: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Official Email</label>
              <input
                type="email"
                className="form-control"
                value={infoForm.email || ''}
                onChange={(e) => setInfoForm({ ...infoForm, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Website</label>
              <input
                type="text"
                className="form-control"
                value={infoForm.website || ''}
                onChange={(e) => setInfoForm({ ...infoForm, website: e.target.value })}
              />
            </div>

            <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
              <Button type="submit" variant="primary" icon={FiSave}>
                Save Hospital Profile
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Appearance */}
      {activeTab === 'Appearance' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <FiMoon color="var(--primary)" />
              <span>Visual Theme & Interface Configuration</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', backgroundColor: 'var(--surface-hover)', borderRadius: '8px' }}>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '600' }}>Dark Theme Mode</h4>
                <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                  Switch between Off-White healthcare light palette and Dark Slate mode (stored in LocalStorage).
                </p>
              </div>
              <Button variant="outline" onClick={toggleTheme} icon={theme === 'dark' ? FiSun : FiMoon}>
                {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
              </Button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', backgroundColor: 'var(--surface-hover)', borderRadius: '8px' }}>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '600' }}>Sidebar Default Mode</h4>
                <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                  Keep sidebar compact (icons only with tooltips) to maximize workspace.
                </p>
              </div>
              <Button variant="outline" onClick={toggleSidebar}>
                {sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Notifications */}
      {activeTab === 'Notifications' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <FiBell color="var(--warning)" />
              <span>Real-time Clinical Notifications</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { key: 'appointments', title: 'Appointment Reminders', desc: 'Notify when patient checks in or appointment is starting.' },
              { key: 'labResults', title: 'Critical & Abnormal Lab Alerts', desc: 'Immediate notification when urgent/critical pathology values are flagged.' },
              { key: 'lowStock', title: 'Pharmacy Stock Reorder Alerts', desc: 'Notify pharmacy staff when formulations drop below minimum quantity.' },
              { key: 'billingDue', title: 'Unpaid Invoices & Insurance Claims', desc: 'Alert billing counter when pending balance exceeds due date.' }
            ].map((item) => (
              <div
                key={item.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  backgroundColor: 'var(--surface-hover)',
                  borderRadius: '8px'
                }}
              >
                <div>
                  <h4 style={{ fontSize: '13.5px', fontWeight: '600' }}>{item.title}</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{item.desc}</p>
                </div>
                <input
                  type="checkbox"
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                  checked={notifPreferences[item.key]}
                  onChange={(e) =>
                    setNotifPreferences({ ...notifPreferences, [item.key]: e.target.checked })
                  }
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Security */}
      {activeTab === 'Security' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <FiShield color="var(--danger)" />
              <span>Account Security & Session Management</span>
            </div>
          </div>

          <form onSubmit={handleSaveSecurity} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Current Authenticated Account</label>
              <input
                type="text"
                className="form-control"
                disabled
                value={`${currentUser?.name} (${currentUser?.email}) - ${currentUser?.role}`}
              />
            </div>

            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={securityForm.newPassword}
                onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={securityForm.confirmPassword}
                onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Session Inactivity Timeout</label>
              <select
                className="form-control"
                value={securityForm.sessionTimeout}
                onChange={(e) => setSecurityForm({ ...securityForm, sessionTimeout: e.target.value })}
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes (Standard)</option>
                <option value="60">60 minutes</option>
              </select>
            </div>

            <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
              <Button type="submit" variant="primary" icon={FiSave}>
                Update Security Settings
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 5: System & Reset */}
      {activeTab === 'System' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <FiRefreshCw color="var(--primary)" />
              <span>LocalStorage Demo Data Maintenance</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Medix HMS stores all patient registrations, appointments, bills, prescriptions, and lab tests in your browser’s <strong>LocalStorage</strong>.
              If you have added test records or altered data and wish to return to the original demonstration state, click the button below.
            </p>

            <div style={{ padding: '16px', backgroundColor: 'var(--danger-light)', borderRadius: '8px', border: '1px solid var(--danger-border)' }}>
              <h5 style={{ color: 'var(--danger)', fontWeight: '700', fontSize: '14px' }}>Factory Reset Demo Records</h5>
              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                This will re-initialize 10 patients, 8 doctors, 8 staff, 12 appointments, 15 medicines, 12 lab tests, 10 bills, and 8 admissions.
              </p>
              <Button
                variant="danger"
                size="sm"
                icon={FiRefreshCw}
                style={{ marginTop: '12px' }}
                onClick={() => setIsResetConfirmOpen(true)}
              >
                Reset All Records to Factory Default
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={resetDemoData}
        title="Reset All Hospital Data?"
        message="This will wipe custom patient records from LocalStorage and reload initial sample data."
        confirmText="Confirm Reset"
      />
    </div>
  );
};
