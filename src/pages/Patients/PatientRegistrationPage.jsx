import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHospital } from '../../context/HospitalContext';
import { PageHeader } from '../../components/Common/PageHeader/PageHeader';
import { Button } from '../../components/Common/Button/Button';
import { calculateAge } from '../../utils/formatters';
import { isValidEmail, isValidPhone } from '../../utils/validators';
import { generatePatientId } from '../../services/idGenerator';
import {
  FiUser,
  FiPhone,
  FiMail,
  FiMapPin,
  FiShield,
  FiActivity,
  FiCalendar,
  FiSave,
  FiArrowLeft,
  FiCheck
} from 'react-icons/fi';

export const PatientRegistrationPage = () => {
  const navigate = useNavigate();
  const { patients, doctors, addPatient, addAppointment } = useHospital();

  const previewId = generatePatientId(patients);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '1995-05-15',
    age: 31,
    gender: 'Male',
    bloodGroup: 'O+',
    phone: '',
    email: '',
    address: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    emergencyContact: '',
    emergencyContactNumber: '',
    knownAllergies: 'None',
    medicalConditions: 'None',
    insuranceProvider: 'Star Health Insurance',
    insuranceNumber: '',
    previousHistory: '',
    assignedDoctorId: doctors[0]?.id || '',
    vitals: {
      bp: '120/80 mmHg',
      pulse: '72 bpm',
      temp: '98.6 °F',
      spO2: '99%',
      weight: '70 kg',
      height: '172 cm'
    }
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'dob') {
        next.age = calculateAge(value);
      }
      return next;
    });

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleVitalChange = (vitalField, value) => {
    setFormData((prev) => ({
      ...prev,
      vitals: {
        ...prev.vitals,
        [vitalField]: value
      }
    }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.firstName.trim()) errs.firstName = 'First name is required';
    if (!formData.lastName.trim()) errs.lastName = 'Last name is required';
    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required';
    } else if (!isValidPhone(formData.phone)) {
      errs.phone = 'Enter valid 10-digit Indian mobile number';
    }
    if (formData.email && !isValidEmail(formData.email)) {
      errs.email = 'Enter a valid email address';
    }
    if (!formData.emergencyContact.trim()) {
      errs.emergencyContact = 'Emergency contact person is required';
    }
    if (!formData.emergencyContactNumber.trim()) {
      errs.emergencyContactNumber = 'Emergency phone is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = (createAppointmentAfter = false) => {
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const assignedDoc = doctors.find((d) => d.id === formData.assignedDoctorId);

    const newPatient = addPatient({
      ...formData,
      assignedDoctorName: assignedDoc ? assignedDoc.name : 'Dr. General Duty'
    });

    if (createAppointmentAfter) {
      addAppointment({
        patientId: newPatient.id,
        patientName: newPatient.name,
        doctorId: formData.assignedDoctorId,
        doctorName: assignedDoc ? assignedDoc.name : 'Dr. General Duty',
        department: assignedDoc ? assignedDoc.department : 'General OPD',
        date: new Date().toISOString().split('T')[0],
        time: '10:00 AM',
        type: 'Consultation',
        reason: 'Initial consultation and registration checkup',
        status: 'Scheduled',
        fee: assignedDoc ? assignedDoc.consultationFee : 500
      });
      navigate(`/appointments`);
    } else {
      navigate(`/patients/${newPatient.id}`);
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <PageHeader
        title="Patient Registration Form"
        subtitle={`Registering new patient profile with auto-assigned clinical identifier: ${previewId}`}
      >
        <Button variant="outline" icon={FiArrowLeft} onClick={() => navigate('/patients')}>
          Back to List
        </Button>
      </PageHeader>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave(false);
        }}
        style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
      >
        {/* Section 1: Demographics & Personal Info */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <FiUser color="var(--primary)" />
              <span>1. Patient Demographics & Identity</span>
            </div>
            <span className="badge badge-neutral" style={{ fontWeight: '700' }}>
              {previewId}
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '16px'
            }}
          >
            <div className="form-group">
              <label className="form-label">
                First Name <span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Anand"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
              />
              {errors.firstName && <span className="form-error">{errors.firstName}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Last Name <span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Murthy"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
              />
              {errors.lastName && <span className="form-error">{errors.lastName}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Date of Birth <span className="required">*</span>
              </label>
              <input
                type="date"
                className="form-control"
                value={formData.dob}
                onChange={(e) => handleInputChange('dob', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Calculated Age</label>
              <input type="number" className="form-control" disabled value={formData.age} />
            </div>

            <div className="form-group">
              <label className="form-label">Gender</label>
              <select
                className="form-control"
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Blood Group</label>
              <select
                className="form-control"
                value={formData.bloodGroup}
                onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Contact & Emergency Details */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <FiPhone color="var(--secondary)" />
              <span>2. Contact Information & Emergency Contacts</span>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '16px'
            }}
          >
            <div className="form-group">
              <label className="form-label">
                Primary Phone <span className="required">*</span>
              </label>
              <input
                type="tel"
                className="form-control"
                placeholder="+91 98450 12345"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
              {errors.phone && <span className="form-error">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="patient@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Residential Address</label>
              <input
                type="text"
                className="form-control"
                placeholder="Door No, Street name, Apartment / Landmark"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">City</label>
              <input
                type="text"
                className="form-control"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">State</label>
              <input
                type="text"
                className="form-control"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Emergency Contact Name & Relation <span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Shalini Murthy (Wife)"
                value={formData.emergencyContact}
                onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
              />
              {errors.emergencyContact && (
                <span className="form-error">{errors.emergencyContact}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                Emergency Contact Phone <span className="required">*</span>
              </label>
              <input
                type="tel"
                className="form-control"
                placeholder="+91 98450 99999"
                value={formData.emergencyContactNumber}
                onChange={(e) => handleInputChange('emergencyContactNumber', e.target.value)}
              />
              {errors.emergencyContactNumber && (
                <span className="form-error">{errors.emergencyContactNumber}</span>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Clinical Information & Initial Vitals */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <FiActivity color="var(--danger)" />
              <span>3. Clinical History, Allergies & Baseline Vitals</span>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '16px'
            }}
          >
            <div className="form-group">
              <label className="form-label">Primary Attending Doctor</label>
              <select
                className="form-control"
                value={formData.assignedDoctorId}
                onChange={(e) => handleInputChange('assignedDoctorId', e.target.value)}
              >
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.department} - {d.specialization})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Known Allergies</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Penicillin, Peanuts, Sulfa (or 'None')"
                value={formData.knownAllergies}
                onChange={(e) => handleInputChange('knownAllergies', e.target.value)}
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Existing Medical Conditions</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Type 2 Diabetes, Hypertension, Asthma"
                value={formData.medicalConditions}
                onChange={(e) => handleInputChange('medicalConditions', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Blood Pressure</label>
              <input
                type="text"
                className="form-control"
                value={formData.vitals.bp}
                onChange={(e) => handleVitalChange('bp', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Pulse Rate</label>
              <input
                type="text"
                className="form-control"
                value={formData.vitals.pulse}
                onChange={(e) => handleVitalChange('pulse', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Body Temperature</label>
              <input
                type="text"
                className="form-control"
                value={formData.vitals.temp}
                onChange={(e) => handleVitalChange('temp', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Oxygen Saturation (SpO2)</label>
              <input
                type="text"
                className="form-control"
                value={formData.vitals.spO2}
                onChange={(e) => handleVitalChange('spO2', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Section 4: Insurance Information */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <FiShield color="var(--primary)" />
              <span>4. Health Insurance Coverage (TPA)</span>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '16px'
            }}
          >
            <div className="form-group">
              <label className="form-label">Insurance Provider / TPA</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Star Health / HDFC ERGO / Cash"
                value={formData.insuranceProvider}
                onChange={(e) => handleInputChange('insuranceProvider', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Policy / Card Number</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. SH-992019-22"
                value={formData.insuranceNumber}
                onChange={(e) => handleInputChange('insuranceNumber', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Form Action Buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '14px',
            padding: '16px 0'
          }}
        >
          <Button variant="outline" onClick={() => navigate('/patients')}>
            Cancel
          </Button>
          <Button
            variant="secondary"
            icon={FiCalendar}
            onClick={() => handleSave(true)}
          >
            Save & Create Appointment
          </Button>
          <Button type="submit" variant="primary" icon={FiSave}>
            Save Patient Record
          </Button>
        </div>
      </form>
    </div>
  );
};
