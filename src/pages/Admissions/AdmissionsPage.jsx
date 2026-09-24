import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHospital } from '../../context/HospitalContext';
import { PageHeader } from '../../components/Common/PageHeader/PageHeader';
import { StatCard } from '../../components/Common/StatCard/StatCard';
import { DataTable } from '../../components/Common/DataTable/DataTable';
import { Button } from '../../components/Common/Button/Button';
import { StatusBadge } from '../../components/Common/StatusBadge/StatusBadge';
import { Modal } from '../../components/Common/Modal/Modal';
import { formatDate } from '../../utils/formatters';
import {
  FiBriefcase,
  FiPlus,
  FiCheckCircle,
  FiHome,
  FiClock,
  FiShield,
  FiLayers,
  FiUser
} from 'react-icons/fi';

export const AdmissionsPage = () => {
  const navigate = useNavigate();
  const {
    admissions,
    beds,
    patients,
    doctors,
    addAdmission,
    dischargeAdmission,
    updateBedStatus
  } = useHospital();

  const [activeWardTab, setActiveWardTab] = useState('All');
  const [isAdmitModalOpen, setIsAdmitModalOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    patientId: patients[0]?.id || '',
    doctorId: doctors[0]?.id || '',
    ward: 'General Ward',
    room: 'Ward 201',
    bedNumber: 'Bed 2',
    reason: 'Observation & inpatient treatment',
    attendant: '',
    emergencyContact: '',
    insurance: 'Star Health'
  });

  // Calculate Metrics
  const totalAdmissionsCount = admissions.length;
  const currentInpatientsCount = admissions.filter((a) => a.status === 'Admitted' || a.status === 'Under Treatment').length;
  const availableBedsCount = beds.filter((b) => b.status === 'Available').length;
  const dischargedCount = admissions.filter((a) => a.status === 'Discharged').length;

  const wards = ['All', 'ICU', 'General Ward', 'Private Ward', 'Emergency'];

  const filteredBeds = useMemo(() => {
    if (activeWardTab === 'All') return beds;
    return beds.filter((b) => b.ward === activeWardTab);
  }, [beds, activeWardTab]);

  const handleSaveAdmission = (e) => {
    e.preventDefault();
    const selPatient = patients.find((p) => p.id === formData.patientId);
    const selDoctor = doctors.find((d) => d.id === formData.doctorId);

    addAdmission({
      ...formData,
      patientName: selPatient ? selPatient.name : 'Patient',
      doctorName: selDoctor ? selDoctor.name : 'Doctor',
      department: selDoctor ? selDoctor.department : 'General'
    });

    setIsAdmitModalOpen(false);
  };

  const columns = [
    {
      header: 'Admission ID',
      accessor: 'id',
      sortable: true,
      width: '130px',
      cell: (row) => <span style={{ fontWeight: '600', color: 'var(--primary)' }}>{row.id}</span>
    },
    {
      header: 'Patient Name',
      accessor: 'patientName',
      sortable: true,
      cell: (row) => (
        <div onClick={() => navigate(`/patients/${row.patientId}`)} style={{ cursor: 'pointer' }}>
          <div style={{ fontWeight: '600' }}>{row.patientName}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{row.patientId}</div>
        </div>
      )
    },
    {
      header: 'Attending Doctor',
      accessor: 'doctorName',
      sortable: true
    },
    {
      header: 'Ward / Room / Bed',
      cell: (row) => (
        <div>
          <span className="badge badge-neutral" style={{ fontSize: '11px' }}>{row.ward}</span>
          <div style={{ fontSize: '12px', marginTop: '2px', fontWeight: '500' }}>
            {row.room} • {row.bedNumber}
          </div>
        </div>
      )
    },
    {
      header: 'Admission Date',
      accessor: 'admissionDate',
      sortable: true,
      cell: (row) => formatDate(row.admissionDate)
    },
    {
      header: 'Status',
      accessor: 'status',
      sortable: true,
      cell: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Action',
      width: '120px',
      cell: (row) => (
        <div>
          {row.status !== 'Discharged' ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => dischargeAdmission(row.id)}
            >
              Discharge
            </Button>
          ) : (
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Discharged {formatDate(row.dischargeDate)}
            </span>
          )}
        </div>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <PageHeader
        title="Inpatient Admissions & Bed Management"
        subtitle="Manage hospital ward occupancy, inpatient admissions, bed allocations, and clinical discharges."
      >
        <Button variant="primary" icon={FiPlus} onClick={() => setIsAdmitModalOpen(true)}>
          Admit Patient
        </Button>
      </PageHeader>

      {/* Top Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <StatCard
          title="Total Admissions"
          value={totalAdmissionsCount}
          subtitle="Cumulative hospital stay records"
          icon={FiBriefcase}
          color="primary"
        />
        <StatCard
          title="Current Inpatients"
          value={currentInpatientsCount}
          subtitle="Patients currently occupying beds"
          icon={FiUser}
          color="secondary"
        />
        <StatCard
          title="Available Beds"
          value={`${availableBedsCount} / ${beds.length}`}
          subtitle="Ready for immediate admission"
          icon={FiLayers}
          color="success"
        />
        <StatCard
          title="Total Discharges"
          value={dischargedCount}
          subtitle="Patients cleared with reports"
          icon={FiCheckCircle}
          color="info"
        />
      </div>

      {/* Interactive Bed Allocation Grid */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <FiLayers color="var(--primary)" />
            <span>Interactive Ward & Bed Occupancy Board</span>
          </div>
          <div style={{ display: 'flex', gap: '4px', overflowX: 'auto' }}>
            {wards.map((w) => (
              <button
                key={w}
                onClick={() => setActiveWardTab(w)}
                style={{
                  padding: '5px 12px',
                  fontSize: '12px',
                  fontWeight: '600',
                  borderRadius: '6px',
                  backgroundColor: activeWardTab === w ? 'var(--primary)' : 'var(--surface-hover)',
                  color: activeWardTab === w ? '#ffffff' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                {w}
              </button>
            ))}
          </div>
        </div>

        {/* Bed Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px', padding: '10px 0' }}>
          {filteredBeds.map((bed) => {
            let statusColor = 'var(--success)';
            if (bed.status === 'Occupied') statusColor = 'var(--primary)';
            if (bed.status === 'Reserved') statusColor = 'var(--warning)';
            if (bed.status === 'Maintenance') statusColor = 'var(--danger)';

            return (
              <div
                key={bed.id}
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--surface-hover)',
                  borderTop: `4px solid ${statusColor}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{bed.ward}</span>
                  <StatusBadge status={bed.status} />
                </div>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>
                    {bed.bedNumber} ({bed.room})
                  </h4>
                  {bed.patientName ? (
                    <p style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '600', marginTop: '2px' }}>
                      Patient: {bed.patientName}
                    </p>
                  ) : (
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Vacant & sanitized
                    </p>
                  )}
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Toggle:</span>
                  <select
                    style={{ fontSize: '11px', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-primary)' }}
                    value={bed.status}
                    onChange={(e) => updateBedStatus(bed.id, e.target.value)}
                  >
                    <option value="Available">Available</option>
                    <option value="Occupied">Occupied</option>
                    <option value="Reserved">Reserved</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Admission Registry Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <FiBriefcase color="var(--secondary)" />
            <span>Inpatient Admission Records</span>
          </div>
        </div>
        <DataTable
          columns={columns}
          data={admissions}
          searchPlaceholder="Search admission by patient, doctor, ward, ID..."
          searchKeys={['patientName', 'doctorName', 'ward', 'id', 'room']}
        />
      </div>

      {/* Admit Patient Modal */}
      <Modal
        isOpen={isAdmitModalOpen}
        onClose={() => setIsAdmitModalOpen(false)}
        title="Admit Inpatient"
        subtitle="Assign ward, room, and bed for inpatient treatment"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsAdmitModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveAdmission}>
              Confirm Admission
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveAdmission} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Select Patient *</label>
            <select
              className="form-control"
              value={formData.patientId}
              onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.id} - {p.gender}, {p.age}y - {p.status})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Admitting Consultant Doctor *</label>
            <select
              className="form-control"
              value={formData.doctorId}
              onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
            >
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.department})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Ward</label>
            <select
              className="form-control"
              value={formData.ward}
              onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
            >
              <option value="ICU">ICU</option>
              <option value="General Ward">General Ward</option>
              <option value="Private Ward">Private Ward</option>
              <option value="Emergency">Emergency</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Room & Bed Number</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Ward 201 - Bed 2"
              value={formData.room}
              onChange={(e) => setFormData({ ...formData, room: e.target.value })}
            />
          </div>

          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Reason for Admission</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Post-op recovery, acute chest infection, monitoring"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Attendant Name & Relation</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Shalini (Wife)"
              value={formData.attendant}
              onChange={(e) => setFormData({ ...formData, attendant: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Insurance Provider</label>
            <input
              type="text"
              className="form-control"
              value={formData.insurance}
              onChange={(e) => setFormData({ ...formData, insurance: e.target.value })}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
