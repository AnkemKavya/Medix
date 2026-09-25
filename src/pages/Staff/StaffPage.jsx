import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHospital } from '../../context/HospitalContext';
import { PageHeader } from '../../components/Common/PageHeader/PageHeader';
import { DataTable } from '../../components/Common/DataTable/DataTable';
import { Button } from '../../components/Common/Button/Button';
import { StatusBadge } from '../../components/Common/StatusBadge/StatusBadge';
import { Modal } from '../../components/Common/Modal/Modal';
import { ConfirmDialog } from '../../components/Common/Modal/ConfirmDialog';
import { formatDate } from '../../utils/formatters';
import { FiUserPlus, FiUsers, FiTrash2, FiUserCheck, FiArrowLeft } from 'react-icons/fi';

export const StaffPage = () => {
  const navigate = useNavigate();
  const { staff, addStaff, updateStaff, deleteStaff } = useHospital();

  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    role: 'Nurse',
    department: 'General Ward',
    phone: '',
    email: '',
    shift: 'Morning (07:00 AM - 03:00 PM)',
    status: 'Active'
  });

  const roles = [
    'ALL',
    'Nurse',
    'Receptionist',
    'Lab Technician',
    'Pharmacist',
    'Accountant',
    'Ward Staff',
    'Admin'
  ];

  const filteredStaff = useMemo(() => {
    return staff.filter((s) => {
      if (roleFilter !== 'ALL' && s.role !== roleFilter) return false;
      if (statusFilter !== 'ALL' && s.status !== statusFilter) return false;
      return true;
    });
  }, [staff, roleFilter, statusFilter]);

  const handleSaveStaff = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    addStaff(formData);
    setIsAddModalOpen(false);
  };

  const handleStatusChange = (staffId, newStatus) => {
    updateStaff(staffId, { status: newStatus });
  };

  const columns = [
    {
      header: 'Staff ID',
      accessor: 'id',
      sortable: true,
      width: '130px',
      cell: (row) => <span style={{ fontWeight: '600', color: 'var(--primary)' }}>{row.id}</span>
    },
    {
      header: 'Staff Name',
      accessor: 'name',
      sortable: true,
      cell: (row) => (
        <div>
          <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{row.name}</div>
          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{row.email}</div>
        </div>
      )
    },
    {
      header: 'Role',
      accessor: 'role',
      sortable: true,
      cell: (row) => <span className="badge badge-neutral">{row.role}</span>
    },
    {
      header: 'Department',
      accessor: 'department',
      sortable: true
    },
    {
      header: 'Phone Number',
      accessor: 'phone'
    },
    {
      header: 'Assigned Shift',
      accessor: 'shift',
      cell: (row) => <span style={{ fontSize: '12px' }}>{row.shift}</span>
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
          <option value="Active">Active</option>
          <option value="On Leave">On Leave</option>
          <option value="Inactive">Inactive</option>
        </select>
      )
    },
    {
      header: 'Actions',
      width: '90px',
      cell: (row) => (
        <button
          onClick={() => setDeleteTarget(row)}
          className="btn btn-ghost btn-sm"
          style={{ color: 'var(--danger)' }}
          title="Remove Staff"
        >
          <FiTrash2 size={15} />
        </button>
      )
    }
  ];

  const filterControls = (
    <>
      <select
        className="form-control"
        style={{ width: 'auto', padding: '7px 12px' }}
        value={roleFilter}
        onChange={(e) => setRoleFilter(e.target.value)}
      >
        {roles.map((r) => (
          <option key={r} value={r}>
            {r === 'ALL' ? 'All Roles' : r}
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
        <option value="Active">Active</option>
        <option value="On Leave">On Leave</option>
        <option value="Inactive">Inactive</option>
      </select>
    </>
  );

  return (
    <div>
      <PageHeader
        title="Hospital Staff Directory"
        subtitle="Manage nursing, technical, administrative, and ward support staff duty records."
      >
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button variant="outline" icon={FiArrowLeft} onClick={() => navigate('/doctors')}>
            Back to Doctors
          </Button>
          <Button
            variant="primary"
            icon={FiUserPlus}
            onClick={() => {
              setFormData({
                name: '',
                role: 'Nurse',
                department: 'General Ward',
                phone: '',
                email: '',
                shift: 'Morning (07:00 AM - 03:00 PM)',
                status: 'Active'
              });
              setIsAddModalOpen(true);
            }}
          >
            Add Staff Member
          </Button>
        </div>
      </PageHeader>

      <DataTable
        columns={columns}
        data={filteredStaff}
        searchPlaceholder="Search staff by name, role, department, phone..."
        searchKeys={['name', 'role', 'department', 'phone', 'email']}
        filterControls={filterControls}
      />

      {/* Add Staff Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Staff Member"
        subtitle="Register new hospital nursing, technical, or administrative staff"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveStaff}>
              Save Staff
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveStaff} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Sister Mary Varghese"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Role</label>
            <select
              className="form-control"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="Nurse">Nurse</option>
              <option value="Receptionist">Receptionist</option>
              <option value="Lab Technician">Lab Technician</option>
              <option value="Pharmacist">Pharmacist</option>
              <option value="Accountant">Accountant</option>
              <option value="Ward Staff">Ward Staff</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Department</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. ICU / Biochemistry"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="text"
              className="form-control"
              placeholder="+91 98765 00000"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="staff@medixhms.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Assigned Shift</label>
            <select
              className="form-control"
              value={formData.shift}
              onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
            >
              <option value="Morning (07:00 AM - 03:00 PM)">Morning (07:00 AM - 03:00 PM)</option>
              <option value="Evening (02:00 PM - 10:00 PM)">Evening (02:00 PM - 10:00 PM)</option>
              <option value="Night (10:00 PM - 07:00 AM)">Night (10:00 PM - 07:00 AM)</option>
              <option value="General (09:00 AM - 06:00 PM)">General (09:00 AM - 06:00 PM)</option>
            </select>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deleteStaff(deleteTarget.id);
        }}
        title="Remove Staff Member?"
        message={`Are you sure you want to remove ${deleteTarget?.name} (${deleteTarget?.role}) from the staff registry?`}
      />
    </div>
  );
};
