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
import { triggerPrint } from '../../utils/helpers';
import {
  FiClipboard,
  FiPlus,
  FiPrinter,
  FiAlertCircle,
  FiCheckCircle,
  FiActivity,
  FiEye,
  FiEdit,
  FiTrash2
} from 'react-icons/fi';

export const LaboratoryPage = () => {
  const navigate = useNavigate();
  const {
    labTests,
    patients,
    doctors,
    addLabTest,
    enterLabResults,
    updateLabTest,
    hospitalInfo
  } = useHospital();

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedTestForResults, setSelectedTestForResults] = useState(null);
  const [selectedTestForPrint, setSelectedTestForPrint] = useState(null);

  // New Order State
  const [orderForm, setOrderForm] = useState({
    patientId: patients[0]?.id || '',
    doctorId: doctors[0]?.id || '',
    testName: 'Complete Blood Count (CBC)',
    category: 'Hematology',
    sampleType: 'Blood (EDTA)',
    priority: 'Routine'
  });

  // Results Entry Form State
  const [resultsForm, setResultsForm] = useState({
    technician: 'Ganesh Hegde',
    overallResult: 'Normal',
    summaryResult: '',
    parameters: []
  });

  // Metrics
  const pendingCount = labTests.filter((t) => t.status === 'Requested' || t.status === 'Sample Collected' || t.status === 'Processing').length;
  const completedCount = labTests.filter((t) => t.status === 'Completed').length;
  const criticalCount = labTests.filter((t) => t.status === 'Critical').length;
  const todaySamplesCount = labTests.length;

  const filteredTests = useMemo(() => {
    return labTests.filter((t) => {
      if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
      if (priorityFilter !== 'ALL' && t.priority !== priorityFilter) return false;
      return true;
    });
  }, [labTests, statusFilter, priorityFilter]);

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    const selPatient = patients.find((p) => p.id === orderForm.patientId);
    const selDoctor = doctors.find((d) => d.id === orderForm.doctorId);

    addLabTest({
      ...orderForm,
      patientName: selPatient ? selPatient.name : 'Unknown',
      doctorName: selDoctor ? selDoctor.name : 'Unknown'
    });

    setIsOrderModalOpen(false);
  };

  const handleOpenEnterResults = (test) => {
    setSelectedTestForResults(test);
    const initialParams =
      test.parameters && test.parameters.length > 0
        ? [...test.parameters]
        : [
            { name: 'Primary Analyte', observed: '12.5', normalRange: '10.0 - 15.0', status: 'Normal' }
          ];

    setResultsForm({
      technician: test.technician || 'Ganesh Hegde',
      overallResult: test.overallResult || 'Normal',
      summaryResult: test.summaryResult || 'Parameters within clinical normal range.',
      parameters: initialParams
    });
  };

  const handleAddParam = () => {
    setResultsForm((prev) => ({
      ...prev,
      parameters: [
        ...prev.parameters,
        { name: '', observed: '', normalRange: '', status: 'Normal' }
      ]
    }));
  };

  const handleParamChange = (index, field, value) => {
    setResultsForm((prev) => {
      const params = [...prev.parameters];
      params[index] = { ...params[index], [field]: value };
      return { ...prev, parameters: params };
    });
  };

  const handleSaveResults = (e) => {
    e.preventDefault();
    if (!selectedTestForResults) return;

    enterLabResults(selectedTestForResults.id, resultsForm);
    setSelectedTestForResults(null);
  };

  const columns = [
    {
      header: 'Test ID',
      accessor: 'id',
      sortable: true,
      width: '130px',
      cell: (row) => (
        <span
          onClick={() => setSelectedTestForPrint(row)}
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
      header: 'Investigation / Test',
      accessor: 'testName',
      sortable: true,
      cell: (row) => (
        <div>
          <div style={{ fontWeight: '600' }}>{row.testName}</div>
          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
            {row.category} • {row.sampleType}
          </div>
        </div>
      )
    },
    {
      header: 'Ordering Doctor',
      accessor: 'doctorName',
      sortable: true
    },
    {
      header: 'Date & Priority',
      cell: (row) => (
        <div>
          <div>{formatDate(row.requestedDate)}</div>
          {row.priority === 'Critical' && <span className="badge badge-danger" style={{ fontSize: '10px' }}>Critical</span>}
          {row.priority === 'Urgent' && <span className="badge badge-warning" style={{ fontSize: '10px' }}>Urgent</span>}
          {row.priority === 'Routine' && <span className="badge badge-neutral" style={{ fontSize: '10px' }}>Routine</span>}
        </div>
      )
    },
    {
      header: 'Test Status',
      accessor: 'status',
      sortable: true,
      cell: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Result Flag',
      accessor: 'overallResult',
      sortable: true,
      cell: (row) => {
        let flagClass = 'badge-success';
        if (row.overallResult === 'Abnormal') flagClass = 'badge-warning';
        if (row.overallResult === 'Critical') flagClass = 'badge-danger';
        return <span className={`badge ${flagClass}`}>{row.overallResult || 'Normal'}</span>;
      }
    },
    {
      header: 'Actions',
      width: '160px',
      cell: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => handleOpenEnterResults(row)}
            className="btn btn-secondary btn-sm"
            title="Enter / Update Lab Results"
          >
            {row.status === 'Completed' || row.status === 'Critical' ? 'Edit' : 'Enter'}
          </button>
          <button
            onClick={() => setSelectedTestForPrint(row)}
            className="btn btn-ghost btn-sm"
            title="View & Print Diagnostic Report"
          >
            <FiPrinter size={15} />
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
        <option value="Requested">Requested</option>
        <option value="Sample Collected">Sample Collected</option>
        <option value="Processing">Processing</option>
        <option value="Completed">Completed</option>
        <option value="Critical">Critical</option>
      </select>

      <select
        className="form-control"
        style={{ width: 'auto', padding: '7px 12px' }}
        value={priorityFilter}
        onChange={(e) => setPriorityFilter(e.target.value)}
      >
        <option value="ALL">All Priorities</option>
        <option value="Routine">Routine</option>
        <option value="Urgent">Urgent</option>
        <option value="Critical">Critical</option>
      </select>
    </>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <PageHeader
        title="Laboratory Diagnostics & Pathology"
        subtitle="Specimen collection, biochemistry analysis, clinical pathology parameters, and signed lab reports."
      >
        <Button variant="primary" icon={FiPlus} onClick={() => setIsOrderModalOpen(true)}>
          Order Diagnostic Test
        </Button>
      </PageHeader>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <StatCard
          title="Pending Tests"
          value={pendingCount}
          subtitle="In pipeline or sample collected"
          icon={FiClipboard}
          color="warning"
        />
        <StatCard
          title="Completed Reports"
          value={completedCount}
          subtitle="Validated by laboratory staff"
          icon={FiCheckCircle}
          color="success"
        />
        <StatCard
          title="Critical Alerts"
          value={criticalCount}
          subtitle="Immediate physician notification"
          icon={FiAlertCircle}
          color="danger"
        />
        <StatCard
          title="Total Lab Orders"
          value={todaySamplesCount}
          subtitle="Diagnostic throughput"
          icon={FiActivity}
          color="primary"
        />
      </div>

      {/* Lab Tests Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <FiClipboard color="var(--primary)" />
            <span>Pathology & Imaging Worklist</span>
          </div>
        </div>
        <DataTable
          columns={columns}
          data={filteredTests}
          searchPlaceholder="Search test by name, patient, ID, doctor..."
          searchKeys={['testName', 'patientName', 'doctorName', 'id', 'category']}
          filterControls={filterControls}
        />
      </div>

      {/* Order Test Modal */}
      <Modal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        title="Order Laboratory Test"
        subtitle="Physician request for pathology, biochemistry or radiology"
        maxWidth="600px"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsOrderModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleOrderSubmit}>
              Submit Order
            </Button>
          </>
        }
      >
        <form onSubmit={handleOrderSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Select Patient *</label>
            <select
              className="form-control"
              value={orderForm.patientId}
              onChange={(e) => setOrderForm({ ...orderForm, patientId: e.target.value })}
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.id})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Ordering Doctor *</label>
            <select
              className="form-control"
              value={orderForm.doctorId}
              onChange={(e) => setOrderForm({ ...orderForm, doctorId: e.target.value })}
            >
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.department})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Test Name *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Lipid Profile, Fasting Blood Sugar, CBC"
              required
              value={orderForm.testName}
              onChange={(e) => setOrderForm({ ...orderForm, testName: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-control"
              value={orderForm.category}
              onChange={(e) => setOrderForm({ ...orderForm, category: e.target.value })}
            >
              <option value="Hematology">Hematology</option>
              <option value="Biochemistry">Biochemistry</option>
              <option value="Microbiology">Microbiology</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Radiology">Radiology</option>
              <option value="Immunology">Immunology</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Priority</label>
            <select
              className="form-control"
              value={orderForm.priority}
              onChange={(e) => setOrderForm({ ...orderForm, priority: e.target.value })}
            >
              <option value="Routine">Routine</option>
              <option value="Urgent">Urgent</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Sample Type</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Blood (Serum), Urine, Sputum, Imaging"
              value={orderForm.sampleType}
              onChange={(e) => setOrderForm({ ...orderForm, sampleType: e.target.value })}
            />
          </div>
        </form>
      </Modal>

      {/* Enter Lab Results Modal */}
      {selectedTestForResults && (
        <Modal
          isOpen={Boolean(selectedTestForResults)}
          onClose={() => setSelectedTestForResults(null)}
          title={`Enter Results: ${selectedTestForResults.testName}`}
          subtitle={`Patient: ${selectedTestForResults.patientName} (${selectedTestForResults.id})`}
          maxWidth="700px"
          footer={
            <>
              <Button variant="outline" onClick={() => setSelectedTestForResults(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSaveResults}>
                Save Lab Results
              </Button>
            </>
          }
        >
          <form onSubmit={handleSaveResults} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Reporting Technician</label>
                <input
                  type="text"
                  className="form-control"
                  value={resultsForm.technician}
                  onChange={(e) => setResultsForm({ ...resultsForm, technician: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Overall Interpretation Flag</label>
                <select
                  className="form-control"
                  value={resultsForm.overallResult}
                  onChange={(e) => setResultsForm({ ...resultsForm, overallResult: e.target.value })}
                >
                  <option value="Normal">Normal (Green)</option>
                  <option value="Abnormal">Abnormal (Amber)</option>
                  <option value="Critical">Critical (Red Alert)</option>
                </select>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label className="form-label" style={{ fontWeight: '600' }}>Observed Parameters & Values</label>
                <Button size="sm" variant="outline" icon={FiPlus} onClick={handleAddParam}>
                  Add Parameter
                </Button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {resultsForm.parameters.map((param, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 2fr 1.5fr auto', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Param Name"
                      value={param.name}
                      onChange={(e) => handleParamChange(idx, 'name', e.target.value)}
                    />
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Observed Value"
                      value={param.observed}
                      onChange={(e) => handleParamChange(idx, 'observed', e.target.value)}
                    />
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Normal Range (12-16)"
                      value={param.normalRange}
                      onChange={(e) => handleParamChange(idx, 'normalRange', e.target.value)}
                    />
                    <select
                      className="form-control"
                      value={param.status}
                      onChange={(e) => handleParamChange(idx, 'status', e.target.value)}
                    >
                      <option value="Normal">Normal</option>
                      <option value="Abnormal">Abnormal</option>
                      <option value="Critical">Critical</option>
                    </select>
                    {resultsForm.parameters.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          setResultsForm((p) => ({
                            ...p,
                            parameters: p.parameters.filter((_, i) => i !== idx)
                          }))
                        }
                        style={{ color: 'var(--danger)', cursor: 'pointer' }}
                      >
                        <FiTrash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Clinical Summary / Technician Impression</label>
              <textarea
                rows="2"
                className="form-control"
                value={resultsForm.summaryResult}
                onChange={(e) => setResultsForm({ ...resultsForm, summaryResult: e.target.value })}
              />
            </div>
          </form>
        </Modal>
      )}

      {/* Printable Lab Test Report Modal */}
      {selectedTestForPrint && (
        <Modal
          isOpen={Boolean(selectedTestForPrint)}
          onClose={() => setSelectedTestForPrint(null)}
          title={`Diagnostic Report: ${selectedTestForPrint.id}`}
          maxWidth="700px"
          footer={
            <>
              <Button variant="outline" icon={FiPrinter} onClick={triggerPrint}>
                Print Report
              </Button>
              <Button variant="primary" onClick={() => setSelectedTestForPrint(null)}>
                Close
              </Button>
            </>
          }
        >
          <div className="printable-document" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--primary)', paddingBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--primary)' }}>
                  {hospitalInfo?.name || 'Medix Super Specialty Hospital'}
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Department of Laboratory Medicine & Diagnostics
                </p>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  NABL & NABH Accredited Central Diagnostic Laboratory
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <h4 style={{ fontSize: '16px', fontWeight: '700' }}>DIAGNOSTIC REPORT</h4>
                <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--primary)' }}>
                  {selectedTestForPrint.id}
                </p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Reported: {formatDate(selectedTestForPrint.completedDate || selectedTestForPrint.requestedDate)}
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', padding: '12px', backgroundColor: 'var(--surface-hover)', borderRadius: '8px', fontSize: '13px' }}>
              <div><strong>Patient Name:</strong> {selectedTestForPrint.patientName}</div>
              <div><strong>Patient ID:</strong> {selectedTestForPrint.patientId}</div>
              <div><strong>Referred By:</strong> {selectedTestForPrint.doctorName}</div>
              <div><strong>Sample:</strong> {selectedTestForPrint.sampleType}</div>
            </div>

            <table className="data-table" style={{ background: 'var(--surface)' }}>
              <thead>
                <tr>
                  <th>Test Parameter</th>
                  <th>Observed Value</th>
                  <th>Reference Range</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {selectedTestForPrint.parameters?.map((p, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: '500' }}>{p.name}</td>
                    <td style={{ fontWeight: '700', color: p.status === 'Critical' ? 'var(--danger)' : p.status === 'Abnormal' ? 'var(--warning)' : 'var(--text-primary)' }}>
                      {p.observed}
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>{p.normalRange}</td>
                    <td><StatusBadge status={p.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ padding: '12px', backgroundColor: 'var(--surface-hover)', borderRadius: '8px', fontSize: '13px' }}>
              <strong>Clinical Impression:</strong>
              <p style={{ marginTop: '2px', color: 'var(--text-primary)' }}>
                {selectedTestForPrint.summaryResult || 'Parameters verified and within normal limits.'}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
              <div>
                <p style={{ fontSize: '12px', fontWeight: '600' }}>{selectedTestForPrint.technician || 'Ganesh Hegde'}</p>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Medical Lab Technologist</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '12px', fontWeight: '600' }}>Dr. Priya Nandakumar, MD</p>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Consultant Pathologist & HOD</p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
