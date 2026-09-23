import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  INITIAL_HOSPITAL_INFO,
  INITIAL_DOCTORS,
  INITIAL_STAFF,
  INITIAL_PATIENTS,
  INITIAL_APPOINTMENTS,
  INITIAL_MEDICINES,
  INITIAL_LAB_TESTS,
  INITIAL_PRESCRIPTIONS,
  INITIAL_BILLS,
  INITIAL_BEDS,
  INITIAL_ADMISSIONS,
  INITIAL_FINAL_REPORTS,
  INITIAL_NOTIFICATIONS
} from '../data/initialData';
import {
  getData,
  setData,
  STORAGE_KEYS,
  resetAllData
} from '../services/storageService';
import {
  generatePatientId,
  generateDoctorId,
  generateStaffId,
  generateAppointmentId,
  generateBillId,
  generateLabId,
  generatePrescriptionId,
  generateAdmissionId,
  generateReportId
} from '../services/idGenerator';

const HospitalContext = createContext(null);

export const HospitalProvider = ({ children }) => {
  // Toast notifications state
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success", duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Entity States backed by LocalStorage
  const [hospitalInfo, setHospitalInfoState] = useState(() =>
    getData(STORAGE_KEYS.HOSPITAL_INFO, INITIAL_HOSPITAL_INFO)
  );
  const [doctors, setDoctorsState] = useState(() =>
    getData(STORAGE_KEYS.DOCTORS, INITIAL_DOCTORS)
  );
  const [staff, setStaffState] = useState(() =>
    getData(STORAGE_KEYS.STAFF, INITIAL_STAFF)
  );
  const [patients, setPatientsState] = useState(() =>
    getData(STORAGE_KEYS.PATIENTS, INITIAL_PATIENTS)
  );
  const [appointments, setAppointmentsState] = useState(() =>
    getData(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS)
  );
  const [medicines, setMedicinesState] = useState(() =>
    getData(STORAGE_KEYS.MEDICINES, INITIAL_MEDICINES)
  );
  const [labTests, setLabTestsState] = useState(() =>
    getData(STORAGE_KEYS.LAB_TESTS, INITIAL_LAB_TESTS)
  );
  const [prescriptions, setPrescriptionsState] = useState(() =>
    getData(STORAGE_KEYS.PRESCRIPTIONS, INITIAL_PRESCRIPTIONS)
  );
  const [bills, setBillsState] = useState(() =>
    getData(STORAGE_KEYS.BILLS, INITIAL_BILLS)
  );
  const [beds, setBedsState] = useState(() =>
    getData(STORAGE_KEYS.BEDS, INITIAL_BEDS)
  );
  const [admissions, setAdmissionsState] = useState(() =>
    getData(STORAGE_KEYS.ADMISSIONS, INITIAL_ADMISSIONS)
  );
  const [finalReports, setFinalReportsState] = useState(() =>
    getData(STORAGE_KEYS.FINAL_REPORTS, INITIAL_FINAL_REPORTS)
  );
  const [notifications, setNotificationsState] = useState(() =>
    getData(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS)
  );

  // Sync to LocalStorage on update
  const setHospitalInfo = (info) => {
    setHospitalInfoState(info);
    setData(STORAGE_KEYS.HOSPITAL_INFO, info);
    addToast("Hospital profile updated successfully.", "success");
  };

  const setDoctors = (list) => {
    setDoctorsState(list);
    setData(STORAGE_KEYS.DOCTORS, list);
  };

  const setStaff = (list) => {
    setStaffState(list);
    setData(STORAGE_KEYS.STAFF, list);
  };

  const setPatients = (list) => {
    setPatientsState(list);
    setData(STORAGE_KEYS.PATIENTS, list);
  };

  const setAppointments = (list) => {
    setAppointmentsState(list);
    setData(STORAGE_KEYS.APPOINTMENTS, list);
  };

  const setMedicines = (list) => {
    setMedicinesState(list);
    setData(STORAGE_KEYS.MEDICINES, list);
  };

  const setLabTests = (list) => {
    setLabTestsState(list);
    setData(STORAGE_KEYS.LAB_TESTS, list);
  };

  const setPrescriptions = (list) => {
    setPrescriptionsState(list);
    setData(STORAGE_KEYS.PRESCRIPTIONS, list);
  };

  const setBills = (list) => {
    setBillsState(list);
    setData(STORAGE_KEYS.BILLS, list);
  };

  const setBeds = (list) => {
    setBedsState(list);
    setData(STORAGE_KEYS.BEDS, list);
  };

  const setAdmissions = (list) => {
    setAdmissionsState(list);
    setData(STORAGE_KEYS.ADMISSIONS, list);
  };

  const setFinalReports = (list) => {
    setFinalReportsState(list);
    setData(STORAGE_KEYS.FINAL_REPORTS, list);
  };

  const setNotifications = (list) => {
    setNotificationsState(list);
    setData(STORAGE_KEYS.NOTIFICATIONS, list);
  };

  // --- PATIENTS CRUD & LIFECYCLE ---
  const addPatient = (patientData) => {
    const id = generatePatientId(patients);
    const newPatient = {
      ...patientData,
      id,
      name: `${patientData.firstName || ""} ${patientData.lastName || ""}`.trim() || patientData.name,
      registeredDate: new Date().toISOString().split("T")[0],
      lastVisit: new Date().toISOString().split("T")[0],
      status: patientData.status || "Active",
      currentStage: patientData.currentStage || "Registration",
      avatar: patientData.avatar || (patientData.gender === "Female"
        ? "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
        : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80")
    };

    const updated = [newPatient, ...patients];
    setPatients(updated);
    addToast(`Patient registered successfully with ID: ${id}`, "success");
    return newPatient;
  };

  const updatePatient = (id, updatedFields) => {
    const updated = patients.map((p) => {
      if (p.id === id) {
        const merged = { ...p, ...updatedFields };
        if (updatedFields.firstName || updatedFields.lastName) {
          merged.name = `${merged.firstName || ""} ${merged.lastName || ""}`.trim();
        }
        return merged;
      }
      return p;
    });
    setPatients(updated);
    addToast("Patient details updated successfully.", "success");
  };

  const deletePatient = (id) => {
    const updated = patients.filter((p) => p.id !== id);
    setPatients(updated);
    addToast("Patient record removed.", "info");
  };

  const updatePatientStage = (patientId, newStage) => {
    const updated = patients.map((p) =>
      p.id === patientId ? { ...p, currentStage: newStage, lastVisit: new Date().toISOString().split("T")[0] } : p
    );
    setPatients(updated);
    addToast(`Patient stage advanced to "${newStage}"`, "info");
  };

  // --- DOCTORS CRUD ---
  const addDoctor = (doctorData) => {
    const id = generateDoctorId(doctors);
    const newDoc = {
      ...doctorData,
      id,
      status: doctorData.status || "Available",
      avatar: doctorData.avatar || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80",
      joiningDate: new Date().toISOString().split("T")[0]
    };
    const updated = [newDoc, ...doctors];
    setDoctors(updated);
    addToast(`Doctor ${newDoc.name} added successfully!`, "success");
    return newDoc;
  };

  const updateDoctor = (id, updatedFields) => {
    const updated = doctors.map((d) => (d.id === id ? { ...d, ...updatedFields } : d));
    setDoctors(updated);
    addToast("Doctor details updated.", "success");
  };

  const deleteDoctor = (id) => {
    const updated = doctors.filter((d) => d.id !== id);
    setDoctors(updated);
    addToast("Doctor removed.", "info");
  };

  // --- STAFF CRUD ---
  const addStaff = (staffData) => {
    const id = generateStaffId(staff);
    const newStaff = {
      ...staffData,
      id,
      joiningDate: new Date().toISOString().split("T")[0],
      status: staffData.status || "Active"
    };
    const updated = [newStaff, ...staff];
    setStaff(updated);
    addToast(`Staff member ${newStaff.name} added!`, "success");
    return newStaff;
  };

  const updateStaff = (id, updatedFields) => {
    const updated = staff.map((s) => (s.id === id ? { ...s, ...updatedFields } : s));
    setStaff(updated);
    addToast("Staff details updated.", "success");
  };

  const deleteStaff = (id) => {
    const updated = staff.filter((s) => s.id !== id);
    setStaff(updated);
    addToast("Staff member removed.", "info");
  };

  // --- APPOINTMENTS CRUD ---
  const addAppointment = (aptData) => {
    const id = generateAppointmentId(appointments);
    const newApt = {
      ...aptData,
      id,
      status: aptData.status || "Scheduled",
      priority: aptData.priority || "Normal"
    };
    const updated = [newApt, ...appointments];
    setAppointments(updated);
    
    // Also advance patient stage to Appointment if currently Registration
    if (newApt.patientId) {
      const patient = patients.find((p) => p.id === newApt.patientId);
      if (patient && patient.currentStage === "Registration") {
        updatePatientStage(newApt.patientId, "Appointment");
      }
    }
    
    addToast(`Appointment scheduled: ${id}`, "success");
    return newApt;
  };

  const updateAppointment = (id, updatedFields) => {
    const updated = appointments.map((a) => (a.id === id ? { ...a, ...updatedFields } : a));
    setAppointments(updated);
    addToast("Appointment updated.", "success");
  };

  const deleteAppointment = (id) => {
    const updated = appointments.filter((a) => a.id !== id);
    setAppointments(updated);
    addToast("Appointment cancelled/removed.", "info");
  };

  const updateAppointmentStatus = (id, status) => {
    const updated = appointments.map((a) => (a.id === id ? { ...a, status } : a));
    setAppointments(updated);
    const apt = appointments.find((a) => a.id === id);
    if (apt && apt.patientId) {
      if (status === "Checked In") updatePatientStage(apt.patientId, "Check-in");
      if (status === "In Consultation") updatePatientStage(apt.patientId, "Consultation");
      if (status === "Completed") updatePatientStage(apt.patientId, "Consultation");
    }
    addToast(`Appointment status changed to ${status}`, "info");
  };

  // --- MEDICINES & PHARMACY ---
  const addMedicine = (medData) => {
    const id = `MED-${new Date().getFullYear()}-${String(medicines.length + 1).padStart(4, "0")}`;
    const stock = Number(medData.stock) || 0;
    const minStock = Number(medData.minStock) || 20;
    let status = "In Stock";
    if (stock <= 0) status = "Out of Stock";
    else if (stock <= minStock) status = "Low Stock";

    const newMed = {
      ...medData,
      id,
      stock,
      minStock,
      purchasePrice: Number(medData.purchasePrice) || 0,
      sellingPrice: Number(medData.sellingPrice) || 0,
      status
    };
    const updated = [newMed, ...medicines];
    setMedicines(updated);
    addToast(`Medicine added: ${newMed.name}`, "success");
    return newMed;
  };

  const updateMedicine = (id, updatedFields) => {
    const updated = medicines.map((m) => {
      if (m.id === id) {
        const stock = updatedFields.stock !== undefined ? Number(updatedFields.stock) : m.stock;
        const minStock = updatedFields.minStock !== undefined ? Number(updatedFields.minStock) : m.minStock;
        let status = m.status;
        if (stock <= 0) status = "Out of Stock";
        else if (stock <= minStock) status = "Low Stock";
        else status = "In Stock";

        return { ...m, ...updatedFields, stock, minStock, status };
      }
      return m;
    });
    setMedicines(updated);
    addToast("Medicine inventory updated.", "success");
  };

  const deleteMedicine = (id) => {
    const updated = medicines.filter((m) => m.id !== id);
    setMedicines(updated);
    addToast("Medicine deleted from inventory.", "info");
  };

  const adjustStock = (id, quantityChange) => {
    const updated = medicines.map((m) => {
      if (m.id === id) {
        const newStock = Math.max(0, m.stock + Number(quantityChange));
        let status = "In Stock";
        if (newStock <= 0) status = "Out of Stock";
        else if (newStock <= m.minStock) status = "Low Stock";
        return { ...m, stock: newStock, status };
      }
      return m;
    });
    setMedicines(updated);
    addToast("Stock level adjusted.", "info");
  };

  // --- PRESCRIPTIONS ---
  const addPrescription = (rxData) => {
    const id = generatePrescriptionId(prescriptions);
    const newRx = {
      ...rxData,
      id,
      date: new Date().toISOString().split("T")[0],
      status: "Pending"
    };
    const updated = [newRx, ...prescriptions];
    setPrescriptions(updated);
    if (newRx.patientId) {
      updatePatientStage(newRx.patientId, "Prescription");
    }
    addToast(`Prescription issued: ${id}`, "success");
    return newRx;
  };

  const dispensePrescription = (rxId) => {
    const updated = prescriptions.map((rx) =>
      rx.id === rxId ? { ...rx, status: "Dispensed" } : rx
    );
    setPrescriptions(updated);
    const rx = prescriptions.find((r) => r.id === rxId);
    if (rx && rx.patientId) {
      updatePatientStage(rx.patientId, "Pharmacy");
    }
    addToast("Prescription marked as Dispensed.", "success");
  };

  // --- LABORATORY ---
  const addLabTest = (testData) => {
    const id = generateLabId(labTests);
    const newTest = {
      ...testData,
      id,
      requestedDate: new Date().toISOString().split("T")[0],
      completedDate: null,
      priority: testData.priority || "Routine",
      status: "Requested",
      parameters: testData.parameters || [],
      summaryResult: "Test ordered. Sample collection pending.",
      overallResult: "Normal"
    };
    const updated = [newTest, ...labTests];
    setLabTests(updated);
    if (newTest.patientId) {
      updatePatientStage(newTest.patientId, "Lab Tests");
    }
    addToast(`Laboratory test requested: ${id}`, "success");
    return newTest;
  };

  const updateLabTest = (id, updatedFields) => {
    const updated = labTests.map((t) => (t.id === id ? { ...t, ...updatedFields } : t));
    setLabTests(updated);
    addToast("Laboratory test record updated.", "success");
  };

  const enterLabResults = (id, { parameters, summaryResult, overallResult, technician }) => {
    const updated = labTests.map((t) => {
      if (t.id === id) {
        return {
          ...t,
          parameters: parameters || t.parameters,
          summaryResult: summaryResult || t.summaryResult,
          overallResult: overallResult || t.overallResult,
          technician: technician || t.technician || "Lab Staff",
          completedDate: new Date().toISOString().split("T")[0],
          status: overallResult === "Critical" ? "Critical" : "Completed"
        };
      }
      return t;
    });
    setLabTests(updated);

    const test = labTests.find((t) => t.id === id);
    if (test && test.patientId) {
      updatePatientStage(test.patientId, "Lab Results");
    }
    addToast(`Lab results recorded for ${id}`, "success");
  };

  // --- BILLING & INVOICES ---
  const addBill = (billData) => {
    const id = generateBillId(bills);
    const items = billData.items || [];
    const subtotal = items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const discount = Number(billData.discount) || 0;
    const tax = Number(billData.tax) || Math.round((subtotal - discount) * 0.05);
    const totalAmount = Math.max(0, subtotal - discount + tax);
    const paidAmount = Number(billData.paidAmount) || 0;
    const balance = Math.max(0, totalAmount - paidAmount);
    let paymentStatus = "Pending";
    if (balance <= 0 && totalAmount > 0) paymentStatus = "Paid";
    else if (paidAmount > 0) paymentStatus = "Partially Paid";

    const newBill = {
      ...billData,
      id,
      billDate: billData.billDate || new Date().toISOString().split("T")[0],
      dueDate: billData.dueDate || new Date().toISOString().split("T")[0],
      items,
      subtotal,
      discount,
      tax,
      totalAmount,
      paidAmount,
      balance,
      paymentStatus,
      paymentMethod: billData.paymentMethod || "UPI"
    };

    const updated = [newBill, ...bills];
    setBills(updated);
    if (newBill.patientId) {
      updatePatientStage(newBill.patientId, "Billing");
    }
    addToast(`Invoice generated: ${id}`, "success");
    return newBill;
  };

  const updateBill = (id, updatedFields) => {
    const updated = bills.map((b) => (b.id === id ? { ...b, ...updatedFields } : b));
    setBills(updated);
    addToast("Bill record updated.", "success");
  };

  const recordPayment = (billId, paymentAmount, paymentMethod = "UPI") => {
    const amt = Number(paymentAmount) || 0;
    const updated = bills.map((b) => {
      if (b.id === billId) {
        const newPaid = b.paidAmount + amt;
        const newBal = Math.max(0, b.totalAmount - newPaid);
        const status = newBal <= 0 ? "Paid" : "Partially Paid";
        return {
          ...b,
          paidAmount: newPaid,
          balance: newBal,
          paymentStatus: status,
          paymentMethod
        };
      }
      return b;
    });
    setBills(updated);
    addToast(`Payment of ₹${amt} recorded successfully!`, "success");
  };

  // --- ADMISSIONS & BEDS ---
  const addAdmission = (admissionData) => {
    const id = generateAdmissionId(admissions);
    const newAdm = {
      ...admissionData,
      id,
      admissionDate: admissionData.admissionDate || new Date().toISOString().split("T")[0],
      admissionTime: admissionData.admissionTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dischargeDate: null,
      status: "Admitted"
    };

    const updatedAdmissions = [newAdm, ...admissions];
    setAdmissions(updatedAdmissions);

    // Update patient status to "Admitted"
    if (newAdm.patientId) {
      updatePatient(newAdm.patientId, { status: "Admitted" });
    }

    // Update bed to occupied if assigned
    if (newAdm.bedNumber) {
      const updatedBeds = beds.map((b) =>
        b.bedNumber === newAdm.bedNumber && b.ward === newAdm.ward
          ? { ...b, status: "Occupied", patientId: newAdm.patientId, patientName: newAdm.patientName }
          : b
      );
      setBeds(updatedBeds);
    }

    addToast(`Admission registered: ${id}`, "success");
    return newAdm;
  };

  const dischargeAdmission = (admId) => {
    const adm = admissions.find((a) => a.id === admId);
    const updated = admissions.map((a) =>
      a.id === admId ? { ...a, status: "Discharged", dischargeDate: new Date().toISOString().split("T")[0] } : a
    );
    setAdmissions(updated);

    if (adm) {
      // Release patient bed
      if (adm.bedNumber) {
        const updatedBeds = beds.map((b) =>
          b.bedNumber === adm.bedNumber && b.ward === adm.ward
            ? { ...b, status: "Available", patientId: null, patientName: null }
            : b
        );
        setBeds(updatedBeds);
      }
      // Update patient status to Discharged
      if (adm.patientId) {
        updatePatient(adm.patientId, { status: "Discharged" });
        updatePatientStage(adm.patientId, "Discharge");
      }
    }
    addToast("Patient successfully discharged.", "success");
  };

  const updateBedStatus = (bedId, newStatus) => {
    const updated = beds.map((b) => (b.id === bedId ? { ...b, status: newStatus } : b));
    setBeds(updated);
    addToast(`Bed status changed to ${newStatus}`, "info");
  };

  // --- FINAL MEDICAL REPORTS ---
  const addFinalReport = (repData) => {
    const id = generateReportId(finalReports);
    const newRep = {
      ...repData,
      id,
      status: repData.status || "Draft"
    };
    const updated = [newRep, ...finalReports];
    setFinalReports(updated);
    if (newRep.patientId) {
      updatePatientStage(newRep.patientId, "Final Report");
    }
    addToast(`Final Medical Report created: ${id}`, "success");
    return newRep;
  };

  const approveFinalReport = (reportId) => {
    const updated = finalReports.map((r) =>
      r.id === reportId ? { ...r, status: "Approved" } : r
    );
    setFinalReports(updated);
    addToast("Final Medical Report approved successfully.", "success");
  };

  // --- NOTIFICATIONS ---
  const markNotificationRead = (id) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    setNotifications(updated);
  };

  const markAllNotificationsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    addToast("All notifications marked as read.", "info");
  };

  // --- RESET ALL DATA ---
  const resetDemoData = () => {
    resetAllData();
    setHospitalInfoState(INITIAL_HOSPITAL_INFO);
    setDoctorsState(INITIAL_DOCTORS);
    setStaffState(INITIAL_STAFF);
    setPatientsState(INITIAL_PATIENTS);
    setAppointmentsState(INITIAL_APPOINTMENTS);
    setMedicinesState(INITIAL_MEDICINES);
    setLabTestsState(INITIAL_LAB_TESTS);
    setPrescriptionsState(INITIAL_PRESCRIPTIONS);
    setBillsState(INITIAL_BILLS);
    setBedsState(INITIAL_BEDS);
    setAdmissionsState(INITIAL_ADMISSIONS);
    setFinalReportsState(INITIAL_FINAL_REPORTS);
    setNotificationsState(INITIAL_NOTIFICATIONS);
    addToast("Demo data reset to factory initial state.", "info");
  };

  return (
    <HospitalContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        hospitalInfo,
        setHospitalInfo,
        doctors,
        addDoctor,
        updateDoctor,
        deleteDoctor,
        staff,
        addStaff,
        updateStaff,
        deleteStaff,
        patients,
        addPatient,
        updatePatient,
        deletePatient,
        updatePatientStage,
        appointments,
        addAppointment,
        updateAppointment,
        deleteAppointment,
        updateAppointmentStatus,
        medicines,
        addMedicine,
        updateMedicine,
        deleteMedicine,
        adjustStock,
        prescriptions,
        addPrescription,
        dispensePrescription,
        labTests,
        addLabTest,
        updateLabTest,
        enterLabResults,
        bills,
        addBill,
        updateBill,
        recordPayment,
        beds,
        updateBedStatus,
        admissions,
        addAdmission,
        dischargeAdmission,
        finalReports,
        addFinalReport,
        approveFinalReport,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        resetDemoData
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error("useHospital must be used within a HospitalProvider");
  }
  return context;
};
