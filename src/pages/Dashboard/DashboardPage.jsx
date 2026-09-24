import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHospital } from '../../context/HospitalContext';
import { StatCard } from '../../components/Common/StatCard/StatCard';
import { StatusBadge } from '../../components/Common/StatusBadge/StatusBadge';
import { Button } from '../../components/Common/Button/Button';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  FiUsers,
  FiCalendar,
  FiUserCheck,
  FiCreditCard,
  FiBriefcase,
  FiClipboard,
  FiAlertCircle,
  FiBox,
  FiPlus,
  FiArrowRight,
  FiActivity
} from 'react-icons/fi';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const {
    patients,
    doctors,
    appointments,
    bills,
    labTests,
    medicines,
    admissions,
    updateAppointmentStatus
  } = useHospital();

  const [patientStatsFilter, setPatientStatsFilter] = useState('Month'); // Today, Week, Month, Year

  // 1. Calculate Metrics
  const totalPatientsCount = patients.length;
  const todayDateStr = new Date().toISOString().split('T')[0];

  const todayAppointments = useMemo(
    () => appointments.filter((a) => a.date === todayDateStr || a.date === '2026-09-18'),
    [appointments, todayDateStr]
  );

  const availableDoctorsCount = doctors.filter(
    (d) => d.status === 'Available' || d.status === 'On Duty'
  ).length;

  const totalRevenue = useMemo(() => {
    return bills.reduce((sum, b) => sum + (Number(b.paidAmount) || 0), 0);
  }, [bills]);

  const admittedPatientsCount = admissions.filter((a) => a.status === 'Admitted' || a.status === 'Under Treatment').length;
  const pendingLabReportsCount = labTests.filter((t) => t.status === 'Requested' || t.status === 'Processing' || t.status === 'Sample Collected').length;
  const pendingBillsCount = bills.filter((b) => b.paymentStatus === 'Pending' || b.paymentStatus === 'Partially Paid').length;
  const lowStockCount = medicines.filter((m) => m.status === 'Low Stock' || m.status === 'Out of Stock').length;

  // 2. Patient trend chart data
  const chartDataMap = {
    Today: [
      { period: '08:00', patients: 2 },
      { period: '10:00', patients: 6 },
      { period: '12:00', patients: 9 },
      { period: '14:00', patients: 5 },
      { period: '16:00', patients: 8 },
      { period: '18:00', patients: 4 }
    ],
    Week: [
      { period: 'Mon', patients: 14 },
      { period: 'Tue', patients: 22 },
      { period: 'Wed', patients: 18 },
      { period: 'Thu', patients: 29 },
      { period: 'Fri', patients: 25 },
      { period: 'Sat', patients: 16 },
      { period: 'Sun', patients: 8 }
    ],
    Month: [
      { period: 'Week 1', patients: 78 },
      { period: 'Week 2', patients: 95 },
      { period: 'Week 3', patients: 112 },
      { period: 'Week 4', patients: 130 }
    ],
    Year: [
      { period: 'Jan', patients: 320 },
      { period: 'Mar', patients: 410 },
      { period: 'May', patients: 480 },
      { period: 'Jul', patients: 520 },
      { period: 'Sep', patients: 610 },
      { period: 'Nov', patients: 590 }
    ]
  };

  const trendData = chartDataMap[patientStatsFilter] || chartDataMap.Month;

  // 3. Appointment Status Breakdown
  const appointmentOverviewData = useMemo(() => {
    const counts = {
      Scheduled: 0,
      'Checked In': 0,
      Waiting: 0,
      Completed: 0,
      Cancelled: 0
    };
    appointments.forEach((a) => {
      if (counts[a.status] !== undefined) counts[a.status]++;
      else counts.Scheduled++;
    });

    return [
      { name: 'Scheduled', count: counts.Scheduled, fill: '#1E40AF' },
      { name: 'Checked In', count: counts['Checked In'], fill: '#0284C7' },
      { name: 'Waiting', count: counts.Waiting, fill: '#D97706' },
      { name: 'Completed', count: counts.Completed, fill: '#16A34A' },
      { name: 'Cancelled', count: counts.Cancelled, fill: '#DC2626' }
    ];
  }, [appointments]);

  // Recent 5 patients
  const recentPatients = patients.slice(0, 5);
  // Recent 4 lab reports
  const recentLabReports = labTests.slice(0, 4);
  // Pharmacy alert medicines
  const lowStockMedicines = medicines.filter((m) => m.status === 'Low Stock' || m.status === 'Out of Stock').slice(0, 4);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Welcome & Quick Actions Bar */}
      <div
        className="card"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          background: 'linear-gradient(135deg, #1E40AF 0%, #1E3A8A 60%, #0F172A 100%)',
          color: '#ffffff',
          border: 'none',
          padding: '24px 28px'
        }}
      >
        <div>
          <span
            style={{
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontWeight: '700',
              padding: '3px 8px',
              borderRadius: '4px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)'
            }}
          >
            Hospital Operational Console
          </span>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff', marginTop: '6px' }}>
            Welcome to Medix HMS
          </h2>
          <p style={{ fontSize: '13.5px', color: 'rgba(255, 255, 255, 0.8)', marginTop: '4px' }}>
            All departments operational. Today is{' '}
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <Button
            variant="secondary"
            icon={FiPlus}
            onClick={() => navigate('/patients/new')}
            style={{ backgroundColor: '#0D9488', color: '#ffffff' }}
          >
            Register Patient
          </Button>
          <Button
            variant="outline"
            icon={FiCalendar}
            onClick={() => navigate('/appointments')}
            style={{ borderColor: 'rgba(255, 255, 255, 0.3)', color: '#ffffff' }}
          >
            New Appointment
          </Button>
          <Button
            variant="outline"
            icon={FiCreditCard}
            onClick={() => navigate('/billing')}
            style={{ borderColor: 'rgba(255, 255, 255, 0.3)', color: '#ffffff' }}
          >
            Create Bill
          </Button>
        </div>
      </div>

      {/* Primary 4 KPI Cards (Clickable) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '18px'
        }}
      >
        <StatCard
          title="Total Registered Patients"
          value={totalPatientsCount}
          subtitle="All active medical records"
          trend="+12% this month"
          trendDirection="up"
          icon={FiUsers}
          color="primary"
          onClick={() => navigate('/patients')}
        />
        <StatCard
          title="Today's Appointments"
          value={todayAppointments.length}
          subtitle="Scheduled across all OPDs"
          trend="+4 new today"
          trendDirection="up"
          icon={FiCalendar}
          color="secondary"
          onClick={() => navigate('/appointments')}
        />
        <StatCard
          title="Available Doctors"
          value={`${availableDoctorsCount} / ${doctors.length}`}
          subtitle="On duty across departments"
          trend="88% attendance"
          trendDirection="up"
          icon={FiUserCheck}
          color="success"
          onClick={() => navigate('/doctors')}
        />
        <StatCard
          title="Total Collected Revenue"
          value={formatCurrency(totalRevenue)}
          subtitle="Cleared billing transactions"
          trend="+18.4% growth"
          trendDirection="up"
          icon={FiCreditCard}
          color="warning"
          onClick={() => navigate('/billing')}
        />
      </div>

      {/* Secondary 4 KPI Cards (Clickable to filtered views) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px'
        }}
      >
        <StatCard
          title="Admitted Inpatients"
          value={admittedPatientsCount}
          subtitle="Under current ward care"
          icon={FiBriefcase}
          color="primary"
          onClick={() => navigate('/admissions')}
        />
        <StatCard
          title="Pending Lab Reports"
          value={pendingLabReportsCount}
          subtitle="In processing or review"
          icon={FiClipboard}
          color="warning"
          onClick={() => navigate('/laboratory')}
        />
        <StatCard
          title="Pending Invoices"
          value={pendingBillsCount}
          subtitle="Awaiting claim/co-pay"
          icon={FiAlertCircle}
          color="danger"
          onClick={() => navigate('/billing')}
        />
        <StatCard
          title="Low Stock Medicines"
          value={lowStockCount}
          subtitle="Requires reordering"
          icon={FiBox}
          color="danger"
          onClick={() => navigate('/pharmacy')}
        />
      </div>

      {/* Analytics Row: Patient Trends & Appointment Overview */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '20px'
        }}
      >
        {/* Section A: Patient Registration Trend */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <FiActivity color="var(--primary)" />
              <span>Patient Inflow & Registration Trends</span>
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              {['Today', 'Week', 'Month', 'Year'].map((f) => (
                <button
                  key={f}
                  onClick={() => setPatientStatsFilter(f)}
                  style={{
                    padding: '4px 10px',
                    fontSize: '11.5px',
                    fontWeight: '600',
                    borderRadius: '6px',
                    backgroundColor: patientStatsFilter === f ? 'var(--primary)' : 'var(--surface-hover)',
                    color: patientStatsFilter === f ? '#ffffff' : 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div style={{ width: '100%', height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1E40AF" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#1E40AF" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="period" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--surface)',
                    borderColor: 'var(--border)',
                    borderRadius: '8px',
                    boxShadow: 'var(--shadow-md)',
                    color: 'var(--text-primary)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="patients"
                  stroke="#1E40AF"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorPatients)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Section B: Appointment Status Distribution */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <FiCalendar color="var(--secondary)" />
              <span>Appointment Distribution by Status</span>
            </div>
            <button
              onClick={() => navigate('/appointments')}
              style={{ fontSize: '12.5px', color: 'var(--secondary)', fontWeight: '600', cursor: 'pointer' }}
            >
              View All
            </button>
          </div>
          <div style={{ width: '100%', height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={appointmentOverviewData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--surface)',
                    borderColor: 'var(--border)',
                    borderRadius: '8px',
                    boxShadow: 'var(--shadow-md)',
                    color: 'var(--text-primary)'
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {appointmentOverviewData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Section C: Today's Appointments List */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <FiCalendar color="var(--primary)" />
            <span>Today's Appointment Schedule ({todayAppointments.length})</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/appointments')}>
            Open Calendar <FiArrowRight size={14} />
          </Button>
        </div>

        <div className="table-container" style={{ border: 'none' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Department</th>
                <th>Type</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {todayAppointments.slice(0, 6).map((apt) => (
                <tr key={apt.id}>
                  <td style={{ fontWeight: '600', color: 'var(--primary)' }}>{apt.time}</td>
                  <td>
                    <div style={{ fontWeight: '500' }}>{apt.patientName}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{apt.patientId}</div>
                  </td>
                  <td>{apt.doctorName}</td>
                  <td>
                    <span className="badge badge-neutral">{apt.department}</span>
                  </td>
                  <td>{apt.type}</td>
                  <td>
                    <StatusBadge status={apt.status} />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {apt.status === 'Scheduled' && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => updateAppointmentStatus(apt.id, 'Checked In')}
                      >
                        Check In
                      </Button>
                    )}
                    {apt.status === 'Checked In' && (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => updateAppointmentStatus(apt.id, 'In Consultation')}
                      >
                        Consult
                      </Button>
                    )}
                    {apt.status === 'In Consultation' && (
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => updateAppointmentStatus(apt.id, 'Completed')}
                      >
                        Complete
                      </Button>
                    )}
                    {apt.status === 'Completed' && (
                      <button
                        onClick={() => navigate(`/patients/${apt.patientId}`)}
                        style={{ fontSize: '12px', color: 'var(--secondary)', fontWeight: '600', cursor: 'pointer' }}
                      >
                        View File
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row: Recent Patients & Recent Lab Tests */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))',
          gap: '20px'
        }}
      >
        {/* Section D: Recent Patients */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <FiUsers color="var(--primary)" />
              <span>Recent Patient Consultations</span>
            </div>
            <button
              onClick={() => navigate('/patients')}
              style={{ fontSize: '12.5px', color: 'var(--secondary)', fontWeight: '600', cursor: 'pointer' }}
            >
              All Patients
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {recentPatients.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate(`/patients/${p.id}`)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--surface-hover)',
                  cursor: 'pointer',
                  transition: 'transform 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img
                    src={p.avatar}
                    alt={p.name}
                    style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <h5 style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--text-primary)' }}>
                      {p.name}
                    </h5>
                    <p style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                      {p.id} • {p.gender}, {p.age}y • {p.assignedDoctorName}
                    </p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <StatusBadge status={p.status} />
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '3px' }}>
                    Stage: <span style={{ fontWeight: '600', color: 'var(--secondary)' }}>{p.currentStage}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section E: Recent Lab Reports */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <FiClipboard color="var(--secondary)" />
              <span>Recent Laboratory Tests</span>
            </div>
            <button
              onClick={() => navigate('/laboratory')}
              style={{ fontSize: '12.5px', color: 'var(--secondary)', fontWeight: '600', cursor: 'pointer' }}
            >
              All Lab Tests
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {recentLabReports.map((t) => (
              <div
                key={t.id}
                onClick={() => navigate('/laboratory')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--surface-hover)',
                  cursor: 'pointer'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--primary)' }}>
                      {t.id}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
                      {t.testName}
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Patient: {t.patientName} • Tech: {t.technician}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <StatusBadge status={t.status} />
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '3px' }}>
                    Result: <span style={{ fontWeight: '600' }}>{t.overallResult}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section F: Pharmacy Stock Alerts */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <FiBox color="var(--danger)" />
            <span>Pharmacy Low Stock & Reorder Alerts</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/pharmacy')}>
            Manage Inventory <FiArrowRight size={14} />
          </Button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
          {lowStockMedicines.map((med) => (
            <div
              key={med.id}
              style={{
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--surface-hover)',
                border: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{med.id}</span>
                  <StatusBadge status={med.status} />
                </div>
                <h5 style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--text-primary)', marginTop: '4px' }}>
                  {med.name}
                </h5>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Supplier: {med.supplier}
                </p>
              </div>
              <div
                style={{
                  marginTop: '12px',
                  paddingTop: '8px',
                  borderTop: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '12px'
                }}
              >
                <span>
                  Current: <strong style={{ color: 'var(--danger)' }}>{med.stock}</strong> / Min: {med.minStock}
                </span>
                <span style={{ color: 'var(--primary)', fontWeight: '600' }}>
                  {formatCurrency(med.sellingPrice)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
