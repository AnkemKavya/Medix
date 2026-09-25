import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHospital } from '../../context/HospitalContext';
import {
  FiSearch,
  FiX,
  FiUser,
  FiCalendar,
  FiFileText,
  FiBox,
  FiClipboard,
  FiCreditCard
} from 'react-icons/fi';

export const GlobalSearchModal = ({ isOpen, onClose }) => {
  const { patients, doctors, appointments, medicines, bills, labTests } = useHospital();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();

    const matches = [];

    // 1. Search Patients
    patients.forEach((p) => {
      if (
        p.name?.toLowerCase().includes(q) ||
        p.id?.toLowerCase().includes(q) ||
        p.phone?.includes(q)
      ) {
        matches.push({
          type: 'Patient',
          icon: FiUser,
          title: p.name,
          subtitle: `${p.id} • ${p.gender}, ${p.age}y • ${p.status}`,
          link: `/patients/${p.id}`
        });
      }
    });

    // 2. Search Doctors
    doctors.forEach((d) => {
      if (
        d.name?.toLowerCase().includes(q) ||
        d.id?.toLowerCase().includes(q) ||
        d.department?.toLowerCase().includes(q)
      ) {
        matches.push({
          type: 'Doctor',
          icon: FiUser,
          title: d.name,
          subtitle: `${d.id} • ${d.department} • ${d.specialization}`,
          link: `/doctors`
        });
      }
    });

    // 3. Search Appointments
    appointments.forEach((a) => {
      if (
        a.id?.toLowerCase().includes(q) ||
        a.patientName?.toLowerCase().includes(q) ||
        a.doctorName?.toLowerCase().includes(q)
      ) {
        matches.push({
          type: 'Appointment',
          icon: FiCalendar,
          title: `${a.id} - ${a.patientName}`,
          subtitle: `${a.date} at ${a.time} • ${a.doctorName} • ${a.status}`,
          link: `/appointments`
        });
      }
    });

    // 4. Search Medicines
    medicines.forEach((m) => {
      if (
        m.name?.toLowerCase().includes(q) ||
        m.id?.toLowerCase().includes(q) ||
        m.genericName?.toLowerCase().includes(q)
      ) {
        matches.push({
          type: 'Medicine',
          icon: FiBox,
          title: m.name,
          subtitle: `${m.id} • Stock: ${m.stock} units • Status: ${m.status}`,
          link: `/pharmacy`
        });
      }
    });

    // 5. Search Bills
    bills.forEach((b) => {
      if (
        b.id?.toLowerCase().includes(q) ||
        b.patientName?.toLowerCase().includes(q)
      ) {
        matches.push({
          type: 'Bill / Invoice',
          icon: FiCreditCard,
          title: `${b.id} - ${b.patientName}`,
          subtitle: `Amount: ₹${b.totalAmount} • Status: ${b.paymentStatus}`,
          link: `/billing`
        });
      }
    });

    // 6. Search Lab Tests
    labTests.forEach((l) => {
      if (
        l.id?.toLowerCase().includes(q) ||
        l.testName?.toLowerCase().includes(q) ||
        l.patientName?.toLowerCase().includes(q)
      ) {
        matches.push({
          type: 'Lab Test',
          icon: FiClipboard,
          title: `${l.id} - ${l.testName}`,
          subtitle: `Patient: ${l.patientName} • Status: ${l.status}`,
          link: `/laboratory`
        });
      }
    });

    return matches.slice(0, 15);
  }, [query, patients, doctors, appointments, medicines, bills, labTests]);

  if (!isOpen) return null;

  const handleSelect = (link) => {
    onClose();
    navigate(link);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1200,
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '12vh',
        paddingLeft: '16px',
        paddingRight: '16px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '620px',
          backgroundColor: 'var(--surface)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--border)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '16px 20px',
            borderBottom: '1px solid var(--border)',
            gap: '12px'
          }}
        >
          <FiSearch size={20} color="var(--primary)" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search patients, doctors, appointments, bills, medicines, tests..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '15px',
              backgroundColor: 'transparent',
              color: 'var(--text-primary)'
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{ color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
            >
              <FiX size={16} />
            </button>
          )}
          <span
            style={{
              fontSize: '11px',
              padding: '3px 7px',
              borderRadius: '6px',
              backgroundColor: 'var(--surface-hover)',
              color: 'var(--text-muted)',
              border: '1px solid var(--border)'
            }}
          >
            ESC
          </span>
        </div>

        {/* Search Results */}
        <div style={{ maxHeight: '420px', overflowY: 'auto', padding: '8px 0' }}>
          {query.trim() === '' ? (
            <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '13.5px' }}>Type a patient name, ID, medicine, doctor, or bill number...</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '12px' }}>
                <span className="badge badge-neutral">PT-2026-0001</span>
                <span className="badge badge-neutral">Paracetamol</span>
                <span className="badge badge-neutral">Cardiology</span>
              </div>
            </div>
          ) : results.length === 0 ? (
            <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No matches found for "{query}"
            </div>
          ) : (
            results.map((item, index) => {
              const ItemIcon = item.icon;
              return (
                <div
                  key={index}
                  onClick={() => handleSelect(item.link)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 20px',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease',
                    borderBottom: '1px solid var(--border-subtle)'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--surface-hover)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--primary-light)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <ItemIcon size={18} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
                        {item.title}
                      </h4>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                  <span className="badge badge-neutral" style={{ fontSize: '11px' }}>
                    {item.type}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
