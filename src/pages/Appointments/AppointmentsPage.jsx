import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHospital } from '../../context/HospitalContext';
import { PageHeader } from '../../components/Common/PageHeader/PageHeader';
import { DataTable } from '../../components/Common/DataTable/DataTable';
import { Button } from '../../components/Common/Button/Button';
import { StatusBadge } from '../../components/Common/StatusBadge/StatusBadge';
import { Modal } from '../../components/Common/Modal/Modal';
import { formatDate } from '../../utils/formatters';
import {
  FiCalendar,
  FiClock,
  FiPlus,
  FiList,
  FiGrid,
  FiCheckCircle,
  FiXCircle,
  FiUserCheck,
  FiEye
} from 'react-icons/fi';

export const AppointmentsPage = () => {
  const navigate = useNavigate();
  const {
    appointments,
    patients,
    doctors,
    addAppointment,
    updateAppointmentStatus,
    deleteAppointment
  } = useHospital();

  const [viewMode, setViewMode] = useState('list'); // 'list' | 'calendar'
  const [calendarViewType, setCalendarViewType] = useState('Day'); // 'Day' | 'Week' | 'Month'
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // Form State for Booking
  const [formData, setFormData] = useState({
    patientId: patients[0]?.id || '',
    doctorId: doctors[0]?.id || '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM',
    type: 'Consultation',
    priority: 'Normal',
    reason: ''
  });

  const filteredAppointments = useMemo(() => {
    return appointments.filter((a) => {
      if (statusFilter !== 'ALL' && a.status !== statusFilter) return false;
      if (typeFilter !== 'ALL' && a.type !== typeFilter) return false;
      return true;
    });
  }, [appointments, statusFilter, typeFilter]);

  const handleCreateAppointment = (e) => {
    e.preventDefault();
    const selPatient = patients.find((p) => p.id === formData.patientId);
    const selDoctor = doctors.find((d) => d.id === formData.doctorId);

    addAppointment({
      ...formData,
      patientName: selPatient ? selPatient.name : 'Unknown Patient',
      doctorName: selDoctor ? selDoctor.name : 'Unknown Doctor',
      department: selDoctor ? selDoctor.department : 'General OPD',
      fee: selDoctor ? selDoctor.consultationFee : 600
    });

    setIsNewModalOpen(false);
  };

  const columns = [
    {
      header: 'APT ID',
      accessor: 'id',
      sortable: true,
      width: '120px',
      cell: (row) => <span style={{ fontWeight: '600', color: 'var(--primary)' }}>{row.id}</span>
    },
    {
      header: 'Date & Time',
      sortable: true,
      accessor: 'date',
      cell: (row) => (
        <div>
          <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{formatDate(row.date)}</div>
          <div style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '500' }}>
            <FiClock size={11} style={{ marginRight: '3px' }} />
            {row.time}
          </div>
        </div>
      )
    },
    {
      header: 'Patient',
      accessor: 'patientName',
      sortable: true,
      cell: (row) => (
        <div
          onClick={() => navigate(`/patients/${row.patientId}`)}
          style={{ cursor: 'pointer' }}
        >
          <div style={{ fontWeight: '600' }}>{row.patientName}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{row.patientId}</div>
        </div>
      )
    },
    {
      header: 'Doctor & Department',
      accessor: 'doctorName',
      sortable: true,
      cell: (row) => (
        <div>
          <div style={{ fontWeight: '500' }}>{row.doctorName}</div>
          <span className="badge badge-neutral" style={{ fontSize: '11px' }}>{row.department}</span>
        </div>
      )
    },
    {
      header: 'Type',
      accessor: 'type',
      sortable: true
    },
    {
      header: 'Reason / Priority',
      cell: (row) => (
        <div>
          <div style={{ fontSize: '12.5px' }}>{row.reason || 'General checkup'}</div>
          {row.priority === 'Critical' && <span className="badge badge-danger" style={{ fontSize: '10px' }}>Critical</span>}
          {row.priority === 'Urgent' && <span className="badge badge-warning" style={{ fontSize: '10px' }}>Urgent</span>}
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      sortable: true,
      cell: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Quick Action',
      width: '150px',
      cell: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {row.status === 'Scheduled' && (
            <button
              onClick={() => updateAppointmentStatus(row.id, 'Checked In')}
              className="btn btn-secondary btn-sm"
              title="Mark Patient as Checked In"
            >
              Check In
            </button>
          )}
          {row.status === 'Checked In' && (
            <button
              onClick={() => updateAppointmentStatus(row.id, 'In Consultation')}
              className="btn btn-primary btn-sm"
              title="Start Doctor Consultation"
            >
              Consult
            </button>
          )}
          {row.status === 'In Consultation' && (
            <button
              onClick={() => updateAppointmentStatus(row.id, 'Completed')}
              className="btn btn-success btn-sm"
              title="Mark Appointment Completed"
            >
              Complete
            </button>
          )}
          {row.status !== 'Completed' && row.status !== 'Cancelled' && (
            <button
              onClick={() => updateAppointmentStatus(row.id, 'Cancelled')}
              className="btn btn-ghost btn-sm"
              style={{ color: 'var(--danger)' }}
              title="Cancel Appointment"
            >
              <FiXCircle size={15} />
            </button>
          )}
          <button
            onClick={() => navigate(`/patients/${row.patientId}`)}
            className="btn btn-ghost btn-sm"
            title="Open Patient Profile"
          >
            <FiEye size={15} />
          </button>
        </div>
      )
    }
  ];

  const filterControls = (
    <>
      <select
        className="form-control"
        style={{ width: 'auto', padding: '7px 12px' }}
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="ALL">All Statuses</option>
        <option value="Scheduled">Scheduled</option>
        <option value="Checked In">Checked In</option>
        <option value="Waiting">Waiting</option>
        <option value="In Consultation">In Consultation</option>
        <option value="Completed">Completed</option>
        <option value="Cancelled">Cancelled</option>
      </select>

      <select
        className="form-control"
        style={{ width: 'auto', padding: '7px 12px' }}
        value={typeFilter}
        onChange={(e) => setTypeFilter(e.target.value)}
      >
        <option value="ALL">All Types</option>
        <option value="Consultation">Consultation</option>
        <option value="Follow-up">Follow-up</option>
        <option value="Emergency">Emergency</option>
        <option value="Routine Checkup">Routine Checkup</option>
        <option value="Lab Review">Lab Review</option>
      </select>
    </>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <PageHeader
        title="Appointments & Scheduling"
        subtitle="Coordinate OPD visits, doctor consultations, patient check-ins and clinical queues."
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* View Mode Toggle */}
          <div
            style={{
              display: 'flex',
              padding: '2px',
              backgroundColor: 'var(--surface-hover)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)'
            }}
          >
            <button
              onClick={() => setViewMode('list')}
              className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ padding: '6px 12px' }}
            >
              <FiList size={14} /> List View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`btn btn-sm ${viewMode === 'calendar' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ padding: '6px 12px' }}
            >
              <FiGrid size={14} /> Calendar View
            </button>
          </div>

          <Button
            variant="primary"
            icon={FiPlus}
            onClick={() => setIsNewModalOpen(true)}
          >
            New Appointment
          </Button>
        </div>
      </PageHeader>

      {/* View Mode: List vs Calendar */}
      {viewMode === 'list' ? (
        <DataTable
          columns={columns}
          data={filteredAppointments}
          searchPlaceholder="Search by patient, doctor, reason, ID..."
          searchKeys={['patientName', 'doctorName', 'id', 'department', 'reason']}
          filterControls={filterControls}
        />
      ) : (
        /* Calendar Schedule View */
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <FiCalendar color="var(--primary)" />
              <span>OPD Calendar Schedule</span>
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              {['Day', 'Week', 'Month'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setCalendarViewType(mode)}
                  style={{
                    padding: '5px 12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    borderRadius: '6px',
                    backgroundColor: calendarViewType === mode ? 'var(--primary)' : 'var(--surface-hover)',
                    color: calendarViewType === mode ? '#ffffff' : 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  {mode} View
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px', padding: '10px 0' }}>
            {filteredAppointments.map((apt) => (
              <div
                key={apt.id}
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--surface-hover)',
                  borderLeft: `4px solid ${apt.status === 'Completed' ? 'var(--success)' : apt.status === 'Cancelled' ? 'var(--danger)' : 'var(--primary)'}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--primary)' }}>
                    {apt.time}
                  </span>
                  <StatusBadge status={apt.status} />
                </div>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: '600' }}>{apt.patientName}</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {apt.doctorName} • {apt.department}
                  </p>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Reason: {apt.reason}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', paddingTop: '6px', borderTop: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{formatDate(apt.date)}</span>
                  <button
                    onClick={() => navigate(`/patients/${apt.patientId}`)}
                    style={{ fontSize: '12px', color: 'var(--secondary)', fontWeight: '600', cursor: 'pointer' }}
                  >
                    View Record →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Appointment Modal */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title="Schedule New Appointment"
        subtitle="Book OPD clinical slot for registered patient"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsNewModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateAppointment}>
              Confirm Booking
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateAppointment} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Select Patient *</label>
            <select
              className="form-control"
              value={formData.patientId}
              onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.id} - {p.gender}, {p.age}y - {p.phone})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Select Doctor & Department *</label>
            <select
              className="form-control"
              value={formData.doctorId}
              onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
            >
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.department} - {d.status})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Appointment Date</label>
            <input
              type="date"
              className="form-control"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Time Slot</label>
            <select
              className="form-control"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            >
              <option value="09:00 AM">09:00 AM</option>
              <option value="09:30 AM">09:30 AM</option>
              <option value="10:00 AM">10:00 AM</option>
              <option value="10:30 AM">10:30 AM</option>
              <option value="11:00 AM">11:00 AM</option>
              <option value="11:30 AM">11:30 AM</option>
              <option value="12:00 PM">12:00 PM</option>
              <option value="02:00 PM">02:00 PM</option>
              <option value="02:30 PM">02:30 PM</option>
              <option value="03:00 PM">03:00 PM</option>
              <option value="03:30 PM">03:30 PM</option>
              <option value="04:00 PM">04:00 PM</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Appointment Type</label>
            <select
              className="form-control"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="Consultation">Consultation</option>
              <option value="Follow-up">Follow-up</option>
              <option value="Routine Checkup">Routine Checkup</option>
              <option value="Emergency">Emergency</option>
              <option value="Lab Review">Lab Review</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Priority</label>
            <select
              className="form-control"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            >
              <option value="Normal">Normal</option>
              <option value="Urgent">Urgent</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Chief Complaint / Reason for Visit</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Chest pain on exertion, recurrent migraine, fever"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
