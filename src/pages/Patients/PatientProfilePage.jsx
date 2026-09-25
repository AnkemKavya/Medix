import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useHospital } from '../../context/HospitalContext';
import { PageHeader } from '../../components/Common/PageHeader/PageHeader';
import { StatusBadge } from '../../components/Common/StatusBadge/StatusBadge';
import { Button } from '../../components/Common/Button/Button';
import { Modal } from '../../components/Common/Modal/Modal';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { triggerPrint } from '../../utils/helpers';
import {
  FiArrowLeft,
  FiPrinter,
  FiEdit3,
  FiCalendar,
  FiCreditCard,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiActivity,
  FiClipboard,
  FiFileText,
  FiBox,
  FiPlus,
  FiUserCheck,
  FiCheck,
  FiChevronRight
} from 'react-icons/fi';

const JOURNEY_STAGES = [
  'Registration',
  'Appointment',
  'Check-in',
  'Vitals',
  'Consultation',
  'Lab Tests',
  'Lab Results',
  'Prescription',
  'Pharmacy',
  'Billing',
  'Discharge',
  'Final Report'
];

export const PatientProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    patients,
    updatePatient,
    updatePatientStage,
    appointments,
    labTests,
    prescriptions,
    bills,
    admissions,
    finalReports,
    approveFinalReport
  } = useHospital();

  const patient = patients.find((p) => p.id === id);

  const [activeTab, setActiveTab] = useState('Overview'); // Overview, History, Appointments, Vitals, Lab, Prescriptions, Billing, FinalReport
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isVitalsModalOpen, setIsVitalsModalOpen] = useState(false);

  // Edit patient form state
  const [editFormData, setEditFormData] = useState(patient || {});

  // Edit vitals state
  const [vitalsFormData, setVitalsFormData] = useState(patient?.vitals || {});

  if (!patient) {
    return (
      <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
        <h3>Patient Not Found</h3>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
          No patient with record identifier {id} exists in the clinical database.
        </p>
        <Button
          variant="primary"
          style={{ marginTop: '16px' }}
          onClick={() => navigate('/patients')}
        >
          Return to Patients
        </Button>
      </div>
    );
  }

  // Associated records
  const patientAppointments = appointments.filter((a) => a.patientId === patient.id);
  const patientLabs = labTests.filter((l) => l.patientId === patient.id);
  const patientPrescriptions = prescriptions.filter((r) => r.patientId === patient.id);
  const patientBills = bills.filter((b) => b.patientId === patient.id);
  const patientAdmissions = admissions.filter((a) => a.patientId === patient.id);
  const patientReport = finalReports.find((r) => r.patientId === patient.id);

  // Stage advancement logic
  const currentStageIndex = JOURNEY_STAGES.indexOf(patient.currentStage || 'Registration');

  const handleAdvanceStage = () => {
    if (currentStageIndex < JOURNEY_STAGES.length - 1) {
      const nextStage = JOURNEY_STAGES[currentStageIndex + 1];
      updatePatientStage(patient.id, nextStage);
    }
  };

  const handleSelectStage = (stageName) => {
    updatePatientStage(patient.id, stageName);
  };

  const handleSaveEdit = () => {
    updatePatient(patient.id, editFormData);
    setIsEditModalOpen(false);
  };

  const handleSaveVitals = () => {
    updatePatient(patient.id, { vitals: vitalsFormData });
    setIsVitalsModalOpen(false);
  };

  const tabs = [
    { key: 'Overview', label: 'Overview' },
    { key: 'Journey', label: 'Patient Journey' },
    { key: 'History', label: 'Medical History' },
    { key: 'Appointments', label: `Appointments (${patientAppointments.length})` },
    { key: 'Vitals', label: 'Vitals Log' },
    { key: 'Lab', label: `Lab Reports (${patientLabs.length})` },
    { key: 'Prescriptions', label: `Prescriptions (${patientPrescriptions.length})` },
    { key: 'Billing', label: `Billing (${patientBills.length})` },
    { key: 'FinalReport', label: 'Final Medical Report' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Breadcrumb & Action Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <Button variant="ghost" icon={FiArrowLeft} onClick={() => navigate('/patients')}>
          Back to Patient List
        </Button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <Button variant="outline" icon={FiPrinter} onClick={triggerPrint}>
            Print Clinical Summary
          </Button>
          <Button
            variant="outline"
            icon={FiEdit3}
            onClick={() => {
              setEditFormData(patient);
              setIsEditModalOpen(true);
            }}
          >
            Edit Record
          </Button>
          <Button
            variant="secondary"
            icon={FiCalendar}
            onClick={() => navigate('/appointments')}
          >
            New Appointment
          </Button>
          <Button
            variant="primary"
            icon={FiCreditCard}
            onClick={() => navigate('/billing')}
          >
            Create Invoice
          </Button>
        </div>
      </div>

      {/* Patient Profile Header Card */}
      <div
        className="card"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
          padding: '24px 28px',
          background: 'var(--surface)',
          borderLeft: '5px solid var(--primary)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <img
            src={patient.avatar}
            alt={patient.name}
            style={{
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid var(--primary-border)',
              boxShadow: 'var(--shadow-md)'
            }}
          />

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)' }}>
                {patient.name}
              </h1>
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: '700',
                  color: 'var(--primary)',
                  backgroundColor: 'var(--primary-light)',
                  padding: '3px 9px',
                  borderRadius: '6px'
                }}
              >
                {patient.id}
              </span>
              <StatusBadge status={patient.status} />
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginTop: '8px',
                fontSize: '13px',
                color: 'var(--text-secondary)',
                flexWrap: 'wrap'
              }}
            >
              <span>
                <strong>Age / Gender:</strong> {patient.age} yrs • {patient.gender}
              </span>
              <span>
                <strong>Blood Group:</strong>{' '}
                <span className="badge badge-neutral" style={{ padding: '2px 7px' }}>
                  {patient.bloodGroup}
                </span>
              </span>
              <span>
                <strong>Phone:</strong> {patient.phone}
              </span>
              <span>
                <strong>Attending:</strong> {patient.assignedDoctorName}
              </span>
            </div>
          </div>
        </div>

        {/* Current Treatment Stage Badge & Quick Advance */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '8px'
          }}
        >
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Current Treatment Stage</div>
          <span
            style={{
              fontSize: '15px',
              fontWeight: '700',
              color: '#ffffff',
              backgroundColor: 'var(--secondary)',
              padding: '6px 14px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(13, 148, 136, 0.3)'
            }}
          >
            {patient.currentStage}
          </span>
          {currentStageIndex < JOURNEY_STAGES.length - 1 && (
            <button
              onClick={handleAdvanceStage}
              className="btn btn-primary btn-sm"
              style={{ marginTop: '4px' }}
            >
              Advance Stage <FiChevronRight size={14} />
            </button>
          )}
        </div>
      </div>

      {/* CORE FEATURE: Interactive Patient Journey Timeline Stepper */}
      <div className="card" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiActivity color="var(--secondary)" />
              Clinical Patient Journey & Status Flow
            </h4>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Track the live progress of {patient.name} across the 12 treatment touchpoints. Click any stage to transition status.
            </p>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            overflowX: 'auto',
            padding: '12px 4px 18px 4px',
            gap: '6px'
          }}
        >
          {JOURNEY_STAGES.map((stage, idx) => {
            const isPassed = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;
            const isPending = idx > currentStageIndex;

            let circleColor = 'var(--text-muted)';
            let bgColor = 'var(--surface-hover)';
            let borderColor = 'var(--border)';

            if (isPassed) {
              circleColor = '#ffffff';
              bgColor = 'var(--success)';
              borderColor = 'var(--success)';
            } else if (isCurrent) {
              circleColor = '#ffffff';
              bgColor = 'var(--secondary)';
              borderColor = 'var(--secondary)';
            }

            return (
              <div
                key={stage}
                onClick={() => handleSelectStage(stage)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
                title={`Set stage to ${stage}`}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: bgColor,
                      border: `2px solid ${borderColor}`,
                      color: circleColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: '700',
                      transition: 'all 0.2s ease',
                      boxShadow: isCurrent ? '0 0 0 4px var(--secondary-light)' : 'none'
                    }}
                  >
                    {isPassed ? <FiCheck size={16} /> : idx + 1}
                  </div>
                  <span
                    style={{
                      fontSize: '11.5px',
                      fontWeight: isCurrent ? '700' : '500',
                      color: isCurrent
                        ? 'var(--secondary)'
                        : isPassed
                        ? 'var(--text-primary)'
                        : 'var(--text-muted)',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {stage}
                  </span>
                </div>

                {idx < JOURNEY_STAGES.length - 1 && (
                  <div
                    style={{
                      width: '30px',
                      height: '2px',
                      backgroundColor: isPassed ? 'var(--success)' : 'var(--border)',
                      margin: '0 4px',
                      marginBottom: '20px',
                      flexShrink: 0
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          borderBottom: '1px solid var(--border)',
          overflowX: 'auto',
          paddingBottom: '2px'
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '10px 16px',
              fontSize: '13.5px',
              fontWeight: activeTab === tab.key ? '600' : '500',
              color: activeTab === tab.key ? 'var(--secondary)' : 'var(--text-secondary)',
              borderBottom: activeTab === tab.key ? '2px solid var(--secondary)' : '2px solid transparent',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'var(--transition)'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'Overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {/* Vitals Summary Card */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <FiActivity color="var(--danger)" />
                <span>Current Recorded Vitals</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setVitalsFormData(patient.vitals || {});
                  setIsVitalsModalOpen(true);
                }}
              >
                Update Vitals
              </Button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div style={{ padding: '12px', backgroundColor: 'var(--surface-hover)', borderRadius: '8px' }}>
                <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Blood Pressure</span>
                <h4 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginTop: '2px' }}>
                  {patient.vitals?.bp || '120/80 mmHg'}
                </h4>
              </div>

              <div style={{ padding: '12px', backgroundColor: 'var(--surface-hover)', borderRadius: '8px' }}>
                <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Pulse Rate</span>
                <h4 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginTop: '2px' }}>
                  {patient.vitals?.pulse || '72'} bpm
                </h4>
              </div>

              <div style={{ padding: '12px', backgroundColor: 'var(--surface-hover)', borderRadius: '8px' }}>
                <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Body Temp</span>
                <h4 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginTop: '2px' }}>
                  {patient.vitals?.temp || '98.6 °F'}
                </h4>
              </div>

              <div style={{ padding: '12px', backgroundColor: 'var(--surface-hover)', borderRadius: '8px' }}>
                <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Oxygen Saturation</span>
                <h4 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--success)', marginTop: '2px' }}>
                  {patient.vitals?.spO2 || '99%'}
                </h4>
              </div>
            </div>
          </div>

          {/* Clinical Profile Info */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <FiClipboard color="var(--primary)" />
                <span>Clinical Notes & Allergies</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <div>
                <strong style={{ color: 'var(--danger)' }}>Known Allergies:</strong>
                <p style={{ color: 'var(--text-primary)', marginTop: '2px' }}>
                  {patient.knownAllergies || 'None reported'}
                </p>
              </div>

              <div>
                <strong style={{ color: 'var(--text-primary)' }}>Medical Conditions:</strong>
                <p style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {patient.medicalConditions || 'None reported'}
                </p>
              </div>

              <div>
                <strong style={{ color: 'var(--text-primary)' }}>Previous History:</strong>
                <p style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {patient.previousHistory || 'No prior surgeries'}
                </p>
              </div>

              <div>
                <strong style={{ color: 'var(--text-primary)' }}>Insurance Provider:</strong>
                <p style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {patient.insuranceProvider} (ID: {patient.insuranceNumber || 'N/A'})
                </p>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <FiUserCheck color="var(--secondary)" />
                <span>Emergency Contact & Address</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Emergency Contact:</span>
                <h5 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginTop: '2px' }}>
                  {patient.emergencyContact}
                </h5>
                <p style={{ color: 'var(--secondary)', fontWeight: '600' }}>
                  {patient.emergencyContactNumber}
                </p>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)' }}>Residential Address:</span>
                <p style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {patient.address}, {patient.city}, {patient.state}
                </p>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)' }}>Registration Date:</span>
                <p style={{ color: 'var(--text-primary)', marginTop: '2px' }}>
                  {formatDate(patient.registeredDate)} (Last visited: {formatDate(patient.lastVisit)})
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Medical History Timeline */}
      {activeTab === 'History' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <FiClock color="var(--primary)" />
              <span>Patient Medical History Timeline</span>
            </div>
          </div>

          <div style={{ position: 'relative', paddingLeft: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div
              style={{
                position: 'absolute',
                left: '10px',
                top: '10px',
                bottom: '10px',
                width: '2px',
                backgroundColor: 'var(--primary-border)'
              }}
            />

            {[
              {
                date: '2026-09-18',
                time: '10:30 AM',
                doctor: patient.assignedDoctorName,
                diagnosis: 'Clinical Consultation & Diagnostic Assessment',
                treatment: 'Laboratory investigation ordered and symptomatic medications prescribed.',
                notes: 'Patient advised to review with blood investigations within 48 hours.'
              },
              {
                date: '2026-09-18',
                time: '09:15 AM',
                doctor: 'Sister Mary Varghese',
                diagnosis: 'Initial Triage & Baseline Vital Signs',
                treatment: 'BP 135/88, SpO2 98%, Pulse 78 bpm. Weight 74 kg.',
                notes: 'Patient comfortable, alert, oriented to time, place and person.'
              },
              {
                date: patient.registeredDate,
                time: '09:00 AM',
                doctor: 'Front Desk Reception',
                diagnosis: 'Patient Registration & Identity Card Issued',
                treatment: `Assigned Patient ID: ${patient.id}. Insurance verification complete.`,
                notes: 'Registered with Star Health Insurance coverage.'
              }
            ].map((hist, idx) => (
              <div key={idx} style={{ position: 'relative' }}>
                <div
                  style={{
                    position: 'absolute',
                    left: '-23px',
                    top: '4px',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary)',
                    boxShadow: '0 0 0 3px var(--primary-light)'
                  }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--secondary)' }}>
                    {formatDate(hist.date)} ({hist.time})
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>• {hist.doctor}</span>
                </div>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginTop: '4px' }}>
                  {hist.diagnosis}
                </h4>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {hist.treatment}
                </p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '2px' }}>
                  Note: {hist.notes}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Appointments */}
      {activeTab === 'Appointments' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <FiCalendar color="var(--primary)" />
              <span>Patient Appointments ({patientAppointments.length})</span>
            </div>
            <Button size="sm" variant="primary" onClick={() => navigate('/appointments')}>
              Book Appointment
            </Button>
          </div>

          <div className="table-container" style={{ border: 'none' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Appointment ID</th>
                  <th>Date & Time</th>
                  <th>Doctor</th>
                  <th>Department</th>
                  <th>Type</th>
                  <th>Reason</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {patientAppointments.map((a) => (
                  <tr key={a.id}>
                    <td style={{ fontWeight: '600', color: 'var(--primary)' }}>{a.id}</td>
                    <td>{formatDate(a.date)} at {a.time}</td>
                    <td>{a.doctorName}</td>
                    <td><span className="badge badge-neutral">{a.department}</span></td>
                    <td>{a.type}</td>
                    <td>{a.reason}</td>
                    <td><StatusBadge status={a.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Vitals Log */}
      {activeTab === 'Vitals' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <FiActivity color="var(--danger)" />
              <span>Vital Signs Tracking Log</span>
            </div>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setVitalsFormData(patient.vitals || {});
                setIsVitalsModalOpen(true);
              }}
            >
              Record New Vitals
            </Button>
          </div>

          <div className="table-container" style={{ border: 'none' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Blood Pressure</th>
                  <th>Pulse</th>
                  <th>Temperature</th>
                  <th>SpO2</th>
                  <th>Weight / Height</th>
                  <th>Recorded By</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{formatDate(patient.lastVisit)} (Current)</td>
                  <td style={{ fontWeight: '600', color: 'var(--primary)' }}>{patient.vitals?.bp}</td>
                  <td>{patient.vitals?.pulse} bpm</td>
                  <td>{patient.vitals?.temp}</td>
                  <td style={{ color: 'var(--success)', fontWeight: '600' }}>{patient.vitals?.spO2}</td>
                  <td>{patient.vitals?.weight} / {patient.vitals?.height}</td>
                  <td>Staff Nurse Mary</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Lab Reports */}
      {activeTab === 'Lab' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <FiClipboard color="var(--secondary)" />
              <span>Laboratory Test Orders & Results</span>
            </div>
            <Button size="sm" variant="primary" onClick={() => navigate('/laboratory')}>
              Order Lab Test
            </Button>
          </div>

          {patientLabs.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', padding: '16px 0' }}>No laboratory tests ordered for this patient yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {patientLabs.map((test) => (
                <div
                  key={test.id}
                  style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--surface-hover)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--primary)' }}>{test.id}</span>
                      <h4 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)' }}>
                        {test.testName}
                      </h4>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        Requested: {formatDate(test.requestedDate)} • Sample: {test.sampleType} • Technician: {test.technician}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <StatusBadge status={test.status} />
                    </div>
                  </div>

                  {test.parameters && test.parameters.length > 0 && (
                    <div style={{ marginTop: '14px' }}>
                      <table className="data-table" style={{ background: 'var(--surface)' }}>
                        <thead>
                          <tr>
                            <th>Parameter</th>
                            <th>Observed Value</th>
                            <th>Reference Range</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {test.parameters.map((p, pIdx) => (
                            <tr key={pIdx}>
                              <td style={{ fontWeight: '500' }}>{p.name}</td>
                              <td style={{ fontWeight: '600' }}>{p.observed}</td>
                              <td style={{ color: 'var(--text-muted)' }}>{p.normalRange}</td>
                              <td><StatusBadge status={p.status} /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div style={{ marginTop: '10px', fontSize: '13px', color: 'var(--text-primary)' }}>
                    <strong>Clinical Summary:</strong> {test.summaryResult}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 6: Prescriptions */}
      {activeTab === 'Prescriptions' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <FiBox color="var(--primary)" />
              <span>Medical Prescriptions & Medications</span>
            </div>
            <Button size="sm" variant="primary" onClick={() => navigate('/pharmacy')}>
              Open Pharmacy
            </Button>
          </div>

          {patientPrescriptions.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', padding: '16px 0' }}>No active prescriptions found.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {patientPrescriptions.map((rx) => (
                <div
                  key={rx.id}
                  style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--surface-hover)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--primary)' }}>{rx.id}</span>
                      <h4 style={{ fontSize: '14.5px', fontWeight: '600' }}>Diagnosis: {rx.diagnosis}</h4>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        Prescribed by {rx.doctorName} on {formatDate(rx.date)}
                      </span>
                    </div>
                    <StatusBadge status={rx.status} />
                  </div>

                  <table className="data-table" style={{ background: 'var(--surface)' }}>
                    <thead>
                      <tr>
                        <th>Medicine</th>
                        <th>Dosage</th>
                        <th>Frequency</th>
                        <th>Duration</th>
                        <th>Instructions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rx.items.map((item, i) => (
                        <tr key={i}>
                          <td style={{ fontWeight: '600' }}>{item.medicine}</td>
                          <td>{item.dosage}</td>
                          <td>{item.frequency}</td>
                          <td>{item.duration}</td>
                          <td style={{ color: 'var(--text-secondary)' }}>{item.instructions}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {rx.notes && (
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px', fontStyle: 'italic' }}>
                      Instructions: {rx.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 7: Billing */}
      {activeTab === 'Billing' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <FiCreditCard color="var(--primary)" />
              <span>Patient Invoices & Billing Summary</span>
            </div>
            <Button size="sm" variant="primary" onClick={() => navigate('/billing')}>
              Generate New Invoice
            </Button>
          </div>

          <div className="table-container" style={{ border: 'none' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Bill ID</th>
                  <th>Date</th>
                  <th>Total Amount</th>
                  <th>Paid Amount</th>
                  <th>Balance Due</th>
                  <th>Status</th>
                  <th>Method</th>
                </tr>
              </thead>
              <tbody>
                {patientBills.map((b) => (
                  <tr key={b.id}>
                    <td style={{ fontWeight: '600', color: 'var(--primary)' }}>{b.id}</td>
                    <td>{formatDate(b.billDate)}</td>
                    <td style={{ fontWeight: '600' }}>{formatCurrency(b.totalAmount)}</td>
                    <td style={{ color: 'var(--success)' }}>{formatCurrency(b.paidAmount)}</td>
                    <td style={{ color: b.balance > 0 ? 'var(--danger)' : 'var(--text-muted)', fontWeight: '600' }}>
                      {formatCurrency(b.balance)}
                    </td>
                    <td><StatusBadge status={b.paymentStatus} /></td>
                    <td><span className="badge badge-neutral">{b.paymentMethod}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 8: Final Medical Report */}
      {activeTab === 'FinalReport' && (
        <div className="card printable-document" style={{ padding: '28px', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', borderBottom: '2px solid var(--primary)', paddingBottom: '16px', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--primary)' }}>
                Medix Super Specialty Hospital
              </h2>
              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                Sector 4, HSR Layout, Outer Ring Road, Bengaluru • Reg: MED-KA-2024-88941
              </p>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginTop: '10px' }}>
                COMPREHENSIVE FINAL MEDICAL & DISCHARGE SUMMARY
              </h3>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="badge badge-success" style={{ fontSize: '13px', padding: '6px 12px' }}>
                {patientReport?.status || 'Active Treatment Record'}
              </span>
              <div className="no-print" style={{ marginTop: '10px' }}>
                <Button variant="outline" size="sm" icon={FiPrinter} onClick={triggerPrint}>
                  Print Report
                </Button>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '20px', padding: '14px', backgroundColor: 'var(--surface-hover)', borderRadius: '8px' }}>
            <div><strong>Patient Name:</strong> {patient.name}</div>
            <div><strong>Patient ID:</strong> {patient.id}</div>
            <div><strong>Age / Gender:</strong> {patient.age}y / {patient.gender}</div>
            <div><strong>Blood Group:</strong> {patient.bloodGroup}</div>
            <div><strong>Attending Doctor:</strong> {patient.assignedDoctorName}</div>
            <div><strong>Date of Discharge:</strong> {formatDate(new Date().toISOString())}</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '13.5px', lineHeight: 1.6 }}>
            <div>
              <h4 style={{ fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>
                1. Final Diagnosis & Clinical Presentation
              </h4>
              <p>{patientReport?.finalDiagnosis || patient.medicalConditions || 'Essential evaluation completed.'}</p>
            </div>

            <div>
              <h4 style={{ fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>
                2. Summary of Case & Interventions
              </h4>
              <p>{patientReport?.summaryOfCase || 'Patient underwent clinical consultation, baseline investigations, and targeted medical therapy.'}</p>
            </div>

            <div>
              <h4 style={{ fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>
                3. Vitals at Discharge
              </h4>
              <p>
                BP: {patient.vitals?.bp} • Pulse: {patient.vitals?.pulse} bpm • Temp: {patient.vitals?.temp} • SpO2: {patient.vitals?.spO2} (Stable on room air)
              </p>
            </div>

            <div>
              <h4 style={{ fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>
                4. Discharge Medications & Follow-up Instructions
              </h4>
              <p>{patientReport?.dietAdvice || 'Continue prescribed medications as per RX sheet. Maintain adequate hydration and follow up in OPD after 2 weeks.'}</p>
            </div>
          </div>

          <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <p style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Electronically generated on Medix HMS v2.4.1</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '180px', borderBottom: '1px solid var(--text-primary)', marginBottom: '4px' }} />
              <strong style={{ fontSize: '12px' }}>{patient.assignedDoctorName}</strong>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Authorized Medical Signatory</p>
            </div>
          </div>
        </div>
      )}

      {/* Edit Record Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Patient Details"
        subtitle={`Updating demographic details for ${patient.name}`}
        footer={
          <>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </>
        }
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="text"
              className="form-control"
              value={editFormData.phone || ''}
              onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={editFormData.email || ''}
              onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
            />
          </div>
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Address</label>
            <input
              type="text"
              className="form-control"
              value={editFormData.address || ''}
              onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              className="form-control"
              value={editFormData.status || 'Active'}
              onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
            >
              <option value="Active">Active</option>
              <option value="Admitted">Admitted</option>
              <option value="Critical">Critical</option>
              <option value="Discharged">Discharged</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Treatment Stage</label>
            <select
              className="form-control"
              value={editFormData.currentStage || 'Registration'}
              onChange={(e) => setEditFormData({ ...editFormData, currentStage: e.target.value })}
            >
              {JOURNEY_STAGES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Modal>

      {/* Update Vitals Modal */}
      <Modal
        isOpen={isVitalsModalOpen}
        onClose={() => setIsVitalsModalOpen(false)}
        title="Record Vital Signs"
        subtitle={`Enter latest vitals recorded for ${patient.name}`}
        footer={
          <>
            <Button variant="outline" onClick={() => setIsVitalsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveVitals}>
              Save Vitals
            </Button>
          </>
        }
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div className="form-group">
            <label className="form-label">Blood Pressure</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. 120/80 mmHg"
              value={vitalsFormData.bp || ''}
              onChange={(e) => setVitalsFormData({ ...vitalsFormData, bp: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Pulse (bpm)</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. 72"
              value={vitalsFormData.pulse || ''}
              onChange={(e) => setVitalsFormData({ ...vitalsFormData, pulse: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Temperature</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. 98.6 °F"
              value={vitalsFormData.temp || ''}
              onChange={(e) => setVitalsFormData({ ...vitalsFormData, temp: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">SpO2 (%)</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. 99%"
              value={vitalsFormData.spO2 || ''}
              onChange={(e) => setVitalsFormData({ ...vitalsFormData, spO2: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Weight</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. 70 kg"
              value={vitalsFormData.weight || ''}
              onChange={(e) => setVitalsFormData({ ...vitalsFormData, weight: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Height</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. 172 cm"
              value={vitalsFormData.height || ''}
              onChange={(e) => setVitalsFormData({ ...vitalsFormData, height: e.target.value })}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
