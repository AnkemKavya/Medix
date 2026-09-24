import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHospital } from '../../context/HospitalContext';
import { PageHeader } from '../../components/Common/PageHeader/PageHeader';
import { DataTable } from '../../components/Common/DataTable/DataTable';
import { Button } from '../../components/Common/Button/Button';
import { StatusBadge } from '../../components/Common/StatusBadge/StatusBadge';
import { Modal } from '../../components/Common/Modal/Modal';
import { ConfirmDialog } from '../../components/Common/Modal/ConfirmDialog';
import { formatCurrency } from '../../utils/formatters';
import {
  FiUserPlus,
  FiCalendar,
  FiEdit,
  FiTrash2,
  FiClock,
  FiUsers,
  FiAward,
  FiMapPin,
  FiPhone,
  FiMail
} from 'react-icons/fi';

export const DoctorsPage = () => {
  const navigate = useNavigate();
  const { doctors, addDoctor, updateDoctor, deleteDoctor } = useHospital();

  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Form State for Add/Edit
  const [formData, setFormData] = useState({
    name: '',
    department: 'Cardiology',
    specialization: '',
    qualification: '',
    experience: '',
    phone: '',
    email: '',
    room: 'OPD Room 101',
    consultationFee: 700,
    status: 'Available',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    workingHours: '09:00 AM - 02:00 PM'
  });

  const departments = useMemo(() => {
    const set = new Set(doctors.map((d) => d.department));
    return ['ALL', ...Array.from(set)];
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    return doctors.filter((d) => {
      if (departmentFilter !== 'ALL' && d.department !== departmentFilter) return false;
      if (statusFilter !== 'ALL' && d.status !== statusFilter) return false;
      return true;
    });
  }, [doctors, departmentFilter, statusFilter]);

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      department: 'Cardiology',
      specialization: '',
      qualification: '',
      experience: '',
      phone: '',
      email: '',
      room: 'OPD Room 101',
      consultationFee: 700,
      status: 'Available',
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      workingHours: '09:00 AM - 02:00 PM'
    });
    setIsAddModalOpen(true);
  };

  const handleSaveDoctor = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    addDoctor(formData);
    setIsAddModalOpen(false);
  };

  const handleStatusChange = (docId, newStatus) => {
    updateDoctor(docId, { status: newStatus });
  };

  const columns = [
    {
      header: 'Doctor Details',
      accessor: 'name',
      sortable: true,
      cell: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src={row.avatar}
            alt={row.name}
            style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div>
            <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{row.name}</div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
              {row.qualification} • {row.experience}
            </div>
          </div>
        </div>
      )
    },
    {
      header: 'Department',
      accessor: 'department',
      sortable: true,
      cell: (row) => <span className="badge badge-neutral">{row.department}</span>
    },
    {
      header: 'Specialization',
      accessor: 'specialization'
    },
    {
      header: 'Contact',
      cell: (row) => (
        <div style={{ fontSize: '12.5px' }}>
          <div>{row.phone}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{row.email}</div>
        </div>
      )
    },
    {
      header: 'OPD Room & Fee',
      cell: (row) => (
        <div style={{ fontSize: '12.5px' }}>
          <div>{row.room}</div>
          <div style={{ fontWeight: '600', color: 'var(--primary)' }}>{formatCurrency(row.consultationFee)}</div>
        </div>
      )
    },
    {
      header: 'Working Hours',
      cell: (row) => (
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          {row.workingHours}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      sortable: true,
      cell: (row) => (
        <select
          className="form-control"
          style={{ width: 'auto', padding: '4px 8px', fontSize: '12px', height: 'auto' }}
          value={row.status}
          onChange={(e) => handleStatusChange(row.id, e.target.value)}
        >
          <option value="Available">Available</option>
          <option value="On Duty">On Duty</option>
          <option value="On Leave">On Leave</option>
          <option value="Half Day">Half Day</option>
          <option value="Unavailable">Unavailable</option>
        </select>
      )
    },
    {
      header: 'Actions',
      width: '120px',
      cell: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => {
              setSelectedDoctor(row);
              setIsScheduleModalOpen(true);
            }}
            className="btn btn-ghost btn-sm"
            title="View Doctor Schedule & Profile"
          >
            <FiCalendar size={15} />
          </button>
          <button
            onClick={() => setDeleteTarget(row)}
            className="btn btn-ghost btn-sm"
            style={{ color: 'var(--danger)' }}
            title="Remove Doctor"
          >
            <FiTrash2 size={15} />
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
        value={departmentFilter}
        onChange={(e) => setDepartmentFilter(e.target.value)}
      >
        {departments.map((dep) => (
          <option key={dep} value={dep}>
            {dep === 'ALL' ? 'All Departments' : dep}
          </option>
        ))}
      </select>

      <select
        className="form-control"
        style={{ width: 'auto', padding: '7px 12px' }}
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="ALL">All Statuses</option>
        <option value="Available">Available</option>
        <option value="On Duty">On Duty</option>
        <option value="On Leave">On Leave</option>
        <option value="Half Day">Half Day</option>
      </select>
    </>
  );

  return (
    <div>
      <PageHeader
        title="Doctors & Medical Consultants"
        subtitle="Manage specialist doctor profiles, OPD duty schedules, and real-time availability."
      >
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button variant="outline" icon={FiUsers} onClick={() => navigate('/staff')}>
            View Hospital Staff
          </Button>
          <Button variant="primary" icon={FiUserPlus} onClick={handleOpenAdd}>
            Add Doctor
          </Button>
        </div>
      </PageHeader>

      <DataTable
        columns={columns}
        data={filteredDoctors}
        searchPlaceholder="Search doctor by name, department, specialization..."
        searchKeys={['name', 'department', 'specialization', 'phone', 'email']}
        filterControls={filterControls}
      />

      {/* Add Doctor Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Doctor"
        subtitle="Register medical practitioner to hospital roster"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveDoctor}>
              Save Doctor
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveDoctor} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Doctor Name (with Salutation) *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Dr. Raghavendra Rao"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Department</label>
            <select
              className="form-control"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            >
              <option value="Cardiology">Cardiology</option>
              <option value="General Medicine">General Medicine</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Neurology">Neurology</option>
              <option value="Gynecology">Gynecology</option>
              <option value="Pulmonology">Pulmonology</option>
              <option value="Dermatology">Dermatology</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Specialization</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Spine Specialist"
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Medical Qualification</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. MBBS, MD (Medicine)"
              value={formData.qualification}
              onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Years of Experience</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. 12 years"
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="text"
              className="form-control"
              placeholder="+91 98450 00000"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="doctor@medixhms.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Assigned OPD Room</label>
            <input
              type="text"
              className="form-control"
              placeholder="OPD Room 102"
              value={formData.room}
              onChange={(e) => setFormData({ ...formData, room: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Consultation Fee (₹)</label>
            <input
              type="number"
              className="form-control"
              value={formData.consultationFee}
              onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
            />
          </div>

          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Working Hours</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. 09:00 AM - 02:00 PM"
              value={formData.workingHours}
              onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
            />
          </div>
        </form>
      </Modal>

      {/* Doctor Schedule & Profile Modal */}
      {selectedDoctor && (
        <Modal
          isOpen={isScheduleModalOpen}
          onClose={() => setIsScheduleModalOpen(false)}
          title={`Doctor Profile & Weekly Schedule`}
          subtitle={`${selectedDoctor.name} • ${selectedDoctor.department}`}
          maxWidth="550px"
          footer={
            <Button variant="primary" onClick={() => setIsScheduleModalOpen(false)}>
              Done
            </Button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <img
                src={selectedDoctor.avatar}
                alt={selectedDoctor.name}
                style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: '700' }}>{selectedDoctor.name}</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  {selectedDoctor.specialization} ({selectedDoctor.qualification})
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  <StatusBadge status={selectedDoctor.status} />
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{selectedDoctor.room}</span>
                </div>
              </div>
            </div>

            <div>
              <h5 style={{ fontSize: '13.5px', fontWeight: '600', marginBottom: '8px' }}>
                Weekly Consultation Timetable
              </h5>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                  const isWorking = selectedDoctor.workingDays?.includes(day);
                  return (
                    <div
                      key={day}
                      style={{
                        padding: '8px 10px',
                        borderRadius: '6px',
                        textAlign: 'center',
                        fontSize: '12px',
                        backgroundColor: isWorking ? 'var(--primary-light)' : 'var(--surface-hover)',
                        border: `1px solid ${isWorking ? 'var(--primary-border)' : 'var(--border)'}`,
                        color: isWorking ? 'var(--primary)' : 'var(--text-muted)'
                      }}
                    >
                      <div style={{ fontWeight: '600' }}>{day.slice(0, 3)}</div>
                      <div style={{ fontSize: '10.5px' }}>{isWorking ? 'Duty' : 'Off'}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ padding: '12px', backgroundColor: 'var(--surface-hover)', borderRadius: '8px', fontSize: '13px' }}>
              <div><strong>Shift Hours:</strong> {selectedDoctor.workingHours}</div>
              <div style={{ marginTop: '4px' }}><strong>Standard Fee:</strong> {formatCurrency(selectedDoctor.consultationFee)}</div>
              <div style={{ marginTop: '4px' }}><strong>Joined Hospital:</strong> {selectedDoctor.joiningDate}</div>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deleteDoctor(deleteTarget.id);
        }}
        title="Remove Doctor Record?"
        message={`Are you sure you want to remove ${deleteTarget?.name}? Existing appointments may need reassignment.`}
      />
    </div>
  );
};
