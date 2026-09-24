import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHospital } from '../../context/HospitalContext';
import { PageHeader } from '../../components/Common/PageHeader/PageHeader';
import { StatCard } from '../../components/Common/StatCard/StatCard';
import { DataTable } from '../../components/Common/DataTable/DataTable';
import { Button } from '../../components/Common/Button/Button';
import { StatusBadge } from '../../components/Common/StatusBadge/StatusBadge';
import { Modal } from '../../components/Common/Modal/Modal';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { triggerPrint } from '../../utils/helpers';
import {
  FiCreditCard,
  FiPlus,
  FiPrinter,
  FiCheckCircle,
  FiAlertCircle,
  FiDollarSign,
  FiShield,
  FiEye,
  FiTrash2
} from 'react-icons/fi';

export const BillingPage = () => {
  const navigate = useNavigate();
  const { bills, patients, addBill, recordPayment, hospitalInfo } = useHospital();

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [methodFilter, setMethodFilter] = useState('ALL');

  const [isNewBillModalOpen, setIsNewBillModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  // Form State for New Invoice
  const [formData, setFormData] = useState({
    patientId: patients[0]?.id || '',
    billDate: new Date().toISOString().split('T')[0],
    dueDate: new Date().toISOString().split('T')[0],
    discount: 0,
    paidAmount: 0,
    paymentMethod: 'UPI',
    items: [
      { description: 'Consultation & Clinical Evaluation', quantity: 1, unitPrice: 800, amount: 800 }
    ]
  });

  // Calculate Metrics
  const totalBilled = useMemo(() => bills.reduce((s, b) => s + (Number(b.totalAmount) || 0), 0), [bills]);
  const totalCollected = useMemo(() => bills.reduce((s, b) => s + (Number(b.paidAmount) || 0), 0), [bills]);
  const totalPending = useMemo(() => bills.reduce((s, b) => s + (Number(b.balance) || 0), 0), [bills]);
  const insuranceCount = useMemo(() => bills.filter((b) => b.paymentMethod === 'Insurance').length, [bills]);

  const filteredBills = useMemo(() => {
    return bills.filter((b) => {
      if (statusFilter !== 'ALL' && b.paymentStatus !== statusFilter) return false;
      if (methodFilter !== 'ALL' && b.paymentMethod !== methodFilter) return false;
      return true;
    });
  }, [bills, statusFilter, methodFilter]);

  // Form line item helpers
  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, unitPrice: 0, amount: 0 }]
    }));
  };

  const handleItemChange = (index, field, val) => {
    setFormData((prev) => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: val };
      if (field === 'quantity' || field === 'unitPrice') {
        const qty = Number(field === 'quantity' ? val : newItems[index].quantity) || 1;
        const price = Number(field === 'unitPrice' ? val : newItems[index].unitPrice) || 0;
        newItems[index].amount = qty * price;
      }
      return { ...prev, items: newItems };
    });
  };

  const handleRemoveItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleSaveBill = (e) => {
    e.preventDefault();
    const selPatient = patients.find((p) => p.id === formData.patientId);

    addBill({
      ...formData,
      patientName: selPatient ? selPatient.name : 'Unknown Patient'
    });

    setIsNewBillModalOpen(false);
  };

  const handleRecordPaymentSubmit = (e) => {
    e.preventDefault();
    if (!selectedInvoice) return;
    recordPayment(selectedInvoice.id, Number(paymentAmount), paymentMethod);
    setIsPaymentModalOpen(false);
    setSelectedInvoice(null);
  };

  const columns = [
    {
      header: 'Invoice ID',
      accessor: 'id',
      sortable: true,
      width: '130px',
      cell: (row) => (
        <span
          onClick={() => setSelectedInvoice(row)}
          style={{ fontWeight: '600', color: 'var(--primary)', cursor: 'pointer' }}
        >
          {row.id}
        </span>
      )
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
      header: 'Invoice Date',
      accessor: 'billDate',
      sortable: true,
      cell: (row) => formatDate(row.billDate)
    },
    {
      header: 'Services Billed',
      cell: (row) => (
        <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
          {row.items?.map((i) => i.description).slice(0, 2).join(', ')}
          {row.items?.length > 2 && ' + more'}
        </span>
      )
    },
    {
      header: 'Total Amount',
      accessor: 'totalAmount',
      sortable: true,
      cell: (row) => <span style={{ fontWeight: '700' }}>{formatCurrency(row.totalAmount)}</span>
    },
    {
      header: 'Paid Amount',
      accessor: 'paidAmount',
      sortable: true,
      cell: (row) => <span style={{ color: 'var(--success)', fontWeight: '600' }}>{formatCurrency(row.paidAmount)}</span>
    },
    {
      header: 'Balance',
      accessor: 'balance',
      sortable: true,
      cell: (row) => (
        <span style={{ color: row.balance > 0 ? 'var(--danger)' : 'var(--text-muted)', fontWeight: '600' }}>
          {formatCurrency(row.balance)}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: 'paymentStatus',
      sortable: true,
      cell: (row) => <StatusBadge status={row.paymentStatus} />
    },
    {
      header: 'Actions',
      width: '140px',
      cell: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => setSelectedInvoice(row)}
            className="btn btn-ghost btn-sm"
            title="View & Print Invoice"
          >
            <FiEye size={15} />
          </button>
          {row.balance > 0 && (
            <button
              onClick={() => {
                setSelectedInvoice(row);
                setPaymentAmount(String(row.balance));
                setIsPaymentModalOpen(true);
              }}
              className="btn btn-secondary btn-sm"
              title="Record Payment"
            >
              Pay
            </button>
          )}
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
        <option value="ALL">All Payment Statuses</option>
        <option value="Paid">Paid</option>
        <option value="Partially Paid">Partially Paid</option>
        <option value="Pending">Pending</option>
      </select>

      <select
        className="form-control"
        style={{ width: 'auto', padding: '7px 12px' }}
        value={methodFilter}
        onChange={(e) => setMethodFilter(e.target.value)}
      >
        <option value="ALL">All Payment Methods</option>
        <option value="UPI">UPI</option>
        <option value="Card">Card</option>
        <option value="Cash">Cash</option>
        <option value="Insurance">Insurance</option>
      </select>
    </>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <PageHeader
        title="Billing, Invoices & Claims"
        subtitle="Itemized medical billing, cashier payment collection, insurance claims, and official receipts."
      >
        <Button
          variant="primary"
          icon={FiPlus}
          onClick={() => {
            setFormData({
              patientId: patients[0]?.id || '',
              billDate: new Date().toISOString().split('T')[0],
              dueDate: new Date().toISOString().split('T')[0],
              discount: 0,
              paidAmount: 0,
              paymentMethod: 'UPI',
              items: [
                { description: 'Consultation & Clinical Evaluation', quantity: 1, unitPrice: 800, amount: 800 }
              ]
            });
            setIsNewBillModalOpen(true);
          }}
        >
          Create Invoice
        </Button>
      </PageHeader>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <StatCard
          title="Total Billed"
          value={formatCurrency(totalBilled)}
          subtitle="All generated invoices"
          icon={FiDollarSign}
          color="primary"
        />
        <StatCard
          title="Total Paid"
          value={formatCurrency(totalCollected)}
          subtitle="Realized cashier collection"
          icon={FiCheckCircle}
          color="success"
        />
        <StatCard
          title="Outstanding Balance"
          value={formatCurrency(totalPending)}
          subtitle="Pending patient/insurance dues"
          icon={FiAlertCircle}
          color="danger"
        />
        <StatCard
          title="Insurance Invoices"
          value={insuranceCount}
          subtitle="Covered under cashless TPA"
          icon={FiShield}
          color="secondary"
        />
      </div>

      {/* Invoices Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <FiCreditCard color="var(--primary)" />
            <span>Hospital Billing Ledger</span>
          </div>
        </div>
        <DataTable
          columns={columns}
          data={filteredBills}
          searchPlaceholder="Search invoice by ID, patient, service, method..."
          searchKeys={['id', 'patientName', 'paymentMethod', 'paymentStatus']}
          filterControls={filterControls}
        />
      </div>

      {/* Create Bill Modal */}
      <Modal
        isOpen={isNewBillModalOpen}
        onClose={() => setIsNewBillModalOpen(false)}
        title="Create Patient Invoice"
        subtitle="Generate itemized hospital bill for consultation, lab, or pharmacy"
        maxWidth="700px"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsNewBillModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveBill}>
              Save Invoice
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveBill} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Select Patient *</label>
              <select
                className="form-control"
                value={formData.patientId}
                onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.id})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Payment Method</label>
              <select
                className="form-control"
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              >
                <option value="UPI">UPI</option>
                <option value="Card">Card</option>
                <option value="Cash">Cash</option>
                <option value="Insurance">Insurance (TPA Claim)</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>
          </div>

          {/* Line Items */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label className="form-label" style={{ fontWeight: '600' }}>Itemized Services & Medications</label>
              <Button size="sm" variant="outline" icon={FiPlus} onClick={handleAddItem}>
                Add Service Line
              </Button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {formData.items.map((item, index) => (
                <div key={index} style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1.5fr 1fr auto', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Service description"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  />
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Qty"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                  />
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Price ₹"
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                  />
                  <div style={{ fontWeight: '600', fontSize: '13px', textAlign: 'right' }}>
                    {formatCurrency(item.amount)}
                  </div>
                  {formData.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      style={{ color: 'var(--danger)', cursor: 'pointer', padding: '6px' }}
                    >
                      <FiTrash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '10px' }}>
            <div className="form-group">
              <label className="form-label">Discount (₹)</label>
              <input
                type="number"
                className="form-control"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Initial Paid Amount (₹)</label>
              <input
                type="number"
                className="form-control"
                value={formData.paidAmount}
                onChange={(e) => setFormData({ ...formData, paidAmount: e.target.value })}
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* Printable Invoice Modal */}
      {selectedInvoice && (
        <Modal
          isOpen={Boolean(selectedInvoice)}
          onClose={() => setSelectedInvoice(null)}
          title={`Hospital Invoice: ${selectedInvoice.id}`}
          maxWidth="700px"
          footer={
            <>
              <Button variant="outline" icon={FiPrinter} onClick={triggerPrint}>
                Print Receipt
              </Button>
              <Button variant="primary" onClick={() => setSelectedInvoice(null)}>
                Close
              </Button>
            </>
          }
        >
          <div className="printable-document" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--primary)', paddingBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--primary)' }}>
                  {hospitalInfo?.name || 'Medix Super Specialty Hospital'}
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {hospitalInfo?.address}, {hospitalInfo?.city} • Ph: {hospitalInfo?.phone}
                </p>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  GSTIN: {hospitalInfo?.taxId || 'GSTIN29AAACM1234F1Z8'}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <h4 style={{ fontSize: '16px', fontWeight: '700' }}>TAX INVOICE</h4>
                <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--primary)' }}>
                  {selectedInvoice.id}
                </p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Date: {formatDate(selectedInvoice.billDate)}
                </p>
              </div>
            </div>

            {/* Billed To */}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', backgroundColor: 'var(--surface-hover)', borderRadius: '8px', fontSize: '13px' }}>
              <div>
                <strong>Billed To:</strong>
                <div>{selectedInvoice.patientName}</div>
                <div style={{ color: 'var(--text-muted)' }}>Patient ID: {selectedInvoice.patientId}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <strong>Payment Method:</strong> {selectedInvoice.paymentMethod}
                <div style={{ marginTop: '4px' }}>
                  <StatusBadge status={selectedInvoice.paymentStatus} />
                </div>
              </div>
            </div>

            {/* Table */}
            <table className="data-table" style={{ background: 'var(--surface)' }}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Service Description</th>
                  <th style={{ textAlign: 'center' }}>Qty</th>
                  <th style={{ textAlign: 'right' }}>Rate</th>
                  <th style={{ textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {selectedInvoice.items?.map((item, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td style={{ fontWeight: '500' }}>{item.description}</td>
                    <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                    <td style={{ textAlign: 'right' }}>{formatCurrency(item.unitPrice)}</td>
                    <td style={{ textAlign: 'right', fontWeight: '600' }}>{formatCurrency(item.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals Summary */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{ width: '260px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Subtotal:</span>
                  <strong>{formatCurrency(selectedInvoice.subtotal)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Discount:</span>
                  <span style={{ color: 'var(--success)' }}>- {formatCurrency(selectedInvoice.discount)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Tax (5% GST):</span>
                  <span>{formatCurrency(selectedInvoice.tax)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: '700', borderTop: '2px solid var(--border)', paddingTop: '6px', color: 'var(--primary)' }}>
                  <span>Grand Total:</span>
                  <span>{formatCurrency(selectedInvoice.totalAmount)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)' }}>
                  <span>Paid Amount:</span>
                  <span>{formatCurrency(selectedInvoice.paidAmount)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', color: selectedInvoice.balance > 0 ? 'var(--danger)' : 'var(--text-muted)' }}>
                  <span>Balance Due:</span>
                  <span>{formatCurrency(selectedInvoice.balance)}</span>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Record Payment Modal */}
      {isPaymentModalOpen && selectedInvoice && (
        <Modal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          title={`Record Cashier Payment for ${selectedInvoice.id}`}
          maxWidth="450px"
          footer={
            <>
              <Button variant="outline" onClick={() => setIsPaymentModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleRecordPaymentSubmit}>
                Confirm Payment
              </Button>
            </>
          }
        >
          <form onSubmit={handleRecordPaymentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Total Due: <strong style={{ color: 'var(--danger)' }}>{formatCurrency(selectedInvoice.balance)}</strong>
              </p>
            </div>
            <div className="form-group">
              <label className="form-label">Payment Amount (₹)</label>
              <input
                type="number"
                className="form-control"
                required
                max={selectedInvoice.balance}
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Payment Instrument</label>
              <select
                className="form-control"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="UPI">UPI / QR Code</option>
                <option value="Card">Debit / Credit Card</option>
                <option value="Cash">Cash Counter</option>
                <option value="Insurance">Insurance TPA Approval</option>
              </select>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
