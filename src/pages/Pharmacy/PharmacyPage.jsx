import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHospital } from '../../context/HospitalContext';
import { PageHeader } from '../../components/Common/PageHeader/PageHeader';
import { StatCard } from '../../components/Common/StatCard/StatCard';
import { DataTable } from '../../components/Common/DataTable/DataTable';
import { Button } from '../../components/Common/Button/Button';
import { StatusBadge } from '../../components/Common/StatusBadge/StatusBadge';
import { Modal } from '../../components/Common/Modal/Modal';
import { ConfirmDialog } from '../../components/Common/Modal/ConfirmDialog';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  FiBox,
  FiPlus,
  FiAlertTriangle,
  FiCheckCircle,
  FiXCircle,
  FiEdit,
  FiTrash2,
  FiClipboard,
  FiCheck
} from 'react-icons/fi';

export const PharmacyPage = () => {
  const navigate = useNavigate();
  const {
    medicines,
    addMedicine,
    updateMedicine,
    deleteMedicine,
    adjustStock,
    prescriptions,
    dispensePrescription,
    patients,
    doctors,
    addPrescription
  } = useHospital();

  const [activeTab, setActiveTab] = useState('Inventory'); // 'Inventory' | 'Prescriptions'
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [isAddMedicineOpen, setIsAddMedicineOpen] = useState(false);
  const [isNewRxOpen, setIsNewRxOpen] = useState(false);
  const [stockAdjustItem, setStockAdjustItem] = useState(null);
  const [stockDelta, setStockDelta] = useState('10');
  const [deleteTarget, setDeleteTarget] = useState(null);

  // New Medicine Form State
  const [medicineForm, setMedicineForm] = useState({
    name: '',
    genericName: '',
    category: 'Tablet',
    manufacturer: '',
    batchNumber: '',
    expiryDate: '2027-12-31',
    stock: 100,
    minStock: 25,
    purchasePrice: 10,
    sellingPrice: 18,
    supplier: 'Karnataka Pharma Wholesalers'
  });

  // New Prescription Form State
  const [rxForm, setRxForm] = useState({
    patientId: patients[0]?.id || '',
    doctorId: doctors[0]?.id || '',
    diagnosis: '',
    notes: '',
    items: [
      { medicine: 'Paracetamol 650mg (Dolo 650)', dosage: '650mg', frequency: 'Twice daily', duration: '5 days', instructions: 'After food' }
    ]
  });

  // Calculate Metrics
  const totalMeds = medicines.length;
  const lowStockMeds = medicines.filter((m) => m.status === 'Low Stock').length;
  const outOfStockMeds = medicines.filter((m) => m.status === 'Out of Stock').length;
  const activeRxCount = prescriptions.filter((r) => r.status === 'Pending').length;

  const categories = ['ALL', 'Tablet', 'Capsule', 'Syrup', 'Injection', 'Ointment', 'Drops', 'Other'];

  const filteredMedicines = useMemo(() => {
    return medicines.filter((m) => {
      if (categoryFilter !== 'ALL' && m.category !== categoryFilter) return false;
      if (statusFilter !== 'ALL' && m.status !== statusFilter) return false;
      return true;
    });
  }, [medicines, categoryFilter, statusFilter]);

  const handleSaveMedicine = (e) => {
    e.preventDefault();
    if (!medicineForm.name.trim()) return;
    addMedicine(medicineForm);
    setIsAddMedicineOpen(false);
  };

  const handleAdjustStockSubmit = (e) => {
    e.preventDefault();
    if (!stockAdjustItem) return;
    adjustStock(stockAdjustItem.id, Number(stockDelta));
    setStockAdjustItem(null);
  };

  const handleSavePrescription = (e) => {
    e.preventDefault();
    const selPatient = patients.find((p) => p.id === rxForm.patientId);
    const selDoctor = doctors.find((d) => d.id === rxForm.doctorId);

    addPrescription({
      ...rxForm,
      patientName: selPatient ? selPatient.name : 'Unknown Patient',
      doctorName: selDoctor ? selDoctor.name : 'Unknown Doctor'
    });

    setIsNewRxOpen(false);
  };

  const handleAddRxItem = () => {
    setRxForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { medicine: '', dosage: '1 tablet', frequency: 'Twice daily', duration: '5 days', instructions: 'After meals' }
      ]
    }));
  };

  const handleRemoveRxItem = (index) => {
    setRxForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleRxItemChange = (index, field, val) => {
    setRxForm((prev) => {
      const items = [...prev.items];
      items[index] = { ...items[index], [field]: val };
      return { ...prev, items };
    });
  };

  const columns = [
    {
      header: 'Drug ID',
      accessor: 'id',
      sortable: true,
      width: '130px',
      cell: (row) => <span style={{ fontWeight: '600', color: 'var(--primary)' }}>{row.id}</span>
    },
    {
      header: 'Medicine Name & Generic',
      accessor: 'name',
      sortable: true,
      cell: (row) => (
        <div>
          <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{row.name}</div>
          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{row.genericName} • {row.manufacturer}</div>
        </div>
      )
    },
    {
      header: 'Category',
      accessor: 'category',
      sortable: true,
      cell: (row) => <span className="badge badge-neutral">{row.category}</span>
    },
    {
      header: 'Batch & Expiry',
      cell: (row) => (
        <div>
          <div style={{ fontSize: '12px', fontWeight: '500' }}>{row.batchNumber}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Exp: {row.expiryDate}</div>
        </div>
      )
    },
    {
      header: 'Current Stock',
      accessor: 'stock',
      sortable: true,
      cell: (row) => (
        <div>
          <span
            style={{
              fontWeight: '700',
              fontSize: '14px',
              color: row.stock <= 0 ? 'var(--danger)' : row.stock <= row.minStock ? 'var(--warning)' : 'var(--text-primary)'
            }}
          >
            {row.stock} units
          </span>
          <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Min: {row.minStock}</div>
        </div>
      )
    },
    {
      header: 'Price / Unit',
      accessor: 'sellingPrice',
      sortable: true,
      cell: (row) => <span style={{ fontWeight: '600' }}>{formatCurrency(row.sellingPrice)}</span>
    },
    {
      header: 'Supplier',
      accessor: 'supplier',
      cell: (row) => <span style={{ fontSize: '12px' }}>{row.supplier}</span>
    },
    {
      header: 'Status',
      accessor: 'status',
      sortable: true,
      cell: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Actions',
      width: '140px',
      cell: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => {
              setStockAdjustItem(row);
              setStockDelta('20');
            }}
            className="btn btn-secondary btn-sm"
            title="Add / Restock Units"
          >
            + Restock
          </button>
          <button
            onClick={() => setDeleteTarget(row)}
            className="btn btn-ghost btn-sm"
            style={{ color: 'var(--danger)' }}
            title="Delete Medicine"
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
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
      >
        {categories.map((c) => (
          <option key={c} value={c}>
            {c === 'ALL' ? 'All Categories' : c}
          </option>
        ))}
      </select>

      <select
        className="form-control"
        style={{ width: 'auto', padding: '7px 12px' }}
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="ALL">All Stock Statuses</option>
        <option value="In Stock">In Stock</option>
        <option value="Low Stock">Low Stock</option>
        <option value="Out of Stock">Out of Stock</option>
      </select>
    </>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <PageHeader
        title="Pharmacy & Drug Dispensary"
        subtitle="Medicine inventory tracking, expiry alerts, doctor prescriptions, and outpatient dispensing."
      >
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button variant="outline" icon={FiClipboard} onClick={() => setIsNewRxOpen(true)}>
            New Prescription
          </Button>
          <Button variant="primary" icon={FiPlus} onClick={() => setIsAddMedicineOpen(true)}>
            Add Medicine
          </Button>
        </div>
      </PageHeader>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <StatCard
          title="Total Formulations"
          value={totalMeds}
          subtitle="Cataloged active medicines"
          icon={FiBox}
          color="primary"
        />
        <StatCard
          title="Low Stock Items"
          value={lowStockMeds}
          subtitle="Below safety threshold"
          icon={FiAlertTriangle}
          color="warning"
        />
        <StatCard
          title="Out of Stock"
          value={outOfStockMeds}
          subtitle="Requires urgent procurement"
          icon={FiXCircle}
          color="danger"
        />
        <StatCard
          title="Pending Prescriptions"
          value={activeRxCount}
          subtitle="Awaiting pharmacy dispensing"
          icon={FiCheckCircle}
          color="secondary"
        />
      </div>

      {/* View Switcher Tabs: Inventory vs Prescriptions */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border)', paddingBottom: '4px' }}>
        <button
          onClick={() => setActiveTab('Inventory')}
          style={{
            padding: '8px 16px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            color: activeTab === 'Inventory' ? 'var(--primary)' : 'var(--text-secondary)',
            borderBottom: activeTab === 'Inventory' ? '2px solid var(--primary)' : '2px solid transparent'
          }}
        >
          Drug Inventory ({medicines.length})
        </button>
        <button
          onClick={() => setActiveTab('Prescriptions')}
          style={{
            padding: '8px 16px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            color: activeTab === 'Prescriptions' ? 'var(--secondary)' : 'var(--text-secondary)',
            borderBottom: activeTab === 'Prescriptions' ? '2px solid var(--secondary)' : '2px solid transparent'
          }}
        >
          Active Prescriptions Queue ({prescriptions.length})
        </button>
      </div>

      {activeTab === 'Inventory' ? (
        <div className="card">
          <DataTable
            columns={columns}
            data={filteredMedicines}
            searchPlaceholder="Search medicine by name, generic, supplier, ID..."
            searchKeys={['name', 'genericName', 'supplier', 'id', 'category']}
            filterControls={filterControls}
          />
        </div>
      ) : (
        /* Prescriptions Table & Dispensing Flow */
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <FiClipboard color="var(--secondary)" />
              <span>Doctor Prescriptions & Pharmacy Dispense Queue</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {prescriptions.map((rx) => (
              <div
                key={rx.id}
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--surface-hover)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--primary)' }}>{rx.id}</span>
                    <h4 style={{ fontSize: '15px', fontWeight: '600' }}>
                      Patient: {rx.patientName} ({rx.patientId})
                    </h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      Prescribed by: {rx.doctorName} on {formatDate(rx.date)} • Diagnosis: <strong>{rx.diagnosis}</strong>
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <StatusBadge status={rx.status} />
                    {rx.status === 'Pending' && (
                      <Button
                        size="sm"
                        variant="success"
                        icon={FiCheck}
                        onClick={() => dispensePrescription(rx.id)}
                      >
                        Dispense Medicine
                      </Button>
                    )}
                  </div>
                </div>

                <div style={{ marginTop: '12px' }}>
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
                      {rx.items?.map((item, idx) => (
                        <tr key={idx}>
                          <td style={{ fontWeight: '600' }}>{item.medicine}</td>
                          <td>{item.dosage}</td>
                          <td>{item.frequency}</td>
                          <td>{item.duration}</td>
                          <td>{item.instructions}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Medicine Modal */}
      <Modal
        isOpen={isAddMedicineOpen}
        onClose={() => setIsAddMedicineOpen(false)}
        title="Add Formulation to Inventory"
        subtitle="Catalog new drug batch with pricing and stock levels"
        maxWidth="650px"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsAddMedicineOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveMedicine}>
              Save Medicine
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveMedicine} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Brand Name *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Pantoprazole 40mg (Pan 40)"
              required
              value={medicineForm.name}
              onChange={(e) => setMedicineForm({ ...medicineForm, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Generic Compound</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Pantoprazole Sodium"
              value={medicineForm.genericName}
              onChange={(e) => setMedicineForm({ ...medicineForm, genericName: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Dosage Category</label>
            <select
              className="form-control"
              value={medicineForm.category}
              onChange={(e) => setMedicineForm({ ...medicineForm, category: e.target.value })}
            >
              <option value="Tablet">Tablet</option>
              <option value="Capsule">Capsule</option>
              <option value="Syrup">Syrup</option>
              <option value="Injection">Injection</option>
              <option value="Ointment">Ointment</option>
              <option value="Drops">Drops</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Batch Number</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. BATCH-9941"
              value={medicineForm.batchNumber}
              onChange={(e) => setMedicineForm({ ...medicineForm, batchNumber: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Expiry Date</label>
            <input
              type="date"
              className="form-control"
              value={medicineForm.expiryDate}
              onChange={(e) => setMedicineForm({ ...medicineForm, expiryDate: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Initial Stock Units</label>
            <input
              type="number"
              className="form-control"
              value={medicineForm.stock}
              onChange={(e) => setMedicineForm({ ...medicineForm, stock: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Min Stock Threshold</label>
            <input
              type="number"
              className="form-control"
              value={medicineForm.minStock}
              onChange={(e) => setMedicineForm({ ...medicineForm, minStock: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Selling Price (₹)</label>
            <input
              type="number"
              className="form-control"
              value={medicineForm.sellingPrice}
              onChange={(e) => setMedicineForm({ ...medicineForm, sellingPrice: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Manufacturer / Supplier</label>
            <input
              type="text"
              className="form-control"
              value={medicineForm.supplier}
              onChange={(e) => setMedicineForm({ ...medicineForm, supplier: e.target.value })}
            />
          </div>
        </form>
      </Modal>

      {/* Adjust Stock Modal */}
      {stockAdjustItem && (
        <Modal
          isOpen={Boolean(stockAdjustItem)}
          onClose={() => setStockAdjustItem(null)}
          title={`Restock Inventory: ${stockAdjustItem.name}`}
          maxWidth="420px"
          footer={
            <>
              <Button variant="outline" onClick={() => setStockAdjustItem(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleAdjustStockSubmit}>
                Confirm Stock Addition
              </Button>
            </>
          }
        >
          <form onSubmit={handleAdjustStockSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Current In-Stock Quantity: <strong>{stockAdjustItem.stock}</strong> units.
            </p>
            <div className="form-group">
              <label className="form-label">Add Quantity (Units to add)</label>
              <input
                type="number"
                className="form-control"
                required
                min="1"
                value={stockDelta}
                onChange={(e) => setStockDelta(e.target.value)}
              />
            </div>
          </form>
        </Modal>
      )}

      {/* New Prescription Modal */}
      <Modal
        isOpen={isNewRxOpen}
        onClose={() => setIsNewRxOpen(false)}
        title="Issue Clinical Prescription"
        subtitle="Doctor prescription order linked to patient profile"
        maxWidth="700px"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsNewRxOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSavePrescription}>
              Save Prescription
            </Button>
          </>
        }
      >
        <form onSubmit={handleSavePrescription} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Select Patient *</label>
              <select
                className="form-control"
                value={rxForm.patientId}
                onChange={(e) => setRxForm({ ...rxForm, patientId: e.target.value })}
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.id})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Prescribing Doctor *</label>
              <select
                className="form-control"
                value={rxForm.doctorId}
                onChange={(e) => setRxForm({ ...rxForm, doctorId: e.target.value })}
              >
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.department})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Diagnosis *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Acute Bronchial Asthma Exacerbation"
              required
              value={rxForm.diagnosis}
              onChange={(e) => setRxForm({ ...rxForm, diagnosis: e.target.value })}
            />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label className="form-label" style={{ fontWeight: '600' }}>Prescribed Drugs</label>
              <Button size="sm" variant="outline" icon={FiPlus} onClick={handleAddRxItem}>
                Add Drug
              </Button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {rxForm.items.map((item, idx) => (
                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.5fr 1fr auto', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Drug name"
                    value={item.medicine}
                    onChange={(e) => handleRxItemChange(idx, 'medicine', e.target.value)}
                  />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Dosage (500mg)"
                    value={item.dosage}
                    onChange={(e) => handleRxItemChange(idx, 'dosage', e.target.value)}
                  />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Frequency"
                    value={item.frequency}
                    onChange={(e) => handleRxItemChange(idx, 'frequency', e.target.value)}
                  />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Duration"
                    value={item.duration}
                    onChange={(e) => handleRxItemChange(idx, 'duration', e.target.value)}
                  />
                  {rxForm.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveRxItem(idx)}
                      style={{ color: 'var(--danger)', cursor: 'pointer', padding: '6px' }}
                    >
                      <FiTrash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deleteMedicine(deleteTarget.id);
        }}
        title="Delete Medicine Formulation?"
        message={`Are you sure you want to delete ${deleteTarget?.name} (${deleteTarget?.id})?`}
      />
    </div>
  );
};
