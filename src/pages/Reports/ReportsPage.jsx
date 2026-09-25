import React, { useState, useMemo } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { PageHeader } from '../../components/Common/PageHeader/PageHeader';
import { Button } from '../../components/Common/Button/Button';
import { DataTable } from '../../components/Common/DataTable/DataTable';
import { StatusBadge } from '../../components/Common/StatusBadge/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { exportToCSV, triggerPrint } from '../../utils/helpers';
import {
  FiFileText,
  FiDownload,
  FiPrinter,
  FiBarChart2,
  FiPieChart,
  FiTrendingUp,
  FiDollarSign,
  FiUsers,
  FiActivity
} from 'react-icons/fi';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const ReportsPage = () => {
  const { patients, doctors, appointments, bills, medicines, labTests, admissions } = useHospital();

  const [reportCategory, setReportCategory] = useState('Patient'); // Patient, Financial, Doctor, Appointment, Admission, Pharmacy, Laboratory
  const [departmentFilter, setDepartmentFilter] = useState('ALL');

  // CSV Export Handler
  const handleExportCSV = () => {
    let exportData = [];
    let filename = `medix_${reportCategory.toLowerCase()}_report.csv`;

    if (reportCategory === 'Patient') {
      exportData = patients.map((p) => ({
        ID: p.id,
        Name: p.name,
        Age: p.age,
        Gender: p.gender,
        BloodGroup: p.bloodGroup,
        Doctor: p.assignedDoctorName,
        Status: p.status,
        Stage: p.currentStage,
        Phone: p.phone
      }));
    } else if (reportCategory === 'Financial') {
      exportData = bills.map((b) => ({
        InvoiceID: b.id,
        Patient: b.patientName,
        Date: b.billDate,
        TotalAmount: b.totalAmount,
        PaidAmount: b.paidAmount,
        Balance: b.balance,
        Status: b.paymentStatus,
        Method: b.paymentMethod
      }));
    } else if (reportCategory === 'Appointment') {
      exportData = appointments.map((a) => ({
        AppointmentID: a.id,
        Patient: a.patientName,
        Doctor: a.doctorName,
        Department: a.department,
        Date: a.date,
        Time: a.time,
        Type: a.type,
        Status: a.status
      }));
    } else if (reportCategory === 'Pharmacy') {
      exportData = medicines.map((m) => ({
        ID: m.id,
        Medicine: m.name,
        Category: m.category,
        Stock: m.stock,
        MinStock: m.minStock,
        Price: m.sellingPrice,
        Status: m.status,
        Supplier: m.supplier
      }));
    } else {
      exportData = labTests.map((t) => ({
        TestID: t.id,
        TestName: t.testName,
        Patient: t.patientName,
        Doctor: t.doctorName,
        Date: t.requestedDate,
        Status: t.status,
        Result: t.overallResult
      }));
    }

    exportToCSV(exportData, filename);
  };

  // Analytics Visual Data
  const monthlyRevenueData = [
    { month: 'Apr', revenue: 245000, target: 200000 },
    { month: 'May', revenue: 310000, target: 250000 },
    { month: 'Jun', revenue: 290000, target: 250000 },
    { month: 'Jul', revenue: 420000, target: 350000 },
    { month: 'Aug', revenue: 480000, target: 400000 },
    { month: 'Sep', revenue: 530000, target: 450000 }
  ];

  const departmentVolumeData = [
    { department: 'Cardiology', visits: 142 },
    { department: 'Medicine', visits: 185 },
    { department: 'Orthopedics', visits: 110 },
    { department: 'Pediatrics', visits: 95 },
    { department: 'Neurology', visits: 72 },
    { department: 'Gynecology', visits: 88 }
  ];

  const categories = [
    'Patient',
    'Financial',
    'Doctor',
    'Appointment',
    'Admission',
    'Pharmacy',
    'Laboratory'
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <PageHeader
        title="Clinical, Financial & Operations Analytics"
        subtitle="Comprehensive business intelligence reports with charts, CSV data exports, and audit trails."
      >
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button variant="outline" icon={FiPrinter} onClick={triggerPrint}>
            Print Report
          </Button>
          <Button variant="primary" icon={FiDownload} onClick={handleExportCSV}>
            Export CSV
          </Button>
        </div>
      </PageHeader>

      {/* Category Selection Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', borderBottom: '1px solid var(--border)', paddingBottom: '4px' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setReportCategory(cat)}
            style={{
              padding: '8px 16px',
              fontSize: '13.5px',
              fontWeight: reportCategory === cat ? '600' : '500',
              borderRadius: '8px',
              backgroundColor: reportCategory === cat ? 'var(--primary)' : 'var(--surface)',
              color: reportCategory === cat ? '#ffffff' : 'var(--text-secondary)',
              border: `1px solid ${reportCategory === cat ? 'var(--primary)' : 'var(--border)'}`,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'var(--transition)'
            }}
          >
            {cat} Reports
          </button>
        ))}
      </div>

      {/* Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px' }}>
        {/* Revenue Analytics Trend */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <FiDollarSign color="var(--success)" />
              <span>Monthly Hospital Revenue Trend (INR)</span>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--success)', fontWeight: '600' }}>
              +24% YoY Growth
            </span>
          </div>
          <div style={{ width: '100%', height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16A34A" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#16A34A" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip
                  formatter={(val) => [formatCurrency(val), 'Revenue']}
                  contentStyle={{
                    backgroundColor: 'var(--surface)',
                    borderColor: 'var(--border)',
                    borderRadius: '8px',
                    boxShadow: 'var(--shadow-md)',
                    color: 'var(--text-primary)'
                  }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#16A34A" strokeWidth={2.5} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Volume Bar */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <FiBarChart2 color="var(--primary)" />
              <span>Patient Volume by Specialty Department</span>
            </div>
          </div>
          <div style={{ width: '100%', height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentVolumeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="department" stroke="var(--text-muted)" fontSize={11} />
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
                <Bar dataKey="visits" fill="#1E40AF" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Dynamic Data Table based on Selected Category */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <FiFileText color="var(--secondary)" />
            <span>{reportCategory} Master Data Table</span>
          </div>
        </div>

        {reportCategory === 'Patient' && (
          <DataTable
            columns={[
              { header: 'Patient ID', accessor: 'id', sortable: true },
              { header: 'Patient Name', accessor: 'name', sortable: true },
              { header: 'Age / Gender', cell: (r) => `${r.age}y • ${r.gender}` },
              { header: 'Blood Group', accessor: 'bloodGroup' },
              { header: 'Attending Doctor', accessor: 'assignedDoctorName' },
              { header: 'Treatment Stage', accessor: 'currentStage' },
              { header: 'Status', accessor: 'status', cell: (r) => <StatusBadge status={r.status} /> }
            ]}
            data={patients}
            searchPlaceholder="Filter patient report records..."
            searchKeys={['id', 'name', 'assignedDoctorName', 'bloodGroup']}
          />
        )}

        {reportCategory === 'Financial' && (
          <DataTable
            columns={[
              { header: 'Bill ID', accessor: 'id', sortable: true },
              { header: 'Patient Name', accessor: 'patientName', sortable: true },
              { header: 'Date', accessor: 'billDate', cell: (r) => formatDate(r.billDate) },
              { header: 'Total Billed', accessor: 'totalAmount', cell: (r) => formatCurrency(r.totalAmount) },
              { header: 'Paid Amount', accessor: 'paidAmount', cell: (r) => formatCurrency(r.paidAmount) },
              { header: 'Balance', accessor: 'balance', cell: (r) => formatCurrency(r.balance) },
              { header: 'Payment Method', accessor: 'paymentMethod' },
              { header: 'Status', accessor: 'paymentStatus', cell: (r) => <StatusBadge status={r.paymentStatus} /> }
            ]}
            data={bills}
            searchPlaceholder="Filter invoice records..."
            searchKeys={['id', 'patientName', 'paymentMethod', 'paymentStatus']}
          />
        )}

        {reportCategory === 'Appointment' && (
          <DataTable
            columns={[
              { header: 'Appointment ID', accessor: 'id', sortable: true },
              { header: 'Patient Name', accessor: 'patientName', sortable: true },
              { header: 'Doctor', accessor: 'doctorName', sortable: true },
              { header: 'Department', accessor: 'department' },
              { header: 'Date & Time', cell: (r) => `${formatDate(r.date)} at ${r.time}` },
              { header: 'Type', accessor: 'type' },
              { header: 'Status', accessor: 'status', cell: (r) => <StatusBadge status={r.status} /> }
            ]}
            data={appointments}
            searchPlaceholder="Filter appointment records..."
            searchKeys={['id', 'patientName', 'doctorName', 'department']}
          />
        )}

        {reportCategory === 'Pharmacy' && (
          <DataTable
            columns={[
              { header: 'Drug ID', accessor: 'id', sortable: true },
              { header: 'Medicine Name', accessor: 'name', sortable: true },
              { header: 'Category', accessor: 'category' },
              { header: 'Stock Units', accessor: 'stock', sortable: true },
              { header: 'Min Stock', accessor: 'minStock' },
              { header: 'Unit Price', accessor: 'sellingPrice', cell: (r) => formatCurrency(r.sellingPrice) },
              { header: 'Status', accessor: 'status', cell: (r) => <StatusBadge status={r.status} /> }
            ]}
            data={medicines}
            searchPlaceholder="Filter drug inventory records..."
            searchKeys={['id', 'name', 'category', 'status']}
          />
        )}

        {reportCategory === 'Laboratory' && (
          <DataTable
            columns={[
              { header: 'Test ID', accessor: 'id', sortable: true },
              { header: 'Test Name', accessor: 'testName', sortable: true },
              { header: 'Patient Name', accessor: 'patientName', sortable: true },
              { header: 'Doctor', accessor: 'doctorName' },
              { header: 'Date', accessor: 'requestedDate', cell: (r) => formatDate(r.requestedDate) },
              { header: 'Test Status', accessor: 'status', cell: (r) => <StatusBadge status={r.status} /> },
              { header: 'Result Flag', accessor: 'overallResult' }
            ]}
            data={labTests}
            searchPlaceholder="Filter diagnostic test records..."
            searchKeys={['id', 'testName', 'patientName', 'doctorName']}
          />
        )}

        {reportCategory === 'Doctor' && (
          <DataTable
            columns={[
              { header: 'Doctor ID', accessor: 'id', sortable: true },
              { header: 'Doctor Name', accessor: 'name', sortable: true },
              { header: 'Department', accessor: 'department', sortable: true },
              { header: 'Specialization', accessor: 'specialization' },
              { header: 'Room', accessor: 'room' },
              { header: 'Working Hours', accessor: 'workingHours' },
              { header: 'Status', accessor: 'status', cell: (r) => <StatusBadge status={r.status} /> }
            ]}
            data={doctors}
            searchPlaceholder="Filter doctor performance records..."
            searchKeys={['id', 'name', 'department', 'specialization']}
          />
        )}

        {reportCategory === 'Admission' && (
          <DataTable
            columns={[
              { header: 'Admission ID', accessor: 'id', sortable: true },
              { header: 'Patient Name', accessor: 'patientName', sortable: true },
              { header: 'Doctor', accessor: 'doctorName' },
              { header: 'Ward / Bed', cell: (r) => `${r.ward} • ${r.room}` },
              { header: 'Admission Date', accessor: 'admissionDate', cell: (r) => formatDate(r.admissionDate) },
              { header: 'Status', accessor: 'status', cell: (r) => <StatusBadge status={r.status} /> }
            ]}
            data={admissions}
            searchPlaceholder="Filter inpatient admission records..."
            searchKeys={['id', 'patientName', 'doctorName', 'ward']}
          />
        )}
      </div>
    </div>
  );
};
