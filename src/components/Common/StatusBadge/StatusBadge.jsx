import React from 'react';

export const StatusBadge = ({ status, className = '' }) => {
  if (!status) return null;

  const normalized = String(status).trim().toLowerCase();

  let variant = 'neutral';

  // Green / Success
  if (
    [
      'active',
      'available',
      'completed',
      'paid',
      'in stock',
      'approved',
      'normal',
      'on duty',
      'stable'
    ].includes(normalized)
  ) {
    variant = 'success';
  }
  // Amber / Warning
  else if (
    [
      'pending',
      'waiting',
      'low stock',
      'sample collected',
      'processing',
      'partially paid',
      'discharge pending',
      'on leave',
      'half day',
      'abnormal',
      'urgent'
    ].includes(normalized)
  ) {
    variant = 'warning';
  }
  // Red / Danger
  else if (
    [
      'critical',
      'cancelled',
      'out of stock',
      'expired',
      'unavailable',
      'inactive',
      'no show',
      'emergency',
      'failed'
    ].includes(normalized)
  ) {
    variant = 'danger';
  }
  // Blue / Info
  else if (
    [
      'scheduled',
      'checked in',
      'in consultation',
      'requested',
      'admitted',
      'discharged',
      'dispensed',
      'draft',
      'reserved',
      'maintenance',
      'under treatment'
    ].includes(normalized)
  ) {
    variant = 'info';
  }

  return (
    <span className={`badge badge-${variant} ${className}`.trim()}>
      <span className="badge-dot" />
      {status}
    </span>
  );
};
