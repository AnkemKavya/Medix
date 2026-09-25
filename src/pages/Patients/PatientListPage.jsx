import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHospital } from '../../context/HospitalContext';
import { PageHeader } from '../../components/Common/PageHeader/PageHeader';
import { DataTable } from '../../components/Common/DataTable/DataTable';
import { Button } from '../../components/Common/Button/Button';
import { StatusBadge } from '../../components/Common/StatusBadge/StatusBadge';
import { ConfirmDialog } from '../../components/Common/Modal/ConfirmDialog';
import { formatDate } from '../../utils/formatters';
import { FiUserPlus, FiEye, FiTrash2, FiCalendar, FiCreditCard } from 'react-icons/fi';

export const PatientListPage = () => {
  const navigate = useNavigate();
  const { patients, deletePatient } = useHospital();

  const [genderFilter, setGenderFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [bloodGroupFilter, setBloodGroupFilter] = useState('ALL');
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Apply Category Filters
  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      if (genderFilter !== 'ALL' && p.gender !== genderFilter) return false;
      if (statusFilter !== 'ALL' && p.status !== statusFilter) return false;
      if (bloodGroupFilter !== 'ALL' && p.bloodGroup !== bloodGroupFilter) return false;
      return true;
    });
  }, [patients, genderFilter, statusFilter, bloodGroupFilter]);

  const columns = [
    {
      header: 'Patient ID',
      accessor: 'id',
      sortable: true,
      width: '130px',
      cell: (row) => (
        <span
          onClick={() => navigate(`/patients/${row.id}`)}
          style={{ fontWeight: '600', color: 'var(--primary)', cursor: 'pointer' }}
        >
          {row.id}
        </span>
      )
    },
    {
      header: 'Patient Details',
      accessor: 'name',
      sortable: true,
      cell: (row) => (
        <div
          onClick={() => navigate(`/patients/${row.id}`)}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        >
          <img
            src={row.avatar}
            alt={row.name}
            style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div>
            <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{row.name}</div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{row.email}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Age / Gender',
      accessor: 'age',
      sortable: true,
      width: '120px',
      cell: (row) => (
        <span>
          {row.age} yrs • {row.gender}
        </span>
      )
    },
    {
      header: 'Phone Number',
      accessor: 'phone',
      width: '140px'
    },
    {
      header: 'Blood Group',
      accessor: 'bloodGroup',
      width: '110px',
      cell: (row) => <span className="badge badge-neutral">{row.bloodGroup}</span>
    },
    {
      header: 'Assigned Doctor',
      accessor: 'assignedDoctorName',
      sortable: true
    },
    {
      header: 'Stage',
      accessor: 'currentStage',
      cell: (row) => (
        <span
          style={{
            fontSize: '11.5px',
            fontWeight: '600',
            color: 'var(--secondary)',
            backgroundColor: 'var(--secondary-light)',
            padding: '3px 8px',
            borderRadius: '6px'
          }}
        >
          {row.currentStage}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      sortable: true,
      width: '120px',
      cell: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Actions',
      width: '130px',
      cell: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => navigate(`/patients/${row.id}`)}
            className="btn btn-ghost btn-sm"
            title="View Patient Journey & Medical Profile"
          >
            <FiEye size={15} />
          </button>
          <button
            onClick={() => setDeleteTarget(row)}
            className="btn btn-ghost btn-sm"
            style={{ color: 'var(--danger)' }}
            title="Delete Patient Record"
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
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="ALL">All Statuses</option>
        <option value="Active">Active</option>
        <option value="Admitted">Admitted</option>
        <option value="Critical">Critical</option>
        <option value="Discharged">Discharged</option>
      </select>

      <select
        className="form-control"
        style={{ width: 'auto', padding: '7px 12px' }}
        value={genderFilter}
        onChange={(e) => setGenderFilter(e.target.value)}
      >
        <option value="ALL">All Genders</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>

      <select
        className="form-control"
        style={{ width: 'auto', padding: '7px 12px' }}
        value={bloodGroupFilter}
        onChange={(e) => setBloodGroupFilter(e.target.value)}
      >
        <option value="ALL">All Blood Groups</option>
        <option value="A+">A+</option>
        <option value="A-">A-</option>
        <option value="B+">B+</option>
        <option value="B-">B-</option>
        <option value="O+">O+</option>
        <option value="O-">O-</option>
        <option value="AB+">AB+</option>
        <option value="AB-">AB-</option>
      </select>
    </>
  );

  return (
    <div>
      <PageHeader
        title="Patient Directory"
        subtitle="Manage hospital patient registrations, clinical journey status, and medical histories."
      >
        <Button variant="primary" icon={FiUserPlus} onClick={() => navigate('/patients/new')}>
          Register Patient
        </Button>
      </PageHeader>

      <DataTable
        columns={columns}
        data={filteredPatients}
        searchPlaceholder="Search by name, patient ID, phone, doctor..."
        searchKeys={['name', 'id', 'phone', 'assignedDoctorName', 'email']}
        filterControls={filterControls}
        initialSortKey="id"
        emptyTitle="No Patients Found"
        emptyDescription="There are no patient records matching your filters or search criteria."
        emptyActionText="Register New Patient"
        emptyActionIcon={FiUserPlus}
        onEmptyAction={() => navigate('/patients/new')}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deletePatient(deleteTarget.id);
        }}
        title="Delete Patient Record?"
        message={`Are you sure you want to permanently delete ${deleteTarget?.name} (${deleteTarget?.id})? This removes all associated clinical files.`}
        confirmText="Delete Record"
      />
    </div>
  );
};
